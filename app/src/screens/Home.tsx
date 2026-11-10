import { useRouter } from 'expo-router';
import { ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AppHeader } from '../components/AppHeader';
import { ThailandTourGallery } from '../components/ThailandTourGallery';
import { Button } from '../components/ui';
import { useTheme } from '../theme';
import { Brand } from '../components/Brand';

export default function Home() {
  const router = useRouter(), { colors: c, mode } = useTheme(), { width } = useWindowDimensions();
  const wide = width > 820;
  return <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}><AppHeader /><ScrollView role="main" contentContainerStyle={{ width: '100%', maxWidth: 1160, padding: wide ? 36 : 22, alignSelf: 'center', paddingBottom: 50 }}>
    <View style={{ flexDirection: wide ? 'row' : 'column', alignItems: 'center', gap: 40, paddingVertical: wide ? 58 : 26 }}>
      <View style={{ flex: 1, gap: 22, width: '100%' }}><Text style={{ color: c.primary, fontSize: 13, fontWeight: '700', letterSpacing: 2 }}>THE WORLD, YOUR WAY.</Text><Text accessibilityRole="header" style={{ fontSize: wide ? 65 : 43, lineHeight: wide ? 74 : 51, fontWeight: '800', color: c.text, letterSpacing: -2 }}>Travel more.{'\n'}Stress less.{'\n'}<Text style={{ color: c.primary }}>Stay on budget.</Text></Text><Text style={{ color: c.muted, fontSize: 18, lineHeight: 28, maxWidth: 470 }}>A little structure. A clearer budget. Build a trip that feels right for you, with every day in one place.</Text><View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}><Button label="Plan My Trip  →" onPress={() => router.push('/create-trip')} /><Button label="AI Concierge & Book Call" secondary onPress={() => router.push('/concierge')} /><Button label="Explore Destinations" secondary onPress={() => router.push('/explore')} /></View><Text style={{ color: c.muted, fontSize: 13 }}>Start without an account. Save your plans on this device.</Text></View>
      <View accessibilityRole="image" accessibilityLabel="Illustrated sample trip plan: three days for two travelers. This is an example, not live prices." style={{ flex: 1, width: '100%', backgroundColor: c.soft, borderRadius: 30, padding: wide ? 30 : 22, minHeight: 410 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 28 }}><Text style={{ color: c.primary, fontWeight: '700', fontSize: 12, letterSpacing: 2 }}>YOUR NEXT CHAPTER</Text><Text style={{ color: c.primary, fontSize: 24 }}>↗</Text></View>
        <View style={{ backgroundColor: c.card, borderRadius: 20, padding: 24, gap: 14, transform: [{ rotate: '-2deg' }] }}><Text style={{ color: c.muted, fontSize: 12, letterSpacing: 1 }}>SAMPLE TRIP · YOUR NUMBERS, YOUR PLAN</Text><Text style={{ color: c.text, fontSize: 27, fontWeight: '700' }}>A long weekend away</Text><Text style={{ color: c.muted, fontSize: 14 }}>3 days · 2 travelers · a slower pace</Text><View style={{ height: 1, backgroundColor: c.border }} />{[['01', 'Arrive & settle in', 'Leave a little room to explore.'], ['02', 'Find your kind of adventure', 'Choose what matters to you.'], ['03', 'One more coffee. Then home.', 'Keep the last day simple.']].map(([n, title, detail]) => <View key={n} style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}><View style={{ backgroundColor: c.soft, borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center' }}><Text style={{ color: c.primary, fontWeight: '700' }}>{n}</Text></View><View style={{ flex: 1 }}><Text style={{ color: c.text, fontSize: 14, fontWeight: '600' }}>{title}</Text><Text style={{ color: c.muted, fontSize: 12, marginTop: 4 }}>{detail}</Text></View></View>)}</View>
        <View style={{ backgroundColor: c.primary, borderRadius: 14, padding: 18, marginTop: 20 }}><Text style={{ color: c.onPrimary, fontWeight: '700', fontSize: 16 }}>Know the cost before you go.</Text><Text style={{ color: c.onPrimary, fontSize: 13, marginTop: 6 }}>Clear estimates. Visible unknowns. No invented quotes.</Text></View>
      </View>
    </View>
    <View style={{ backgroundColor: c.sand, borderRadius: 20, padding: 24, marginVertical: 20, gap: 9 }}><Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 24, fontWeight: '700' }}>“Can I actually afford this trip?”</Text><Text style={{ color: c.muted, fontSize: 16, lineHeight: 25 }}>Start with transport, stays, food, and the things you want to do. See what is known, what is still missing, and where a small change could help.</Text></View>
    <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 30, fontWeight: '700', marginTop: 30, marginBottom: 22 }}>From someday to a plan.</Text><View style={{ flexDirection: wide ? 'row' : 'column', gap: 28 }}>{[['01', 'Make it yours', 'Choose your destination, dates, people, and budget. Skip the extras until you need them.'], ['02', 'Put the pieces together', 'Shape each day and add your own cost estimates. Every number keeps its source.'], ['03', 'Take it with you', 'Save your trip, review your next stop, and keep your spending in view.']].map(([n, title, body]) => <View key={n} style={{ flex: 1, gap: 12 }}><Text style={{ color: c.primary, fontSize: 18, fontWeight: '700' }}>{n} /</Text><Text style={{ color: c.text, fontSize: 21, fontWeight: '700' }}>{title}</Text><Text style={{ color: c.muted, fontSize: 15, lineHeight: 24 }}>{body}</Text></View>)}</View>
    <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 20, padding: 24, marginTop: 36, gap: 14 }}>
      <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.8 }}>TRAVEL, CONDUCTED AROUND YOU</Text>
      <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 26, fontWeight: '700' }}>Four ways to plan with clarity.</Text>
      <Text style={{ color: c.muted, fontSize: 15, lineHeight: 23 }}>Inspired by Travel Like Andy’s advisory craft—built as a self-paced companion on your device.</Text>
      <View style={{ flexDirection: wide ? 'row' : 'column', gap: 16 }}>
        {[
          ['Anticipate', 'See known costs, missing categories, and schedule overlaps before departure.'],
          ['Advocate', 'Keep your total party target, traveler share, and accessibility notes front and center.'],
          ['Curate', 'Shape each day around your pace—from destination ideas to your own stops.'],
          ['Accompany', 'Check off stops, view what is next, and log foreign-currency expenses offline or on the go.'],
        ].map(([title, detail]) => (
          <View key={title} style={{ flex: 1, backgroundColor: c.soft, borderRadius: 14, padding: 16, gap: 6 }}>
            <Text style={{ color: c.primary, fontSize: 16, fontWeight: '700' }}>{title}</Text>
            <Text style={{ color: c.text, fontSize: 13, lineHeight: 20 }}>{detail}</Text>
          </View>
        ))}
      </View>
    </View>
    <ThailandTourGallery />
    <View style={{ marginTop: 50, borderTopWidth: 1, borderColor: c.border, paddingTop: 24, gap: 10 }}><Brand size={48} wordmark variant={mode === 'dark' ? 'dark' : 'light'} /><Text style={{ color: c.text, fontWeight: '700' }}>The world, your way.</Text><Text style={{ color: c.muted, fontSize: 13, lineHeight: 21 }}>A travel companion by Travel Like Andy, founded by international travel expert Andy. AndyGo is a proposed name, pending clearance.</Text><Text style={{ color: c.muted, fontSize: 13, lineHeight: 21 }}>Planning prototype. No booking or payment collection. AI planning and live travel prices are not connected. AI-generated plans, when available, are not personally reviewed by Andy unless explicitly labeled. Keep sensitive documents out of your plans.</Text></View>
  </ScrollView></SafeAreaView>;
}
