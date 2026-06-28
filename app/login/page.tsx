'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'

export default function LoginPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const user     = useAppSelector(s => s.app.user)
  const onboarded = useAppSelector(s => s.app.onboarded)
  const [showPass, setShowPass] = useState(false)

  function handleSignIn() {
    dispatch(actions.signIn())
    router.push(onboarded ? '/dashboard' : '/setup')
  }

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', padding:'0 30px', display:'flex', flexDirection:'column', flex:1 }}>
        <StatusBar />

        <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', paddingBottom:24 }}>
          {/* Logo */}
          <div style={{ width:60, height:60, borderRadius:18, background:'#3C5A45', display:'flex', alignItems:'center', justifyContent:'center', marginBottom:28 }}>
            <div style={{ width:22, height:22, border:'2.5px solid #E8EEE7', borderRadius:'50%', borderTopColor:'transparent', transform:'rotate(45deg)' }} />
          </div>

          <div style={{ fontFamily:"'Newsreader', serif", fontSize:42, lineHeight:1, letterSpacing:'-.01em', marginBottom:10 }}>Rizq</div>
          <div style={{ fontSize:15, color:'#6B7065', marginBottom:34, lineHeight:1.5 }}>
            Mindful money, every month —<br />savings &amp; zakat in one calm place.
          </div>

          {/* Email */}
          <label style={{ fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', color:'#6B7065', fontWeight:600 }}>Email</label>
          <input
            type="email"
            value={user.email}
            onChange={e => dispatch(actions.updateSignup({ email: e.target.value }))}
            style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'15px 16px', margin:'7px 0 18px', fontSize:15, color:'#21261F', outline:'none' }}
          />

          {/* Password */}
          <label style={{ fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', color:'#6B7065', fontWeight:600 }}>Password</label>
          <div style={{ position:'relative', margin:'7px 0 10px' }}>
            <input
              type={showPass ? 'text' : 'password'}
              defaultValue="password"
              style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'15px 52px 15px 16px', fontSize:15, color:'#21261F', outline:'none' }}
            />
            <button onClick={() => setShowPass(p => !p)}
              style={{ position:'absolute', right:16, top:'50%', transform:'translateY(-50%)', color:'#3C5A45', fontSize:13, fontWeight:600, background:'none', border:'none', cursor:'pointer' }}>
              {showPass ? 'Hide' : 'Show'}
            </button>
          </div>

          <div style={{ textAlign:'right', fontSize:13, color:'#6B7065', marginBottom:24, cursor:'pointer' }}>Forgot password?</div>

          <button onClick={handleSignIn}
            style={{ background:'#3C5A45', color:'#F4F1EA', textAlign:'center', padding:17, borderRadius:16, fontSize:16, fontWeight:600, cursor:'pointer', border:'none', width:'100%' }}>
            Sign in
          </button>

          <div style={{ display:'flex', alignItems:'center', gap:12, margin:'22px 0', color:'#A7A597', fontSize:12 }}>
            <div style={{ flex:1, height:1, background:'#E7E2D7' }} />
            or
            <div style={{ flex:1, height:1, background:'#E7E2D7' }} />
          </div>

          <button onClick={handleSignIn}
            style={{ background:'#fff', border:'1px solid #E7E2D7', color:'#21261F', textAlign:'center', padding:16, borderRadius:16, fontSize:15, fontWeight:600, cursor:'pointer', width:'100%' }}>
            Continue with Google
          </button>
        </div>

        <div onClick={() => router.push('/signup')}
          style={{ textAlign:'center', fontSize:14, color:'#6B7065', paddingBottom:24, cursor:'pointer' }}>
          New here? <span style={{ color:'#3C5A45', fontWeight:600 }}>Create account</span>
        </div>
      </div>
    </AppShell>
  )
}
