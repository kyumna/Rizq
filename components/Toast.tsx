'use client'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '@/store/hooks'
import { actions } from '@/store/appSlice'

export function Toast() {
  const dispatch = useAppDispatch()
  const toast = useAppSelector(s => s.app.toast)

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => dispatch(actions.clearToast()), 1900)
    return () => clearTimeout(t)
  }, [toast, dispatch])

  if (!toast) return null
  return (
    <div style={{ position:'absolute', left:'50%', bottom:100, transform:'translateX(-50%)', background:'#21261F', color:'#F4F1EA', padding:'12px 20px', borderRadius:99, fontSize:14, fontWeight:500, zIndex:40, whiteSpace:'nowrap' }}
      className="animate-rzUp">
      {toast}
    </div>
  )
}
