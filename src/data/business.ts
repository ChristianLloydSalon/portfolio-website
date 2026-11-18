import type { Outcome } from '@/types';

/**
 * Impact section: measured results from my own work, each linked to the case study that
 * explains it. Only numbers confirmed by me (Nov 2026); `basis` says where each was measured.
 * Keep it to what I did and what it changed. No financial or business claims without data.
 */

export interface ImpactItem {
  id: string;
  title: string;
  /** The work itself, in one sentence. */
  body: string;
  result: Pick<Outcome, 'value' | 'label' | 'basis'>;
  /** Project id whose case study backs this up. */
  projectId: string;
}

export const outcomes: ImpactItem[] = [
  {
    id: 'push',
    title: 'Push notifications on every device',
    body: 'Implemented Firebase Cloud Messaging and Huawei Push Kit side by side, so announcements also reach Huawei phones without Google services.',
    result: { value: '15,000+', label: 'Users and devices reached', basis: 'production' },
    projectId: 'personal-collection',
  },
  {
    id: 'attendance',
    title: 'Verified event attendance',
    body: 'Built QR check-in with geofencing validation, so a scan only counts when the attendee is at the venue.',
    result: { value: '600+', label: 'Attendees checked in', basis: 'production' },
    projectId: 'personal-collection',
  },
  {
    id: 'bulk',
    title: 'Bulk imports off the request path',
    body: 'Implemented bulk import and notification processing on AWS SQS, with dead letter queues for failed messages.',
    result: { value: '20,000+', label: 'Records processed', basis: 'load-test' },
    projectId: 'personal-collection',
  },
  {
    id: 'regression',
    title: 'Shorter regression cycles',
    body: 'Introduced Maestro end-to-end tests for the app’s critical user journeys.',
    result: { value: '5–6h → ~2h', label: 'Manual regression per release cycle', basis: 'internal' },
    projectId: 'personal-collection',
  },
];
