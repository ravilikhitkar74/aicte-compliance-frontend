import { create } from 'zustand';
import { Role, UserSession } from '../api/types';

export const DEMO_USERS: Record<Role, UserSession> = {
  INSTITUTION: {
    id: 'u-inst-1',
    name: 'Dr. R. K. Sharma (Principal)',
    email: 'principal@vitbhopal.example.edu.in',
    role: 'INSTITUTION',
    regionCode: 'CR',
    institutionId: 'inst-1'
  },
  SCRUTINY_OFFICER: {
    id: 'u-scr-1',
    name: 'Anil Verma (Scrutiny Officer - CR)',
    email: 'anil.verma@aicte-cr.example.gov.in',
    role: 'SCRUTINY_OFFICER',
    regionCode: 'CR'
  },
  REGIONAL_OFFICER: {
    id: 'u-ro-1',
    name: 'Meera Nair (Regional Officer - CR)',
    email: 'meera.nair@aicte-cr.example.gov.in',
    role: 'REGIONAL_OFFICER',
    regionCode: 'CR'
  },
  REGIONAL_DIRECTOR: {
    id: 'u-rd-1',
    name: 'Dr. S. K. Deshmukh (Regional Director - CR)',
    email: 'rd.cr@aicte.example.gov.in',
    role: 'REGIONAL_DIRECTOR',
    regionCode: 'CR'
  },
  BUREAU_OFFICER: {
    id: 'u-bo-1',
    name: 'Vikramaditya Rao (Bureau Officer - HQ)',
    email: 'v.rao@aicte-hq.example.gov.in',
    role: 'BUREAU_OFFICER'
  },
  COMMITTEE_MEMBER: {
    id: 'u-cm-1',
    name: 'Prof. P. Chidambaram (EVC / SAC Member)',
    email: 'p.chidambaram@committee.example.ac.in',
    role: 'COMMITTEE_MEMBER'
  },
  BUREAU_HEAD: {
    id: 'u-bh-1',
    name: 'Dr. Vandana Joshi (Bureau Head - Approval)',
    email: 'bureau.head@aicte-hq.example.gov.in',
    role: 'BUREAU_HEAD'
  },
  ADMIN: {
    id: 'u-adm-1',
    name: 'Suresh Iyer (System Administrator)',
    email: 'sysadmin@aicte.example.gov.in',
    role: 'ADMIN'
  }
};

interface SessionState {
  user: UserSession | null;
  lastActiveAt: number;
  idleWarningOpen: boolean;
  loginAsRole: (role: Role) => void;
  logout: () => void;
  touchActivity: () => void;
  setIdleWarning: (open: boolean) => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: DEMO_USERS.REGIONAL_OFFICER, // Default signed-in for quick start, can logout
  lastActiveAt: Date.now(),
  idleWarningOpen: false,
  loginAsRole: (role: Role) =>
    set({
      user: DEMO_USERS[role],
      lastActiveAt: Date.now(),
      idleWarningOpen: false
    }),
  logout: () => set({ user: null, idleWarningOpen: false }),
  touchActivity: () => set({ lastActiveAt: Date.now(), idleWarningOpen: false }),
  setIdleWarning: (open: boolean) => set({ idleWarningOpen: open })
}));