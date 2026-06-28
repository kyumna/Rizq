'use client'
import { useAppDispatch } from '@/store/hooks'
import { actions } from '@/store/appSlice'

export function ActionSheet() {
  const dispatch = useAppDispatch()
  return (
    <>
      <div onClick={() => dispatch(actions.closeSheet())}
        style={{ position:'absolute', inset:0, background:'rgba(33,38,31,.4)', zIndex:20 }}
        className="animate-rzFade" />
      <div style={{ position:'absolute', left:0, right:0, bottom:0, background:'#F4F1EA', borderRadius:'28px 28px 0 0', padding:'22px 22px 28px', zIndex:21 }}
        className="animate-rzUp">
        <div style={{ width:40, height:4, background:'#D9D2C2', borderRadius:99, margin:'0 auto 18px' }} />
        <div style={{ fontFamily:"'Newsreader', serif", fontSize:20, marginBottom:16 }}>What would you like to log?</div>

        <button onClick={() => dispatch(actions.openExpense())}
          style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', border:'1px solid #ECE7DC', borderRadius:18, padding:16, marginBottom:12, cursor:'pointer', width:'100%', textAlign:'left' }}>
          <div style={{ width:44, height:44, borderRadius:13, background:'#F3E4DF', display:'flex', alignItems:'center', justifyContent:'center', color:'#A8584A', fontSize:22, fontWeight:700, flexShrink:0 }}>−</div>
          <div>
            <div style={{ fontSize:16, fontWeight:600 }}>Log expense</div>
            <div style={{ fontSize:13, color:'#6B7065' }}>Record money you spent</div>
          </div>
        </button>

        <button onClick={() => dispatch(actions.openIncome())}
          style={{ display:'flex', alignItems:'center', gap:14, background:'#fff', border:'1px solid #ECE7DC', borderRadius:18, padding:16, cursor:'pointer', width:'100%', textAlign:'left' }}>
          <div style={{ width:44, height:44, borderRadius:13, background:'#E8EEE7', display:'flex', alignItems:'center', justifyContent:'center', color:'#3C5A45', fontSize:22, fontWeight:700, flexShrink:0 }}>+</div>
          <div>
            <div style={{ fontSize:16, fontWeight:600 }}>Log income</div>
            <div style={{ fontSize:13, color:'#6B7065' }}>Record money you received</div>
          </div>
        </button>
      </div>
    </>
  )
}
