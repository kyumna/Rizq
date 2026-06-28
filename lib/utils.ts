export function fmt(n: number): string {
  return 'Rs ' + Math.round(n).toLocaleString('en-US')
}

export function fmtShort(n: number): string {
  n = Math.round(n)
  if (Math.abs(n) >= 100000) return (n / 1000).toFixed(0) + 'k'
  if (Math.abs(n) >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + 'k'
  return '' + n
}

export function fmtDate(d: Date): string {
  const MO = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return d.getDate() + ' ' + MO[d.getMonth()] + ' ' + d.getFullYear()
}

export function computeZakat(
  totalSavings: number,
  gold: number,
  nisab: number,
  zakatRate: number,
  lastZakat: string
) {
  const total = totalSavings + (gold || 0)
  const above = total >= nisab
  const due = above ? Math.round(total * zakatRate / 100) : 0
  const today = new Date()
  const lp = new Date(lastZakat + 'T00:00:00')
  const dueDate = new Date(lp)
  dueDate.setDate(dueDate.getDate() + 354)
  const days = Math.max(0, Math.ceil((dueDate.getTime() - today.getTime()) / 86400000))
  const progress = Math.min(100, Math.max(3, Math.round((354 - days) / 354 * 100)))
  return { total, above, due, dueDate, days, progress, lp }
}

export const CATCOLORS = ['#3C5A45','#5C7A65','#7C9483','#9DAE9C','#B6C0B1']

export const EXPENSE_CATS = ['Food','Transport','Rent','Bills','Shopping','Health','Other']
export const INCOME_CATS  = ['Salary','Freelance','Business','Gift','Other']
