import { useEffect, useState } from 'react';
import { Linking, Platform, Pressable, ScrollView, Text, View, useWindowDimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import Svg, { Circle, Path } from 'react-native-svg';
import { AppHeader } from '../components/AppHeader';
import { Brand } from '../components/Brand';
import { TravelPhoto } from '../components/TravelPhoto';
import { Button, Choices, Input, Notice } from '../components/ui';
import { adjacentMonth, calendarMonth } from '../calendar';
import {
  LEGAL_DISCLOSURES,
  buildConciergeProposal,
  buildConsultationIcs,
  buildConsultationMailtoUrl,
  conciergePrompts,
  consultationSlots,
  consultationTypes,
  curatedCollections,
  validateConsultation,
  type ConciergeProposal,
  type ConsultationBooking,
} from '../concierge';
import { addPlan, createPlannedTrip, getSetting, listTrips, saveSetting, type Trip } from '../data';
import { photoForPlaceText } from '../places';
import { useTheme } from '../theme';
import { dateLabel } from '../validation';

function downloadIcsOnWeb(filename: string, content: string): boolean {
  if (Platform.OS !== 'web' || typeof document === 'undefined' || typeof URL === 'undefined') return false;
  const url = URL.createObjectURL(new Blob([content], { type: 'text/calendar;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 60_000);
  return true;
}

function RouteCompassBadge({ color, accent }: { color: string; accent: string }) {
  return (
    <Svg width={36} height={36} viewBox="0 0 36 36" accessible={false} aria-hidden>
      <Circle cx={18} cy={18} r={16} stroke={color} strokeWidth={1.6} fill="none" strokeDasharray="3 3" />
      <Path d="M10 23C14 15 22 15 26 12" stroke={accent} strokeWidth={2.2} strokeLinecap="round" fill="none" />
      <Circle cx={10} cy={23} r={2.6} fill={color} />
      <Circle cx={26} cy={12} r={2.8} fill={accent} />
    </Svg>
  );
}

export default function Concierge() {
  const { colors: c, mode } = useTheme();
  const router = useRouter();
  const params = useLocalSearchParams<{ trip?: string }>();
  const db = useSQLiteContext();
  const { width } = useWindowDimensions();
  const wide = width > 860;

  // Saved trips & consultations from SQLite
  const [trips, setTrips] = useState<Trip[]>([]);
  const [bookings, setBookings] = useState<ConsultationBooking[]>([]);

  // AI Concierge state
  const [prompt, setPrompt] = useState('');
  const [history, setHistory] = useState<{ role: 'user' | 'assistant'; text: string; proposal?: ConciergeProposal }[]>([
    {
      role: 'assistant',
      text: 'Welcome to AndyGo Concierge. Ask me for any destination, number of days, traveler count, or budget target (or tap a prompt below) and I will draft a day-by-day route you can save directly to your trips or attach to a consultation with Andy.',
      proposal: buildConciergeProposal(conciergePrompts[0]),
    },
  ]);
  const [savingDraft, setSavingDraft] = useState(false);
  const [chatNotice, setChatNotice] = useState('');
  const [chatError, setChatError] = useState('');

  // Consultation Calendar & Appointment state
  const defaultDate = '2026-11-18';
  const [month, setMonth] = useState(defaultDate);
  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedSlot, setSelectedSlot] = useState<string>(consultationSlots[1]);
  const [selectedType, setSelectedType] = useState<string>(consultationTypes[0].label);
  const [selectedTripId, setSelectedTripId] = useState<number | null>(null);
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [consultNotes, setConsultNotes] = useState('');
  const [bookingNotice, setBookingNotice] = useState('');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [loadedTrips, rawConsults] = await Promise.all([listTrips(db), getSetting(db, 'consultations')]);
        if (!active) return;
        setTrips(loadedTrips);
        if (loadedTrips.length > 0) {
          const requestedId = Number(params.trip);
          const match = loadedTrips.find(t => t.id === requestedId);
          setSelectedTripId(match ? match.id : loadedTrips[0].id);
        }
        if (rawConsults) {
          const parsed = JSON.parse(rawConsults);
          if (Array.isArray(parsed)) setBookings(parsed);
        }
      } catch {
        // Ignore initial load error
      }
    })();
    return () => { active = false; };
  }, [db, params.trip]);

  function askConcierge(inputPrompt = prompt) {
    setChatError('');
    setChatNotice('');
    try {
      const proposal = buildConciergeProposal(inputPrompt);
      setHistory(prev => [
        ...prev,
        { role: 'user', text: inputPrompt.trim() },
        { role: 'assistant', text: proposal.reply, proposal },
      ]);
      setPrompt('');
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Could not generate a trip draft.');
    }
  }

  async function saveProposalToTrips(proposal: ConciergeProposal) {
    if (savingDraft) return;
    setSavingDraft(true);
    setChatError('');
    setChatNotice('');
    try {
      const id = await createPlannedTrip(
        db,
        {
          title: proposal.title,
          destination: proposal.destination,
          start_date: proposal.start_date,
          end_date: proposal.end_date,
          currency: proposal.currency,
          budget_cents: proposal.budget_cents,
        },
        proposal.planning,
      );
      for (const stop of proposal.stops) {
        await addPlan(db, {
          trip_id: id,
          day: stop.day,
          time: stop.time,
          kind: stop.kind,
          title: stop.title,
          place: stop.place,
          note: stop.note,
          duration_minutes: stop.duration_minutes,
          completed: false,
        });
      }
      const updated = await listTrips(db);
      setTrips(updated);
      setSelectedTripId(id);
      setChatNotice(`Saved "${proposal.title}" to My Trips with ${proposal.stops.length} curated stops.`);
      router.push({ pathname: '/', params: { section: 'Overview', trip: String(id) } });
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Could not save draft to trips.');
    } finally {
      setSavingDraft(false);
    }
  }

  async function bookAppointment() {
    setBookingError('');
    setBookingNotice('');
    try {
      const typeObj = consultationTypes.find(t => t.label === selectedType) ?? consultationTypes[0];
      const attachedTrip = trips.find(t => t.id === selectedTripId);
      const booking = validateConsultation({
        typeId: typeObj.id,
        date: selectedDate,
        time: selectedSlot,
        clientName,
        clientEmail,
        tripTitle: attachedTrip?.title ?? '',
        tripSummary: attachedTrip
          ? `${attachedTrip.destination} (${attachedTrip.start_date} to ${attachedTrip.end_date}) · Target ${(attachedTrip.budget_cents / 100).toFixed(0)} ${attachedTrip.currency}`
          : '',
        notes: consultNotes,
      });
      const nextBookings = [booking, ...bookings.filter(b => b.id !== booking.id)].slice(0, 15);
      await saveSetting(db, 'consultations', JSON.stringify(nextBookings));
      setBookings(nextBookings);
      const ics = buildConsultationIcs(booking);
      const downloaded = downloadIcsOnWeb(`andygo-consultation-${booking.date}.ics`, ics);
      setBookingNotice(
        downloaded
          ? `Confirmed ${booking.typeLabel} on ${dateLabel(booking.date)} at ${booking.time} and downloaded your .ics calendar invite.`
          : `Confirmed ${booking.typeLabel} on ${dateLabel(booking.date)} at ${booking.time}.`,
      );
    } catch (error) {
      setBookingError(error instanceof Error ? error.message : 'Could not schedule consultation.');
    }
  }

  const monthTitle = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' }).format(
    new Date(month.slice(0, 7) + '-01T12:00:00Z'),
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <AppHeader />
      <ScrollView role="main" contentContainerStyle={{ width: '100%', maxWidth: 1160, padding: wide ? 36 : 20, alignSelf: 'center', paddingBottom: 60, gap: 32 }}>
        <View style={{ backgroundColor: c.card, borderRadius: 24, borderWidth: 1, borderColor: c.border, padding: wide ? 28 : 20, flexDirection: wide ? 'row' : 'column', alignItems: wide ? 'center' : 'flex-start', justifyContent: 'space-between', gap: 20 }}>
          <View style={{ flex: 1, gap: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <RouteCompassBadge color={c.primary} accent="#EE765C" />
              <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.8 }}>AI CONCIERGE · WEBSITE COLLECTIONS · ADVISOR CALENDAR</Text>
            </View>
            <Text accessibilityRole="header" aria-level={1} style={{ color: c.text, fontSize: wide ? 44 : 32, fontWeight: '800', letterSpacing: -1 }}>
              Draft with AI. Curate with Andy.
            </Text>
            <Text style={{ color: c.muted, fontSize: 16, lineHeight: 25, maxWidth: 720 }}>
              Shape a day-by-day route in seconds, load signature journeys from the Travel Like Andy website, or book a consultation slot on the calendar with your trip blueprint attached.
            </Text>
          </View>
          <View style={{ backgroundColor: c.soft, borderRadius: 18, padding: 16, borderWidth: 1, borderColor: c.border, alignItems: 'center', gap: 6 }}>
            <Brand size={40} wordmark endorsed variant={mode === 'dark' ? 'dark' : 'light'} decorative />
            <Text style={{ color: c.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }}>4 ADVISORY PILLARS</Text>
            <Text style={{ color: c.muted, fontSize: 12 }}>Anticipate · Advocate · Curate · Accompany</Text>
          </View>
        </View>

        <View style={{ flexDirection: wide ? 'row' : 'column', alignItems: 'flex-start', gap: 24 }}>
          {/* LEFT PANE: AI CONCIERGE CHAT */}
          <View style={{ flex: 1.15, width: '100%', backgroundColor: c.card, borderRadius: 22, borderWidth: 1, borderColor: c.border, padding: wide ? 24 : 18, gap: 16 }}>
            <View style={{ gap: 4 }}>
              <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4 }}>1 · ASK ANDYGO AI CONCIERGE</Text>
              <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 24, fontWeight: '700' }}>Conversational Trip Architect</Text>
              <Text style={{ color: c.muted, fontSize: 13, lineHeight: 20 }}>
                Describe where you want to go, how many days, travelers, and budget. Every draft keeps unknown supplier prices honest until verified.
              </Text>
            </View>

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
              {conciergePrompts.map(chip => (
                <Pressable
                  key={chip}
                  accessibilityRole="button"
                  accessibilityLabel={'Use prompt: ' + chip}
                  onPress={() => askConcierge(chip)}
                  style={{ backgroundColor: c.soft, borderWidth: 1, borderColor: c.border, borderRadius: 18, paddingHorizontal: 12, paddingVertical: 8 }}
                >
                  <Text style={{ color: c.primary, fontSize: 12, fontWeight: '600' }}>{chip}</Text>
                </Pressable>
              ))}
            </View>

            <View style={{ gap: 12 }}>
              {history.slice(-3).map((msg, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: msg.role === 'user' ? c.primary : c.soft,
                    borderRadius: 16,
                    padding: 16,
                    gap: 12,
                    alignSelf: msg.role === 'user' ? 'flex-end' : 'stretch',
                    maxWidth: msg.role === 'user' ? '88%' : '100%',
                  }}
                >
                  <Text style={{ color: msg.role === 'user' ? c.onPrimary : c.text, fontSize: 14, lineHeight: 22 }}>{msg.text}</Text>
                  {msg.proposal && (
                    <View style={{ backgroundColor: c.card, borderRadius: 14, borderWidth: 1, borderColor: c.border, padding: 14, gap: 10 }}>
                      <Text style={{ color: c.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }}>
                        STRUCTURED DRAFT · {msg.proposal.start_date} TO {msg.proposal.end_date} · {msg.proposal.planning.travelers} TRAVELERS
                      </Text>
                      <Text style={{ color: c.text, fontSize: 18, fontWeight: '700' }}>{msg.proposal.title}</Text>
                      {msg.proposal.stops.map(stop => {
                        const matchedPhoto = photoForPlaceText(stop.place) ?? photoForPlaceText(stop.title);
                        return (
                          <View key={stop.day + stop.title} style={{ borderLeftWidth: 3, borderLeftColor: c.primary, paddingLeft: 12, gap: 6 }}>
                            {matchedPhoto && (
                              <View style={{ borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: c.border }}>
                                <TravelPhoto id={matchedPhoto.photo} height={110} />
                              </View>
                            )}
                            <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700' }}>{dateLabel(stop.day)} · {stop.time} · {stop.kind}</Text>
                            <Text style={{ color: c.text, fontSize: 14, fontWeight: '700' }}>{stop.title} ({stop.place})</Text>
                            <Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>{stop.note}</Text>
                          </View>
                        );
                      })}
                      <Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>{msg.proposal.practicalNote}</Text>
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
                        <Button
                          label={savingDraft ? 'Saving…' : 'Save Draft to My Trips →'}
                          disabled={savingDraft}
                          onPress={() => saveProposalToTrips(msg.proposal!)}
                        />
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>

            <Input
              label="Ask AndyGo to draft or refine a trip"
              value={prompt}
              onChangeText={setPrompt}
              maxLength={400}
              placeholder="e.g., 10 days in Thailand for 4 friends under $6,500"
            />
            <Button label="Generate Route Draft" onPress={() => askConcierge(prompt)} />
            {!!chatError && <Notice text={chatError} error />}
            {!!chatNotice && <Notice text={chatNotice} />}
          </View>

          {/* RIGHT PANE: CONSULTATION CALENDAR & APPOINTMENT BOOKING */}
          <View style={{ flex: 1, width: '100%', backgroundColor: c.card, borderRadius: 22, borderWidth: 1, borderColor: c.border, padding: wide ? 24 : 18, gap: 14 }}>
            <View style={{ gap: 4 }}>
              <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.4 }}>2 · CONSULTATION CALENDAR & APPOINTMENTS</Text>
              <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 24, fontWeight: '700' }}>Book a Session with Andy</Text>
              <Text style={{ color: c.muted, fontSize: 13, lineHeight: 20 }}>
                Select a consultation type, date, and time slot. Attach a saved trip so Andy receives your dates, group size, and stops upfront.
              </Text>
            </View>

            <Choices
              label="Consultation session"
              values={consultationTypes.map(t => t.label)}
              value={selectedType}
              onChange={setSelectedType}
            />

            {/* Interactive Month Calendar */}
            <View style={{ borderWidth: 1, borderColor: c.border, borderRadius: 14, padding: 10, backgroundColor: c.soft }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <Pressable accessibilityRole="button" accessibilityLabel="Previous month" onPress={() => setMonth(adjacentMonth(month, -1))} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: c.text, fontSize: 18, fontWeight: '700' }}>‹</Text>
                </Pressable>
                <Text accessibilityRole="header" style={{ color: c.text, fontSize: 15, fontWeight: '700' }}>{monthTitle}</Text>
                <Pressable accessibilityRole="button" accessibilityLabel="Next month" onPress={() => setMonth(adjacentMonth(month, 1))} style={{ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center' }}>
                  <Text style={{ color: c.text, fontSize: 18, fontWeight: '700' }}>›</Text>
                </Pressable>
              </View>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <View key={d} style={{ width: '14.2857%', alignItems: 'center', paddingVertical: 4 }}>
                    <Text style={{ color: c.muted, fontSize: 11, fontWeight: '600' }}>{d}</Text>
                  </View>
                ))}
                {calendarMonth(month).map((day, idx) => {
                  const isSelected = day === selectedDate;
                  return (
                    <View key={day ?? 'blank-' + idx} style={{ width: '14.2857%', alignItems: 'center', paddingVertical: 2 }}>
                      {day && (
                        <Pressable
                          accessibilityRole="button"
                          accessibilityLabel={`Select consultation date ${dateLabel(day)}`}
                          accessibilityState={{ selected: isSelected }}
                          onPress={() => setSelectedDate(day)}
                          style={{
                            width: 38,
                            height: 38,
                            borderRadius: 19,
                            alignItems: 'center',
                            justifyContent: 'center',
                            backgroundColor: isSelected ? c.primary : 'transparent',
                          }}
                        >
                          <Text style={{ color: isSelected ? c.onPrimary : c.text, fontWeight: isSelected ? '700' : '500', fontSize: 14 }}>
                            {Number(day.slice(8))}
                          </Text>
                        </Pressable>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>

            <Choices
              label={`Available slots on ${dateLabel(selectedDate)} (CT)`}
              values={consultationSlots}
              value={selectedSlot}
              onChange={setSelectedSlot}
            />

            {trips.length > 0 && (
              <Choices
                label="Attach saved trip blueprint"
                values={['None', ...trips.map(t => t.title)]}
                value={trips.find(t => t.id === selectedTripId)?.title ?? 'None'}
                onChange={label => {
                  const found = trips.find(t => t.title === label);
                  setSelectedTripId(found?.id ?? null);
                }}
              />
            )}

            <Input label="Your full name" value={clientName} onChangeText={setClientName} maxLength={100} placeholder="e.g., Alex Morgan" />
            <Input label="Email for calendar invite (.ics)" value={clientEmail} onChangeText={setClientEmail} maxLength={254} keyboardType="email-address" placeholder="you@example.com" />
            <Input label="Questions or group notes (optional)" value={consultNotes} onChangeText={setConsultNotes} maxLength={500} placeholder="Destination goals, group size, or accessibility notes" />

            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
              <Button label="Confirm Slot & Download .ics" onPress={bookAppointment} />
              <Button
                label="Open Website Contact Page"
                secondary
                onPress={() => Linking.openURL('https://www.travellikeandy.com/contact')}
              />
            </View>
            {!!bookingError && <Notice text={bookingError} error />}
            {!!bookingNotice && <Notice text={bookingNotice} />}

            {bookings.length > 0 && (
              <View style={{ marginTop: 8, paddingTop: 12, borderTopWidth: 1, borderColor: c.border, gap: 10 }}>
                <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.2 }}>YOUR SCHEDULED CONSULTATIONS ({bookings.length})</Text>
                {bookings.map(b => (
                  <View key={b.id} style={{ backgroundColor: c.soft, borderRadius: 12, padding: 12, gap: 4 }}>
                    <Text style={{ color: c.text, fontSize: 14, fontWeight: '700' }}>{b.typeLabel}</Text>
                    <Text style={{ color: c.primary, fontSize: 13, fontWeight: '600' }}>{dateLabel(b.date)} at {b.time} CT · {b.clientName}</Text>
                    {!!b.tripTitle && <Text style={{ color: c.muted, fontSize: 12 }}>Attached trip: {b.tripTitle}</Text>}
                    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 4 }}>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Download .ics invite for ${b.typeLabel}`}
                        onPress={() => downloadIcsOnWeb(`andygo-consultation-${b.date}.ics`, buildConsultationIcs(b))}
                      >
                        <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>Download .ics calendar file again</Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel={`Send consultation brief via email for ${b.typeLabel}`}
                        onPress={() => Linking.openURL(buildConsultationMailtoUrl(b))}
                      >
                        <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>Send consultation brief via email →</Text>
                      </Pressable>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>

        {/* BOTTOM SECTION: WEBSITE SIGNATURE COLLECTIONS */}
        <View style={{ gap: 16, marginTop: 8 }}>
          <View style={{ gap: 4 }}>
            <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', letterSpacing: 1.6 }}>3 · SIGNATURE WEBSITE COLLECTIONS</Text>
            <Text accessibilityRole="header" aria-level={2} style={{ color: c.text, fontSize: 28, fontWeight: '800' }}>
              Featured Journeys from Travel Like Andy
            </Text>
            <Text style={{ color: c.muted, fontSize: 15, lineHeight: 23 }}>
              Load any of Andy’s signature website routes directly into your device planner with one click, complete with day-by-day stops and practical local checks.
            </Text>
          </View>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 18 }}>
            {curatedCollections.map(col => (
              <View
                key={col.id}
                style={{
                  flexBasis: wide ? 260 : '100%',
                  flexGrow: 1,
                  flexShrink: 1,
                  backgroundColor: c.card,
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: c.border,
                  overflow: 'hidden',
                }}
              >
                <TravelPhoto id={col.photo} height={175} />
                <View style={{ padding: 18, gap: 8 }}>
                  <Text style={{ color: c.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.2 }}>{col.badge}</Text>
                  <Text accessibilityRole="header" aria-level={3} style={{ color: c.text, fontSize: 20, fontWeight: '700' }}>{col.title}</Text>
                  <Text style={{ color: c.muted, fontSize: 13, lineHeight: 20 }}>{col.summary}</Text>
                  <Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>{col.stops.length} curated stops · {col.practicalNote}</Text>
                  <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 }}>
                    <Button
                      small
                      label="Load Route in AI →"
                      onPress={() => askConcierge(`Plan ${col.days} days in ${col.destination} for ${col.defaultTravelers} travelers`)}
                    />
                    <Button
                      small
                      secondary
                      label="Open in Planner"
                      onPress={() => saveProposalToTrips(buildConciergeProposal(`Plan ${col.days} days in ${col.destination} for ${col.defaultTravelers} travelers`))}
                    />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* LEGAL & WEBSITE REGISTRATION DISCLOSURES */}
        <View style={{ backgroundColor: c.card, borderRadius: 18, borderWidth: 1, borderColor: c.border, padding: wide ? 22 : 16, gap: 8 }}>
          <Text style={{ color: c.primary, fontSize: 11, fontWeight: '700', letterSpacing: 1.4 }}>LEGAL & SELLER OF TRAVEL DISCLOSURES</Text>
          <Text style={{ color: c.text, fontSize: 13, fontWeight: '700' }}>{LEGAL_DISCLOSURES.entity}</Text>
          <Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>{LEGAL_DISCLOSURES.californiaNotice}</Text>
          <Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>{LEGAL_DISCLOSURES.foraContractor} {LEGAL_DISCLOSURES.foraRegistrations}</Text>
          <Text style={{ color: c.muted, fontSize: 12, lineHeight: 18 }}>{LEGAL_DISCLOSURES.nonContractNotice}</Text>
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14, marginTop: 4 }}>
            <Pressable accessibilityRole="button" onPress={() => Linking.openURL(LEGAL_DISCLOSURES.privacyUrl)}>
              <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>Website Privacy Policy</Text>
            </Pressable>
            <Pressable accessibilityRole="button" onPress={() => Linking.openURL(LEGAL_DISCLOSURES.contactUrl)}>
              <Text style={{ color: c.primary, fontSize: 12, fontWeight: '700', textDecorationLine: 'underline' }}>Travel Like Andy Contact Form</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
