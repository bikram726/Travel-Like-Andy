import { test } from 'node:test';
import assert from 'node:assert/strict';
import { answerQuestion, faqEntries, isQuestion, routeConciergeInput } from '../src/faq.ts';

test('questions route to grounded site answers; trip requests route to drafts; unknowns never guess', () => {
  assert.ok(isQuestion('How big are the groups?'));
  assert.ok(!isQuestion('6 days in Lisbon for 2 travelers'));

  const groups = routeConciergeInput('How big are the groups?');
  assert.equal(groups.kind, 'faq');
  assert.equal(groups.kind === 'faq' && groups.entry.id, 'group-size');

  assert.equal(answerQuestion('Is the Thailand trip still available?')?.id, 'thailand-tour');
  assert.equal(answerQuestion('How much does a trip cost?')?.id, 'price');
  assert.equal(answerQuestion('Are you a registered seller of travel?')?.id, 'legal');

  assert.equal(routeConciergeInput('Can you plan 7 days in Kyoto?').kind, 'draft');
  assert.equal(routeConciergeInput('6 days in Lisbon for 2 travelers').kind, 'draft');
  assert.equal(routeConciergeInput('What is the capital of Mongolia?').kind, 'fallback');
  // Whole-word matching: "good" must not match the "go" keyword.
  assert.equal(answerQuestion('Is it good?'), null);

  // Every answer cites a public travellikeandy.com page and avoids retired vocabulary.
  for (const entry of faqEntries) {
    assert.match(entry.source, /^https:\/\/www\.travellikeandy\.com\//);
    assert.doesNotMatch(entry.answer, /book now|bucket list|hidden gem|dream vacation|inner circle|by invitation only/i);
  }
});
