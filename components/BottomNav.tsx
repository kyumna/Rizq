'use client'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'

export function BottomNav() {
  const dispatch = useAppDispatch()
  const tab = useAppSelector(s => s.app.tab)

  const active = (t: string) => tab === t
  const color  = (t: string) => active(t) ? '#3C5A45' : '#A7A597'
  const weight = (t: string) => active(t) ? 700 : 500

  return (
    <div style={{ position:'absolute', left:0, right:0, bottom:0, height:80, background:'#fff', borderTop:'1px solid #ECE7DC', display:'flex', alignItems:'center', justifyContent:'space-around', padding:'0 18px', zIndex:5 }}>
      <button onClick={() => dispatch(actions.goHome())}
        style={{ fontSize:11, fontWeight:weight('home'), color:color('home'), textAlign:'center', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>
        {active('home') ? '● ' : ''}Home
      </button>
      <button onClick={() => dispatch(actions.goSavings())}
        style={{ fontSize:11, fontWeight:weight('savings'), color:color('savings'), textAlign:'center', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>
        {active('savings') ? '● ' : ''}Savings
      </button>
      <button onClick={() => dispatch(actions.openSheet())}
        style={{ width:52, height:52, borderRadius:'50%', background:'#3C5A45', color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:28, marginTop:-22, boxShadow:'0 8px 18px -4px rgba(60,90,69,.6)', border:'none', cursor:'pointer', flexShrink:0 }}>
        +
      </button>
      <button onClick={() => dispatch(actions.goReport())}
        style={{ fontSize:11, fontWeight:weight('report'), color:color('report'), textAlign:'center', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>
        {active('report') ? '● ' : ''}Reports
      </button>
      <button onClick={() => dispatch(actions.goZakat())}
        style={{ fontSize:11, fontWeight:weight('zakat'), color:color('zakat'), textAlign:'center', background:'none', border:'none', cursor:'pointer', padding:'4px 8px' }}>
        {active('zakat') ? '● ' : ''}Zakat
      </button>
    </div>
  )
}
