import React, { useState } from 'react';
import { 
  Store, 
  StoreBranch, 
  RoyaltyProgram, 
  DiscountOffer, 
  LinkedAccount 
} from '../types';
import { ROYALTY_PROGRAMS } from '../data/mockData';
import { formatDistance } from '../utils/geo';
import { getDurationBadge } from '../utils/sync';
import { 
  X, 
  MapPin, 
  ExternalLink, 
  LogIn, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Percent, 
  Copy, 
  Phone, 
  Globe, 
  Star,
  ChevronRight,
  Info
} from 'lucide-react';

interface StoreDetailsModalProps {
  store: Store;
  offers: DiscountOffer[];
  nearestBranch: { branch: StoreBranch; distanceKm: number } | null;
  linkedAccounts: LinkedAccount[];
  onClose: () => void;
  onOpenLoginModal: (program: RoyaltyProgram) => void;
}

export const StoreDetailsModal: React.FC<StoreDetailsModalProps> = ({
  store,
  offers,
  nearestBranch,
  linkedAccounts,
  onClose,
  onOpenLoginModal
}) => {
  const [activeTab, setActiveTab] = useState<'programs' | 'branches' | 'about'>('programs');
  const [copiedCodeId, setCopiedCodeId] = useState<string | null>(null);

  // Group supported programs
  const supportedPrograms = store.supportedProgramIds
    .map(id => ROYALTY_PROGRAMS.find(p => p.id === id))
    .filter((p): p is RoyaltyProgram => Boolean(p));

  const handleCopyCode = (id: string, code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCodeId(id);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header & Store Banner */}
        <div className="relative h-48 sm:h-56 bg-slate-900 w-full overflow-hidden flex-shrink-0">
          <img
            src={store.coverImage}
            alt={store.nameAr}
            className="w-full h-full object-cover opacity-85"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/40 to-black/30" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-md transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Store Category & Rating */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-xs bg-emerald-600/90 text-white font-medium px-3 py-1 rounded-full backdrop-blur-md">
              {store.categoryNameAr}
            </span>
            <span className="text-xs bg-black/50 text-amber-300 font-semibold px-2.5 py-1 rounded-full backdrop-blur-md flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              {store.rating} ({store.ratingCount.toLocaleString()} تقييم)
            </span>
          </div>

          {/* Store Title, Distance & Meta */}
          <div className="absolute bottom-4 right-4 left-4 flex items-end justify-between">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {store.nameAr}
              </h2>
              <p className="text-sm text-slate-300 font-medium">
                {store.nameEn}
              </p>
              {nearestBranch && (
                <div className="flex items-center gap-1.5 text-xs text-emerald-300 mt-1 font-semibold">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>
                    أقرب فرع على بُعد {formatDistance(nearestBranch.distanceKm, true)} ({nearestBranch.branch.city} - {nearestBranch.branch.districtAr})
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Modal Tabs: Programs & Offers, Branches, About */}
        <div className="flex items-center border-b border-slate-200 bg-slate-50 px-4 sm:px-6">
          <button
            onClick={() => setActiveTab('programs')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'programs'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Percent className="w-4 h-4" />
            <span>برامج الولاء والخصومات ({supportedPrograms.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('branches')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'branches'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>الفروع والمواقع ({store.branches.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`py-3 px-4 text-sm font-semibold border-b-2 transition flex items-center gap-2 ${
              activeTab === 'about'
                ? 'border-emerald-600 text-emerald-700 bg-white'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            <Info className="w-4 h-4" />
            <span>معلومات المتجر</span>
          </button>
        </div>

        {/* Modal Content Scroll Area */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-4">
          
          {/* TAB 1: PROGRAMS & OFFERS */}
          {activeTab === 'programs' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    البرامج المدعومة والعروض المتاحة
                  </h3>
                  <p className="text-xs text-slate-500">
                    اختر البرنامج للاستفادة من الخصم أو تسجيل الدخول وتفعيل المزايا
                  </p>
                </div>
                <span className="text-xs bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                  تم التحقق اليوم ✓
                </span>
              </div>

              {/* Supported Programs List */}
              <div className="space-y-3.5">
                {supportedPrograms.map((program) => {
                  const programOffers = offers.filter(o => o.programId === program.id);
                  const isLinked = linkedAccounts.some(acc => acc.programId === program.id);
                  const linkedInfo = linkedAccounts.find(acc => acc.programId === program.id);

                  return (
                    <div
                      key={program.id}
                      className="border border-slate-200 rounded-2xl p-4 bg-white hover:border-slate-300 transition-shadow shadow-sm space-y-3"
                    >
                      {/* Program Header */}
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-3">
                          <div 
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-sm"
                            style={{ backgroundColor: program.color }}
                          >
                            {program.nameAr.slice(0, 2)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="text-base font-bold text-slate-900">
                                {program.nameAr}
                              </h4>
                              <span className="text-xs text-slate-400">
                                ({program.nameEn})
                              </span>
                              {isLinked && (
                                <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border border-emerald-200">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  متصل ({linkedInfo?.tier || 'عضو'})
                                </span>
                              )}
                            </div>
                            <span className="text-xs text-slate-500">
                              {program.categoryLabelAr}
                            </span>
                          </div>
                        </div>

                        {/* Program Action Button (Login vs Redirect) */}
                        <div>
                          {program.hasDirectLogin ? (
                            <button
                              onClick={() => onOpenLoginModal(program)}
                              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                                isLinked
                                  ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300'
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm shadow-emerald-600/20'
                              }`}
                            >
                              <LogIn className="w-3.5 h-3.5" />
                              <span>{isLinked ? 'إدارة حساب البرنامج' : `تسجيل دخول ${program.nameAr}`}</span>
                            </button>
                          ) : (
                            <a
                              href={program.websiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 transition"
                            >
                              <span>الانتقال للموقع / التطبيق</span>
                              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Offers under this program */}
                      {programOffers.length > 0 ? (
                        <div className="space-y-2 pt-1">
                          {programOffers.map((offer) => {
                            const duration = getDurationBadge(offer.endDate, true);
                            return (
                              <div
                                key={offer.id}
                                className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                              >
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="bg-emerald-600 text-white font-bold text-xs px-2.5 py-0.5 rounded-md">
                                      {offer.discountValue}
                                    </span>
                                    <h5 className="text-sm font-bold text-slate-900">
                                      {offer.titleAr}
                                    </h5>
                                  </div>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {offer.termsAr}
                                  </p>

                                  {/* Duration Countdown Badge */}
                                  <div className="flex items-center gap-2 pt-1 text-xs">
                                    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-medium ${
                                      duration.isUrgent
                                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                                        : 'bg-slate-200/80 text-slate-700'
                                    }`}>
                                      <Clock className="w-3 h-3" />
                                      {duration.text}
                                    </span>

                                    <span className="text-slate-400">
                                      طريقة الاستفادة: {
                                        offer.redemptionMethod === 'barcode' ? 'مسح باركود التطبيق' :
                                        offer.redemptionMethod === 'card_payment' ? 'الدفع بالبطاقة' :
                                        offer.redemptionMethod === 'mobile_number' ? 'برقم الجوال لدى الكاشير' :
                                        offer.redemptionMethod === 'promo_code' ? 'رمز ترويجي' : 'إبراز التطبيق'
                                      }
                                    </span>
                                  </div>
                                </div>

                                {/* Promo Code / Action */}
                                {offer.promoCode && (
                                  <div className="flex-shrink-0 flex items-center gap-2 self-start sm:self-center">
                                    <div className="bg-white border border-dashed border-emerald-500 rounded-lg px-2.5 py-1 text-xs font-mono font-bold text-emerald-800">
                                      {offer.promoCode}
                                    </div>
                                    <button
                                      onClick={() => handleCopyCode(offer.id, offer.promoCode!)}
                                      className="p-1.5 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 transition"
                                      title="نسخ الكود"
                                    >
                                      {copiedCodeId === offer.id ? (
                                        <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                                      ) : (
                                        <Copy className="w-4 h-4" />
                                      )}
                                    </button>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="text-xs text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-dashed border-slate-200">
                          يدعم هذا المتجر برنامج {program.nameAr} لنقاط الولاء أو العمليات المباشرة عند نقاط البيع.
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: BRANCHES */}
          {activeTab === 'branches' && (
            <div className="space-y-3">
              <h3 className="text-base font-bold text-slate-900">
                الفروع في المملكة العربية السعودية
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {store.branches.map((b) => (
                  <div
                    key={b.id}
                    className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 hover:bg-white hover:border-emerald-300 transition"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                        {b.city}
                      </span>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${b.lat},${b.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-slate-500 hover:text-emerald-600 flex items-center gap-1 font-medium"
                      >
                        خرائط جوجل <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800">
                      {b.districtAr}
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      {b.addressAr}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: ABOUT */}
          {activeTab === 'about' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  نبذة عن {store.nameAr}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {store.descriptionAr}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                {store.website && (
                  <a
                    href={store.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                  >
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs text-slate-400">الموقع الرسمي</div>
                      <div className="font-semibold text-slate-800 text-xs">{store.website}</div>
                    </div>
                  </a>
                )}

                {store.phone && (
                  <a
                    href={`tel:${store.phone}`}
                    className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition"
                  >
                    <Phone className="w-4 h-4 text-emerald-600" />
                    <div>
                      <div className="text-xs text-slate-400">رقم الهاتف / خدمة العملاء</div>
                      <div className="font-semibold text-slate-800 text-xs">{store.phone}</div>
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            RoyaltiesPlus | دليل برامج الولاء والخصومات بالسعودية
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition"
          >
            إغلاق
          </button>
        </div>

      </div>
    </div>
  );
};
