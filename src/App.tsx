import React, { useState, useEffect, useMemo } from 'react';
import { 
  Store, 
  StoreCategory, 
  RoyaltyProgram, 
  DiscountOffer, 
  UserLocation, 
  LinkedAccount 
} from './types';
import { 
  STORES, 
  ROYALTY_PROGRAMS, 
  INITIAL_USER_LOCATION 
} from './data/mockData';
import { calculateDistanceKm, getNearestBranch } from './utils/geo';
import { syncDiscountsOnLaunch, getLastSyncTime } from './utils/sync';
import { getLinkedAccounts, saveLinkedAccount, removeLinkedAccount } from './utils/auth';

// Components
import { Header } from './components/Header';
import { CategoryTabs } from './components/CategoryTabs';
import { StoreCard } from './components/StoreCard';
import { StoreDetailsModal } from './components/StoreDetailsModal';
import { LoginModal } from './components/LoginModal';
import { ProgramsOverviewModal } from './components/ProgramsOverviewModal';
import { NearbyRadar } from './components/NearbyRadar';

import { 
  ArrowUpDown, 
  MapPin, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  ShieldCheck,
  Percent
} from 'lucide-react';

export function App() {
  // 1. Location state
  const [userLocation, setUserLocation] = useState<UserLocation>(INITIAL_USER_LOCATION);
  const [isDetectingGps, setIsDetectingGps] = useState<boolean>(false);

  // 2. Search & Filters
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>('all');
  const [selectedProgramId, setSelectedProgramId] = useState<string>('');
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<'distance' | 'rating' | 'name'>('distance');

  // 3. Offers & Sync state (Requirement 8)
  const [offers, setOffers] = useState<DiscountOffer[]>([]);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);
  const [lastSyncTime, setLastSyncTime] = useState<string>('جارِ التحديث...');
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // 4. Modals state
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [loginModalProgram, setLoginModalProgram] = useState<RoyaltyProgram | null>(null);
  const [showProgramsOverview, setShowProgramsOverview] = useState<boolean>(false);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([]);

  // Load linked accounts and perform discount sync on launch
  useEffect(() => {
    setLinkedAccounts(getLinkedAccounts());

    // Auto-detect GPS on launch
    detectUserGps(true);

    // Requirement 8: update available discounts and durations on launch
    performDiscountSync(true);
  }, []);

  const performDiscountSync = async (isInitial = false) => {
    setIsSyncing(true);
    try {
      const result = await syncDiscountsOnLaunch();
      setOffers(result.offers);
      const timeStr = getLastSyncTime();
      setLastSyncTime(timeStr);
      if (isInitial) {
        setSyncToast(`تم تحديث ${result.updatedCount} عرضاً وخصماً نشطاً اليوم عبر المملكة`);
        setTimeout(() => setSyncToast(null), 4000);
      }
    } catch (e) {
      console.error('Discount sync error', e);
    } finally {
      setIsSyncing(false);
    }
  };

  const detectUserGps = (silent = false) => {
    if (!('geolocation' in navigator)) {
      if (!silent) alert('متصفحك لا يدعم تحديد الموقع الجغرافي.');
      return;
    }

    setIsDetectingGps(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          city: 'موقعي الحالي',
          district: 'GPS مباشر',
          isCustom: false,
          accuracy: position.coords.accuracy
        });
        setIsDetectingGps(false);
        if (!silent) {
          setSyncToast('تم تحديد موقعك بدقة بنجاح عبر GPS');
          setTimeout(() => setSyncToast(null), 3000);
        }
      },
      (error) => {
        console.warn('Geolocation failed or denied', error);
        setIsDetectingGps(false);
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  // Auth account handling
  const handleSaveAccount = (account: LinkedAccount) => {
    saveLinkedAccount(account);
    setLinkedAccounts(getLinkedAccounts());
    setSyncToast(`تم ربط حسابك في ${account.programId === 'walaplus' ? 'ولا بلس' : 'فيزا كونسيرج'} بنجاح!`);
    setTimeout(() => setSyncToast(null), 3500);
  };

  const handleRemoveAccount = (programId: string) => {
    removeLinkedAccount(programId);
    setLinkedAccounts(getLinkedAccounts());
  };

  // Compute distance for all stores from user's current coordinates
  const storesWithDistance = useMemo(() => {
    return STORES.map(store => {
      const nearest = getNearestBranch(store, userLocation);
      return {
        store,
        nearestBranch: nearest || {
          branch: store.branches[0],
          distanceKm: 999
        }
      };
    });
  }, [userLocation]);

  // Filter and sort stores
  const filteredStores = useMemo(() => {
    return storesWithDistance
      .filter(({ store, nearestBranch }) => {
        // Category filter
        if (selectedCategory !== 'all' && store.category !== selectedCategory) {
          return false;
        }

        // Program filter
        if (selectedProgramId && !store.supportedProgramIds.includes(selectedProgramId)) {
          return false;
        }

        // Distance filter
        if (maxDistanceKm !== null && nearestBranch.distanceKm > maxDistanceKm) {
          return false;
        }

        // Search query filter (matches store name Ar/En, category, district, or supported program name)
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = store.nameAr.toLowerCase().includes(q) || store.nameEn.toLowerCase().includes(q);
          const matchCat = store.categoryNameAr.toLowerCase().includes(q) || store.categoryNameEn.toLowerCase().includes(q);
          const matchDist = store.branches.some(b => b.districtAr.toLowerCase().includes(q) || b.city.toLowerCase().includes(q));
          
          // Check if search query matches any supported program name
          const matchProg = store.supportedProgramIds.some(pid => {
            const prog = ROYALTY_PROGRAMS.find(p => p.id === pid);
            return prog && (prog.nameAr.toLowerCase().includes(q) || prog.nameEn.toLowerCase().includes(q));
          });

          if (!matchName && !matchCat && !matchDist && !matchProg) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'distance') {
          return a.nearestBranch.distanceKm - b.nearestBranch.distanceKm;
        } else if (sortBy === 'rating') {
          return b.store.rating - a.store.rating;
        } else {
          return a.store.nameAr.localeCompare(b.store.nameAr);
        }
      });
  }, [storesWithDistance, selectedCategory, selectedProgramId, maxDistanceKm, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
      {/* Toast Notification */}
      {syncToast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs sm:text-sm font-semibold px-4 py-2.5 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-2 animate-in slide-in-from-bottom-5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{syncToast}</span>
        </div>
      )}

      {/* Header */}
      <Header
        userLocation={userLocation}
        onUpdateLocation={setUserLocation}
        onDetectGps={() => detectUserGps(false)}
        isDetectingGps={isDetectingGps}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        lastSyncTime={lastSyncTime}
        isSyncing={isSyncing}
        onRefreshSync={() => performDiscountSync(false)}
        onOpenProgramsModal={() => setShowProgramsOverview(true)}
        linkedCount={linkedAccounts.length}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex-1 space-y-6 w-full">
        
        {/* Radar / Nearby Store Spotlight (Requirement 7) */}
        {!searchQuery && selectedCategory === 'all' && (
          <NearbyRadar
            userLocation={userLocation}
            storesWithDistance={storesWithDistance.sort((a, b) => a.nearestBranch.distanceKm - b.nearestBranch.distanceKm)}
            onSelectStore={setSelectedStore}
            onDetectGps={() => detectUserGps(false)}
            isDetectingGps={isDetectingGps}
          />
        )}

        {/* Filter Controls */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            selectedProgramId={selectedProgramId}
            onSelectProgramId={setSelectedProgramId}
            maxDistanceKm={maxDistanceKm}
            onSelectMaxDistance={setMaxDistanceKm}
          />
        </div>

        {/* Results Bar: Store count and Sorting */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-slate-700 font-semibold">
            <span>المتاجر المتاحة:</span>
            <span className="bg-emerald-100 text-emerald-800 text-xs px-2.5 py-0.5 rounded-full font-bold">
              {filteredStores.length} متجر
            </span>
            {selectedProgramId && (
              <span className="text-xs text-slate-500 font-normal">
                (مدعوم ببرنامج {ROYALTY_PROGRAMS.find(p => p.id === selectedProgramId)?.nameAr})
              </span>
            )}
          </div>

          {/* Sort By Toggle */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">الترتيب حسب:</span>
            <div className="flex items-center bg-white border border-slate-200 rounded-xl p-1 shadow-sm">
              <button
                onClick={() => setSortBy('distance')}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${
                  sortBy === 'distance' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الأقرب لموقعي
              </button>
              <button
                onClick={() => setSortBy('rating')}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${
                  sortBy === 'rating' ? 'bg-emerald-600 text-white font-semibold' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                الأعلى تقييماً
              </button>
            </div>
          </div>
        </div>

        {/* Stores Grid (Requirement 2 & 7) */}
        {filteredStores.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
            {filteredStores.map(({ store, nearestBranch }) => {
              const storeOffers = offers.filter(o => o.storeId === store.id);
              return (
                <StoreCard
                  key={store.id}
                  store={store}
                  nearestBranch={nearestBranch}
                  offers={storeOffers}
                  onSelectStore={setSelectedStore}
                />
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-800">
              لم نعثر على متاجر تطابق بحثك الحالي
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              جرّب توسيع نطاق المسافة أو إلغاء فلتر البرنامج لعرض كافة المتاجر المدعومة.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
                setSelectedProgramId('');
                setMaxDistanceKm(null);
              }}
              className="mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl hover:bg-emerald-700 transition"
            >
              إعادة تعيين الفلاتر
            </button>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-800">RoyaltiesPlus Saudi Arabia</span>
            <span>•</span>
            <span>تتبع برامج الولاء والخصومات التجارية في المملكة</span>
          </div>
          <div>
            البرامج المشمولة: ولا بلس، العثيم بلس، أورا، داينز إيليت، بلو ريواردز، قطاف، نقاطي موبايلي، فيزا، فيزا كونسيرج CEMEA، ماستركارد، الراجحي، الأهلي، العربي، البلاد، الإنماء.
          </div>
        </div>
      </footer>

      {/* MODALS */}

      {/* 1. Store Details Modal (Requirement 2, 8, 9) */}
      {selectedStore && (
        <StoreDetailsModal
          store={selectedStore}
          offers={offers.filter(o => o.storeId === selectedStore.id)}
          nearestBranch={getNearestBranch(selectedStore, userLocation)}
          linkedAccounts={linkedAccounts}
          onClose={() => setSelectedStore(null)}
          onOpenLoginModal={(program) => setLoginModalProgram(program)}
        />
      )}

      {/* 2. Login Modal (Requirement 9) */}
      {loginModalProgram && (
        <LoginModal
          program={loginModalProgram}
          linkedAccount={linkedAccounts.find(a => a.programId === loginModalProgram.id)}
          onClose={() => setLoginModalProgram(null)}
          onSaveAccount={handleSaveAccount}
          onRemoveAccount={handleRemoveAccount}
        />
      )}

      {/* 3. Programs Overview Modal */}
      {showProgramsOverview && (
        <ProgramsOverviewModal
          linkedAccounts={linkedAccounts}
          onClose={() => setShowProgramsOverview(false)}
          onOpenLoginModal={(program) => {
            setShowProgramsOverview(false);
            setLoginModalProgram(program);
          }}
        />
      )}

    </div>
  );
}

export default App;
