'use client'
import { useAppDispatch } from '@/store/hooks'
import { actions } from '@/store/appSlice'

export function DailyReminder() {
  const dispatch = useAppDispatch()
  return (
    <div style={{ position:'absolute', inset:0, background:'rgba(33,38,31,.45)', zIndex:30, display:'flex', alignItems:'center', justifyContent:'center', padding:30 }}
      className="animate-rzFade">
      <div style={{ background:'#F4F1EA', borderRadius:26, padding:'26px 24px 22px', width:'100%' }}
        className="animate-rzPop">
        <div style={{ width:54, height:54, borderRadius:16, background:'#E8EEE7', display:'flex', alignItems:'center', justifyContent:'center', color:'#3C5A45', fontSize:26, marginBottom:18 }}>◔</div>
        <div style={{ fontFamily:"'Newsreader', serif", fontSize:24, letterSpacing:'-.01em', marginBottom:8 }}>End-of-day check-in</div>
        <div style={{ fontSize:14, color:'#6B7065', lineHeight:1.5, marginBottom:22 }}>
          It's 9:00 PM. Have you logged today's expenses? Keeping it daily makes your monthly savings accurate.
        </div>
        <button onClick={() => dispatch(actions.remindLog())}
          style={{ background:'#3C5A45', color:'#fff', textAlign:'center', padding:16, borderRadius:15, fontSize:15, fontWeight:600, marginBottom:10, cursor:'pointer', width:'100%', border:'none' }}>
          Log now
        </button>
        <button onClick={() => dispatch(actions.remindDismiss())}
          style={{ textAlign:'center', padding:13, fontSize:15, fontWeight:600, color:'#6B7065', cursor:'pointer', width:'100%', background:'none', border:'none' }}>
          All done for today
        </button>
      </div>
    </div>
  )
}
