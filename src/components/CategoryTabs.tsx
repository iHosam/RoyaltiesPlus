import React from 'react';
import { StoreCategory, ProgramCategory } from '../types';
import { ROYALTY_PROGRAMS } from '../data/mockData';
import { 
  Sparkles, 
  ShoppingCart, 
  Utensils, 
  Coffee, 
  Laptop, 
  Film, 
  HeartPulse, 
  Fuel, 
  Compass,
  Filter
} from 'lucide-react';

interface CategoryTabsProps {
  selectedCategory: StoreCategory;
  onSelectCategory: (cat: StoreCategory) => void;
  selectedProgramId: string;
  onSelectProgramId: (programId: string) => void;
  maxDistanceKm: number | null;
  onSelectMaxDistance: (dist: number | null) => void;
}

export const CategoryTabs: React.FC<CategoryTabsProps> = ({
  selectedCategory,
  onSelectCategory,
  selectedProgramId,
  onSelectProgramId,
  maxDistanceKm,
  onSelectMaxDistance
}) => {
  const categories = [
    { id: 'all' as StoreCategory, labelAr: 'الكل', icon: Compass },
    { id: 'supermarket' as StoreCategory, labelAr: 'سوبرماركت', icon: ShoppingCart },
    { id: 'restaurant' as StoreCategory, labelAr: 'مطاعم', icon: Utensils },
    { id: 'cafe' as StoreCategory, labelAr: 'كافيهات', icon: Coffee },
    { id: 'electronics' as StoreCategory, labelAr: 'إلكترونيات', icon: Laptop },
    { id: 'entertainment' as StoreCategory, labelAr: 'سينما وترفيه', icon: Film },
    { id: 'pharmacy' as StoreCategory, labelAr: 'صيدليات', icon: HeartPulse },
    { id: 'fuel' as StoreCategory, labelAr: 'محطات وقود', icon: Fuel },
  ];

  const distances = [
    { val: null, label: 'كل المسافات' },
    { val: 3, label: 'أقل من 3 كم' },
    { val: 7, label: 'أقل من 7 كم' },
    { val: 15, label: 'أقل من 15 كم' }
  ];

  return (
    <div className="space-y-3 pt-2">
      {/* Category Pills (Horizontal Scrollable) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const Icon = cat.icon;
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition-all shadow-sm ${
                isSelected
                  ? 'bg-emerald-600 text-white shadow-emerald-600/20'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{cat.labelAr}</span>
            </button>
          );
        })}
      </div>

      {/* Secondary Row: Filter by Royalty Program and Distance */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        {/* Royalty Programs Filter Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full">
          <div className="flex items-center gap-1 text-xs text-slate-500 font-semibold pl-1 whitespace-nowrap">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <span>البرنامج:</span>
          </div>

          <button
            onClick={() => onSelectProgramId('')}
            className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition ${
              selectedProgramId === ''
                ? 'bg-slate-900 text-white font-semibold'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            جميع البرامج
          </button>

          {ROYALTY_PROGRAMS.map((prog) => {
            const isSelected = selectedProgramId === prog.id;
            return (
              <button
                key={prog.id}
                onClick={() => onSelectProgramId(prog.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm ring-1 ring-emerald-800'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: prog.color }}
                />
                <span>{prog.nameAr}</span>
              </button>
            );
          })}
        </div>

        {/* Distance Range Filter */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs">
          {distances.map((d) => (
            <button
              key={d.label}
              onClick={() => onSelectMaxDistance(d.val)}
              className={`px-2.5 py-1 rounded-lg transition font-medium ${
                maxDistanceKm === d.val
                  ? 'bg-white text-emerald-800 shadow-sm font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
