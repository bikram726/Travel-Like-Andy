import { usePathname, useLocalSearchParams, useRouter } from 'expo-router';
import { Pressable, Text, View, useWindowDimensions } from 'react-native';
import { useTheme } from '../theme';
import { Brand } from './Brand';
export function AppHeader() {
  const { width } = useWindowDimensions();
  const pathname = usePathname(), params = useLocalSearchParams<{ section?: string }>();
  const router = useRouter(), { colors: c, mode, toggle, error } = useTheme();
  const items = [
    { label: 'My trips', route: '/?section=Trips', active: pathname === '/' && params.section === 'Trips' },
    { label: 'Explore', route: '/explore', active: pathname === '/explore' },
    { label: 'Concierge & Book', route: '/concierge', active: pathname === '/concierge' },
    { label: 'Settings', route: '/?section=Privacy', active: pathname === '/' && params.section === 'Privacy' },
  ];
  return <View role="banner" style={{ borderBottomWidth: 1, borderColor: c.border, padding: 16, backgroundColor: c.card }}><View style={{ width: '100%', maxWidth: 1160, alignSelf: 'center', flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 10 }}>
    <Pressable accessibilityRole="link" accessibilityLabel="AndyGo by Travel Like Andy home" onPress={() => router.push('/')} style={{ minHeight: 44, justifyContent: 'center' }}><Brand size={34} wordmark endorsed variant={mode === 'dark' ? 'dark' : 'light'} decorative /></Pressable>
    <View role="navigation" accessibilityLabel="Main navigation" style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', flexShrink: 1 }}>{items.map(item => <Pressable key={item.label} accessibilityRole="link" accessibilityState={{ selected: item.active }} onPress={() => router.push(item.route as '/')} style={{ padding: width < 480 ? 8 : 12, minHeight: 44, justifyContent: 'center', borderRadius: 20, backgroundColor: item.active ? c.soft : 'transparent' }}><Text style={{ color: item.active ? c.primary : c.text, fontSize: 14, fontWeight: item.active ? '700' : '400' }}>{item.label}</Text></Pressable>)}<Pressable accessibilityRole="button" accessibilityLabel={mode === 'light' ? 'Switch to dark theme' : 'Switch to light theme'} onPress={toggle} style={{ padding: 12, minHeight: 44, minWidth: 44, alignItems: 'center', borderWidth: 1, borderColor: c.border, borderRadius: 24 }}><Text style={{ color: c.text, fontSize: 14 }}>{width < 480 ? (mode === 'light' ? '◐' : '☀') : (mode === 'light' ? '◐ Dark' : '☀ Light')}</Text></Pressable></View>
  </View>{!!error && <Text accessibilityRole="alert" style={{ color: c.danger }}>{error}</Text>}</View>;
}
