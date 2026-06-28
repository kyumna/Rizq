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
import { fmt, fmtDate, computeZakat } from '@/lib/utils'

export default function ZakatPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const state    = useAppSelector(s => s.app)

  useEffect(() => {
    if (state.tab === 'home')     router.push('/dashboard')
    if (state.tab === 'savings')  router.push('/savings')
    if (state.tab === 'report')   router.push('/reports')
    if (state.tab === 'entry')    router.push('/entry')
    if (state.tab === 'settings') router.push('/settings')
  }, [state.tab, router])

  const inc   = state.transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const exp   = state.transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const total = state.startingSavings + (inc - exp)
  const z     = computeZakat(total, state.gold, state.nisab, state.zakatRate, state.lastZakat)

  function handlePay() {
    dispatch(actions.payZakat())
  }

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', paddingBottom:104, flex:1 }}>
        <StatusBar />
        <div style={{ padding:'18px 24px 6px' }}>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:28, letterSpacing:'-.01em' }}>Zakat</div>
        </div>

        {/* Hero card */}
        <div style={{ margin:'6px 20px 16px', background:'#5A4A28', borderRadius:26, padding:24, color:'#F3ECDA' }}>
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <div style={{ fontSize:13, opacity:.85 }}>Estimated zakat due</div>
            <div style={{ fontSize:11, background:'rgba(255,255,255,.16)', padding:'4px 10px', borderRadius:99 }}>
              {z.above ? 'Above nisab' : 'Below nisab'}
            </div>
          </div>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:40, letterSpacing:'-.01em', margin:'6px 0 4px' }}>
            {fmt(z.due)}
          </div>
          <div style={{ fontSize:13, color:'#D8C79B' }}>
            Due {fmtDate(z.dueDate)} · in {z.days} days
          </div>
          <div style={{ height:7, background:'rgba(255,255,255,.18)', borderRadius:99, overflow:'hidden', marginTop:14 }}>
            <div style={{ width:`${z.progress}%`, height:'100%', background:'#D8B968', borderRadius:99 }} />
          </div>
        </div>

        {/* Details card */}
        <div style={{ margin:'0 20px 16px', background:'#fff', border:'1px solid #ECE7DC', borderRadius:20, padding:'6px 18px' }}>
          {[
            { label:'Zakatable wealth',  value: fmt(z.total) },
            { label:'Nisab threshold',   value: fmt(state.nisab) },
            { label:'Rate',              value: `${state.zakatRate}% of wealth` },
            { label:'Last paid',         value: fmtDate(z.lp) },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom: i < arr.length - 1 ? '1px solid #ECE7DC' : 'none' }}>
              <span style={{ fontSize:14, color:'#6B7065' }}>{row.label}</span>
              <span style={{ fontSize:14, fontWeight:600 }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize:12, color:'#9A988C', padding:'0 24px 16px', lineHeight:1.5 }}>
          Calculated automatically as {state.zakatRate}% of wealth held above nisab for one lunar year (≈354 days) from your last payment.
        </div>

        <button onClick={handlePay}
          style={{ margin:'0 20px 22px', background:'#A98A45', color:'#fff', textAlign:'center', padding:16, borderRadius:16, fontSize:16, fontWeight:600, cursor:'pointer', border:'none', width:'calc(100% - 40px)', display:'block' }}>
          Mark zakat as paid
        </button>

        {/* Payment history */}
        <div style={{ padding:'0 24px' }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:8 }}>Payment history</div>
          {state.zakatHistory.map((z, i, arr) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i < arr.length - 1 ? '1px solid #ECE7DC' : 'none' }}>
              <div style={{ width:38, height:38, borderRadius:11, background:'#F1ECDD', display:'flex', alignItems:'center', justifyContent:'center', color:'#A98A45', fontWeight:700, flexShrink:0 }}>✓</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:14, fontWeight:500 }}>{z.date}</div>
                <div style={{ fontSize:12, color:'#6B7065' }}>{z.hijri} AH</div>
              </div>
              <div style={{ fontSize:14, fontWeight:600 }}>{fmt(z.amount)}</div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
      {state.showSheet && <ActionSheet />}
      <Toast />
    </AppShell>
  )
}
