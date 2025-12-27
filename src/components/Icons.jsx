// Executive Professional Icon Library - Clean, Modern SVG Icons
import React from 'react';

// Book/Learn Icon - Professional document style
export const BookIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
    <line x1="9" y1="15" x2="13" y2="15"/>
  </svg>
);

// Lightning/Practice Icon - Clean bolt
export const LightningIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
  </svg>
);

// Target/Quizzes Icon - Professional target
export const TargetIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <circle cx="12" cy="12" r="6"/>
    <circle cx="12" cy="12" r="2"/>
  </svg>
);

// Certificate/Exam Icon - Professional certificate
export const CertificateIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <path d="M10 9H8"/>
    <path d="M16 13H8"/>
    <path d="M16 17H8"/>
    <path d="M10 21l2-2 2 2"/>
  </svg>
);

// Star/Progress Icon - Professional star
export const StarIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);

// Checkmark Icon - Clean check
export const CheckIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

// X/Close Icon - Clean X
export const XIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

// Circle/Not Started Icon
export const CircleIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
  </svg>
);

// Lock/Privacy Icon - Highly realistic professional padlock
export const LockIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    {/* Lock shackle - realistic U-shaped padlock shackle */}
    <path d="M8 12V8a4 4 0 0 1 8 0v4" fill="none" strokeWidth="2.5"/>
    {/* Lock body - realistic padlock body with rounded corners */}
    <rect x="6" y="12" width="12" height="9" rx="1.5" ry="1.5" fill={fill === 'none' ? 'rgba(0,0,0,0.1)' : fill} stroke={stroke} strokeWidth="2"/>
    {/* Keyhole - detailed keyhole in center */}
    <circle cx="12" cy="16.5" r="1.5" fill={stroke} opacity="0.4"/>
    <line x1="12" y1="15" x2="12" y2="18" stroke={stroke} strokeWidth="1.5" strokeLinecap="round"/>
    {/* Lock body highlight/shadow for depth */}
    <line x1="7" y1="13" x2="17" y2="13" stroke={stroke} strokeWidth="0.5" opacity="0.3"/>
  </svg>
);

// Warning Icon - Professional alert
export const WarningIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

// Arrow Right Icon
export const ArrowRightIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
    <polyline points="12 5 19 12 12 19"/>
  </svg>
);

// Chart/Analytics Icon - Professional bar chart
export const ChartIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="20" x2="12" y2="10"/>
    <line x1="18" y1="20" x2="18" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="16"/>
  </svg>
);

// Search Icon - Professional search/magnifying glass
export const SearchIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/>
    <path d="m21 21-4.35-4.35"/>
  </svg>
);

// Trophy Icon - Professional trophy
export const TrophyIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/>
    <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/>
    <path d="M4 22h16"/>
    <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/>
    <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/>
    <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>
  </svg>
);

// File/Document Icon - Professional document
export const FileIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/>
    <path d="M14 2v4a2 2 0 0 0 2 2h4"/>
    <line x1="10" y1="9" x2="14" y2="9"/>
    <line x1="10" y1="13" x2="14" y2="13"/>
    <line x1="10" y1="17" x2="16" y2="17"/>
  </svg>
);

// Lightbulb/Insight Icon - Professional lightbulb
export const LightbulbIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.8">
    <path d="M12 2v2"/>
    <path d="M12 20v2"/>
    <path d="M4.93 4.93l1.41 1.41"/>
    <path d="M17.66 17.66l1.41 1.41"/>
    <path d="M2 12h2"/>
    <path d="M20 12h2"/>
    <path d="M6.34 17.66l-1.41 1.41"/>
    <path d="M19.07 4.93l-1.41 1.41"/>
    <path d="M9 12a3 3 0 1 1 6 0 3 3 0 0 1-6 0"/>
  </svg>
);

// User/People Icon - Professional user
export const UserIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
  </svg>
);

// Settings/Gear Icon - Professional settings
export const SettingsIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);

// Home Icon
export const HomeIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);

// Bullet Point Icon
export const BulletIcon = ({ className = '', stroke = 'currentColor', size = 8, fill = 'currentColor' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 8 8" fill={fill}>
    <circle cx="4" cy="4" r="3"/>
  </svg>
);

// Dash/In Progress Icon
export const DashIcon = ({ className = '', stroke = 'currentColor', size = 24, fill = 'none' }) => (
  <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill={fill} stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
