'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'
import { BottomNav } from '@/components/BottomNav'
import { ActionSheet } from '@/components/ActionSheet'
import { DailyReminder } from '@/components/DailyReminder'
import { Toast } from '@/components/Toast'
import { fmt, fmtShort, computeZakat, CATCOLORS } from '@/lib/utils'

export default function DashboardPage() {
  const dispatch   = useAppDispatch()
  const router     = useRouter()
  const state      = useAppSelector(s => s.app)

  // Daily reminder — once per session
  useEffect(() => {
    if (state.remindShown) return
    const t = setTimeout(() => dispatch(actions.showReminderModal()), 1600)
    return () => clearTimeout(t)
  }, [dispatch, state.remindShown])

  // Tab sync navigation
  useEffect(() => {
    if (state.tab === 'savings') router.push('/savings')
    if (state.tab === 'report')  router.push('/reports')
    if (state.tab === 'zakat')   router.push('/zakat')
    if (state.tab === 'entry')   router.push('/entry')
    if (state.tab === 'settings') router.push('/settings')
  }, [state.tab, router])

  const inc   = state.transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const exp   = state.transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const saved = inc - exp
  const total = state.startingSavings + saved
  const z     = computeZakat(total, state.gold, state.nisab, state.zakatRate, state.lastZakat)

  const recent = state.transactions.slice(0, 4).map(t => ({
    ...t,
    tint:        t.type === 'income' ? '#E8EEE7' : '#F3E4DF',
    ink:         t.type === 'income' ? '#3C5A45' : '#A8584A',
    amountLabel: (t.type === 'income' ? '+' : '−') + t.amount.toLocaleString('en-US'),
    color:       t.type === 'income' ? '#3C5A45' : '#A8584A',
    initial:     t.category.charAt(0),
    sub:         t.date + ' · ' + (t.note || (t.type === 'income' ? 'Income' : 'Expense')),
  }))

  // Category breakdown for possible future use
  const groups: Record<string, number> = {}
  state.transactions.filter(t => t.type === 'expense').forEach(t => {
    groups[t.category] = (groups[t.category] || 0) + t.amount
  })

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', paddingBottom:104, flex:1 }}>
        <StatusBar />

        {/* Greeting */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px 8px' }}>
          <div>
            <div style={{ fontSize:13, color:'#6B7065' }}>Assalamu alaikum,</div>
            <div style={{ fontFamily:"'Newsreader', serif", fontSize:26, letterSpacing:'-.01em' }}>{state.user.name}</div>
          </div>
          <button onClick={() => dispatch(actions.openSettings())}
            style={{ width:42, height:42, borderRadius:'50%', background:'#E8EEE7', display:'flex', alignItems:'center', justifyContent:'center', color:'#3C5A45', fontWeight:700, fontSize:16, border:'none', cursor:'pointer', flexShrink:0 }}>
            {state.user.name.charAt(0)}
          </button>
        </div>

        {/* Savings hero */}
        <div style={{ margin:'8px 20px 16px', background:'#3C5A45', borderRadius:26, padding:'24px 24px 20px', color:'#EAF0E8' }}>
          <div style={{ fontSize:13, opacity:.8 }}>Total savings</div>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:38, letterSpacing:'-.01em', margin:'4px 0 2px' }}>{fmt(total)}</div>
          <div style={{ fontSize:13, color:'#BBD0B6' }}>▲ {fmt(saved)} saved this month</div>
          <svg width="100%" height="46" viewBox="0 0 280 46" preserveAspectRatio="none" style={{ marginTop:14 }}>
            <polyline points="0,38 35,33 70,35 105,24 140,27 175,16 210,19 245,10 280,7"
              fill="none" stroke="#BBD0B6" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {/* 3 stat cards */}
        <div style={{ display:'flex', gap:12, padding:'0 20px', marginBottom:18 }}>
          {[
            { label:'Income',   value: fmtShort(inc),   color:'#21261F' },
            { label:'Expenses', value: fmtShort(exp),   color:'#A8584A' },
            { label:'Saved',    value: fmtShort(saved), color:'#3C5A45' },
          ].map(c => (
            <div key={c.label} style={{ flex:1, background:'#fff', border:'1px solid #ECE7DC', borderRadius:18, padding:14 }}>
              <div style={{ fontSize:12, color:'#6B7065' }}>{c.label}</div>
              <div style={{ fontSize:17, fontWeight:700, marginTop:3, color:c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Zakat card */}
        <div onClick={() => dispatch(actions.goZakat())}
          style={{ margin:'0 20px 14px', background:'#F1ECDD', border:'1px solid #E7DEC6', borderRadius:20, padding:18, cursor:'pointer' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:14, fontWeight:600 }}>Zakat due in {z.days} days</div>
            <div style={{ fontSize:12, color:'#8A7B52' }}>{state.zakatRate}%</div>
          </div>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:24, margin:'6px 0 10px' }}>{fmt(z.due)}</div>
          <div style={{ height:7, background:'#E3D7B8', borderRadius:99, overflow:'hidden' }}>
            <div style={{ width:`${z.progress}%`, height:'100%', background:'#A98A45', borderRadius:99 }} />
          </div>
        </div>

        {/* Reminder strip */}
        <div style={{ margin:'0 20px 18px', display:'flex', alignItems:'center', gap:12, background:'#fff', border:'1px dashed #D9D2C2', borderRadius:16, padding:'13px 16px' }}>
          <div style={{ width:30, height:30, borderRadius:9, background:'#E8EEE7', display:'flex', alignItems:'center', justifyContent:'center', color:'#3C5A45', fontSize:15, flexShrink:0 }}>◔</div>
          <div style={{ flex:1, fontSize:13, color:'#6B7065', lineHeight:1.35 }}>
            Daily reminder on · <span style={{ color:'#21261F', fontWeight:600 }}>9:00 PM</span>
          </div>
          <div style={{ fontSize:12, color:'#3C5A45', fontWeight:600, cursor:'pointer' }}>Edit</div>
        </div>

        {/* Recent transactions */}
        <div style={{ padding:'0 24px' }}>
          <div style={{ display:'flex', justifyContent:'space-between', fontSize:14, marginBottom:6 }}>
            <span style={{ fontWeight:600 }}>Recent</span>
            <span onClick={() => dispatch(actions.goReport())} style={{ color:'#3C5A45', cursor:'pointer' }}>See all</span>
          </div>
          {recent.map((t, i) => (
            <div key={t.id} style={{ display:'flex', alignItems:'center', gap:12, padding:'11px 0', borderBottom: i < recent.length - 1 ? '1px solid #ECE7DC' : 'none' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:t.tint, display:'flex', alignItems:'center', justifyContent:'center', color:t.ink, fontWeight:600, fontSize:14, flexShrink:0 }}>
                {t.initial}
              </div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>{t.category}</div>
                <div style={{ fontSize:12, color:'#6B7065' }}>{t.sub}</div>
              </div>
              <div style={{ fontSize:14, fontWeight:600, color:t.color }}>{t.amountLabel}</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
      {state.showSheet   && <ActionSheet />}
      {state.showReminder && <DailyReminder />}
      <Toast />
    </AppShell>
  )
}
