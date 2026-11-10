// Locations supported by the project's own captions/filenames. No live prices.
export type PlaceIdea = { id: string; title: string; destination: string; country: string; kind: 'Activity' | 'Stay'; category: 'Culture' | 'Outdoors' | 'Stays'; photo: string; aliases: string[]; description: string; budgetNote: string };
export const placeIdeas: PlaceIdea[] = [
  { id: 'phewa-lake', title: 'Phewa Lake', destination: 'Pokhara', country: 'Nepal', kind: 'Activity', category: 'Outdoors', photo: 'leisure-pokhara-phewa-lake-boats', aliases: ['Pokhara', 'Nepal', 'Phewa Lake'], description: 'Start with the lakeside scene from the project’s Nepal photographs. Choose your own time by the water.', budgetNote: 'Check any boat hire, transfers and activities separately; a photograph does not establish a price.' },
  { id: 'koh-yao-noi', title: 'Koh Yao Noi', destination: 'Koh Yao Noi', country: 'Thailand', kind: 'Activity', category: 'Outdoors', photo: 'leisure-koh-yao-noi-longtail-boat', aliases: ['Koh Yao Noi', 'Thailand'], description: 'An island idea inspired by the longtail boat photograph. Shape a day around the coast at your own pace.', budgetNote: 'Check transfers, boat costs and any guide fees for your dates and group.' },
  { id: 'la-fortuna', title: 'La Fortuna Waterfall', destination: 'La Fortuna', country: 'Costa Rica', kind: 'Activity', category: 'Outdoors', photo: 'about-la-fortuna-waterfall', aliases: ['La Fortuna', 'Costa Rica'], description: 'A rainforest stop pictured in Andy’s travels. Add it as an idea, then check the practical details.', budgetNote: 'Confirm entry, transport, access requirements and any guide costs before committing.' },
  { id: 'taj-mahal', title: 'Taj Mahal', destination: 'Agra', country: 'India', kind: 'Activity', category: 'Culture', photo: 'about-taj-mahal-jump', aliases: ['Agra', 'India', 'Taj Mahal'], description: 'Use Andy’s Taj Mahal photograph as the starting point for your own Agra plans.', budgetNote: 'Check current admission, transport and any guide fees; opening times and availability are not connected.' },
  { id: 'sydney-opera-house', title: 'Sydney Opera House', destination: 'Sydney', country: 'Australia', kind: 'Activity', category: 'Culture', photo: 'about-sydney-opera-house', aliases: ['Sydney', 'Australia'], description: 'A city landmark from the project’s Sydney photographs. Decide whether your plan is a walk, a tour or a performance.', budgetNote: 'Price each option separately. A ticketed tour or performance is not included automatically.' },
  { id: 'palmilla', title: 'One&Only Palmilla', destination: 'Los Cabos', country: 'Mexico', kind: 'Stay', category: 'Stays', photo: 'bespoke-onlyandonly-palmilla-entrance', aliases: ['Los Cabos', 'Cabo', 'San Jose del Cabo', 'Palmilla', 'Mexico'], description: 'A stay pictured in the project collection. Compare it with your total trip target before choosing accommodation.', budgetNote: 'Request a dated room quote, including taxes and fees. No rate or availability is supplied by this photo.' },
  { id: 'bangkok-dawn', title: 'Bangkok Chao Phraya & Grand Palace', destination: 'Bangkok', country: 'Thailand', kind: 'Activity', category: 'Culture', photo: 'thailand-bangkok-skyline-dawn', aliases: ['Bangkok', 'Thailand'], description: 'Start in Bangkok with river piers, gilded temples, and skyline views from Andy’s Thailand route.', budgetNote: 'Check temple admission, river boat fares, and local transit separately.' },
  { id: 'river-kwai', title: 'River Kwai Sanctuary', destination: 'Kanchanaburi', country: 'Thailand', kind: 'Stay', category: 'Stays', photo: 'thailand-kanchanaburi-river-kwai-dawn', aliases: ['Kanchanaburi', 'River Kwai', 'Thailand'], description: 'Mist-wrapped limestone hills and riverfront stays along the River Kwai.', budgetNote: 'Request dated room rates and rail/transfer quotes for your dates.' },
  { id: 'wat-phra-singh', title: 'Wat Phra Singh & 137 Pillars', destination: 'Chiang Mai', country: 'Thailand', kind: 'Activity', category: 'Culture', photo: 'thailand-chiang-mai-wat-phra-singh', aliases: ['Chiang Mai', '137 Pillars', 'Thailand'], description: 'Gilded Lanna temple gables, lanterns, and teakwood garden sanctuaries in northern Thailand.', budgetNote: 'Confirm local guide, temple, cooking class, and sanctuary fees separately.' },
  { id: 'andaman-islands', title: 'Phang Nga Bay & Andaman Coast', destination: 'Koh Lanta & Phang Nga Bay', country: 'Thailand', kind: 'Activity', category: 'Outdoors', photo: 'thailand-andaman-sunset-horizon', aliases: ['Koh Lanta', 'Phang Nga', 'Koh Yao Yai', 'Andaman', 'Thailand'], description: 'Longtail crossings beneath limestone karsts and golden Andaman Sea sunsets.', budgetNote: 'Verify island ferry, longtail charter, and marine park fees for your group.' },
];
const normalize = (value: string) => ` ${value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()} `;
export function placesForDestination(destination: string) {
  const query = normalize(destination);
  return placeIdeas.filter(place => place.aliases.some(alias => query.includes(normalize(alias))));
}
export function placeById(id: string) { return placeIdeas.find(place => place.id === id); }
export function photoForPlaceText(value: string) {
  const query = normalize(value);
  if (query.trim().length < 3) return undefined;
  return placeIdeas.find(place =>
    query.includes(normalize(place.title)) ||
    place.aliases.some(alias => query.includes(normalize(alias))),
  );
}
