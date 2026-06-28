'use client'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'

function RsInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div style={{ position:'relative' }}>
      <span style={{ position:'absolute', left:16, top:15, color:'#9A988C', fontSize:15, pointerEvents:'none' }}>Rs</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'14px 16px 14px 44px', fontSize:16, fontWeight:600, outline:'none' }}
      />
    </div>
  )
}

export default function SetupPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const setup    = useAppSelector(s => s.app.setup)

  function handleFinish() {
    dispatch(actions.finishSetup())
    router.push('/dashboard')
  }

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', padding:'0 26px 30px', flex:1 }}>
        <StatusBar />

        <div style={{ paddingTop:18 }}>
          <div style={{ fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color:'#A98A45', fontWeight:600, marginBottom:8 }}>
            One-time setup
          </div>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:30, lineHeight:1.15, letterSpacing:'-.01em', marginBottom:8 }}>
            Let's start from<br />where you are.
          </div>
          <div style={{ fontSize:14, color:'#6B7065', lineHeight:1.5, marginBottom:26 }}>
            We'll add each month's savings on top of this, and use it to calculate your zakat automatically.
          </div>

          <label style={{ fontSize:13, fontWeight:600 }}>Current total savings</label>
          <div style={{ margin:'8px 0 18px' }}>
            <RsInput value={setup.savings} onChange={v => dispatch(actions.updateSetup({ savings: v }))} />
          </div>

          <label style={{ fontSize:13, fontWeight:600 }}>Typical monthly income</label>
          <div style={{ margin:'8px 0 18px' }}>
            <RsInput value={setup.income} onChange={v => dispatch(actions.updateSetup({ income: v }))} />
          </div>

          {/* Zakat section */}
          <div style={{ background:'#F1ECDD', border:'1px solid #E7DEC6', borderRadius:18, padding:18, marginBottom:18 }}>
            <div style={{ fontSize:13, fontWeight:600, color:'#8A7B52', letterSpacing:'0.04em', textTransform:'uppercase', marginBottom:14 }}>
              Zakat details
            </div>

            <label style={{ fontSize:13, fontWeight:600 }}>Last zakat paid on</label>
            <input
              type="date"
              value={setup.lastZakat}
              onChange={e => dispatch(actions.updateSetup({ lastZakat: e.target.value }))}
              style={{ width:'100%', background:'#fff', border:'1px solid #E7DEC6', borderRadius:12, padding:'13px 14px', margin:'8px 0 16px', fontSize:15, outline:'none', color:'#21261F', display:'block' }}
            />

            <label style={{ fontSize:13, fontWeight:600 }}>
              Gold / other zakatable assets <span style={{ color:'#9A988C', fontWeight:400 }}>(optional)</span>
            </label>
            <div style={{ marginTop:8 }}>
              <div style={{ position:'relative' }}>
                <span style={{ position:'absolute', left:14, top:14, color:'#9A988C', fontSize:15, pointerEvents:'none' }}>Rs</span>
                <input
                  inputMode="numeric"
                  value={setup.gold}
                  onChange={e => dispatch(actions.updateSetup({ gold: e.target.value }))}
                  style={{ width:'100%', background:'#fff', border:'1px solid #E7DEC6', borderRadius:12, padding:'13px 14px 13px 42px', fontSize:15, outline:'none' }}
                />
              </div>
            </div>
          </div>

          <button onClick={handleFinish}
            style={{ background:'#3C5A45', color:'#F4F1EA', textAlign:'center', padding:17, borderRadius:16, fontSize:16, fontWeight:600, cursor:'pointer', border:'none', width:'100%' }}>
            Finish setup
          </button>
          <button onClick={handleFinish}
            style={{ textAlign:'center', fontSize:14, color:'#6B7065', paddingTop:16, cursor:'pointer', background:'none', border:'none', width:'100%' }}>
            Skip for now
          </button>
        </div>
      </div>
    </AppShell>
  )
}
