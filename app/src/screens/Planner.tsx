import React, { useCallback, useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSQLiteContext } from 'expo-sqlite';
import { addExpense, addPlan, updateExpense, updatePlan, reorderPlan, createTrip, updateTrip, deleteAll, deleteExpense, deletePlan, deleteTrip, plannerSnapshot, type Expense, type PlanItem, type Trip } from '../data';

import { ItinerarySection } from '../components/ItinerarySection';
import { DailyBudget } from '../components/DailyBudget';
import { FormField as Field } from '../components/FormField';
import { PrivacyPanel } from '../components/PrivacyPanel';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { cents, currencyOK, dateOK, tripDays, currencies, dateLabel } from '../validation';
import { formatDuration, formatTimeRange } from '../itinerary';
import { tripFromParam } from '../navigation';
import { ExpenseAmount } from '../components/ExpenseAmount';
import type { ExpenseConversion } from '../currency';
import { useTheme, useThemedStyles } from '../theme';
import { AppHeader } from '../components/AppHeader';
import { CostPlanner } from '../components/CostPlanner';
import { TripDashboard } from '../components/TripDashboard';
import { TripPreferencesCard } from '../components/TripPreferencesCard';
import { SpendingTracker } from '../components/SpendingTracker';
import { PlaceIdeas } from '../components/PlaceIdeas';

const color = { bg: '#071017', card: '#14232A', line: '#304044', gold: '#D4AF37', cream: '#F5F2EB', muted: '#ADB9B6', red: '#E6A19B' };
type Section = 'Trips' | 'Overview' | 'Itinerary' | 'Budget' | 'Privacy';
type Form = 'trip' | 'plan' | 'expense' | null;
function cash(v: number, c: string) { try { return new Intl.NumberFormat('en-US', { style: 'currency', currency: c }).format(v / 100); } catch { return c + ' ' + (v / 100).toFixed(2); } }
function Action({ label, onPress, outline = false, disabled = false }: { label: string; onPress: () => void; outline?: boolean; disabled?: boolean }) { const { legacy: color } = useTheme(); const styles = useThemedStyles(baseStyles); return <Pressable accessibilityRole="button" accessibilityState={{ disabled }} disabled={disabled} onPress={onPress} style={[styles.action, outline && styles.outline, disabled && { opacity: .5 }]}><Text style={[styles.actionText, outline && { color: color.cream }]}>{label}</Text></Pressable>; }
function Options({ values, value, set }: { values: string[]; value: string; set: (v: string) => void }) { const { legacy: color } = useTheme(); const styles = useThemedStyles(baseStyles); return <View style={styles.options}>{values.map(v => <Pressable key={v} accessibilityRole="radio" accessibilityState={{ checked: v === value }} onPress={() => set(v)} style={[styles.option, v === value && styles.optionOn]}><Text style={{ color: v === value ? color.onGold : color.cream, fontSize: 12 }}>{v}</Text></Pressable>)}</View>; }

