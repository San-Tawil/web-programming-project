import { initialOpportunities } from './opportunities.js';

// Phase 1 mock listings. The IDs can carry over to the team's shared opportunity data.
const listings = [
  { id: 'coastal-cleanup', cause: 'Environment', title: 'Coastal cleanup', location: 'Ramlet el Baida, Beirut', time: '2 hours · One shift', description: 'Walk the shoreline with a small team, collect litter, and sort recyclables at the end of the shift.' },
  { id: 'food-packing', cause: 'Food support', title: 'Community food packing', location: 'Beirut', time: '3 hours · One shift', description: 'Sort pantry staples and assemble grocery boxes for families in the community.' },
  { id: 'homework-club', cause: 'Education', title: 'After-school homework club', location: 'Hamra, Beirut', time: '1 hour · Weekly', description: 'Help students work through homework and build confidence by reading together.' },
  { id: 'shelter-care', cause: 'Animal welfare', title: 'Shelter care shift', location: 'Tripoli, North Lebanon', time: '2 hours · One shift', description: 'Help shelter staff refresh bedding and prepare food for rescued animals.' },
  { id: 'garden-day', cause: 'Community support', title: 'Neighborhood garden day', location: 'Sidon, South Lebanon', time: '3 hours · One shift', description: 'Prepare planting beds and water seedlings with neighborhood volunteers.' },
  { id: 'community-health-day', cause: 'Health', title: 'Community health welcome desk', location: 'Zahle, Beqaa', time: '2 hours · One shift', description: 'Welcome visitors, help them find the right station, and organize supplies.' },
  { id: 'arts-workshop', cause: 'Arts and culture', title: 'Community art workshop', location: 'Byblos, Mount Lebanon', time: '2 hours · One shift', description: 'Set up materials and support participants during a hands-on art session.' },
];

const times = {
  'food-packing': { startTime: '09:00', endTime: '12:00' },
  'homework-club': { startTime: '15:30', endTime: '16:30' },
  'garden-day': { startTime: '09:00', endTime: '12:00' },
};

const organization = { id: 'aidconnect-community', name: 'AidConnect Community' };
const volunteer = { id: 'maya-haddad', name: 'Maya Haddad' };

export const initialDemo = {
  organization,
  volunteer,
  opportunities: [
    ...listings.map((listing, index) => ({
      ...initialOpportunities.find(item => item.id === listing.id),
      ...listing,
      status: 'Published',
      organization: organization.name,
      kind: 'shift',
      date: `2026-11-${14 + index}`,
      startTime: '09:00',
      endTime: '11:00',
      ...times[listing.id],
      hours: listing.id === 'food-packing' || listing.id === 'garden-day' ? 3 : listing.id === 'homework-club' ? 1 : 2,
      capacity: 8,
      organizationId: organization.id,
      organizer: organization.name,
      signup: listing.id === 'homework-club' ? 'approval' : 'open',
    })),
    {
      id: 'community-tutoring',
      city: 'Beirut',
      status: 'Published',
      organization: organization.name,
      requirements: 'Contact the program coordinator to arrange a suitable tutoring session.',
      kind: 'opportunity',
      title: 'Community tutoring program',
      cause: 'Education',
      location: 'Hamra, Beirut',
      description: 'Help students build confidence in reading and homework throughout the school year.',
      capacity: 8,
      organizationId: organization.id,
      organizer: organization.name,
      signup: 'approval',
    },
  ],
  signups: [
    { opportunityId: 'coastal-cleanup', volunteerId: 'karim-saleh', volunteer: 'Karim Saleh', status: 'Reserved' },
    { opportunityId: 'homework-club', volunteerId: 'nour-khoury', volunteer: 'Nour Khoury', status: 'Pending' },
  ],
};

export const completedShifts = [
  { title: 'Neighborhood garden day', cause: 'Community support', date: '2026-08-22', month: 'Aug', hours: 2 },
  { title: 'Community food packing', cause: 'Food support', date: '2026-09-12', month: 'Sep', hours: 3 },
  { title: 'Coastal cleanup', cause: 'Environment', date: '2026-10-24', month: 'Oct', hours: 3 },
];

