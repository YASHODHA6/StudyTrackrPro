# Student Study Tracker - Design Guidelines

## Design Approach

**Selected Approach:** Design System + Productivity App Reference
- **Justification:** As a utility-focused productivity tool for students, this app prioritizes efficiency, clarity, and data visualization over decorative elements. Drawing inspiration from Notion, Todoist, and Google Classroom while maintaining clean, accessible design patterns.
- **Key Principles:** Clean information hierarchy, instant visual feedback, distraction-free data entry, clear progress visualization

## Core Design Elements

### Typography
- **Primary Font:** Inter or DM Sans (Google Fonts) - excellent readability for data-heavy interfaces
- **Heading Hierarchy:**
  - H1 (Dashboard title): text-3xl font-bold
  - H2 (Section headers): text-2xl font-semibold
  - H3 (Card titles): text-lg font-semibold
  - Body text: text-base
  - Small labels/metadata: text-sm
- **Number displays (stats):** Use tabular-nums for consistent alignment of statistics

### Layout System
- **Spacing Units:** Consistent use of 4, 6, 8, and 12 (tailwind units: p-4, p-6, p-8, p-12)
- **Container:** max-w-7xl mx-auto for main content area with px-4 for mobile padding
- **Grid System:** Dashboard uses 3-column grid on desktop (grid-cols-1 md:grid-cols-2 lg:grid-cols-3) for stat cards

### Component Library

**Dashboard Layout:**
- Top header bar with app branding and navigation tabs
- Hero stats section: 3-card grid displaying Total Study Hours, Subjects Tracked, Average Hours/Subject
  - Each stat card: Large number display (text-4xl font-bold), descriptive label below
  - Cards have subtle elevation with rounded corners (rounded-lg)
- Main content area with two-column layout on desktop (forms left, data display right)

**Forms:**
- Study Session Form: Compact horizontal layout with subject input, hours input (number type with step="0.5"), date picker, and submit button
- Todo Form: Single-line input with inline add button
- Feedback Form: Textarea (rows="4") with full-width submit button
- All forms use consistent padding (p-6) and spacing between fields (space-y-4)
- Input fields: Full-width with clear borders, adequate padding (px-4 py-2), rounded corners (rounded-md)
- Labels: Positioned above inputs with font-medium and mb-2

**Data Displays:**
- Study Sessions List: Timeline-style cards showing most recent first
  - Each entry displays: Subject name (bold), hours studied (highlighted), date (muted text)
  - Horizontal layout with subject left-aligned, hours and date right-aligned
- Todo List: Checkbox-style items with delete button on hover/focus
  - Strike-through text for completed items
  - Clean separation between items (border-b)
- Feedback submissions: Confirmation message appears below form after submission

**Navigation:**
- Tab-based navigation for Dashboard, Add Study Session, Todos, Feedback, Report
- Active tab indication with underline or filled background
- Horizontal scroll on mobile if needed, full horizontal layout on desktop

**Buttons:**
- Primary actions (Submit, Add): Prominent styling with adequate padding (px-6 py-2.5)
- Secondary actions (Delete, Download): Subtle styling, icon-based where appropriate
- All buttons: rounded-md, font-medium, with clear hover states
- Report download button: Distinct styling with download icon

**Cards & Containers:**
- Consistent card styling throughout: rounded-lg with subtle shadow
- Header within cards uses border-b for separation
- Adequate internal padding (p-6 or p-8)

**Empty States:**
- When no study sessions exist: Friendly message with call-to-action to add first session
- When todo list is empty: Encouraging message prompting task creation
- Use centered text with supportive icon

### Visual Feedback Elements
- Loading states: Spinner or skeleton screens when fetching data
- Success messages: Toast notifications or inline success text after form submissions
- Error states: Red-tinted alerts with clear error messages below form fields
- Delete confirmations: Smooth fade-out animation when removing todos

### Responsive Behavior
- Mobile (base): Single column layout, stacked stat cards, full-width forms
- Tablet (md): 2-column grid for stats, side-by-side layout begins
- Desktop (lg): 3-column stats grid, optimal two-panel layout for forms and lists
- All touch targets minimum 44px for mobile usability

### Data Visualization
- Study hours: Consider simple bar chart or progress indicators if displaying trends
- Subject breakdown: Use consistent visual treatment for each subject
- Stats cards: Icon + number + label pattern for quick scanning

### Accessibility
- All form inputs have associated labels (not just placeholders)
- Error messages are programmatically linked to inputs
- Focus indicators clearly visible on all interactive elements
- Adequate contrast ratios for all text
- Semantic HTML with proper heading hierarchy

## Images
No hero images required for this productivity application. Focus remains on data and functionality. If adding visual elements, use subtle background patterns or geometric shapes in the header area only.