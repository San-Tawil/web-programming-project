// Phase 1 mock listings. The IDs can carry over to the team's shared opportunity data.
const listings = [
  { id: 'coastal-cleanup', cause: 'Environment', title: 'Coastal cleanup', location: 'Ramlet el Baida, Beirut', time: '2 hours · One shift', description: 'Walk the shoreline with a small team, collect litter, and sort recyclables at the end of the shift.', bring: 'Water, sun protection, and closed-toe shoes.' },
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
  organizationProfiles: {},
  volunteer,
  plannedByVolunteer: {},
  hoursByVolunteer: {},
  opportunities: [
    ...listings.map((listing, index) => ({
      ...listing,
      kind: 'shift',
      date: demoDate(5 + index),
      startTime: '09:00',
      endTime: '11:00',
      ...times[listing.id],
      capacity: 8,
      organizationId: organization.id,
      organizer: organization.name,
      signup: listing.id === 'homework-club' ? 'approval' : 'open',
    })),
    {
      id: 'community-tutoring',
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

function demoDate(daysFromToday) {
  const date = new Date();
  date.setDate(date.getDate() + daysFromToday);
  return date.toLocaleDateString('sv-SE');
}

export function isClosed(listing) {
  return Boolean(listing.cancelled) || Boolean(listing.date && new Date(`${listing.date}T${listing.startTime}`) <= new Date());
}

export function listingScheduleError(listing, parent) {
  const start = new Date(`${listing.date}T${listing.startTime}`);
  const end = new Date(`${listing.date}T${listing.endTime}`);
  if (!Number.isFinite(+start) || start <= new Date()) return 'Choose a date and start time in the future.';
  if (!Number.isFinite(+end) || end <= start) return 'End time must be after the start time.';
  if (parent?.date && start < new Date(`${parent.date}T${parent.startTime}`)) return 'A shift cannot start before its program.';
  return '';
}

export function listingStatus(listing, signups) {
  if (listing.cancelled) return 'Cancelled';
  if (isClosed(listing)) return 'Closed';
  return spotsFilled(signups, listing.id) >= listing.capacity ? 'Full' : 'Open';
}

function signupLabel(listing) {
  if (listing.signup === 'approval') return 'Apply for approval';
  return listing.kind === 'shift' ? 'Reserve a spot' : 'Join opportunity';
}

export function signupAction(listing, status, availability) {
  const pending = status === 'Pending';
  const reserved = listing.kind === 'shift' && isConfirmed({ status });
  if (pending || reserved) {
    return {
      type: 'leave',
      label: pending ? 'Withdraw application' : 'Cancel reservation',
      disabled: availability === 'Closed' || availability === 'Cancelled',
    };
  }
  return {
    type: 'join',
    label: signupLabel(listing),
    disabled: Boolean(status) || availability !== 'Open',
  };
}

export function isConfirmed({ status }) {
  return status === 'Reserved' || status === 'Accepted';
}

export function spotsFilled(signups, opportunityId) {
  return signups.filter(signup => signup.opportunityId === opportunityId && isConfirmed(signup)).length;
}

export function demoReducer(state, action) {
  if (action.type === 'selectOrganization') {
    const profile = state.organizationProfiles[action.organization.id] ?? action.organization;
    return { ...state, organization: profile };
  }

  if (action.type === 'logHours' || action.type === 'removeHours') {
    const id = state.volunteer.id;
    const entries = state.hoursByVolunteer[id] ?? [];
    const { entry } = action;
    if (action.type === 'logHours' && (!entry.title || !Number.isFinite(entry.hours) || entry.hours <= 0 || entry.hours > 24 ||
      !/^\d{4}-\d{2}-\d{2}$/.test(entry.date) || entry.date > demoDate(0))) return state;
    const updated = action.type === 'logHours' ? [...entries, entry] : entries.filter(item => item.id !== action.id);
    return { ...state, hoursByVolunteer: { ...state.hoursByVolunteer, [id]: updated } };
  }

  if (action.type === 'updateProfile') {
    const { role, changes } = action;
    if (role === 'organization') {
      const profile = { ...state.organization, ...changes, id: state.organization.id };
      return {
        ...state,
        organization: profile,
        organizationProfiles: { ...state.organizationProfiles, [profile.id]: profile },
        opportunities: state.opportunities.map(item =>
          item.organizationId === profile.id ? { ...item, organizer: profile.name } : item
        ),
      };
    }
    return {
      ...state,
      volunteer: { ...state.volunteer, ...changes },
      signups: state.signups.map(signup =>
        signup.volunteerId === state.volunteer.id ? { ...signup, volunteer: changes.name } : signup
      ),
    };
  }

  if (action.type === 'selectVolunteer') {
    return { ...state, volunteer: action.volunteer };
  }

  if (action.type === 'post') {
    const { parentId } = action.opportunity;
    const parent = state.opportunities.find(item =>
      item.id === parentId && item.kind === 'opportunity' && item.organizationId === state.organization.id
    );
    if ((parentId && !parent) || listingScheduleError(action.opportunity, parent)) return state;
    const opportunity = {
      ...action.opportunity,
      id: `demo-${state.opportunities.length}`,
      organizationId: state.organization.id,
      organizer: state.organization.name,
    };
    return { ...state, opportunities: [...state.opportunities, opportunity] };
  }

  const opportunity = state.opportunities.find(item => item.id === action.opportunityId);
  if (!opportunity) return state;
  const filled = spotsFilled(state.signups, opportunity.id);
  const full = filled >= opportunity.capacity;
  const closed = isClosed(opportunity);

  if (action.type === 'togglePlan') {
    if (opportunity.kind !== 'shift' || closed) return state;
    const planned = state.plannedByVolunteer[state.volunteer.id] ?? [];
    const updated = planned.includes(opportunity.id)
      ? planned.filter(id => id !== opportunity.id)
      : [...planned, opportunity.id];
    return { ...state, plannedByVolunteer: { ...state.plannedByVolunteer, [state.volunteer.id]: updated } };
  }

  if (action.type === 'editShift' || action.type === 'cancelShift') {
    if (closed || opportunity.kind !== 'shift' || opportunity.organizationId !== state.organization.id) return state;
    const updated = action.type === 'cancelShift' ? { ...opportunity, cancelled: true } : { ...opportunity, ...action.changes };
    const parent = state.opportunities.find(item =>
      item.id === updated.parentId && item.kind === 'opportunity' && item.organizationId === state.organization.id
    );
    if (action.type === 'editShift' && (updated.capacity < filled || (updated.parentId && !parent) ||
      listingScheduleError(updated, parent))) return state;
    return { ...state, opportunities: state.opportunities.map(item => item.id === opportunity.id ? updated : item) };
  }

  if (action.type === 'join') {
    const alreadyJoined = state.signups.some(item =>
      item.opportunityId === opportunity.id && item.volunteerId === state.volunteer.id
    );
    if (closed || full || alreadyJoined) return state;

    const status = opportunity.signup === 'approval' ? 'Pending' : 'Reserved';
    return {
      ...state,
      signups: [...state.signups, { opportunityId: opportunity.id, volunteerId: state.volunteer.id, volunteer: state.volunteer.name, status }],
    };
  }

  if (action.type === 'leave' && !closed) {
    return {
      ...state,
      signups: state.signups.filter(item =>
        item.opportunityId !== opportunity.id || item.volunteerId !== state.volunteer.id ||
        !(item.status === 'Pending' || (opportunity.kind === 'shift' && isConfirmed(item)))
      ),
    };
  }

  if (action.type === 'review' && !closed && opportunity.organizationId === state.organization.id
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
