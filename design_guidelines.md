# Note Be — Design Guidelines

## Design Approach

**Selected Approach**: Design System with productivity-focused references
**Primary References**: Notion (information architecture), Linear (clean task aesthetics), Todoist (focused UI patterns)
**Rationale**: Productivity tools demand consistency, learnability, and efficiency over visual experimentation. Users need familiar patterns to maintain focus on their work, not navigate complex interfaces.

## Core Design Principles

1. **Clarity Over Complexity**: Every element serves a functional purpose
2. **Breathing Room**: Generous whitespace prevents cognitive overload
3. **Immediate Hierarchy**: Clear visual distinction between primary and secondary actions
4. **Consistent Spatial Rhythm**: Predictable spacing creates muscle memory
5. **Progressive Disclosure**: Advanced features available but not intrusive

---

## Typography System

**Font Family**: Inter (primary UI), JetBrains Mono (timers/data)

**Hierarchy**:
- **Page Titles**: text-3xl font-semibold (30px)
- **Section Headers**: text-xl font-semibold (20px)
- **Card Titles**: text-lg font-medium (18px)
- **Body Text**: text-base font-normal (16px)
- **Secondary/Meta**: text-sm font-normal (14px)
- **Captions/Labels**: text-xs font-medium uppercase tracking-wide (12px)
- **Timer Display**: text-6xl font-mono font-bold (60px)

**Line Height**: Generous 1.6 for body text, 1.3 for headings

---

## Layout System

**Spacing Primitives**: Tailwind units of **2, 4, 6, 8, 12, 16**
- Micro spacing (gaps between related items): p-2, gap-2
- Standard padding (cards, buttons): p-4, px-6 py-3
- Section spacing: p-6, p-8
- Major sections: py-12, py-16

**Container Strategy**:
- App Shell: max-w-7xl mx-auto (1280px max)
- Reading Content: max-w-3xl (768px for optimal readability)
- Sidebar: Fixed 280px on desktop, full-width drawer on mobile
- Cards: Consistent 24px (p-6) internal padding

**Grid Systems**:
- Notes List: Single column on mobile, 2-column grid on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3)
- Eisenhower Matrix: 2x2 grid (grid-cols-2) at all breakpoints
- Calendar: 7-column grid for days

---

## Component Library

### Navigation
**Sidebar (Desktop)**:
- Fixed left sidebar, 280px width
- Logo/app name at top (py-6 px-6)
- Navigation items with icons (py-3 px-4, rounded-lg)
- Active state with subtle background treatment
- Bottom section for settings/theme toggle

**Mobile Navigation**:
- Bottom tab bar with 4-5 primary sections
- Icons with labels, 60px height
- Hamburger menu for secondary options

### Note Cards
- Rounded corners (rounded-xl, 12px)
- Border treatment for separation
- Internal padding: p-6
- Title: text-lg font-medium, mb-2
- Tag chips: inline-flex items-center px-3 py-1 rounded-full text-xs
- Date/meta: text-sm at bottom
- Hover state: subtle elevation increase (shadow-md → shadow-lg)
- Favorite icon: Absolute positioned top-right

### Buttons
**Primary Action**: 
- px-6 py-3, rounded-lg, font-medium
- Shadow for depth (shadow-sm)

**Secondary Action**:
- px-4 py-2, rounded-lg, border treatment

**Icon Buttons**: 
- p-2, rounded-lg
- 40px × 40px touch target

**Floating Action Button (FAB)**:
- Fixed bottom-right (bottom-8 right-8)
- 56px × 56px circular
- Shadow-xl for elevation

### Forms & Input Fields
**Text Input**:
- px-4 py-3, rounded-lg
- Border treatment with focus state (ring-2)
- Placeholder text using opacity-50

**Textarea (Note Content)**:
- min-h-[200px], resize-y
- Clean, distraction-free editing area
- Auto-save indicator (text-xs) bottom-right

**Tags/Categories**:
- Multi-select chip interface
- Add new tag with inline input
- Removable with × icon

### Calendar Component
**Monthly View**:
- 7-column grid with day headers
- Each day cell: aspect-square or min-h-[80px]
- Current day: border highlight
- Days with notes: dot indicator or badge count
- Hover state shows preview tooltip

**Day Detail View**:
- Slide-up panel or modal
- Date header (text-xl font-semibold)
- List of notes for that day
- Quick add note button

### Productivity Tools

**Pomodoro Timer**:
- Centered circular progress indicator (200px diameter)
- Timer display in center (text-6xl font-mono)
- Start/Pause/Reset buttons below (gap-4)
- Session counter: "Session 3 of 4" (text-sm)
- Settings icon for customization

**Kaizen Tracker**:
- Daily goal input at top (border-b divider)
- Progress visualization: Simple bar or circular progress
- Weekly summary: 7-day grid with completion states
- Small celebration animation on goal completion

**Eisenhower Matrix**:
- 2×2 grid with equal quadrants (gap-4)
- Quadrant headers with labels
- Task input within each quadrant
- Tasks as simple list items with checkboxes
- Drag-and-drop support between quadrants

### Search & Filters
**Search Bar**:
- Prominent position at page top
- Icon prefix (magnifying glass)
- px-4 py-3, rounded-lg
- Instant results dropdown

**Filter Chips**:
- Horizontal scrollable row
- All | Work | Personal | Study (customizable)
- Active filter with distinct treatment
- Clear all option

### Modals & Overlays
**Note Editor (Full Screen on Mobile)**:
- Clean canvas with minimal chrome
- Title input (border-b only)
- Content textarea (borderless, full height)
- Floating toolbar for formatting
- Save/Cancel in header

**Confirmation Dialogs**:
- Centered modal, max-w-md
- p-6 padding
- Clear heading, description, action buttons

---

## Animations

**Use Sparingly**:
- Page transitions: Subtle fade-in (duration-200)
- Card hover: Slight lift with shadow transition (duration-150)
- Button press: Scale down to 0.98 (duration-100)
- Modal entry: Fade + slight scale (duration-300)
- List item addition: Slide-in from top (duration-300)
- **No**: Continuous animations, parallax effects, scroll-triggered surprises

---

## Responsive Strategy

**Breakpoints**:
- Mobile: < 768px (base styles)
- Tablet: 768px - 1024px (md:)
- Desktop: > 1024px (lg:)

**Key Adaptations**:
- Sidebar → Bottom navigation on mobile
- 3-column grid → 2-column → 1-column progressive collapse
- Full-screen modals on mobile, centered overlays on desktop
- Touch targets minimum 44px on mobile

---

## Images

**No hero images needed** - This is a productivity tool, not a marketing site. Focus on functional UI.

**Icon Library**: Heroicons (via CDN) - consistent, clean, productivity-appropriate icons throughout

---

## Accessibility

- Focus states with visible ring (ring-2 ring-offset-2)
- Keyboard navigation for all interactive elements
- ARIA labels for icon-only buttons
- Sufficient contrast ratios maintained
- Screen reader text for status indicators ("Note saved", "Timer running")