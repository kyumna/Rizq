'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'
import { AppShell } from '@/components/AppShell'
import { StatusBar } from '@/components/StatusBar'
import { Toast } from '@/components/Toast'

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ fontSize:12, letterSpacing:'0.1em', textTransform:'uppercase', color:'#A98A45', fontWeight:600, margin:'6px 0 10px' }}>
      {children}
    </div>
  )
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label style={{ fontSize:13, fontWeight:600 }}>{children}</label>
}

function TextInput({ value, onChange, type = 'text' }: { value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'14px 16px', margin:'7px 0 14px', fontSize:15, outline:'none', display:'block' }}
    />
  )
}

function RsInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div style={{ position:'relative', margin:'7px 0 14px' }}>
      <span style={{ position:'absolute', left:16, top:15, color:'#9A988C', fontSize:15, pointerEvents:'none' }}>Rs</span>
      <input
        inputMode="numeric"
        value={value}
        onChange={e => onChange(e.target.value)}
        style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'14px 16px 14px 44px', fontSize:16, fontWeight:600, outline:'none' }}
      />
    </div>
  )
}

export default function SettingsPage() {
  const dispatch = useAppDispatch()
  const router   = useRouter()
  const state    = useAppSelector(s => s.app)
  const draft    = state.settingsDraft

  useEffect(() => {
    if (state.tab === 'home')    router.push('/dashboard')
    if (state.tab === 'savings') router.push('/savings')
    if (state.tab === 'report')  router.push('/reports')
    if (state.tab === 'zakat')   router.push('/zakat')
    if (state.tab === 'entry')   router.push('/entry')
  }, [state.tab, router])

  function handleSave() {
    dispatch(actions.saveSettings())
    router.push('/dashboard')
  }

  function handleSignOut() {
    dispatch(actions.signOut())
    router.push('/login')
  }

  return (
    <AppShell>
      <div className="scrollbar-hide" style={{ height:'100%', overflow:'auto', paddingBottom:30, flex:1 }}>
        <StatusBar />

        {/* Header */}
        <div style={{ display:'flex', alignItems:'center', gap:14, padding:'14px 20px 4px' }}>
          <button onClick={() => { dispatch(actions.goHome()); router.push('/dashboard') }}
            style={{ width:38, height:38, borderRadius:'50%', background:'#fff', border:'1px solid #ECE7DC', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, cursor:'pointer', flexShrink:0 }}>
            ‹
          </button>
          <div style={{ fontFamily:"'Newsreader', serif", fontSize:24 }}>Settings</div>
        </div>

        {/* Profile hero */}
        <div style={{ display:'flex', alignItems:'center', gap:14, margin:'14px 20px 18px', background:'#3C5A45', borderRadius:22, padding:'18px 20px', color:'#EAF0E8' }}>
          <div style={{ width:50, height:50, borderRadius:'50%', background:'#E8EEE7', display:'flex', alignItems:'center', justifyContent:'center', color:'#3C5A45', fontWeight:700, fontSize:20, flexShrink:0 }}>
            {state.user.name.charAt(0)}
          </div>
          <div>
            <div style={{ fontFamily:"'Newsreader', serif", fontSize:20 }}>{state.user.name}</div>
            <div style={{ fontSize:13, color:'#BBD0B6' }}>{state.user.email}</div>
          </div>
        </div>

        <div style={{ padding:'0 22px' }}>
          {/* Profile section */}
          <SectionLabel>Profile</SectionLabel>
          <FieldLabel>Name</FieldLabel>
          <TextInput value={draft.name} onChange={v => dispatch(actions.updateSettingsDraft({ name: v }))} />
          <FieldLabel>Email</FieldLabel>
          <TextInput value={draft.email} onChange={v => dispatch(actions.updateSettingsDraft({ email: v }))} type="email" />

          {/* Finances section */}
          <SectionLabel>Finances</SectionLabel>
          <FieldLabel>Total savings</FieldLabel>
          <RsInput value={draft.savings} onChange={v => dispatch(actions.updateSettingsDraft({ savings: v }))} />
          <FieldLabel>Typical monthly income</FieldLabel>
          <div style={{ marginBottom:6 }}>
            <RsInput value={draft.income} onChange={v => dispatch(actions.updateSettingsDraft({ income: v }))} />
          </div>

          {/* Zakat section */}
          <SectionLabel>Zakat</SectionLabel>
          <FieldLabel>Last zakat paid on</FieldLabel>
          <input
            type="date"
            value={draft.lastZakat}
            onChange={e => dispatch(actions.updateSettingsDraft({ lastZakat: e.target.value }))}
            style={{ width:'100%', background:'#fff', border:'1px solid #E7E2D7', borderRadius:14, padding:'13px 14px', margin:'7px 0 14px', fontSize:15, outline:'none', color:'#21261F', display:'block' }}
          />
          <FieldLabel>Gold / other zakatable assets</FieldLabel>
          <div style={{ marginBottom:24 }}>
            <RsInput value={draft.gold} onChange={v => dispatch(actions.updateSettingsDraft({ gold: v }))} />
          </div>

          <button onClick={handleSave}
            style={{ background:'#3C5A45', color:'#F4F1EA', textAlign:'center', padding:16, borderRadius:16, fontSize:16, fontWeight:600, cursor:'pointer', border:'none', width:'100%' }}>
            Save changes
          </button>
          <button onClick={handleSignOut}
            style={{ textAlign:'center', padding:16, marginTop:8, fontSize:15, fontWeight:600, color:'#A8584A', cursor:'pointer', background:'none', border:'none', width:'100%' }}>
            Sign out
          </button>
        </div>
      </div>
      <Toast />
    </AppShell>
  )
}
