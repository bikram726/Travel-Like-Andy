import { useThemedStyles } from '../theme';
import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import * as Linking from 'expo-linking';
import { LEGAL_DISCLOSURES } from '../concierge';
import { BackupPanel } from './BackupPanel';
import { OfflinePanel } from './OfflinePanel';

type Props = {
  onDeleteTrip?: () => void;
  onDeleteAll?: () => void;
  onBack?: () => void;
  onImported: () => Promise<void>;
};

export function PrivacyPanel({ onDeleteTrip, onDeleteAll, onBack, onImported }: Props) {
  const styles = useThemedStyles(baseStyles);
  const [linkError, setLinkError] = useState('');
  async function openWebsite(path: 'privacy-policy' | 'contact') {
    setLinkError('');
    try { await Linking.openURL('https://www.travellikeandy.com/' + path); }
    catch { setLinkError('Could not open the website. Visit www.travellikeandy.com in your browser.'); }
  }
  function button(label: string, onPress: () => void) {
    return <Pressable accessibilityRole="button" onPress={onPress} style={styles.button}><Text style={styles.buttonText}>{label}</Text></Pressable>;
  }
  return <View>
    <Text accessibilityRole="header" aria-level={2} style={styles.heading}>Privacy first</Text>
    <Text style={styles.body}>Your trips, plans, expenses, cost estimates, preferences, and unfinished setup draft stay in local app storage on this device. There is no account or cloud backup. Clearing browser storage or uninstalling the app can remove your plans.</Text>
    <Text style={[styles.body, styles.paragraph]}>This version has no tracking, analytics, booking, payment, or automatic sharing. App storage is not encrypted. Keep passport, payment, medical, and booking credentials out of your plans.</Text>
    <Text style={[styles.body, styles.paragraph]}>Website links open the public Travel Like Andy website. Your trip data is not included in those links unless you explicitly choose to send a consultation brief via email.</Text>
    <Text style={[styles.body, styles.paragraph]}>If you choose Get reference rate in an expense, the app contacts Frankfurter with the currency pair. Your expense amount, destination, notes, and trip dates are not sent. The service receives the request and normal connection information. Saved reference rates remain with your expenses and backups.</Text>
    <Text style={[styles.body, styles.paragraph]}>{LEGAL_DISCLOSURES.entity} — {LEGAL_DISCLOSURES.californiaNotice} {LEGAL_DISCLOSURES.foraContractor} {LEGAL_DISCLOSURES.foraRegistrations}</Text>
    {button('Website privacy policy', () => { void openWebsite('privacy-policy'); })}
    {button('Contact Andy', () => { void openWebsite('contact'); })}
    {!!linkError && <Text accessibilityRole="alert" style={styles.error}>{linkError}</Text>}
    <BackupPanel onImported={onImported} />
    <OfflinePanel />
    {onDeleteTrip && button('Delete this trip', onDeleteTrip)}
    {onDeleteAll && button('Delete all local data', onDeleteAll)}
    {onBack && button('Back to planning', onBack)}
  </View>;
}

const baseStyles = StyleSheet.create({
  heading: { color: '#F5F2EB', fontSize: 28, marginBottom: 15, fontWeight: '700' },
  body: { color: '#ADB9B6', fontSize: 14, lineHeight: 21 },
  paragraph: { marginTop: 16 },
  button: { borderWidth: 1, borderColor: '#304044', padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 14 },
  buttonText: { color: '#F5F2EB', fontSize: 13, fontWeight: '800' },
  error: { color: '#E6A19B', marginTop: 12 },
});
