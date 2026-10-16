import React, { useState } from 'react';
import { RoyaltyProgram, LinkedAccount } from '../types';
import { 
  X, 
  ShieldCheck, 
  LogIn, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  CreditCard, 
  Building2, 
  AlertCircle,
  Trash2
} from 'lucide-react';

interface LoginModalProps {
  program: RoyaltyProgram | null;
  linkedAccount?: LinkedAccount;
  onClose: () => void;
  onSaveAccount: (account: LinkedAccount) => void;
  onRemoveAccount: (programId: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  program,
  linkedAccount,
  onClose,
  onSaveAccount,
  onRemoveAccount
}) => {
  if (!program) return null;

  const [identifier, setIdentifier] = useState(linkedAccount?.identifier || '');
  const [subField, setSubField] = useState('');
  const [tier, setTier] = useState(linkedAccount?.tier || 'ذهبي (Corporate Gold)');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!identifier.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      onSaveAccount({
        programId: program.id,
        identifier: identifier.trim(),
        tier: tier,
        linkedAt: new Date().toISOString()
      });
      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    }, 600);
  };

  const handleQuickDemo = () => {
    if (program.id === 'walaplus') {
      setIdentifier('mohammed.alharbi@aramco.com');
      setSubField('شركة أرامكو السعودية');
      setTier('بلاتيني (VIP Corporate)');
    } else if (program.id === 'visa_concierge') {
      setIdentifier('4111-XXXX-XXXX-8921');
      setSubField('visa.vip@saudibanks.com');
      setTier('Visa Infinite Luxury');
    }
  };

  const isWalaplus = program.id === 'walaplus';
  const isVisaConcierge = program.id === 'visa_concierge';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div 
        className="bg-white w-full max-w-lg rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div 
          className="p-6 text-white relative overflow-hidden"
          style={{ backgroundColor: program.color || '#006C35' }}
        >
          <div className="absolute top-0 right-0 left-0 bottom-0 bg-black/20" />
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm transition"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white font-bold text-lg border border-white/30">
              {isWalaplus ? <Building2 className="w-6 h-6" /> : isVisaConcierge ? <CreditCard className="w-6 h-6" /> : <ShieldCheck className="w-6 h-6" />}
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">
                {program.nameAr}
              </h3>
              <p className="text-xs text-white/80">
                {program.loginTitleAr || `الربط مع ${program.nameEn}`}
              </p>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {successMessage ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-bold text-slate-900">
                تم ربط الحساب بنجاح!
              </h4>
              <p className="text-xs text-slate-500">
                تم تفعيل مزايا وخصومات {program.nameAr} تلقائياً في حسابك.
              </p>
            </div>
          ) : program.hasDirectLogin ? (
            /* Direct Login Form for Walaplus & Visa Concierge */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Linked notice if already linked */}
              {linkedAccount && (
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                    <span>
                      الحساب مرتبط حالياً: <b>{linkedAccount.identifier}</b> ({linkedAccount.tier})
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => onRemoveAccount(program.id)}
                    className="text-red-600 hover:text-red-700 font-semibold flex items-center gap-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> إلغاء الربط
                  </button>
                </div>
              )}

              {/* Demo autofill helper button */}
              <div className="flex items-center justify-between bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-600">
                  تجربة سريعة بدون إدخال يدوي:
                </span>
                <button
                  type="button"
                  onClick={handleQuickDemo}
                  className="text-xs font-bold text-emerald-700 bg-white border border-emerald-300 hover:bg-emerald-50 px-2.5 py-1 rounded-lg flex items-center gap-1"
                >
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  ملء بيانات تجريبية
                </button>
              </div>

              {/* Input 1: Primary identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isWalaplus 
                    ? 'البريد الإلكتروني للشركة أو رقم العضوية' 
                    : isVisaConcierge 
                    ? 'رقم بطاقة Visa (أول 6 وأخر 4 أرقام)' 
                    : 'اسم المستخدم أو المعرف'}
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder={program.loginPlaceholderAr || 'أدخل بياناتك المسجلة'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-sans"
                />
              </div>

              {/* Input 2: Secondary field */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  {isWalaplus 
                    ? 'اسم الشركة / جهة العمل المعتمدة' 
                    : isVisaConcierge 
                    ? 'البريد الإلكتروني المعتمد لدى البنك' 
                    : 'كلمة المرور أو رمز الدخول'}
                </label>
                <input
                  type="text"
                  value={subField}
                  onChange={(e) => setSubField(e.target.value)}
                  placeholder={isWalaplus ? 'مثال: شركة أرامكو السعودية، البنك الأهلي...' : 'مثال: user@example.com'}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-sans"
                />
              </div>

              {/* Membership Tier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  فئة العضوية أو البطاقة
                </label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-sans bg-white"
                >
                  {isWalaplus ? (
                    <>
                      <option value="عضوية الشركات الذهبية (Corporate Gold)">عضوية الشركات الذهبية (Corporate Gold)</option>
                      <option value="عضوية كبار الشخصيات (Corporate Platinum/VIP)">عضوية كبار الشخصيات (Corporate Platinum/VIP)</option>
                      <option value="عضوية الموظفين الأساسية">عضوية الموظفين الأساسية</option>
                    </>
                  ) : isVisaConcierge ? (
                    <>
                      <option value="Visa Infinite Luxury">Visa Infinite Luxury (بطاقة إنفينيت)</option>
                      <option value="Visa Signature Elite">Visa Signature Elite (بطاقة سجنتشر)</option>
                      <option value="Visa Platinum Privileges">Visa Platinum Privileges (بلاتينية)</option>
                    </>
                  ) : (
                    <>
                      <option value="عضو نشط">عضو نشط</option>
                      <option value="عضو ذهبي">عضو ذهبي</option>
                    </>
                  )}
                </select>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-md shadow-emerald-700/20 transition flex items-center justify-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>{isSubmitting ? 'جارِ التحقق والربط...' : 'تأكيد تسجيل الدخول وتفعيل الخصومات'}</span>
                </button>
              </div>

              {/* Fallback Redirect Link */}
              <div className="text-center pt-2">
                <a
                  href={program.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-500 hover:text-emerald-700 inline-flex items-center gap-1 font-medium"
                >
                  <span>أو فتح البوابة الرسمية عبر المتصفح</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </form>
          ) : (
            /* Redirect dialog for services without direct login */
            <div className="space-y-4 text-center py-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center mx-auto">
                <ExternalLink className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-base font-bold text-slate-900">
                  تطبيق وبوابة {program.nameAr} الرسمية
                </h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto leading-relaxed">
                  يتم التحقق من نقاط ومزايا {program.nameAr} مباشرة عبر تطبيقهم الرسمي أو عند نقاط البيع بإدخال رقم الجوال المسجل أو الدفع ببطاقة البنك.
                </p>
              </div>

              <div className="pt-2">
                <a
                  href={program.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-md transition flex items-center justify-center gap-2"
                >
                  <span>فتح تطبيق / موقع {program.nameAr}</span>
                  <ExternalLink className="w-4 h-4 text-slate-300" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
