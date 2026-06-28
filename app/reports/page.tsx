'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'
import { BottomNav } from '@/components/BottomNav'
import { ActionSheet } from '@/components/ActionSheet'
import { Toast } from '@/components/Toast'
import { fmt, fmtShort, CATCOLORS } from '@/lib/utils'

export default function ReportsPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const state    = useAppSelector(s => s.app)

  useEffect(() => {
    if (state.tab === 'home')     router.push('/dashboard')
    if (state.tab === 'savings')  router.push('/savings')
    if (state.tab === 'zakat')    router.push('/zakat')
    if (state.tab === 'entry')    router.push('/entry')
    if (state.tab === 'settings') router.push('/settings')
  }, [state.tab, router])

  const inc   = state.transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const exp   = state.transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const saved = inc - exp
  const rate  = inc ? Math.round(saved / inc * 100) : 0
  const mx    = Math.max(inc, exp, 1)

  // Category breakdown
  const groups: Record<string, number> = {}
  state.transactions.filter(t => t.type === 'expense').forEach(t => {
    groups[t.category] = (groups[t.category] || 0) + t.amount
  })
  const categories = Object.entries(groups)
    .map(([cat, amt]) => ({ cat, amt }))
    .sort((a, b) => b.amt - a.amt)
    .slice(0, 5)
    .map((g, i) => ({
      cat: g.cat,
      amountFmt: fmt(g.amt),
      pct: exp ? Math.round(g.amt / exp * 100) : 0,
      color: CATCOLORS[i % CATCOLORS.length],
    }))

  const zakatAccrued = Math.round(saved * state.zakatRate / 100)

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', paddingBottom:104, flex:1 }}>
        <StatusBar />

        {/* Header */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'18px 24px 8px' }}>
          <div>
            <div style={{ fontSize:12, letterSpacing:'0.12em', textTransform:'uppercase', color:'#A98A45', fontWeight:600 }}>Monthly report</div>
            <div style={{ fontFamily:"'Newsreader', serif", fontSize:28, letterSpacing:'-.01em' }}>June 2026</div>
          </div>
          <button style={{ width:38, height:38, borderRadius:'50%', background:'#fff', border:'1px solid #ECE7DC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, cursor:'pointer' }}>⌄</button>
        </div>

        {/* 4 stat cards */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:12, padding:'8px 20px 18px' }}>
          {[
            { label:'Income',       value: fmt(inc),   color:'#21261F' },
            { label:'Expenses',     value: fmt(exp),   color:'#A8584A' },
            { label:'Saved',        value: fmt(saved), color:'#3C5A45' },
            { label:'Savings rate', value: `${rate}%`, color:'#21261F' },
          ].map(c => (
            <div key={c.label} style={{ flex:'1 1 45%', background:'#fff', border:'1px solid #ECE7DC', borderRadius:18, padding:16 }}>
              <div style={{ fontSize:12, color:'#6B7065' }}>{c.label}</div>
              <div style={{ fontFamily:"'Newsreader', serif", fontSize:22, marginTop:2, color:c.color }}>{c.value}</div>
            </div>
          ))}
        </div>

        {/* Income vs expenses bars */}
        <div style={{ margin:'0 20px 18px', background:'#fff', border:'1px solid #ECE7DC', borderRadius:22, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:18 }}>Income vs expenses</div>
          {[
            { label:'Income',   pct: Math.round(inc / mx * 100), fill:'#3C5A45', short: fmtShort(inc) },
            { label:'Expenses', pct: Math.round(exp / mx * 100), fill:'#A8584A', short: fmtShort(exp) },
          ].map(r => (
            <div key={r.label} style={{ display:'flex', alignItems:'center', gap:14, marginBottom: r.label === 'Income' ? 14 : 0 }}>
              <div style={{ width:64, fontSize:13, color:'#6B7065' }}>{r.label}</div>
              <div style={{ flex:1, height:14, background:'#EFEADF', borderRadius:99, overflow:'hidden' }}>
                <div style={{ width:`${r.pct}%`, height:'100%', background:r.fill, borderRadius:99 }} />
              </div>
              <div style={{ width:56, textAlign:'right', fontSize:13, fontWeight:600 }}>{r.short}</div>
            </div>
          ))}
        </div>

        {/* Category breakdown */}
        <div style={{ margin:'0 20px 18px', background:'#fff', border:'1px solid #ECE7DC', borderRadius:22, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Spending by category</div>
          {categories.map(c => (
            <div key={c.cat} style={{ marginBottom:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', fontSize:13, marginBottom:6 }}>
                <span style={{ fontWeight:500 }}>{c.cat}</span>
                <span style={{ color:'#6B7065' }}>{c.amountFmt} · {c.pct}%</span>
              </div>
              <div style={{ height:9, background:'#EFEADF', borderRadius:99, overflow:'hidden' }}>
                <div style={{ width:`${c.pct}%`, height:'100%', background:c.color, borderRadius:99 }} />
              </div>
            </div>
          ))}
        </div>

        {/* Zakat accrued */}
        <div style={{ margin:'0 20px 18px', background:'#F1ECDD', border:'1px solid #E7DEC6', borderRadius:20, padding:18, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
          <div>
            <div style={{ fontSize:13, color:'#8A7B52' }}>Zakat accrued this period</div>
            <div style={{ fontFamily:"'Newsreader', serif", fontSize:22, marginTop:2 }}>{fmt(zakatAccrued)}</div>
          </div>
          <div style={{ fontSize:12, color:'#8A7B52', textAlign:'right' }}>{state.zakatRate}%<br />of savings</div>
        </div>

        {/* Export buttons */}
        <div style={{ display:'flex', gap:12, padding:'0 20px' }}>
          <button style={{ flex:1, background:'#3C5A45', color:'#fff', textAlign:'center', padding:15, borderRadius:16, fontSize:15, fontWeight:600, cursor:'pointer', border:'none' }}>
            Export PDF
          </button>
          <button style={{ flex:1, background:'#fff', border:'1px solid #E7E2D7', textAlign:'center', padding:15, borderRadius:16, fontSize:15, fontWeight:600, cursor:'pointer' }}>
            Share
          </button>
        </div>
      </div>

      <BottomNav />
      {state.showSheet && <ActionSheet />}
      <Toast />
    </AppShell>
  )
}