export function shiftDate(date) {
  return new Date(date + 'T00:00:00').toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

export function shiftTime({ startTime, endTime }) {
  return `${startTime}–${endTime}`;
}

export function isConfirmed({ status }) {
  return status === 'Reserved' || status === 'Accepted';
}

export function spotsFilled(signups, opportunityId) {
  return signups.filter(signup => signup.opportunityId === opportunityId && isConfirmed(signup)).length;
}

export function demoReducer(state, action) {
  if (action.type === 'selectVolunteer') {
    return { ...state, volunteer: action.volunteer };
  }

  if (action.type === 'post') {
    const { parentId } = action.opportunity;
    if (parentId && !state.opportunities.some(item =>
      item.id === parentId && item.kind === 'opportunity' && item.organizationId === state.organization.id
    )) return state;
    const opportunity = {
      ...action.opportunity,
      id: crypto.randomUUID(),
      status: action.opportunity.status || 'Published',
      ...(action.opportunity.kind === 'shift' && { hours: (Number(action.opportunity.endTime.slice(0, 2)) * 60 + Number(action.opportunity.endTime.slice(3)) - Number(action.opportunity.startTime.slice(0, 2)) * 60 - Number(action.opportunity.startTime.slice(3))) / 60 }),
      city: action.opportunity.city || action.opportunity.location,
      requirements: action.opportunity.requirements || 'Contact the organizer for preparation and meeting details.',
      organization: state.organization.name,
      organizationId: state.organization.id,
      organizer: state.organization.name,
    };
    return { ...state, opportunities: [...state.opportunities, opportunity] };
  }

  const opportunity = state.opportunities.find(item => item.id === action.opportunityId);
  if (!opportunity) return state;
  const full = spotsFilled(state.signups, opportunity.id) >= opportunity.capacity;

  if (action.type === 'updateOpportunity' && opportunity.organizationId === state.organization.id) {
    const values = { ...action.values };
    if (opportunity.kind === 'shift' && values.hours && opportunity.startTime) {
      const [hours, minutes] = opportunity.startTime.split(':').map(Number);
      const end = hours * 60 + minutes + Number(values.hours) * 60;
      if (end >= 1440) return state;
      values.endTime = `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
    }
    // Never reduce capacity below confirmed reservations.
    if (values.capacity < spotsFilled(state.signups, opportunity.id)) return state;
    return { ...state, opportunities: state.opportunities.map(item => item.id === opportunity.id
      ? { ...item, ...values, id: item.id, organizationId: item.organizationId } : item) };
  }

  if (action.type === 'deleteOpportunity' && opportunity.organizationId === state.organization.id) {
    const removed = new Set([opportunity.id, ...state.opportunities.filter(item => item.parentId === opportunity.id).map(item => item.id)]);
    return { ...state, opportunities: state.opportunities.filter(item => !removed.has(item.id)),
      signups: state.signups.filter(item => !removed.has(item.opportunityId)) };
  }

  if (action.type === 'join') {
    const alreadyJoined = state.signups.some(item =>
      item.opportunityId === opportunity.id && item.volunteerId === state.volunteer.id
    );
    if (full || alreadyJoined || !isPublished(opportunity, state.opportunities)) return state;

    const status = opportunity.signup === 'approval' ? 'Pending' : 'Reserved';
    return {
      ...state,
      signups: [...state.signups, { opportunityId: opportunity.id, volunteerId: state.volunteer.id, volunteer: state.volunteer.name, status }],
    };
  }

  if (action.type === 'leave' && opportunity.kind === 'shift') {
    return {
      ...state,
      signups: state.signups.filter(item =>
        item.opportunityId !== opportunity.id || item.volunteerId !== state.volunteer.id || item.status === 'Declined'
      ),
    };
  }

  if (action.type === 'review' && opportunity.organizationId === state.organization.id
    && (action.status === 'Declined' || (action.status === 'Accepted' && !full))) {
    return {
      ...state,
      signups: state.signups.map(item =>
        item.opportunityId === opportunity.id && item.volunteerId === action.volunteerId && item.status === 'Pending'
          ? { ...item, status: action.status }
          : item
      ),
    };
  }

  return state;
}

export function isPublished(item, opportunities) {
  const visible = record => record && record.status !== 'Draft' && record.status !== 'Closed';
  return visible(item) && (!item.parentId || visible(opportunities.find(parent => parent.id === item.parentId)));
}
