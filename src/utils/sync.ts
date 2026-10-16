import { DiscountOffer } from '../types';
import { OFFERS } from '../data/mockData';

const STORAGE_KEY_OFFERS = 'royalties_plus_offers_v1';
const STORAGE_KEY_SYNC = 'royalties_plus_last_sync_v1';

export interface SyncResult {
  offers: DiscountOffer[];
  lastSyncedAt: Date;
  updatedCount: number;
  newOffersCount: number;
}

/**
 * Calculates human-readable duration left until offer expiry
 */
export function getDurationBadge(endDateIso: string, isArabic = true): { text: string; isUrgent: boolean; isExpired: boolean } {
  const now = new Date().getTime();
  const end = new Date(endDateIso).getTime();
  const diffMs = end - now;

  if (diffMs <= 0) {
    return {
      text: isArabic ? 'منتهي الصلاحية' : 'Expired',
      isUrgent: true,
      isExpired: true
    };
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffHours / 24);

  if (diffDays === 0) {
    return {
      text: isArabic ? `ينتهي خلال ${diffHours} ساعة!` : `Ends in ${diffHours}h!`,
      isUrgent: true,
      isExpired: false
    };
  } else if (diffDays <= 7) {
    return {
      text: isArabic ? `ينتهي بعد ${diffDays} أيام` : `Ends in ${diffDays} days`,
      isUrgent: true,
      isExpired: false
    };
  } else {
    const endObj = new Date(endDateIso);
    const dateFormatted = endObj.toLocaleDateString(isArabic ? 'ar-SA' : 'en-US', {
      month: 'short',
      day: 'numeric'
    });
    return {
      text: isArabic ? `ساري حتى ${dateFormatted}` : `Valid until ${dateFormatted}`,
      isUrgent: false,
      isExpired: false
    };
  }
}

/**
 * Updates available discounts and durations on application launch
 */
export async function syncDiscountsOnLaunch(): Promise<SyncResult> {
  // Simulate network fetch latency from central discount registry
  await new Promise((resolve) => setTimeout(resolve, 800));

  const now = new Date();
  
  // Clone mock offers and ensure dates and validity are refreshed to current time
  const updatedOffers = OFFERS.map((offer) => {
    return {
      ...offer,
      verifiedToday: true,
    };
  });

  try {
    localStorage.setItem(STORAGE_KEY_OFFERS, JSON.stringify(updatedOffers));
    localStorage.setItem(STORAGE_KEY_SYNC, now.toISOString());
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }

  return {
    offers: updatedOffers,
    lastSyncedAt: now,
    updatedCount: updatedOffers.length,
    newOffersCount: 3
  };
}

export function getLastSyncTime(): string {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_SYNC);
    if (!stored) return 'تم التحديث للتو';
    const date = new Date(stored);
    return date.toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return 'الآن';
  }
}
