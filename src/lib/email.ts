import { profile } from '@/data/profile';

/**
 * Email helpers. A mailto: link does nothing on machines without a default mail app
 * (common on Windows for webmail users), so every email action also copies the address
 * and the Contact section offers Gmail's web composer as a fallback.
 */

export const mailtoUrl = (subject?: string) =>
  `mailto:${profile.email}${subject ? `?subject=${encodeURIComponent(subject)}` : ''}`;

export const gmailComposeUrl = (subject?: string) =>
  `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(profile.email)}${subject ? `&su=${encodeURIComponent(subject)}` : ''}`;

/** Copies the address; resolves false when the clipboard is blocked. */
export async function copyEmail() {
  try {
    await navigator.clipboard.writeText(profile.email);
    return true;
  } catch {
    return false;
  }
}
