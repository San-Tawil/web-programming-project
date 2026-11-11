import { initialOpportunities } from './opportunities.js';

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
  volunteerRatings: {},
  volunteer,
  plannedByVolunteer: {},
  hoursByVolunteer: {},
  opportunities: [
    ...listings.map((listing, index) => ({
      ...initialOpportunities.find(item => item.id === listing.id),
      ...listing,
      status: 'Published',
      organization: organization.name,
      kind: 'shift',
      date: demoDate(5 + index),
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
  {
    id: 'completed-garden-day',
    title: 'Neighborhood garden day',
    cause: 'Community support',
    date: '2026-08-22',
    month: 'Aug',
    hours: 2,
    location: 'Sidon, South Lebanon',
    description:
      'Prepare planting beds and water seedlings with neighborhood volunteers.',
  },
  {
    id: 'completed-food-packing',
    title: 'Community food packing',
    cause: 'Food support',
    date: '2026-09-12',
    month: 'Sep',
    hours: 3,
    location: 'Beirut',
    description:
      'Sort pantry staples and assemble grocery boxes for families in the community.',
  },
  {
    id: 'completed-coastal-cleanup',
    title: 'Coastal cleanup',
    cause: 'Environment',
    date: '2026-10-24',
    month: 'Oct',
    hours: 3,
    location: 'Ramlet el Baida, Beirut',
    description:
      'Walk the shoreline with a small team, collect litter, and sort recyclables at the end of the shift.',
  },
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
  return Boolean(listing.cancelled || listing.closed || listing.status === 'Closed' || listing.status === 'Draft') || Boolean(listing.date && new Date(`${listing.date}T${listing.startTime}`) <= new Date());
}

export function listingScheduleError(listing, parent) {
  const start = new Date(`${listing.date}T${listing.startTime}`);
  const end = new Date(`${listing.date}T${listing.endTime}`);
  if (!Number.isFinite(+start) || start <= new Date()) return 'Choose a date and start time in the future.';
  if (!Number.isFinite(+end) || end <= start) return 'End time must be after the start time.';
  if (parent?.date && start < new Date(`${parent.date}T${parent.startTime}`)) return 'A shift cannot start before its program.';
  return '';
}

export function opportunityEditError(opportunity, opportunities) {
  if (!opportunity.date && !opportunity.startTime && !opportunity.endTime) return '';
  const error = listingScheduleError(opportunity);
  if (error) return error;
  const start = new Date(opportunity.date + 'T' + opportunity.startTime);
  if (opportunities.some(item => item.parentId === opportunity.id && !item.cancelled &&
    new Date(item.date + 'T' + item.startTime) < start)) {
    return 'The opportunity cannot start after one of its linked shifts.';
  }
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

  if (action.type === 'rateVolunteer') {
    const { volunteerId, stars } = action;
    const organizationId = state.organization.id;
    const eligible = state.signups.some(signup =>
      signup.volunteerId === volunteerId && isConfirmed(signup) &&
      state.opportunities.some(item => item.id === signup.opportunityId && item.organizationId === organizationId)
    );
    if (!eligible || !Number.isInteger(stars) || stars < 1 || stars > 5) return state;
    return {
      ...state,
      volunteerRatings: {
        ...state.volunteerRatings,
        [volunteerId]: { ...state.volunteerRatings[volunteerId], [organizationId]: stars },
      },
    };
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
          item.organizationId === profile.id ? { ...item, organizer: profile.name, organization: profile.name } : item
        ),
      };
    }
    return {
      ...state,
      volunteer: { ...state.volunteer, ...changes },
      signups: state.signups.map(signup =>
        signup.volunteerId === state.volunteer.id ? {
          ...signup,
          ...changes,
          volunteer: changes.name ?? signup.volunteer,
        } : signup
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
      id: `demo-${crypto.randomUUID()}`,
      status: action.opportunity.status || 'Published',
      city: action.opportunity.city || action.opportunity.location,
      requirements: action.opportunity.requirements || 'Ask the organizer about preparation and meeting details.',
      organization: state.organization.name,
      hours: (new Date(`2000-01-01T${action.opportunity.endTime}`) - new Date(`2000-01-01T${action.opportunity.startTime}`)) / 3600000,
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

  // Organization tools supplement the dashboard actions without changing their contracts.
  if (action.type === 'updateOpportunity' && opportunity.organizationId === state.organization.id) {
    if (isClosed({ ...opportunity, status: 'Published' })) return state;
    const changes = { ...action.values };
    const updated = { ...opportunity, ...changes, id: opportunity.id, organizationId: opportunity.organizationId };
    if (changes.hours && updated.startTime) {
      const [hours, minutes] = updated.startTime.split(':').map(Number);
      const end = hours * 60 + minutes + Number(changes.hours) * 60;
      if (end >= 1440) return state;
      updated.endTime = `${String(Math.floor(end / 60)).padStart(2, '0')}:${String(end % 60).padStart(2, '0')}`;
    }
    const parent = state.opportunities.find(item => item.id === updated.parentId);
    const error = updated.kind === 'shift' ? listingScheduleError(updated, parent) : opportunityEditError(updated, state.opportunities);
    if (updated.capacity < filled || error) return state;
    return { ...state, opportunities: state.opportunities.map(item => item.id === updated.id ? updated : item) };
  }
  if (action.type === 'deleteToolOpportunity' && opportunity.organizationId === state.organization.id) {
    const removed = new Set([opportunity.id, ...state.opportunities.filter(item => item.parentId === opportunity.id).map(item => item.id)]);
    return { ...state, opportunities: state.opportunities.filter(item => !removed.has(item.id)),
      signups: state.signups.filter(item => !removed.has(item.opportunityId)),
      plannedByVolunteer: Object.fromEntries(Object.entries(state.plannedByVolunteer).map(([id, planned]) => [id, planned.filter(item => !removed.has(item))])) };
  }

  if (action.type === 'togglePlan') {
    if (opportunity.kind !== 'shift' || closed) return state;
    const planned = state.plannedByVolunteer[state.volunteer.id] ?? [];
    const updated = planned.includes(opportunity.id)
      ? planned.filter(id => id !== opportunity.id)
      : [...planned, opportunity.id];
    return { ...state, plannedByVolunteer: { ...state.plannedByVolunteer, [state.volunteer.id]: updated } };
  }

  if (['editOpportunity', 'closeOpportunity', 'deleteOpportunity'].includes(action.type)) {
    if (opportunity.kind !== 'opportunity' || opportunity.organizationId !== state.organization.id) return state;
    if (action.type === 'deleteOpportunity') {
      return {
        ...state,
        opportunities: state.opportunities.filter(item => item.id !== opportunity.id).map(item =>
          item.parentId === opportunity.id ? { ...item, parentId: '' } : item
        ),
        signups: state.signups.filter(signup => signup.opportunityId !== opportunity.id),
      };
    }
    if (closed) return state;
    if (action.type === 'closeOpportunity') {
      return { ...state, opportunities: state.opportunities.map(item =>
        item.id === opportunity.id ? { ...item, closed: true } : item
      ) };
    }
    const updated = { ...opportunity, ...action.changes };
    if (updated.capacity < filled || opportunityEditError(updated, state.opportunities)) return state;
    return { ...state, opportunities: state.opportunities.map(item => {
      if (item.id === opportunity.id) return updated;
      if (item.parentId !== opportunity.id) return item;
      return { ...item, cause: updated.cause, location: updated.location, description: updated.description };
    }) };
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
    if (closed || full || alreadyJoined || !isPublished(opportunity, state.opportunities)) return state;

    const status = opportunity.signup === 'approval' ? 'Pending' : 'Reserved';
    return {
      ...state,
      signups: [...state.signups, { opportunityId: opportunity.id, volunteerId: state.volunteer.id, volunteer: state.volunteer.name, phone: state.volunteer.phone, website: state.volunteer.website, location: state.volunteer.location, photo: state.volunteer.photo, cv: state.volunteer.cv, bio: state.volunteer.bio, tags: state.volunteer.tags, status }],
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

export function isPublished(item, opportunities) {
  const visible = record => record && record.status !== 'Draft' && record.status !== 'Closed' && !record.closed && !record.cancelled;
  const parent = opportunities.find(record => record.id === item?.parentId);
  // Dashboard closure stops the program; tools visibility also hides linked shifts.
  const parentVisible = parent && parent.status !== 'Draft' && parent.status !== 'Closed';
  return Boolean(visible(item) && (!item.parentId || parentVisible));
}
