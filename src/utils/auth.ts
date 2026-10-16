import { LinkedAccount, RoyaltyProgram } from '../types';

const STORAGE_KEY_AUTH = 'royalties_plus_linked_accounts_v1';

export function getLinkedAccounts(): LinkedAccount[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_AUTH);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function isAccountLinked(programId: string): boolean {
  const accounts = getLinkedAccounts();
  return accounts.some(acc => acc.programId === programId);
}

export function saveLinkedAccount(account: LinkedAccount): void {
  const accounts = getLinkedAccounts().filter(acc => acc.programId !== account.programId);
  accounts.push(account);
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(accounts));
}

export function removeLinkedAccount(programId: string): void {
  const accounts = getLinkedAccounts().filter(acc => acc.programId !== programId);
  localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(accounts));
}

/**
 * Handles program action: either opens direct login modal, or redirects to external app/portal
 */
export function handleProgramAction(
  program: RoyaltyProgram,
  onOpenLoginModal: (program: RoyaltyProgram) => void
): void {
  if (program.hasDirectLogin) {
    // Has in-app direct authentication (Walaplus SSO, Visa Concierge CEMEA)
    onOpenLoginModal(program);
  } else {
    // Redirect to service official application or web portal
    window.open(program.websiteUrl, '_blank', 'noopener,noreferrer');
  }
}
