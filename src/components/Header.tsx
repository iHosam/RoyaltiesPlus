import React, { useState } from 'react';
import { 
  MapPin, 
  Navigation, 
  Search, 
  RefreshCw, 
  CheckCircle2, 
  Crown, 
  ShieldCheck, 
  ChevronDown 
} from 'lucide-react';
import { UserLocation } from '../types';
import { SAUDI_CITIES } from '../data/mockData';

interface HeaderProps {
  userLocation: UserLocation;
  onUpdateLocation: (loc: UserLocation) => void;
  onDetectGps: () => void;
  isDetectingGps: boolean;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  lastSyncTime: string;
  isSyncing: boolean;
  onRefreshSync: () => void;
  onOpenProgramsModal: () => void;
  linkedCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  userLocation,
  onUpdateLocation,
  onDetectGps,
  isDetectingGps,
  searchQuery,
  onSearchChange,
  lastSyncTime,
  isSyncing,
  onRefreshSync,
  onOpenProgramsModal,
  linkedCount
}) => {
  const [showCityDropdown, setShowCityDropdown] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-sm">
      {/* Top Bar: Brand, City Selector, Sync Status, Programs Modal */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          
          {/* Logo & Tagline */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-700 via-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-700/20">
              <Crown className="w-6 h-6 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Royalties<span className="text-emerald-600">Plus</span>
                </span>
                <span className="text-xs bg-emerald-100 text-emerald-800 font-medium px-2 py-0.5 rounded-full border border-emerald-200">
                  السعودية 🇸🇦
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                دليل خصومات وبرامج الولاء، البنوك، والبطاقات الائتمانية
              </p>
            </div>
          </div>

          {/* Location Selector (GPS / Saudi Cities) */}
          <div className="relative">
            <button
              onClick={() => setShowCityDropdown(!showCityDropdown)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-sm font-medium transition border border-slate-200"
            >
              <MapPin className="w-4 h-4 text-emerald-600" />
              <span>{userLocation.city} - {userLocation.district}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showCityDropdown && (
              <div className="absolute left-0 right-auto sm:right-0 sm:left-auto mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="px-3 py-2 border-b border-slate-100">
                  <button
                    onClick={() => {
                      setShowCityDropdown(false);
                      onDetectGps();
                    }}
                    disabled={isDetectingGps}
                    className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium transition shadow-sm"
                  >
                    <Navigation className={`w-4 h-4 ${isDetectingGps ? 'animate-spin' : ''}`} />
                    {isDetectingGps ? 'جارِ تحديد الموقع...' : 'تحديد موقعي الحالي (GPS)'}
                  </button>
                </div>
                <div className="px-3 pt-2 text-xs font-semibold text-slate-400">
                  أو اختر المدينة يدوياً:
                </div>
                <div className="py-1">
                  {SAUDI_CITIES.map((c) => (
                    <button
                      key={c.nameAr}
                      onClick={() => {
                        onUpdateLocation({
                          lat: c.lat,
                          lng: c.lng,
                          city: c.nameAr,
                          district: 'وسط المدينة',
                          isCustom: true
                        });
                        setShowCityDropdown(false);
                      }}
                      className="w-full text-right px-4 py-2 text-sm text-slate-700 hover:bg-emerald-50 hover:text-emerald-700 flex items-center justify-between"
                    >
                      <span>{c.nameAr}</span>
                      <span className="text-xs text-slate-400">{c.nameEn}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Action Group: Sync indicator & My Programs */}
          <div className="flex items-center gap-2">
            {/* Live Sync Status */}
            <button
              onClick={onRefreshSync}
              disabled={isSyncing}
              title="تحديث الخصومات وصلاحيات العروض الآن"
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-emerald-600 ${isSyncing ? 'animate-spin' : ''}`} />
              <span className="hidden md:inline">محدث:</span>
              <span>{lastSyncTime}</span>
            </button>

            {/* Linked Programs & Wallets */}
            <button
              onClick={onOpenProgramsModal}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-medium transition shadow-sm"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>برامج الولاء</span>
              {linkedCount > 0 && (
                <span className="bg-emerald-500 text-white text-xs rounded-full px-1.5 py-0.2 font-bold">
                  {linkedCount}
                </span>
              )}
            </button>
          </div>

        </div>

        {/* Search Bar */}
        <div className="mt-3 relative">
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="ابحث عن متجر (جرير، العثيم، ستاربكس...) أو برنامج ولاء (ولا بلس، قطاف، أورا، فيزا...)"
            className="w-full pr-11 pl-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm placeholder:text-slate-400 shadow-inner transition"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-xs text-slate-400 hover:text-slate-600"
            >
              مسح
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
