import { useCallback, useEffect, useMemo, useState } from 'react'

type InstallChoice = { outcome: 'accepted' | 'dismissed'; platform: string }

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<InstallChoice>
}

export type InstallHelpMode = 'ios' | 'browser' | null

function detectStandalone() {
  if (typeof window === 'undefined') return false
  const nav = navigator as Navigator & { standalone?: boolean }
  return window.matchMedia('(display-mode: standalone)').matches || Boolean(nav.standalone)
}

function detectIOS() {
  if (typeof navigator === 'undefined') return false
  return /iphone|ipad|ipod/i.test(navigator.userAgent)
}

export function usePwaInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [installed, setInstalled] = useState(detectStandalone)
  const [helpMode, setHelpMode] = useState<InstallHelpMode>(null)
  const isIOS = useMemo(detectIOS, [])

  useEffect(() => {
    const handlePrompt = (event: Event) => {
      event.preventDefault()
      setDeferredPrompt(event as BeforeInstallPromptEvent)
    }
    const handleInstalled = () => {
      setInstalled(true)
      setDeferredPrompt(null)
      setHelpMode(null)
    }
    const media = window.matchMedia('(display-mode: standalone)')
    const handleDisplayMode = () => setInstalled(detectStandalone())

    window.addEventListener('beforeinstallprompt', handlePrompt)
    window.addEventListener('appinstalled', handleInstalled)
    media.addEventListener?.('change', handleDisplayMode)

    return () => {
      window.removeEventListener('beforeinstallprompt', handlePrompt)
      window.removeEventListener('appinstalled', handleInstalled)
      media.removeEventListener?.('change', handleDisplayMode)
    }
  }, [])

  const requestInstall = useCallback(async () => {
    if (installed) return 'installed' as const

    if (deferredPrompt) {
      await deferredPrompt.prompt()
      const choice = await deferredPrompt.userChoice
      if (choice.outcome === 'accepted') {
        setDeferredPrompt(null)
        return 'accepted' as const
      }
      return 'dismissed' as const
    }

    setHelpMode(isIOS ? 'ios' : 'browser')
    return 'instructions' as const
  }, [deferredPrompt, installed, isIOS])

  return {
    installed,
    canPrompt: Boolean(deferredPrompt),
    isIOS,
    helpMode,
    requestInstall,
    closeHelp: () => setHelpMode(null),
  }
}
