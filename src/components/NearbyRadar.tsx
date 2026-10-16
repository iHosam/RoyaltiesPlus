import React from 'react';
import { Store, StoreBranch, UserLocation } from '../types';
import { formatDistance } from '../utils/geo';
import { Navigation, MapPin, Store as StoreIcon, ChevronLeft } from 'lucide-react';

interface NearbyRadarProps {
  userLocation: UserLocation;
  storesWithDistance: Array<{
    store: Store;
    nearestBranch: { branch: StoreBranch; distanceKm: number };
  }>;
  onSelectStore: (store: Store) => void;
  onDetectGps: () => void;
  isDetectingGps: boolean;
}

export const NearbyRadar: React.FC<NearbyRadarProps> = ({
  userLocation,
  storesWithDistance,
  onSelectStore,
  onDetectGps,
  isDetectingGps
}) => {
  // Take the 5 closest stores
  const closestFive = storesWithDistance.slice(0, 5);

  return (
    <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 text-white rounded-3xl p-4 sm:p-6 shadow-xl border border-emerald-900/50 relative overflow-hidden">
      {/* Decorative background glow circles */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="relative z-10 flex items-center justify-between flex-wrap gap-3 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <Navigation className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base sm:text-lg font-bold">
                رادار المتاجر الأقرب إليك الآن
              </h3>
              <span className="text-[11px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
                مباشر
              </span>
            </div>
            <p className="text-xs text-slate-300">
              موقعك الحالي: <span className="text-emerald-400 font-semibold">{userLocation.city} ({userLocation.district})</span>
            </p>
          </div>
        </div>

        <button
          onClick={onDetectGps}
          disabled={isDetectingGps}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition"
        >
          <Navigation className={`w-3.5 h-3.5 text-emerald-400 ${isDetectingGps ? 'animate-spin' : ''}`} />
          <span>{isDetectingGps ? 'تحديث الموقع...' : 'تحديث GPS'}</span>
        </button>
      </div>

      {/* Closest Stores Cards Carousel */}
      <div className="relative z-10 pt-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {closestFive.map(({ store, nearestBranch }, idx) => (
            <div
              key={store.id}
              onClick={() => onSelectStore(store)}
              className="bg-white/10 hover:bg-white/15 backdrop-blur-md rounded-2xl p-3 border border-white/10 hover:border-emerald-400/50 cursor-pointer transition flex flex-col justify-between space-y-2 group"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="w-8 h-8 rounded-xl bg-white text-slate-900 flex items-center justify-center font-bold text-xs shadow-sm overflow-hidden flex-shrink-0">
                  <img src={store.coverImage} alt={store.nameAr} className="w-full h-full object-cover" />
                </div>
                <span className="text-[10px] bg-emerald-400 text-emerald-950 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {formatDistance(nearestBranch.distanceKm, true)}
                </span>
              </div>

              <div>
                <h4 className="text-xs font-bold text-white group-hover:text-emerald-300 transition truncate">
                  {store.nameAr}
                </h4>
                <p className="text-[10px] text-slate-300 truncate">
                  {nearestBranch.branch.districtAr}
                </p>
              </div>

              <div className="pt-1.5 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-300">
                <span>{store.supportedProgramIds.length} برامج ولاء</span>
                <ChevronLeft className="w-3.5 h-3.5 text-emerald-400 group-hover:-translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