export default function Planner() {
  const { legacy: color, mode } = useTheme();
  const styles = useThemedStyles(baseStyles);
  const router = useRouter();
  const params = useLocalSearchParams<{ section?: string; trip?: string }>();
  const section: Section = ['Trips', 'Overview', 'Itinerary', 'Budget', 'Privacy'].includes(params.section ?? '') ? params.section as Section : 'Overview';
  function setSection(value: Section, selectedTrip = tripId) { router.push({ pathname: '/', params: { section: value, ...(selectedTrip ? { trip: String(selectedTrip) } : {}) } }); }
  const db = useSQLiteContext();
  const savingRef = useRef(false);
  const formTripRef = useRef<number | null>(null);
  const refreshSequence = useRef(0);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [note, setNote] = useState('');
  const [conversion, setConversion] = useState<ExpenseConversion | null>(null);
  const [deletion, setDeletion] = useState<{ message: string; action: () => Promise<unknown> } | null>(null);
  const [deleting, setDeleting] = useState(false);
  const deletionRef = useRef(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false), [editingTrip, setEditingTrip] = useState(false);
  const [trips, setTrips] = useState<Trip[]>([]), [items, setItems] = useState<PlanItem[]>([]), [expenses, setExpenses] = useState<Expense[]>([]);
  const [tripId, setTripId] = useState<number | null>(tripFromParam(params.trip)), [form, setForm] = useState<Form>(null), [error, setError] = useState('');
  const [name, setName] = useState(''), [destination, setDestination] = useState(''), [start, setStart] = useState(''), [end, setEnd] = useState(''), [budget, setBudget] = useState(''), [currency, setCurrency] = useState('USD');
  const [entry, setEntry] = useState(''), [day, setDay] = useState(''), [time, setTime] = useState('09:00'), [kind, setKind] = useState('Activity'), [place, setPlace] = useState(''), [amount, setAmount] = useState(''), [category, setCategory] = useState('Food'), [durationText, setDurationText] = useState(''), [completed, setCompleted] = useState(false);
  const active = trips.find(t => t.id === tripId);
  const [daySelection, setDaySelection] = useState({ trip: '', day: 'All days' });
  const daySelectionKey = String(tripId) + ':' + (active?.start_date ?? '') + ':' + (active?.end_date ?? '');
  const selectedDay = daySelection.trip === daySelectionKey ? daySelection.day : 'All days';
  function setSelectedDay(day: string) { setDaySelection({ trip: daySelectionKey, day }); }


  const filteredExpenses = selectedDay === 'All days' ? expenses : expenses.filter(expense => expense.day === selectedDay);
  const spent = expenses.reduce((sum, e) => sum + e.amount_cents, 0);
  const categoryTotals = ['Stay', 'Transport', 'Food', 'Experience', 'Other'].map(category => ({ category, amount: expenses.filter(e => e.category === category).reduce((sum, e) => sum + e.amount_cents, 0) })).filter(value => value.amount > 0);
  const selectedTripRef = useRef(tripId);
  const refresh = useCallback(async (requested?: number | null) => {
    const sequence = ++refreshSequence.current;
    const preferred = requested === undefined ? selectedTripRef.current : requested;
    const { trips: next, tripId: id, plans, expenses: costs } = await plannerSnapshot(db, preferred);
    if (sequence !== refreshSequence.current) return;
    selectedTripRef.current = id; setTrips(next); setTripId(id); setItems(plans); setExpenses(costs);
    // Deleted or missing trip IDs fall back to an existing trip. Keep the URL
    // aligned so edit guards and browser history reference the displayed trip.
    if (id !== preferred) router.setParams({ trip: id === null ? undefined : String(id) });
  }, [db, router, setTrips, setTripId, setItems, setExpenses]);
  useEffect(() => { refresh().catch(() => setError('Could not load trips.')).finally(() => setLoading(false)); }, [refresh]);
  useEffect(() => {
    const requested = tripFromParam(params.trip);
    if (requested !== null && requested !== selectedTripRef.current) refresh(requested).catch(() => setError('Could not load the selected trip.'));
  }, [params.trip, refresh]);
  function open(next: Form) { if (next === 'trip') { router.push('/create-trip'); return; } formTripRef.current = active?.id ?? null; setError(''); setEditingTrip(false); setEditingId(null); setNote(''); setEntry(''); setPlace(''); setAmount(''); setConversion(null); setTime('09:00'); setKind('Activity'); setCategory('Food'); setDurationText(''); setCompleted(false); setForm(next); setDay(selectedDay !== 'All days' ? selectedDay : active?.start_date ?? ''); }
  function selectTrip(id: number) {
    setError('');
    setSection('Overview', id);
  }
  function editTrip(target = active) { if (!target) return; formTripRef.current = target.id; if (target.id !== tripId) { selectedTripRef.current = target.id; setTripId(target.id); router.setParams({ trip: String(target.id) }); } setName(target.title); setDestination(target.destination); setStart(target.start_date); setEnd(target.end_date); setBudget((target.budget_cents / 100).toFixed(2)); setCurrency(target.currency); setError(''); setEditingTrip(true); setForm('trip'); }
  function editPlan(item: PlanItem) { open('plan'); setEditingId(item.id); setEntry(item.title); setDay(item.day); setTime(item.time); setKind(item.kind); setPlace(item.place); setNote(item.note); setDurationText(item.duration_minutes ? String(item.duration_minutes) : ''); setCompleted(Boolean(item.completed)); }
  function editExpense(item: Expense) { open('expense'); setEditingId(item.id); setEntry(item.label); setDay(item.day); setCategory(item.category); setAmount((item.amount_cents / 100).toFixed(2)); setConversion(item.conversion ?? null); }
  async function refreshAfterSave(id?: number) {
    try { await refresh(id); }
    catch { setError('Saved successfully, but the trip list could not refresh. Reopen the app to see your changes.'); }
  }
  async function togglePlanComplete(item: PlanItem) {
    if (savingRef.current || !active) return;
    savingRef.current = true; setSaving(true); setError('');
    try {
      await updatePlan(db, item.id, { ...item, completed: !item.completed });
      await refreshAfterSave();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not update plan completion.'); }
    finally { savingRef.current = false; setSaving(false); }
  }
  async function movePlan(item: PlanItem, direction: 'up' | 'down') {
    if (savingRef.current || !active) return;
    savingRef.current = true; setSaving(true); setError('');
    try {
      await reorderPlan(db, active.id, item.id, direction);
      await refreshAfterSave();
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not reorder plan.'); }
    finally { savingRef.current = false; setSaving(false); }
  }
  async function save() {
    if (savingRef.current) return;
    savingRef.current = true; setSaving(true);
    try {
      if (form !== 'trip' || editingTrip) {
        const requested = tripFromParam(params.trip);
        if (!active || active.id !== formTripRef.current || (requested !== null && requested !== active.id)) {
          throw Error('The selected trip changed. Close this form and reopen it from the trip you want to edit.');
        }
      }
      if (form === 'trip') {
        const value = cents(budget || '0');
        if (!name.trim() || !destination.trim() || !dateOK(start) || !dateOK(end) || end < start || value === null || !currencyOK(currency)) throw Error('Enter a title, destination, valid YYYY-MM-DD dates, budget, and currency code.');
        const tripValue = { title: name.trim(), destination: destination.trim(), start_date: start, end_date: end, currency: currency.toUpperCase(), budget_cents: value };
        if (editingTrip && active && currency.toUpperCase() !== active.currency && expenses.length) throw Error('Currency cannot change while expenses exist. Amounts are not automatically converted.');
        const id = editingTrip && active ? active.id : await createTrip(db, tripValue);
        if (editingTrip && active) await updateTrip(db, id, tripValue);
        setName(''); setDestination(''); setStart(''); setEnd(''); setBudget(''); setError(''); setForm(null); setSection('Overview', id); await refreshAfterSave(id);
      } else if (form === 'plan' && active) {
        if (!entry.trim() || !dateOK(day) || day < active.start_date || day > active.end_date || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) throw Error('Enter a title, trip date, and time as HH:MM.');
        const trimmedDuration = durationText.trim();
        if (trimmedDuration !== '' && (!/^\d{1,4}$/.test(trimmedDuration) || Number(trimmedDuration) > 9999)) throw Error('Enter a duration in whole minutes from 0 to 9999, or leave it blank.');
        const parsedDuration = trimmedDuration === '' ? 0 : Number(trimmedDuration);
        const planValue = { trip_id: active.id, title: entry.trim(), day, time, kind, place: place.trim(), note: note.trim(), duration_minutes: parsedDuration, completed };
        if (editingId !== null) await updatePlan(db, editingId, planValue); else await addPlan(db, planValue);
        setEntry(''); setPlace(''); setDurationText(''); setCompleted(false); setError(''); setForm(null); setSection('Itinerary'); await refreshAfterSave();
      } else if (form === 'expense' && active) {
        const value = cents(amount);
        if (!entry.trim() || !dateOK(day) || day < active.start_date || day > active.end_date || value === null || value <= 0) throw Error('Enter a label, trip date, and positive amount.');
        const expenseValue = { trip_id: active.id, label: entry.trim(), day, category, amount_cents: value, conversion };
        if (editingId !== null) await updateExpense(db, editingId, expenseValue); else await addExpense(db, expenseValue);
        setEntry(''); setAmount(''); setError(''); setForm(null); setSection('Budget'); await refreshAfterSave();
      }
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not save.'); }
    finally { savingRef.current = false; setSaving(false); }
  }
  function remove(message: string, action: () => Promise<unknown>) { setError(''); setDeletion({ message, action }); }
  async function confirmDelete() {
    if (!deletion || deletionRef.current) return;
    deletionRef.current = true; setDeleting(true);
    try {
      await deletion.action();
      setDeletion(null);
      try { await refresh(); }
      catch { setError('Deletion succeeded, but the trip list could not refresh. Reopen the app to see your changes.'); }
    }
    catch { setError('Could not complete the deletion. Please try again.'); }
    finally { deletionRef.current = false; setDeleting(false); }
  }
  return <SafeAreaView style={styles.safe}><StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} /><AppHeader />
    <ScrollView role="main" contentContainerStyle={styles.page}><Text style={styles.kicker}>YOUR TRIP. YOUR PACE.</Text><Text accessibilityRole="header" style={styles.hero}>{section === 'Trips' ? 'Your next chapters.' : section === 'Privacy' ? 'Your data, your choice.' : active?.destination ?? 'Your plans'}</Text><Text style={styles.muted}>{active && section !== 'Trips' && section !== 'Privacy' ? `${dateLabel(active.start_date)} – ${dateLabel(active.end_date)} · ${tripDays(active.start_date, active.end_date)} days` : 'Plan the days. Understand the costs. Leave room for the good parts.'}</Text>
      {trips.length > 1 && <ScrollView horizontal contentContainerStyle={styles.tripBar}>{trips.map(t => <Pressable key={t.id} accessibilityRole="button" accessibilityState={{ selected: tripId === t.id }} onPress={() => { void selectTrip(t.id); }} style={[styles.pill, tripId === t.id && styles.pillOn]}><Text style={{ color: tripId === t.id ? color.onGold : color.cream }}>{t.title}</Text></Pressable>)}<Pressable accessibilityRole="button" onPress={() => open('trip')} style={styles.pill}><Text style={{ color: color.cream }}>+ New trip</Text></Pressable></ScrollView>}
      {loading && <Text accessibilityLiveRegion="polite" style={styles.muted}>Loading your trips...</Text>}{!!error && form === null && <Text accessibilityRole="alert" style={{ color: color.red }}>{error}</Text>}
      {!active || section === 'Trips' ? section !== 'Privacy' && !loading && <TripDashboard trips={trips} onSelect={selectTrip} onCreate={() => open('trip')} onEdit={t => editTrip(t)} onDelete={t => remove('This trip, its plans, and expenses will be permanently deleted.', () => deleteTrip(db, t.id))} /> : <>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 20 }}><Text style={[styles.muted, { flexShrink: 1, marginTop: 14 }]}>{active.title} · saved on this device</Text><Action label="Edit trip" outline onPress={() => editTrip(active)} /></View>
        <ScrollView horizontal role="tablist" accessibilityLabel="Trip sections" contentContainerStyle={styles.nav}>{(['Overview', 'Itinerary', 'Budget', 'Privacy'] as Section[]).map(v => <Pressable key={v} accessibilityRole="tab" accessibilityState={{ selected: section === v }} onPress={() => setSection(v)} style={[styles.navItem, section === v && styles.navOn]}><Text style={{ color: section === v ? color.gold : color.muted, fontSize: 12 }}>{v}</Text></Pressable>)}</ScrollView>
        {section === 'Overview' && <><Text style={styles.heading}>At a glance</Text><View style={styles.stats}><View style={styles.stat}><Text style={styles.kicker}>PLANNED MOMENTS</Text><Text style={styles.statBig}>{items.length}</Text><Text style={styles.muted}>{items.filter(i => i.completed).length} completed</Text></View><View style={styles.stat}><Text style={styles.kicker}>UNSPENT TARGET</Text><Text style={styles.statSmall}>{cash(active.budget_cents - spent, active.currency)}</Text></View></View><TripPreferencesCard key={active.id} trip={active} /><Text style={styles.heading}>Trip preview</Text>{items.length ? items.slice(0, 3).map(i => <View key={i.id} style={styles.row}><Text style={styles.date}>{dateLabel(i.day)}</Text><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{i.completed ? '✓ ' : ''}{i.title}</Text><Text style={styles.muted}>{formatTimeRange(i.time, i.duration_minutes)}{i.duration_minutes > 0 ? ' (' + formatDuration(i.duration_minutes) + ')' : ''} · {i.kind}</Text></View></View>) : <Text style={styles.muted}>Your itinerary is open. Add a first stop.</Text>}<Action label="+ Add a plan" onPress={() => open('plan')} /><Action label="AI Concierge & Book Consultation" outline onPress={() => router.push({ pathname: '/concierge', params: { trip: String(active.id) } })} /><Action label="View budget & spending" outline onPress={() => setSection('Budget')} /><Action label="+ Log an expense" outline onPress={() => { setEntry(''); open('expense'); }} /></>}
        {section === 'Itinerary' && <><ItinerarySection trip={active} items={items} selected={selectedDay} busy={saving} onSelect={setSelectedDay} onAdd={() => open('plan')} onEdit={editPlan} onDelete={item => remove('This plan will be permanently removed.', () => deletePlan(db, item.id))} onToggleComplete={item => { void togglePlanComplete(item); }} onMove={(item, direction) => { void movePlan(item, direction); }} /><PlaceIdeas key={active.id} trip={active} selected={selectedDay} onAdded={() => refresh()} /></>}
        {section === 'Budget' && <><SpendingTracker trip={active} expenses={expenses} onLogExpense={() => open('expense')} onEditTarget={() => editTrip(active)} /><CostPlanner key={String(active.id) + ':' + active.currency + ':' + active.start_date + ':' + active.end_date} trip={active} actual={spent} expenses={expenses} /><Text style={styles.heading}>By category</Text>{categoryTotals.length ? categoryTotals.map(value => <View key={value.category} style={styles.row}><Text style={[styles.rowTitle, { flex: 1 }]}>{value.category}</Text><Text style={styles.gold}>{cash(value.amount, active.currency)}</Text></View>) : <Text style={styles.muted}>Category totals appear when you add expenses.</Text>}<DailyBudget trip={active} expenses={expenses} selected={selectedDay} onSelect={setSelectedDay} /><Text style={[styles.heading, { marginTop: 24 }]}>{selectedDay === 'All days' ? 'Expenses' : 'Expenses · ' + dateLabel(selectedDay)}</Text><Action label="+ Log an expense" onPress={() => { setEntry(''); open('expense'); }} />{filteredExpenses.length ? filteredExpenses.map(e => <View key={e.id} style={styles.row}><View style={{ flex: 1 }}><Text style={styles.rowTitle}>{e.label}</Text><Text style={styles.muted}>{e.category} · {dateLabel(e.day)}</Text>{e.conversion && <Text style={styles.muted}>{cash(e.conversion.original_cents, e.conversion.original_currency)} originally · 1 {e.conversion.original_currency} = {e.conversion.rate} {active.currency} · {e.conversion.rate_date} · {e.conversion.source}</Text>}<Pressable accessibilityRole="button" accessibilityLabel={'Edit ' + e.label} onPress={() => editExpense(e)} style={styles.editButton}><Text style={styles.gold}>Edit expense</Text></Pressable></View><Text style={styles.rowTitle}>{cash(e.amount_cents, active.currency)}</Text><Pressable accessibilityRole="button" style={styles.iconButton} accessibilityLabel={'Delete ' + e.label} onPress={() => remove('This expense will be permanently removed.', () => deleteExpense(db, e.id))}><Text style={styles.x}>×</Text></Pressable></View>) : <Text style={styles.empty}>{selectedDay === 'All days' ? 'No expenses logged yet.' : 'No expenses logged for this day.'}</Text>}</>}
      </>}
      {section === 'Privacy' && <PrivacyPanel
        onImported={() => refresh()}
        onDeleteTrip={active ? () => remove('This trip, its plans, and expenses will be permanently deleted.', () => deleteTrip(db, active.id)) : undefined}
        onDeleteAll={trips.length ? () => remove('All trips, plans, and expenses will be permanently deleted.', () => deleteAll(db)) : undefined}
        onBack={!active ? () => setSection('Overview') : undefined}
      />}
      <Text style={styles.foot}>TRAVELLIKEANDY LLC</Text><Text style={styles.foot}>Planning tool only. No bookings or payments in this app.</Text>
    </ScrollView>
    <Modal visible={deletion !== null} transparent animationType="fade" onRequestClose={() => { if (!deleting) setDeletion(null); }}><View style={styles.confirmBackdrop}><View role="dialog" aria-modal={true} accessibilityLabel="Confirm local data deletion" style={styles.confirmCard}><Text accessibilityRole="header" style={styles.heading}>Delete local data?</Text><Text style={styles.muted}>{deletion?.message}</Text><Text style={[styles.muted, { marginTop: 12 }]}>This cannot be undone.</Text>{!!error && <Text accessibilityRole="alert" style={{ color: color.red }}>{error}</Text>}<Action label="Keep data" outline disabled={deleting} onPress={() => setDeletion(null)} /><Action label={deleting ? 'Deleting...' : 'Delete permanently'} disabled={deleting} onPress={confirmDelete} /></View></View></Modal>
    <Modal visible={form !== null} animationType="slide" onRequestClose={() => { if (!saving) setForm(null); }}><SafeAreaView role="dialog" aria-modal={true} accessibilityLabel="Trip editor" style={styles.safe}><KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}><ScrollView keyboardShouldPersistTaps="handled" contentContainerStyle={styles.page}><View style={styles.modalTop}><Text style={styles.heading}>{form === 'trip' ? (editingTrip ? 'Edit journey' : 'New journey') : form === 'plan' ? (editingId !== null ? 'Edit plan' : 'Add a plan') : (editingId !== null ? 'Edit expense' : 'Log an expense')}</Text><Pressable accessibilityRole="button" style={styles.iconButton} accessibilityLabel="Close" disabled={saving} accessibilityState={{ disabled: saving }} onPress={() => setForm(null)}><Text style={styles.x}>×</Text></Pressable></View><Text style={styles.muted}>Keep sensitive travel documents and payment details out of this app.</Text><View style={{ height: 26 }} />
      {form === 'trip' && <><Field label="Trip name" value={name} set={setName} hint="Summer in Italy" /><Field label="Destination" value={destination} set={setDestination} hint="Italy" /><Field label="Start date (YYYY-MM-DD)" value={start} set={setStart} limit={10} /><Field label="End date (YYYY-MM-DD)" value={end} set={setEnd} limit={10} /><Field label="Budget" value={budget} set={setBudget} hint="5000.00" limit={13} inputMode="decimal" /><Text style={styles.label}>CURRENCY</Text><Options values={[...currencies]} value={currency} set={setCurrency} /><Text style={styles.muted}>All expenses use this currency. No exchange rates are applied.</Text></>}
      {form === 'plan' && <><Field label="Plan title" value={entry} set={setEntry} hint="Dinner by the harbor" /><Text style={styles.label}>TYPE</Text><Options values={['Activity', 'Stay', 'Transport', 'Dining']} value={kind} set={setKind} /><Field label="Date (YYYY-MM-DD)" value={day} set={setDay} limit={10} /><Field label="Time (HH:MM)" value={time} set={setTime} limit={5} /><Field label="Duration (minutes, optional)" value={durationText} set={setDurationText} limit={4} inputMode="numeric" hint="Leave blank or enter 0-9999" /><Field label="Place (optional)" value={place} set={setPlace} /><Field label="Notes (optional)" value={note} set={setNote} limit={500} multiline /><Pressable accessibilityRole="checkbox" accessibilityState={{ checked: completed }} onPress={() => setCompleted(v => !v)} style={styles.checkbox}><Text style={styles.checkboxText}>{completed ? '✓ Completed' : 'Mark as completed'}</Text></Pressable></>}
      {form === 'expense' && <><Field label="Expense" value={entry} set={setEntry} hint="Lunch" /><Text style={styles.label}>CATEGORY</Text><Options values={['Stay', 'Transport', 'Food', 'Experience', 'Other']} value={category} set={setCategory} /><Field label="Date (YYYY-MM-DD)" value={day} set={setDay} limit={10} /><ExpenseAmount key={String(editingId) + ':' + (active?.currency ?? 'USD')} currency={active?.currency ?? 'USD'} amount={amount} conversion={conversion} disabled={saving} onChange={(value, details) => { setAmount(value); setConversion(details); }} /></>}
      {!!error && <Text accessibilityRole="alert" style={{ color: color.red, marginBottom: 12 }}>{error}</Text>}<Action disabled={saving} label={saving ? 'Saving…' : form === 'trip' ? (editingTrip ? 'Save trip' : 'Create trip') : form === 'plan' ? (editingId !== null ? 'Save plan' : 'Add to itinerary') : (editingId !== null ? 'Save expense' : 'Log expense')} onPress={save} /></ScrollView></KeyboardAvoidingView></SafeAreaView></Modal>
  </SafeAreaView>;
}

