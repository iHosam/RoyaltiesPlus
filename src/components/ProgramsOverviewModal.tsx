import React, { useState } from 'react';
import { RoyaltyProgram, ProgramCategory, LinkedAccount } from '../types';
import { ROYALTY_PROGRAMS } from '../data/mockData';
import { 
  X, 
  ExternalLink, 
  LogIn, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Building2, 
  CreditCard, 
  PhoneCall, 
  Landmark 
} from 'lucide-react';

interface ProgramsOverviewModalProps {
  linkedAccounts: LinkedAccount[];
  onClose: () => void;
  onOpenLoginModal: (program: RoyaltyProgram) => void;
}

export const ProgramsOverviewModal: React.FC<ProgramsOverviewModalProps> = ({
  linkedAccounts,
  onClose,
  onOpenLoginModal
}) => {
  const [activeCategory, setActiveCategory] = useState<ProgramCategory | 'all'>('all');

  const categories = [
    { id: 'all' as const, label: 'جميع البرامج (15)', icon: ShieldCheck },
    { id: 'royalty' as const, label: 'برامج المكافآت العامة (6)', icon: Sparkles },
    { id: 'carrier' as const, label: 'مشغلو الاتصالات (2)', icon: PhoneCall },
    { id: 'credit_card' as const, label: 'البطاقات الائتمانية (3)', icon: CreditCard },
    { id: 'banking' as const, label: 'البنوك السعودية (5)', icon: Landmark },
  ];

  const filteredPrograms = ROYALTY_PROGRAMS.filter(p => {
    if (activeCategory === 'all') return true;
    return p.category === activeCategory;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">
                دليل برامج الولاء والبطاقات المدعومة
              </h3>
              <p className="text-xs text-slate-300">
                تسجيل الدخول وربط الحسابات وتصفح كافة شبكات الخصم في السعودية
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Category Tabs */}
        <div className="bg-slate-50 border-b border-slate-200 p-2 sm:px-6 flex items-center gap-2 overflow-x-auto">
          {categories.map((c) => {
            const Icon = c.icon;
            const isSelected = activeCategory === c.id;
            return (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs sm:text-sm font-medium whitespace-nowrap transition ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-sm font-semibold'
                    : 'bg-white text-slate-600 hover:bg-slate-200/80 border border-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{c.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content list */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {filteredPrograms.map((program) => {
            const isLinked = linkedAccounts.some(acc => acc.programId === program.id);
            const linkedInfo = linkedAccounts.find(acc => acc.programId === program.id);

            return (
              <div
                key={program.id}
                className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-emerald-300 hover:shadow-sm transition flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <div 
                        className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-sm"
                        style={{ backgroundColor: program.color }}
                      >
                        {program.nameAr.slice(0, 2)}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h4 className="text-sm font-bold text-slate-900">
                            {program.nameAr}
                          </h4>
                          {isLinked && (
                            <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded-md flex items-center gap-0.5">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              متصل
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-400">
                          {program.nameEn}
                        </span>
                      </div>
                    </div>

                    <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                      +{program.partnerCount} متجر
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {program.descriptionAr}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
                  <span className="text-[11px] font-medium text-slate-500">
                    {program.categoryLabelAr}
                  </span>

                  {program.hasDirectLogin ? (
                    <button
                      onClick={() => onOpenLoginModal(program)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isLinked
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
                          : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm'
                      }`}
                    >
                      <LogIn className="w-3.5 h-3.5" />
                      <span>{isLinked ? 'إدارة الربط' : 'تسجيل دخول'}</span>
                    </button>
                  ) : (
                    <a
                      href={program.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                    >
                      <span>فتح الموقع / التطبيق</span>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            يشمل: Walaplus, Othaim+, Aura, Dine\'s elite, Blue rewards, Qitaf, Mobily, Visa, Visa Concierge CEMEA, Mastercard, Al Rajhi, SNB, ANB, Albilad, Alinma
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            تم
          </button>
        </div>
      </div>
    </div>
  );
};
