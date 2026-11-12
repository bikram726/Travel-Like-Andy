import { useEffect, useState, type ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';

// Expo's OPFS access-handle pool cannot be opened by two tabs at once. Reserve
// the database before mounting SQLiteProvider, without deleting or renaming it.
export function DatabaseTabGate({ children }: { children: ReactNode }) {
  const supportsLocks = typeof navigator !== 'undefined' && !!navigator.locks;
  const supportsBroadcast = typeof BroadcastChannel !== 'undefined';
  const [status, setStatus] = useState<'opening' | 'waiting' | 'ready' | 'failed'>(supportsLocks || supportsBroadcast ? 'opening' : 'ready');
  useEffect(() => {
    const channel = supportsBroadcast ? new BroadcastChannel('andygo_opfs_lock') : null;
    const tabId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : String(Math.random());
    if (!supportsLocks && !channel) return;
    const controller = new AbortController();
    let active = true, acquired = false, sawLockHeld = false;
    let release!: () => void;
    const lifetime = new Promise<void>(resolve => { release = resolve; });
    const timer = setTimeout(() => { if (active && !acquired) setStatus('waiting'); }, 400);

    if (channel) {
      channel.onmessage = (event: MessageEvent<{ type?: string; tabId?: string }>) => {
        if (!active || !event.data || event.data.tabId === tabId) return;
        if (event.data.type === 'acquire' && acquired) channel.postMessage({ type: 'lock-held', tabId });
        else if (event.data.type === 'lock-held' && !acquired) { sawLockHeld = true; setStatus('waiting'); }
        else if (event.data.type === 'lock-released' && !supportsLocks && !acquired) {
          acquired = true;
          clearTimeout(timer);
          setStatus('ready');
          channel.postMessage({ type: 'lock-held', tabId });
        }
      };
      channel.postMessage({ type: 'acquire', tabId });
    }

    if (supportsLocks) {
      void navigator.locks.request('travellikeandy:database-session', { signal: controller.signal }, async () => {
        acquired = true;
        clearTimeout(timer);
        if (!active) return;
        setStatus('ready');
        channel?.postMessage({ type: 'lock-held', tabId });
        await lifetime;
      }).catch(() => { if (active) setStatus('failed'); });
    } else if (channel) {
      // Without navigator.locks, wait briefly for any existing tab's lock-held reply.
      setTimeout(() => {
        if (!active || acquired || sawLockHeld) return;
        acquired = true;
        clearTimeout(timer);
        setStatus('ready');
        channel.postMessage({ type: 'lock-held', tabId });
      }, 150);
    }

    return () => {
      active = false;
      clearTimeout(timer);
      controller.abort();
      release();
      if (acquired) channel?.postMessage({ type: 'lock-released', tabId });
      channel?.close();
    };
  }, [supportsLocks]);
  if (status === 'ready') return children;
  return <View style={{ flex: 1, justifyContent: 'center', padding: 32, backgroundColor: '#F7FAFB' }}>
    <Text style={{ color: '#075E68', letterSpacing: 2, fontSize: 14, marginBottom: 24 }}>ANDYGO · BY TRAVEL LIKE ANDY</Text>
    <Text accessibilityRole="header" style={{ color: '#172B38', fontSize: 28, marginBottom: 16 }}>{status === 'waiting' ? 'Your planner is open in another tab.' : status === 'failed' ? 'Could not reserve browser storage.' : 'Opening your planner…'}</Text>
    <Text accessibilityLiveRegion="polite" style={{ color: '#526573', fontSize: 16, lineHeight: 25 }}>{status === 'waiting' ? 'Use your existing TravelLikeAndy tab, or close that tab. This one will open automatically when the other tab closes. Your saved trips have not been changed.' : status === 'failed' ? 'Close duplicate planner tabs, then reload this page. Your saved trips have not been cleared.' : 'Connecting to your saved trips on this device.'}</Text>
    {status === 'failed' && <Pressable accessibilityRole="button" onPress={() => window.location.reload()} style={{ alignSelf: 'flex-start', backgroundColor: '#075E68', padding: 16, borderRadius: 10, marginTop: 20 }}><Text style={{ color: '#FFFFFF', fontSize: 16 }}>Reload planner</Text></Pressable>}
  </View>;
}
