import { Store, StoreBranch, UserLocation } from '../types';

/**
 * Calculates distance in kilometers between two GPS coordinates using the Haversine formula
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLon = (lon2 - lon1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c * 10) / 10;
}

/**
 * Finds the nearest branch of a store from user location
 */
export function getNearestBranch(store: Store, userLoc: UserLocation): { branch: StoreBranch; distanceKm: number } | null {
  if (!store.branches || store.branches.length === 0) return null;

  let nearestBranch = store.branches[0];
  let minDistance = calculateDistanceKm(userLoc.lat, userLoc.lng, nearestBranch.lat, nearestBranch.lng);

  for (let i = 1; i < store.branches.length; i++) {
    const branch = store.branches[i];
    const dist = calculateDistanceKm(userLoc.lat, userLoc.lng, branch.lat, branch.lng);
    if (dist < minDistance) {
      minDistance = dist;
      nearestBranch = branch;
    }
  }

  return { branch: nearestBranch, distanceKm: minDistance };
}

/**
 * Formats distance nicely in Arabic or English
 */
export function formatDistance(distanceKm: number, isArabic = true): string {
  if (distanceKm < 1) {
    const meters = Math.round(distanceKm * 1000);
    return isArabic ? `${meters} متر` : `${meters} m`;
  }
  return isArabic ? `${distanceKm.toFixed(1)} كم` : `${distanceKm.toFixed(1)} km`;
}
