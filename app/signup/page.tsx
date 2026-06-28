'use client'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'

export default function SignupPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const signup   = useAppSelector(s => s.app.signup)

  function handleCreate() {
    if (!signup.name || !signup.email) return
    if (signup.password && signup.password !== signup.confirm) return
    dispatch(actions.createAccount())
    router.push('/setup')
  }

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', padding:'0 30px', display:'flex', flexDirection:'column', flex:1 }}>
        <StatusBar />

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', padding:'18px 0 24px' }}>
          <button onClick={() => router.push('/login')}
            style={{ fontSize:14, color:'#6B7065', marginBottom:22, cursor:'pointer', background:'none', border:'none', textAlign:'left', padding:0 }}>
            ‹ Back to sign in
          </button>

          <div style={{ fontFamily:"'Newsreader', serif", fontSize:34, lineHeight:1.05, letterSpacing:'-.01em', marginBottom:8 }}>
            Create your<br />account
          </div>
          <div style={{ fontSize:15, color:'#6B7065', marginBottom:28, lineHeight:1.5 }}>
            Start tracking income, savings &amp; zakat — calmly.
          </div>

          {[
            { label:'Full name',        key:'name',     type:'text',     placeholder:'Your name' },
            { label:'Email',            key:'email',    type:'email',    placeholder:'you@email.com' },
            { label:'Password',         key:'password', type:'password', placeholder:'••••••••' },
            { label:'Confirm password', key:'confirm',  type:'password', placeholder:'••••••••' },
          ].map(f => (
            <div key={f.key}>
              <label style={{ fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', color:'#6B7065', fontWeight:600 }}>{f.label}</label>
              <input
                type={f.type}
                placeholder={f.placeholder}
                value={signup[f.key as keyof typeof signup]}
                onChange={e => dispatch(actions.updateSignup({ [f.key]: e.target.value }))}
                style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'15px 16px', margin:'7px 0 16px', fontSize:15, outline:'none' }}
              />
            </div>
          ))}

          <button onClick={handleCreate}
            style={{ background:'#3C5A45', color:'#F4F1EA', textAlign:'center', padding:17, borderRadius:16, fontSize:16, fontWeight:600, cursor:'pointer', border:'none', width:'100%', marginTop:6 }}>
            Create account
          </button>
        </div>

        <div onClick={() => router.push('/login')}
          style={{ textAlign:'center', fontSize:14, color:'#6B7065', paddingBottom:24, cursor:'pointer' }}>
          Already have an account? <span style={{ color:'#3C5A45', fontWeight:600 }}>Sign in</span>
        </div>
      </div>
    </AppShell>
  )
}
