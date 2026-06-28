export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#E7E4DD', padding:0 }}>
      <div style={{ position:'relative', width:'min(420px, 100vw)', minHeight:'min(880px, 100vh)', background:'#F4F1EA', overflow:'hidden', borderRadius:34, boxShadow:'0 30px 70px -28px rgba(40,48,40,.45)', color:'#21261F', fontFamily:"'Hanken Grotesk', sans-serif", display:'flex', flexDirection:'column' }}>
        {children}
      </div>
    </div>
  )
}