const baseStyles = StyleSheet.create({
  dayFilters: { gap: 8, paddingVertical: 18 },
  confirmBackdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,.8)', justifyContent: 'center', padding: 24 }, confirmCard: { backgroundColor: color.card, borderRadius: 16, padding: 24, maxWidth: 480, width: '100%', alignSelf: 'center' },
  editButton: { paddingVertical: 12, alignSelf: 'flex-start' },
  safe: { flex: 1, backgroundColor: color.bg }, top: { padding: 23, borderBottomWidth: 1, borderColor: color.line }, brand: { color: color.cream, fontSize: 16, letterSpacing: 2, fontWeight: '800' }, tag: { color: color.muted, fontSize: 9, letterSpacing: 2.5, marginTop: 5 }, page: { padding: 24, paddingBottom: 55, width: '100%', maxWidth: 1050, alignSelf: 'center' }, kicker: { color: color.gold, fontSize: 12, fontWeight: '700', letterSpacing: 1.8 }, hero: { color: color.cream, fontSize: 43, fontWeight: '700', lineHeight: 48, marginVertical: 17 }, muted: { color: color.muted, fontSize: 14, lineHeight: 21 }, card: { backgroundColor: color.card, borderWidth: 1, borderColor: color.line, borderRadius: 16, padding: 24, marginVertical: 23 }, cardTitle: { color: color.cream, fontSize: 27, marginBottom: 15 }, destination: { color: color.cream, fontSize: 36, marginVertical: 13 }, line: { height: 1, backgroundColor: color.line, marginVertical: 18 }, gold: { color: color.gold, fontSize: 14, letterSpacing: .1 }, tripBar: { gap: 8, paddingVertical: 25 }, pill: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: color.line, borderRadius: 24, paddingHorizontal: 14, paddingVertical: 10 }, pillOn: { backgroundColor: color.gold, borderColor: color.gold }, nav: { borderBottomWidth: 1, borderColor: color.line, marginBottom: 26 }, navItem: { minHeight: 44, justifyContent: 'center', padding: 12 }, navOn: { borderBottomWidth: 2, borderColor: color.gold }, heading: { color: color.cream, fontSize: 28, marginBottom: 15, fontWeight: '700' }, stats: { flexDirection: 'row', gap: 10, marginBottom: 30 }, stat: { flex: 1, backgroundColor: color.card, borderRadius: 12, padding: 15, minHeight: 95 }, statBig: { color: color.cream, fontSize: 32, marginTop: 10 }, statSmall: { color: color.cream, fontSize: 20, marginTop: 14 }, row: { flexDirection: 'row', gap: 12, alignItems: 'center', borderBottomWidth: 1, borderColor: color.line, paddingVertical: 17 }, date: { color: color.gold, backgroundColor: color.card, padding: 10, borderRadius: 7, fontSize: 12 }, rowTitle: { color: color.cream, fontSize: 15, marginBottom: 3 }, iconButton: { minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }, x: { color: color.muted, fontSize: 29, paddingHorizontal: 8 }, empty: { color: color.muted, paddingVertical: 30 }, action: { backgroundColor: color.gold, padding: 15, borderRadius: 10, alignItems: 'center', marginTop: 14 }, outline: { backgroundColor: 'transparent', borderWidth: 1, borderColor: color.line }, actionText: { color: color.bg, fontSize: 13, fontWeight: '800' }, track: { height: 6, borderRadius: 4, backgroundColor: color.line, marginVertical: 15 }, fill: { height: 6, borderRadius: 4, backgroundColor: color.gold }, foot: { color: '#778681', fontSize: 10, textAlign: 'center', marginTop: 20 }, modalTop: { flexDirection: 'row', justifyContent: 'space-between' }, label: { color: color.muted, fontSize: 12, fontWeight: '700', letterSpacing: 1.5, marginBottom: 8 }, input: { backgroundColor: color.card, borderWidth: 1, borderColor: color.line, borderRadius: 8, color: color.cream, padding: 14, fontSize: 15 }, options: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 22 }, option: { minHeight: 44, justifyContent: 'center', borderWidth: 1, borderColor: color.line, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 9 }, optionOn: { backgroundColor: color.gold, borderColor: color.gold }, checkbox: { minHeight: 44, flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderWidth: 1, borderColor: color.line, borderRadius: 8, backgroundColor: color.card }, checkboxText: { color: color.cream, fontSize: 14, marginLeft: 12 },
});
