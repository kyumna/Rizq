import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export interface Transaction {
  id: number
  type: 'income' | 'expense'
  category: string
  amount: number
  date: string
  note: string
}

export interface ZakatRecord {
  date: string
  hijri: string
  amount: number
}

interface AppState {
  screen: 'login' | 'signup' | 'setup' | 'app'
  tab: 'home' | 'savings' | 'zakat' | 'report' | 'entry' | 'settings'
  onboarded: boolean
  showSheet: boolean
  showReminder: boolean
  remindShown: boolean
  toast: string
  user: { name: string; email: string }
  startingSavings: number
  monthlyIncome: number
  gold: number
  nisab: number
  lastZakat: string
  zakatRate: number
  setup: { savings: string; income: string; lastZakat: string; gold: string }
  settingsDraft: { name: string; email: string; savings: string; income: string; lastZakat: string; gold: string }
  signup: { name: string; email: string; password: string; confirm: string }
  draft: { type: 'expense' | 'income'; amount: string; category: string; note: string }
  transactions: Transaction[]
  zakatHistory: ZakatRecord[]
  trend: { m: string; v: number }[]
}

const initialState: AppState = {
  screen: 'login',
  tab: 'home',
  onboarded: false,
  showSheet: false,
  showReminder: false,
  remindShown: false,
  toast: '',
  user: { name: 'Ahmed', email: 'ahmed@email.com' },
  startingSavings: 1130900,
  monthlyIncome: 180000,
  gold: 0,
  nisab: 179690,
  lastZakat: '2025-08-26',
  zakatRate: 2.5,
  setup: { savings: '1130900', income: '180000', lastZakat: '2025-08-26', gold: '0' },
  settingsDraft: { name: '', email: '', savings: '', income: '', lastZakat: '', gold: '' },
  signup: { name: '', email: '', password: '', confirm: '' },
  draft: { type: 'expense', amount: '', category: 'Food', note: '' },
  transactions: [
    { id: 1,  type: 'income',  category: 'Salary',    amount: 180000, date: '1 Jun',  note: '' },
    { id: 2,  type: 'expense', category: 'Rent',      amount: 45000,  date: '2 Jun',  note: '' },
    { id: 3,  type: 'expense', category: 'Bills',     amount: 8500,   date: '10 Jun', note: 'Electricity' },
    { id: 8,  type: 'expense', category: 'Bills',     amount: 2400,   date: '12 Jun', note: 'Internet' },
    { id: 4,  type: 'expense', category: 'Transport', amount: 3300,   date: '15 Jun', note: '' },
    { id: 10, type: 'expense', category: 'Transport', amount: 2100,   date: '16 Jun', note: '' },
    { id: 5,  type: 'income',  category: 'Freelance', amount: 15000,  date: '18 Jun', note: '' },
    { id: 6,  type: 'expense', category: 'Shopping',  amount: 6000,   date: '20 Jun', note: '' },
    { id: 7,  type: 'expense', category: 'Health',    amount: 2000,   date: '22 Jun', note: '' },
    { id: 9,  type: 'expense', category: 'Food',      amount: 5100,   date: '24 Jun', note: 'Groceries' },
    { id: 11, type: 'expense', category: 'Food',      amount: 3800,   date: '25 Jun', note: 'Dining' },
    { id: 12, type: 'expense', category: 'Food',      amount: 4200,   date: '27 Jun', note: 'Groceries' },
  ],
  zakatHistory: [
    { date: '26 Aug 2025', hijri: '1446', amount: 28750 },
    { date: '5 Sep 2024',  hijri: '1445', amount: 24300 },
  ],
  trend: [
    { m: 'Jan', v: 62000 }, { m: 'Feb', v: 75000 }, { m: 'Mar', v: 48000 },
    { m: 'Apr', v: 90000 }, { m: 'May', v: 103000 },
  ],
}

