export type ProgramCategory = 'royalty' | 'carrier' | 'credit_card' | 'banking';

export type StoreCategory = 
  | 'all'
  | 'supermarket'
  | 'restaurant'
  | 'cafe'
  | 'electronics'
  | 'fashion'
  | 'entertainment'
  | 'pharmacy'
  | 'fuel';

export interface RoyaltyProgram {
  id: string;
  nameEn: string;
  nameAr: string;
  category: ProgramCategory;
  categoryLabelAr: string;
  categoryLabelEn: string;
  color: string;
  badgeBg: string;
  badgeText: string;
  iconName: string;
  descriptionAr: string;
  descriptionEn: string;
  websiteUrl: string;
  appDeepLink?: string;
  hasDirectLogin: boolean;
  loginTitleAr?: string;
  loginTitleEn?: string;
  loginPlaceholderAr?: string;
  partnerCount: number;
}

export type DiscountType = 'percentage' | 'cashback' | 'points' | 'buy_get' | 'vip';

export interface DiscountOffer {
  id: string;
  storeId: string;
  programId: string;
  titleAr: string;
  titleEn: string;
  discountType: DiscountType;
  discountValue: string; // e.g. "20%", "2x Points", "50 SAR Cashback"
  termsAr: string;
  termsEn: string;
  redemptionMethod: 'barcode' | 'promo_code' | 'card_payment' | 'mobile_number' | 'app_show';
  promoCode?: string;
  startDate: string; // ISO
  endDate: string; // ISO
  verifiedToday: boolean;
  isExclusive?: boolean;
}

export interface StoreBranch {
  id: string;
  city: string; // Riyadh, Jeddah, Dammam, Khobar, Mecca
  districtAr: string;
  districtEn: string;
  lat: number;
  lng: number;
  addressAr: string;
  addressEn: string;
  distanceKm?: number;
}

export interface Store {
  id: string;
  nameEn: string;
  nameAr: string;
  category: StoreCategory;
  categoryNameAr: string;
  categoryNameEn: string;
  logo: string;
  coverImage: string;
  rating: number;
  ratingCount: number;
  branches: StoreBranch[];
  supportedProgramIds: string[];
  website?: string;
  phone?: string;
  descriptionAr: string;
  descriptionEn: string;
}

export interface UserLocation {
  lat: number;
  lng: number;
  city: string;
  district: string;
  isCustom: boolean;
  accuracy?: number;
}

export interface LinkedAccount {
  programId: string;
  identifier: string; // e.g. phone or membership ID or email
  tier: string;
  linkedAt: string;
}
