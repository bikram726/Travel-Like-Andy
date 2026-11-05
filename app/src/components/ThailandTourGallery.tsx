import { useRouter } from 'expo-router';
import { Text, View, useWindowDimensions } from 'react-native';
import { TravelPhoto } from './TravelPhoto';
import { Button } from './ui';
import { useTheme } from '../theme';

const THAILAND_STOPS = [
  ['I · Bangkok · 3 Nights', 'The Grand Palace and Wat Pho, a Chao Phraya river cruise, floating markets, and rooftop views.'],
  ['II · Kanchanaburi · 2 Nights', 'The Bridge on the River Kwai, the Death Railway, Erawan Falls, and a scenic valley train.'],
  ['III · Chiang Mai · 4 Nights', 'Old-city Lanna temples, a Thai cooking class, an ethical elephant sanctuary, and Doi Inthanon.'],
  ['IV · Koh Lanta & Islands · 4 Nights', 'Four-islands tour, the Emerald Cave, sunset sailing, and quiet Andaman Sea beaches.'],
] as const;

const THAILAND_GALLERY = [
  ['thailand-bangkok-skyline-dawn', 'Bangkok · Stop I', 'Bangkok Before Sunrise'],
  ['thailand-kanchanaburi-river-kwai-dawn', 'Kanchanaburi · Stop II', 'Dawn on the River Kwai'],
  ['thailand-kanchanaburi-riverfront-pool', 'Kanchanaburi · Stop II', 'Riverfront Sanctuary'],
  ['thailand-chiang-mai-wat-phra-singh', 'Chiang Mai · Stop III', 'Golden Chedi of Wat Phra Singh'],
  ['thailand-chiang-mai-lanna-lanterns', 'Chiang Mai · Stop III', 'Lanna Festival Lanterns'],
  ['thailand-chiang-mai-137-pillars-pavilion', 'Chiang Mai · Stop III', 'Morning at 137 Pillars House'],
  ['thailand-koh-yao-yai-infinity-pool', 'Andaman Islands · Thailand', 'Anantara Koh Yao Yai'],
  ['thailand-phang-nga-longtail-boat', 'Phang Nga Bay · Thailand', 'Phang Nga Bay Crossing'],
  ['thailand-koh-yao-yai-sunrise-palms', 'Koh Yao Yai · Thailand', 'First Light on the Island'],
  ['thailand-phang-nga-karsts-panorama', 'Koh Yao Yai · Thailand', 'Palm Lawns & Limestone Horizons'],
  ['thailand-koh-yao-yai-sea-suite', 'Koh Yao Yai · Thailand', 'Suite by the Sea'],
  ['thailand-andaman-sunset-horizon', 'Andaman Coast · Thailand', 'Andaman Dusk'],
] as const;

export function ThailandTourGallery() {
  const { colors: c } = useTheme(), router = useRouter(), { width } = useWindowDimensions();
  const wide = width > 820;
  return (
    <View style={{ backgroundColor: c.card, borderWidth: 1, borderColor: c.border, borderRadius: 24, padding: wide ? 28 : 20, marginTop: 36, gap: 20 }}>
      <View style={{ gap: 8 }}>
        <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.8 }}>GROUP TRAVEL · FIRST GROUP DEPARTURE</Text>
        <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: wide ? 32 : 26, fontWeight: '800', letterSpacing: -0.5 }}>From Wisconsin to Thailand.</Text>
        <Text style={{ color: c.muted, fontSize: 15, lineHeight: 23, maxWidth: 740 }}>
          Temples, history, mountains, and islands — fourteen days across four destinations (8–14 travelers), built to feel like a shared journey, not a tour bus.
        </Text>
      </View>

      <View style={{ flexDirection: wide ? 'row' : 'column', alignItems: 'flex-start', gap: 18 }}>
        <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', gap: 12, width: '100%' }}>
          {THAILAND_STOPS.map(([title, detail]) => (
            <View key={title} style={{ flexBasis: wide ? 210 : '100%', flexGrow: 1, backgroundColor: c.soft, borderRadius: 14, padding: 15, gap: 6 }}>
              <Text style={{ color: c.primary, fontSize: 13, fontWeight: '700' }}>{title}</Text>
              <Text style={{ color: c.text, fontSize: 13, lineHeight: 19 }}>{detail}</Text>
            </View>
          ))}
        </View>

        <View style={{ flex: 1.15, width: '100%', backgroundColor: c.soft, borderRadius: 16, borderWidth: 1, borderColor: c.border, padding: 14, gap: 10 }}>
          <View style={{ gap: 2 }}>
            <Text style={{ color: c.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 }}>THAILAND, FIRST-HAND · 12 PHOTOS</Text>
            <Text accessibilityRole="header" aria-level={3} style={{ color: c.text, fontSize: 18, fontWeight: '700' }}>Scenes & sanctuaries beside the route.</Text>
          </View>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
            {THAILAND_GALLERY.map(([id, loc, title]) => (
              <View key={id} style={{ flexBasis: wide ? 130 : 145, flexGrow: 1, flexShrink: 1, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: c.border, backgroundColor: c.card }}>
                <TravelPhoto id={id} height={88} />
                <View style={{ paddingHorizontal: 8, paddingVertical: 6, gap: 1 }}>
                  <Text numberOfLines={1} style={{ color: c.primary, fontSize: 9, fontWeight: '700', letterSpacing: 0.8 }}>{loc.toUpperCase()}</Text>
                  <Text numberOfLines={1} style={{ color: c.text, fontSize: 12, fontWeight: '700' }}>{title}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, paddingTop: 6 }}>
        <Text style={{ color: c.muted, fontSize: 13, flex: 1, minWidth: 220 }}>
          Inspired by Andy’s Thailand photography? Start a self-paced Thailand plan with your own dates and budget.
        </Text>
        <Button label="Plan a Thailand Trip →" onPress={() => router.push({ pathname: '/create-trip', params: { destination: 'Thailand' } })} />
      </View>
    </View>
  );
}

