'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'
import { Toast } from '@/components/Toast'
import { EXPENSE_CATS, INCOME_CATS } from '@/lib/utils'

const KEYS = ['1','2','3','4','5','6','7','8','9','000','0','⌫']

export default function EntryPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const draft    = useAppSelector(s => s.app.draft)
  const tab      = useAppSelector(s => s.app.tab)

  useEffect(() => {
    if (tab === 'home') router.push('/dashboard')
  }, [tab, router])

  const isExpense  = draft.type === 'expense'
  const entryColor = isExpense ? '#A8584A' : '#3C5A45'
  const cats       = isExpense ? EXPENSE_CATS : INCOME_CATS
  const displayAmt = draft.amount ? parseInt(draft.amount, 10).toLocaleString('en-US') : '0'

  function handleKey(k: string) {
    if (k === '⌫') dispatch(actions.backspaceAmount())
    else dispatch(actions.appendAmount(k))
  }

  function handleSave() {
    const amt = parseInt(draft.amount || '0', 10)
    if (!amt) { dispatch(actions.setToast('Enter an amount first')); return }
    dispatch(actions.saveEntry())
    router.push('/dashboard')
  }

  return (
    <AppShell>
      <div style={{ height:'100%', display:'flex', flexDirection:'column', background:'#F4F1EA', flex:1 }}>
        <StatusBar />

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px 4px' }}>
          <button onClick={() => { dispatch(actions.goHome()); router.push('/dashboard') }}
            style={{ width:38, height:38, borderRadius:'50%', background:'#fff', border:'1px solid #ECE7DC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer', flexShrink:0 }}>
            ‹
          </button>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:22 }}>
            {isExpense ? 'Log expense' : 'Log income'}
          </div>
        </div>

        {/* Amount display */}
        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', padding:'6px 24px 0' }}>
          <div style={{ fontSize:13, color:'#6B7065' }}>Amount</div>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:52, letterSpacing:'-.02em', color:entryColor, margin:'2px 0 4px' }}>
            Rs {displayAmt}
          </div>
        </div>

        {/* Category chips */}
        <div style={{ padding:'0 20px 6px' }}>
          <div style={{ fontSize:12, color:'#6B7065', marginBottom:8 }}>Category</div>
          <div className="scrollbar-hide" style={{ display:'flex', gap:9, overflowX:'auto', paddingBottom:4 }}>
            {cats.map(name => {
              const selected = name === draft.category
              return (
                <button key={name}
                  onClick={() => dispatch(actions.updateDraft({ category: name }))}
                  style={{
                    padding:'10px 16px', borderRadius:99, fontSize:14, fontWeight:500, whiteSpace:'nowrap', cursor:'pointer',
                    background: selected ? '#3C5A45' : '#fff',
                    color:      selected ? '#fff'    : '#6B7065',
                    border:     selected ? '1px solid #3C5A45' : '1px solid #E7E2D7',
                  }}>
                  {name}
                </button>
              )
            })}
          </div>
        </div>

        {/* Note input */}
        <div style={{ padding:'12px 20px 4px' }}>
          <input
            value={draft.note}
            onChange={e => dispatch(actions.updateDraft({ note: e.target.value }))}
            placeholder="Add a note (optional)"
            style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'13px 16px', fontSize:14, outline:'none' }}
          />
        </div>

        {/* Keypad */}
        <div style={{ background:'#fff', borderTop:'1px solid #ECE7DC', padding:'14px 18px 18px', borderRadius:'24px 24px 0 0' }}>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:9, marginBottom:12 }}>
            {KEYS.map(k => (
              <button key={k} onClick={() => handleKey(k)}
                style={{ textAlign:'center', padding:'15px 0', fontSize:21, fontWeight:600, color:'#21261F', background:'#F4F1EA', borderRadius:14, cursor:'pointer', border:'none' }}>
                {k}
              </button>
            ))}
          </div>
          <button onClick={handleSave}
            style={{ background:entryColor, color:'#fff', textAlign:'center', padding:16, borderRadius:16, fontSize:16, fontWeight:600, cursor:'pointer', border:'none', width:'100%' }}>
            Save {isExpense ? 'expense' : 'income'}
          </button>
        </div>
      </div>
      <Toast />
    </AppShell>
  )
}
