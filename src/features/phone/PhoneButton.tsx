import { useEffect } from 'react';
import { Smartphone } from 'lucide-react';
import { loadPhone, openPhone, phoneStore, restoreRead, usePhone } from './phoneStore';
import './PhoneButton.css';

/** Navbar phone: opens the in-world phone. A dot shows while a text is unread. */
export function PhoneButton({ className = '' }: { className?: string }) {
  const { open, unread } = usePhone();
  useEffect(restoreRead, []);

  return (
    <button
      type="button"
      data-phone-btn
      className={`phone-btn ${className}`}
      aria-haspopup="dialog"
      aria-expanded={open}
      aria-label={unread ? 'Phone, 1 new message' : 'Phone'}
      title="Phone (P)"
      onPointerEnter={() => void loadPhone()}
      onFocus={() => void loadPhone()}
      onClick={() => (open ? phoneStore.set({ open: false }) : openPhone())}
    >
      <Smartphone size={17} strokeWidth={2.2} aria-hidden="true" />
      {unread && <span className="phone-btn__badge" aria-hidden="true" />}
    </button>
  );
}
