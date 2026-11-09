# AidConnect dashboards

How can volunteers see what they signed up for, and how can organizations fill and manage their shifts?

## Phase 1 · Course demo

Use sample data and one shared Tailwind layout. Keep the main action next to each page title. On desktop, put the main list next to a smaller summary panel. On mobile, stack the sections.

| Volunteer dashboard | Organization dashboard |
| --- | --- |
| **Browse opportunities** opens the existing catalog. | **Post an opportunity** opens a demo form with title, cause, date, location, capacity, and signup type. |
| **Upcoming shifts** shows confirmed shifts, with the next one first. | **Applications to review** groups pending applicants by opportunity and offers Accept and Decline. |
| **My applications** shows Pending, Accepted, and Declined decisions. | **My opportunities** shows signup type, date, spots filled, and a participant list. |
| **Volunteer hours** shows a sample total, a monthly bar chart, and completed shifts. | **Completed shifts** shows past opportunities and sample attendance. |

### Two signup paths

- **Open signup.** Reserve a spot at the coastal cleanup. It appears under Upcoming shifts immediately.
- **Approval required.** Apply to the homework club. It appears under My applications as Pending. When the organization accepts, it also appears under Upcoming shifts.

Use shared sample data so a decision on the organization dashboard is reflected on the volunteer dashboard during the demo. Demo changes can reset on refresh.

### Hours chart

Use three labeled Tailwind bars, with example totals of **2, 3, and 3 hours**. The headline shows **8 confirmed hours · Sample data**. List the completed shifts below the chart so people can see where the total comes from. Keep the numeric labels visible on mobile and in both themes.

## Phase 2 · Backend and hours logging

Save opportunities, applications, and reservations and restrict access by signed-in role. Let a volunteer enter hours against a completed shift. The organization reviews hours in that shift's participant list. Count only confirmed hours in the chart and total.

## Demo checks

- A volunteer can tell whether an opportunity offers instant signup or requires approval.
- Accepting an applicant updates both dashboards and the filled-spot count.
- The sample hours chart and history add up to the same total.
- A new volunteer can find Browse opportunities from the empty Upcoming shifts section.