const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    // Auth
    signIn(state) {
      state.screen = state.onboarded ? 'app' : 'setup'
    },
    signOut(state) {
      state.screen = 'login'
      state.tab = 'home'
      state.onboarded = false
      state.showSheet = false
      state.showReminder = false
      state.remindShown = false
    },
    goSignup(state) { state.screen = 'signup' },
    goLogin(state)  { state.screen = 'login'  },
    updateSignup(state, a: PayloadAction<Partial<AppState['signup']>>) {
      state.signup = { ...state.signup, ...a.payload }
    },
    createAccount(state) {
      state.user = { name: state.signup.name, email: state.signup.email }
      state.screen = 'setup'
    },

    // Setup
    updateSetup(state, a: PayloadAction<Partial<AppState['setup']>>) {
      state.setup = { ...state.setup, ...a.payload }
    },
    finishSetup(state) {
      state.startingSavings = parseInt(state.setup.savings || '0', 10)
      state.monthlyIncome   = parseInt(state.setup.income  || '0', 10)
      state.gold            = parseInt(state.setup.gold    || '0', 10)
      state.lastZakat       = state.setup.lastZakat
      state.screen          = 'app'
      state.tab             = 'home'
      state.onboarded       = true
    },

    // Nav
    setTab(state, a: PayloadAction<AppState['tab']>) {
      state.tab       = a.payload
      state.showSheet = false
    },
    goHome(state)    { state.tab = 'home';    state.showSheet = false },
    goSavings(state) { state.tab = 'savings'; state.showSheet = false },
    goReport(state)  { state.tab = 'report';  state.showSheet = false; state.screen = 'app' },
    goZakat(state)   { state.tab = 'zakat';   state.showSheet = false },

    // Action sheet
    openSheet(state)  { state.showSheet = true  },
    closeSheet(state) { state.showSheet = false },
    openExpense(state) {
      state.draft = { type: 'expense', amount: '', category: 'Food', note: '' }
      state.tab   = 'entry'
      state.showSheet = false
    },
    openIncome(state) {
      state.draft = { type: 'income', amount: '', category: 'Salary', note: '' }
      state.tab   = 'entry'
      state.showSheet = false
    },

    // Entry
    updateDraft(state, a: PayloadAction<Partial<AppState['draft']>>) {
      state.draft = { ...state.draft, ...a.payload }
    },
    appendAmount(state, a: PayloadAction<string>) {
      let amt = state.draft.amount
      if (amt === '' && /^0+$/.test(a.payload)) return
      amt = (amt + a.payload).slice(0, 10)
      state.draft.amount = amt
    },
    backspaceAmount(state) {
      state.draft.amount = state.draft.amount.slice(0, -1)
    },
    saveEntry(state) {
      const amt = parseInt(state.draft.amount || '0', 10)
      if (!amt) return
      const t: Transaction = {
        id: Date.now(),
        type: state.draft.type,
        category: state.draft.category,
        amount: amt,
        date: '27 Jun',
        note: state.draft.note,
      }
      state.transactions = [t, ...state.transactions]
      state.tab   = 'home'
      state.toast = (state.draft.type === 'expense' ? 'Expense' : 'Income') + ' saved'
    },

    // Reminder
    showReminderModal(state) { state.showReminder = true; state.remindShown = true },
    remindLog(state) {
      state.showReminder = false
      state.draft = { type: 'expense', amount: '', category: 'Food', note: '' }
      state.tab   = 'entry'
    },
    remindDismiss(state) { state.showReminder = false },

    // Zakat
    payZakat(state) {
      const total  = state.startingSavings + state.transactions.filter(t=>t.type==='income').reduce((a,t)=>a+t.amount,0)
                     - state.transactions.filter(t=>t.type==='expense').reduce((a,t)=>a+t.amount,0) + state.gold
      const due    = Math.round(total * state.zakatRate / 100)
      state.zakatHistory = [{ date: '27 Jun 2026', hijri: '1447', amount: due }, ...state.zakatHistory]
      state.lastZakat    = '2026-06-27'
      state.toast        = 'Zakat marked as paid'
    },

    // Settings
    openSettings(state) {
      state.settingsDraft = {
        name: state.user.name,
        email: state.user.email,
        savings: String(state.startingSavings),
        income:  String(state.monthlyIncome),
        lastZakat: state.lastZakat,
        gold: String(state.gold),
      }
      state.tab = 'settings'
    },
    updateSettingsDraft(state, a: PayloadAction<Partial<AppState['settingsDraft']>>) {
      state.settingsDraft = { ...state.settingsDraft, ...a.payload }
    },
    saveSettings(state) {
      state.user          = { name: state.settingsDraft.name, email: state.settingsDraft.email }
      state.startingSavings = parseInt(state.settingsDraft.savings || '0', 10)
      state.monthlyIncome   = parseInt(state.settingsDraft.income  || '0', 10)
      state.gold            = parseInt(state.settingsDraft.gold    || '0', 10)
      state.lastZakat       = state.settingsDraft.lastZakat
      state.tab             = 'home'
      state.toast           = 'Settings saved'
    },

    // Toast
    setToast(state, a: PayloadAction<string>) { state.toast = a.payload },
    clearToast(state) { state.toast = '' },
  },
})

export const actions = appSlice.actions
export default appSlice.reducer
