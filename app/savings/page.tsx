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
import { fmt, fmtShort } from '@/lib/utils'

export default function SavingsPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const state    = useAppSelector(s => s.app)

  useEffect(() => {
    if (state.tab === 'home')    router.push('/dashboard')
    if (state.tab === 'report')  router.push('/reports')
    if (state.tab === 'zakat')   router.push('/zakat')
    if (state.tab === 'entry')   router.push('/entry')
    if (state.tab === 'settings') router.push('/settings')
  }, [state.tab, router])

  const inc   = state.transactions.filter(t => t.type === 'income').reduce((a, t) => a + t.amount, 0)
  const exp   = state.transactions.filter(t => t.type === 'expense').reduce((a, t) => a + t.amount, 0)
  const saved = inc - exp
  const total = state.startingSavings + saved
  const rate  = inc ? Math.round(saved / inc * 100) : 0

  const trendData = [...state.trend, { m: 'Jun', v: saved }]
  const tmax = Math.max(...trendData.map(x => x.v), 1)

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', paddingBottom:104, flex:1 }}>
        <StatusBar />
        <div style={{ padding:'18px 24px 6px' }}>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:28, letterSpacing:'-.01em' }}>Savings</div>
        </div>

        {/* Hero */}
        <div style={{ margin:'6px 20px 18px', background:'#3C5A45', borderRadius:26, padding:24, color:'#EAF0E8' }}>
          <div style={{ fontSize:13, opacity:.8 }}>Total savings · updated 27 Jun</div>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:40, letterSpacing:'-.01em', margin:'4px 0 10px' }}>{fmt(total)}</div>
          <div style={{ display:'flex', gap:24 }}>
            <div>
              <div style={{ fontSize:12, opacity:.75 }}>This month</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#BBD0B6' }}>+{fmtShort(saved)}</div>
            </div>
            <div>
              <div style={{ fontSize:12, opacity:.75 }}>Savings rate</div>
              <div style={{ fontSize:16, fontWeight:700, color:'#BBD0B6' }}>{rate}%</div>
            </div>
          </div>
        </div>

        {/* Bar chart */}
        <div style={{ margin:'0 20px 18px', background:'#fff', border:'1px solid #ECE7DC', borderRadius:22, padding:20 }}>
          <div style={{ fontSize:14, fontWeight:600, marginBottom:16 }}>Saved each month</div>
          <div style={{ display:'flex', alignItems:'flex-end', gap:10, height:120 }}>
            {trendData.map((b, i) => {
              const h = Math.max(6, Math.round(b.v / tmax * 100))
              const isCurrent = i === trendData.length - 1
              return (
                <div key={b.m} style={{ flex:1, display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'flex-end', height:'100%' }}>
                  <div style={{ fontSize:10, color:'#6B7065', marginBottom:6 }}>{fmtShort(b.v)}</div>
                  <div style={{ width:'100%', height:`${h}%`, background: isCurrent ? '#3C5A45' : '#C4D2C0', borderRadius:7 }} />
                  <div style={{ fontSize:11, color:'#9A988C', marginTop:7 }}>{b.m}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary rows */}
        <div style={{ margin:'0 20px', background:'#FBF9F4', border:'1px solid #ECE7DC', borderRadius:20, padding:'6px 18px' }}>
          {[
            { label:'Starting balance', value: fmt(state.startingSavings), color:'#21261F' },
            { label:'Added this month',  value: '+' + fmt(saved),           color:'#3C5A45' },
            { label:'Auto-added on',     value: 'Last day of month',        color:'#21261F' },
          ].map((row, i, arr) => (
            <div key={row.label} style={{ display:'flex', justifyContent:'space-between', padding:'14px 0', borderBottom: i < arr.length - 1 ? '1px solid #ECE7DC' : 'none' }}>
              <span style={{ fontSize:14, color:'#6B7065' }}>{row.label}</span>
              <span style={{ fontSize:14, fontWeight:600, color:row.color }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div style={{ fontSize:12, color:'#9A988C', textAlign:'center', padding:'16px 30px 0', lineHeight:1.5 }}>
          At month-end, income minus expenses is automatically added to your total savings.
        </div>
      </div>

      <BottomNav />
      {state.showSheet && <ActionSheet />}
      <Toast />
    </AppShell>
  )
}
