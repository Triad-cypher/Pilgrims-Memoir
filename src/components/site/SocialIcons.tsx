type IconProps = { className?: string };

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" />
    </svg>
  );
}

export function TwitterIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M20.4 7.2c.01.18.01.36.01.53 0 5.4-4.11 11.62-11.62 11.62-2.31 0-4.46-.68-6.27-1.84.32.04.64.05.98.05a8.2 8.2 0 0 0 5.08-1.75 4.1 4.1 0 0 1-3.83-2.85c.25.04.51.07.78.07.37 0 .74-.05 1.08-.14A4.1 4.1 0 0 1 3.2 9.03v-.05c.55.3 1.18.49 1.85.51a4.1 4.1 0 0 1-1.27-5.47 11.63 11.63 0 0 0 8.45 4.29 4.63 4.63 0 0 1-.1-.94 4.1 4.1 0 0 1 7.09-2.8 8.06 8.06 0 0 0 2.6-.99 4.1 4.1 0 0 1-1.8 2.27 8.2 8.2 0 0 0 2.36-.64 8.4 8.4 0 0 1-2.05 2.11Z" />
    </svg>
  );
}

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M14 9.5V7.8c0-.72.48-.9.82-.9H16V4h-2.3C11.6 4 11 5.9 11 7.6v1.9H9v3h2v8.5h3V12.5h2.2l.3-3H14Z" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <rect x="2.5" y="6" width="19" height="12" rx="3.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10.5 9.5v5l4.3-2.5-4.3-2.5Z" fill="currentColor" />
    </svg>
  );
}

export function TiktokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M16.6 5.1c.7.9 1.7 1.5 2.9 1.6v2.5a5.6 5.6 0 0 1-2.9-.9v6.1a4.6 4.6 0 1 1-4-4.6v2.6a2 2 0 1 0 1.5 1.9V3h2.4c0 .74.04 1.48.1 2.1Z" />
    </svg>
  );
}
