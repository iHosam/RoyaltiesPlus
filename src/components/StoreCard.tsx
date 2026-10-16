import React from 'react';
import { Store, StoreBranch, RoyaltyProgram, DiscountOffer } from '../types';
import { ROYALTY_PROGRAMS } from '../data/mockData';
import { formatDistance } from '../utils/geo';
import { MapPin, Star, ShieldCheck, ChevronLeft, Percent } from 'lucide-react';

interface StoreCardProps {
  store: Store;
  nearestBranch: { branch: StoreBranch; distanceKm: number } | null;
  offers: DiscountOffer[];
  onSelectStore: (store: Store) => void;
}

export const StoreCard: React.FC<StoreCardProps> = ({
  store,
  nearestBranch,
  offers,
  onSelectStore
}) => {
  // Find royalty program objects for this store
  const supportedPrograms = store.supportedProgramIds
    .map(id => ROYALTY_PROGRAMS.find(p => p.id === id))
    .filter((p): p is RoyaltyProgram => Boolean(p));

  // Top offer
  const topOffer = offers.length > 0 ? offers[0] : null;

  return (
    <div 
      onClick={() => onSelectStore(store)}
      className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between hover:border-emerald-300"
    >
      {/* Top Banner Image with Category Badge & Distance */}
      <div className="relative h-40 w-full overflow-hidden bg-slate-100">
        <img
          src={store.coverImage}
          alt={store.nameAr}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-black/20" />

        {/* Distance Badge */}
        {nearestBranch && (
          <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-600" />
            <span>{formatDistance(nearestBranch.distanceKm, true)}</span>
          </div>
        )}

        {/* Rating */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-sm text-amber-300 text-xs font-semibold px-2 py-1 rounded-full flex items-center gap-1">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{store.rating.toFixed(1)}</span>
        </div>

        {/* Store Name & Category Overlay */}
        <div className="absolute bottom-3 right-3 left-3 flex items-end justify-between">
          <div>
            <span className="text-[11px] font-medium text-emerald-300 bg-emerald-950/60 px-2 py-0.5 rounded-md backdrop-blur-sm">
              {store.categoryNameAr}
            </span>
            <h3 className="text-lg font-bold text-white mt-1 drop-shadow-sm leading-tight">
              {store.nameAr}
            </h3>
            <p className="text-xs text-slate-200 font-normal">
              {store.nameEn}
            </p>
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        {/* Nearest Branch District */}
        {nearestBranch && (
          <div className="text-xs text-slate-500 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
            <span className="truncate">
              أقرب فرع: {nearestBranch.branch.city} - {nearestBranch.branch.districtAr}
            </span>
          </div>
        )}

        {/* Highlighted Top Discount */}
        {topOffer && (
          <div className="bg-emerald-50 border border-emerald-200/80 rounded-xl p-2.5 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0">
              <Percent className="w-4 h-4" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-emerald-900 truncate">
                  {topOffer.titleAr}
                </span>
              </div>
              <p className="text-[11px] text-emerald-700 truncate">
                {topOffer.discountValue}
              </p>
            </div>
          </div>
        )}

        {/* Supported Loyalty Programs Pills */}
        <div>
          <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5 font-medium">
            <span>البرامج المدعومة ({supportedPrograms.length}):</span>
            <span className="text-[11px] text-emerald-600 group-hover:underline flex items-center gap-0.5 font-semibold">
              عرض التفاصيل <ChevronLeft className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            {supportedPrograms.slice(0, 4).map((prog) => (
              <span
                key={prog.id}
                className={`text-[11px] font-medium px-2 py-0.5 rounded-md border flex items-center gap-1 ${prog.badgeBg}`}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: prog.color }}
                />
                <span>{prog.nameAr}</span>
              </span>
            ))}
            {supportedPrograms.length > 4 && (
              <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                +{supportedPrograms.length - 4} برامج
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
