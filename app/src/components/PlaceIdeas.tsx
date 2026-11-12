import { useRef, useState } from 'react';
import { Text, View } from 'react-native';
import { useSQLiteContext } from 'expo-sqlite';
import { useRouter } from 'expo-router';
import { addPlaceToTrip, type Trip } from '../data';
import { placesForDestination } from '../places';
import { dateLabel } from '../validation';
import { useTheme } from '../theme';
import { TravelPhoto } from './TravelPhoto';
import { Button, Choices, Input, Notice } from './ui';

export const placeStatuses = ['idea', 'option', 'confirmed'] as const;
export type PlaceStatus = typeof placeStatuses[number];
export const voteStates = ['super_yes', 'yes', 'no', 'opt_out'] as const;
export type VoteState = typeof voteStates[number];
export type PlaceVoteRecord = { status: PlaceStatus; option_group_id: string | null; vote_state: VoteState };
const defaultVoteRecord = (): PlaceVoteRecord => ({ status: 'idea', option_group_id: null, vote_state: 'yes' });

export function PlaceIdeas({ trip, selected, onAdded }: { trip: Trip; selected: string; onAdded: () => Promise<void> }) {
  const db = useSQLiteContext(), router = useRouter(), { colors: c } = useTheme();
  const [busy, setBusy] = useState(false), [message, setMessage] = useState(''), [error, setError] = useState('');
  const [records, setRecords] = useState<Record<string, PlaceVoteRecord>>({});
  const saving = useRef(false);
  const ideas = placesForDestination(trip.destination);
  const day = selected === 'All days' ? trip.start_date : selected;
  const recordFor = (id: string): PlaceVoteRecord => records[id] ?? defaultVoteRecord();
  function updateRecord(id: string, patch: Partial<PlaceVoteRecord>) {
    setRecords(prev => {
      const next = { ...(prev[id] ?? defaultVoteRecord()), ...patch };
      if (next.status !== 'option') next.option_group_id = null;
      return { ...prev, [id]: next };
    });
  }
  async function syncPlaceMetadata(placeTitle: string, meta: PlaceVoteRecord) {
    try {
      const cols = await db.getAllAsync<{ name: string }>('PRAGMA table_info(plan_items)');
      if (!cols.some(col => col.name === 'vote_state')) return;
      await db.runAsync(
        'UPDATE plan_items SET status = ?, option_group_id = ?, vote_state = ? WHERE trip_id = ? AND day = ? AND place = ?',
        meta.status, meta.option_group_id, meta.vote_state, trip.id, day, placeTitle,
      );
    } catch {
      // v1 schema before group-parity migration has no status/vote columns yet.
    }
  }
  async function add(id: string) {
    if (saving.current) return;
    saving.current = true; setBusy(true); setMessage(''); setError('');
    let persisted = false;
    try {
      const added = await addPlaceToTrip(db, trip.id, id, day);
      persisted = true;
      const meta = recordFor(id);
      const place = ideas.find(item => item.id === id);
      if (place) await syncPlaceMetadata(place.title, meta);
      await onAdded();
      setMessage(added ? `Added to ${dateLabel(day)} at 09:00 (${meta.status}, vote: ${meta.vote_state}). Edit the time to suit you.` : 'This place is already in your plan for that day.');
    } catch (error) { setError(persisted ? 'The place was saved, but the screen could not refresh. Reopen this trip to see it.' : error instanceof Error ? error.message : 'Could not add this place.'); }
    finally { saving.current = false; setBusy(false); }
  }
  return <View style={{ gap: 14, marginTop: 28 }}>
    <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 26, fontWeight: '700' }}>Pictures into plans.</Text>
    <Text style={{ color: c.muted, fontSize: 14, lineHeight: 22 }}>{ideas.length ? `Photo ideas matching your destination. Add to ${dateLabel(day)}; select a different day above to change it.` : 'Browse the project’s travel photos for inspiration, or add your own places to this itinerary.'} These are tentative ideas, not a supplied or personally reviewed Andy itinerary.</Text>
    {ideas.map(place => {
      const rec = recordFor(place.id);
      return <View key={place.id} style={{ borderRadius: 18, overflow: 'hidden', backgroundColor: c.card, borderWidth: 1, borderColor: c.border }}>
        <TravelPhoto id={place.photo} />
        <View style={{ padding: 20, gap: 12 }}>
          <Text style={{ color: c.muted, fontSize: 13 }}>{place.destination} · {place.country}</Text>
          <Text style={{ color: c.text, fontSize: 23, fontWeight: '700' }}>{place.title}</Text>
          <Text style={{ color: c.muted, lineHeight: 22 }}>{place.description}</Text>
          <Text style={{ color: c.muted, lineHeight: 22 }}>Cost not yet checked. {place.budgetNote}</Text>
          <Choices label="Plan status" values={placeStatuses} value={rec.status} onChange={value => updateRecord(place.id, { status: value as PlaceStatus })} />
          {rec.status === 'option' && (
            <Input
              label="Option group ID"
              value={rec.option_group_id ?? ''}
              onChangeText={value => updateRecord(place.id, { option_group_id: value.trim() ? value : null })}
              placeholder={`e.g. ${place.kind.toLowerCase()}-${day}`}
              hint="Group competing choices under the same option_group_id."
            />
          )}
          <Choices label="Group vote" values={voteStates} value={rec.vote_state} onChange={value => updateRecord(place.id, { vote_state: value as VoteState })} />
          <Button label={busy ? 'Saving…' : `Add ${place.title} to ${dateLabel(day)}`} disabled={busy} onPress={() => { void add(place.id); }} />
        </View>
      </View>;
    })}
    {!!message && <Notice text={message} />}{!!error && <Notice error text={error} />}
    <Button label="Browse all travel photos" secondary onPress={() => router.push('/explore')} />
  </View>;
}
