import type { UserRole } from '../types'

export interface Theme {
  primary: string
  primaryDark: string
  primaryLight: string
  primaryBg: string
  primaryText: string
  accent: string
  label: string
}

export const THEMES: Record<UserRole, Theme> = {
  buyer: {
    primary:     '#4A3F8F',
    primaryDark: '#362E6B',
    primaryLight:'#5E52A8',
    primaryBg:   '#F0EEF8',
    primaryText: '#4A3F8F',
    accent:      '#7B6FBF',
    label:       'Buyer · 买家',
  },
  seller: {
    primary:     '#3AAFA9',
    primaryDark: '#2B8F8A',
    primaryLight:'#4DC5BF',
    primaryBg:   '#EBF7F7',
    primaryText: '#2B8F8A',
    accent:      '#5ECAC5',
    label:       'Seller · 卖家',
  },
  admin: {
    primary:     '#1E2325',
    primaryDark: '#0F1416',
    primaryLight:'#2E3538',
    primaryBg:   '#EEEEF0',
    primaryText: '#1E2325',
    accent:      '#4A5568',
    label:       'Admin · 管理员',
  },
}

export function applyTheme(role: UserRole) {
  const t = THEMES[role]
  const root = document.documentElement
  root.style.setProperty('--color-primary',      t.primary)
  root.style.setProperty('--color-primary-dark',  t.primaryDark)
  root.style.setProperty('--color-primary-light', t.primaryLight)
  root.style.setProperty('--color-primary-bg',    t.primaryBg)
  root.style.setProperty('--color-primary-text',  t.primaryText)
  root.style.setProperty('--color-accent',        t.accent)
}
