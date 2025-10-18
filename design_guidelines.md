# Design Guidelines: Interactive Science Learning Platform

## Design Approach

**Selected Framework:** Design System Approach with Educational Platform Influences

**Primary References:** Khan Academy (structured learning), Duolingo (engagement), Notion (content organization)

**Core Principle:** Create a clean, distraction-free learning environment that builds confidence through clarity and accessibility. Prioritize readability, intuitive navigation, and seamless content discovery.

---

## Color Palette

**Primary Colors:**
- **Light Mode Primary:** 210 95% 45% (Trust blue - headers, primary actions)
- **Dark Mode Primary:** 210 90% 55% (Slightly brighter for contrast)
- **Primary Hover:** 210 95% 38%

**Accent Colors (Subject Differentiation):**
- **Physics:** 280 60% 55% (Purple)
- **Chemistry:** 160 65% 45% (Teal-green)  
- **Biology:** 135 55% 50% (Green)
- **General Science:** 200 70% 50% (Cyan)

**Neutral Palette:**
- **Light Mode Background:** 0 0% 98%
- **Light Mode Surface:** 0 0% 100%
- **Dark Mode Background:** 220 15% 12%
- **Dark Mode Surface:** 220 12% 16%
- **Text Primary (Light):** 220 15% 20%
- **Text Primary (Dark):** 210 10% 95%
- **Text Secondary:** 50% opacity of primary

**Feedback Colors:**
- **Success:** 145 65% 45% (Correct answers)
- **Error:** 0 75% 55% (Incorrect answers)
- **Warning:** 40 95% 55% (Incomplete sections)

---

## Typography

**Font Families:**
- **Primary:** Inter (via Google Fonts) - UI, body text, navigation
- **Headings:** Inter (same family for cohesion, varying weights)
- **Code/Formulas:** JetBrains Mono (for scientific notation, equations)

**Type Scale:**
- **Hero/Page Title:** text-4xl md:text-5xl, font-bold
- **Section Headers:** text-2xl md:text-3xl, font-semibold
- **Card Titles:** text-lg md:text-xl, font-semibold
- **Body Text:** text-base, font-normal, leading-relaxed
- **Small Text/Metadata:** text-sm, text-secondary
- **Button Text:** text-sm md:text-base, font-medium

---

## Layout System

**Spacing Primitives:** Consistent use of Tailwind units 2, 4, 6, 8, 12, 16, 24
- **Tight spacing:** p-2, gap-2 (compact lists, tags)
- **Standard spacing:** p-4, p-6, gap-4 (cards, components)
- **Section spacing:** py-12, py-16, py-24 (vertical rhythm)
- **Generous spacing:** p-8, gap-8 (feature areas, important content)

**Grid Systems:**
- **Dashboard Layout:** 12-column grid
- **Content Cards:** grid-cols-1 md:grid-cols-2 lg:grid-cols-3
- **Subject Navigation:** grid-cols-2 md:grid-cols-4
- **Exercise Layout:** Single column max-w-4xl for focused learning

**Container Widths:**
- **Dashboard/Main:** max-w-7xl mx-auto
- **Content Reading:** max-w-4xl mx-auto
- **Exercise Area:** max-w-3xl mx-auto

---

## Component Library

**Navigation:**
- **Top Bar:** Fixed header with logo, search, notifications, profile
- **Sidebar (Desktop):** Collapsible left sidebar with subject categories, progress tracking
- **Mobile Nav:** Bottom tab bar with primary sections (Home, Subjects, Progress, Profile)

**Content Cards:**
- **Lesson Cards:** Rounded-lg border, hover:shadow-lg transition, subject color accent on left border-l-4
- **Exercise Cards:** Interactive states (incomplete/in-progress/completed) with checkmark badges
- **Progress Cards:** Visual progress bars, completion percentages, next-up indicators

**Learning Components:**
- **Video Player:** Custom controls, playback speed, transcript toggle
- **Quiz Interface:** Question display with multiple choice, true/false, fill-in-blank options
- **Formula Renderer:** Math notation support with clear contrast
- **Interactive Diagrams:** Clickable/hoverable labels, zoom capabilities

**Forms & Inputs:**
- **Search Bar:** Prominent with icon, auto-suggestions dropdown
- **Answer Inputs:** Large touch targets, clear validation states
- **Filters:** Checkbox groups, subject tags, difficulty levels

**Data Displays:**
- **Progress Dashboard:** Circular progress indicators, bar charts for topic mastery
- **Achievement Badges:** Icon-based with tooltips, earned/locked states
- **Streak Counter:** Motivational daily streak tracker
- **Grade Tracker:** Performance over time graphs

**Overlays:**
- **Modal Dialogs:** Lesson details, achievement unlocks, settings
- **Tooltips:** Helpful hints, term definitions (hover/tap)
- **Notifications:** Toast messages for achievements, reminders

---

## Key UI Patterns

**Dashboard Homepage:**
- Welcome header with student name and current streak
- "Continue Learning" section with last accessed lessons
- Subject overview cards grid (4 columns desktop, 2 mobile)
- Upcoming quizzes/deadlines timeline
- Achievement showcase area

**Subject Pages:**
- Hero banner with subject icon and gradient (using subject accent color)
- Topic navigation tabs (KS3, GCSE, A-Level filters)
- Lesson card grid with completion status
- Progress summary sidebar

**Lesson View:**
- Breadcrumb navigation
- Content area with mixed media (text, images, videos)
- Side panel with table of contents and related topics
- Bottom navigation (Previous/Next lesson buttons)
- Practice exercise CTA

**Quiz Interface:**
- Question counter and timer
- Large, readable question text
- Answer options with clear hover states
- Submit button with confirmation
- Immediate feedback with explanations
- Results summary with score and review option

---

## Accessibility & Responsiveness

- Minimum contrast ratio 4.5:1 for all text
- Form inputs with visible focus states (ring-2 ring-primary)
- Keyboard navigation support throughout
- Screen reader labels for all interactive elements
- Mobile-first responsive breakpoints: sm:640px, md:768px, lg:1024px, xl:1280px
- Touch targets minimum 44x44px on mobile
- Dark mode toggle with persistent user preference

---

## Images

**Hero Image:** Yes - A vibrant, inspiring image of diverse students engaged in science learning (laboratory setting, collaborative study, or experimentation). Place on homepage hero section with overlay gradient for text readability.

**Subject Icons:** Use icon library (Heroicons) for subject differentiation - beaker (chemistry), atom (physics), leaf (biology), telescope (general science)

**Lesson Thumbnails:** Placeholder for educational content images - diagrams, charts, concept illustrations

**Empty States:** Friendly illustrations when no content available (e.g., "Start your first lesson")

---

## Animation & Interaction

Minimal, purposeful animations only:
- Page transitions: Subtle fade-in for content areas (200ms)
- Card hover: Slight elevation change (shadow transition)
- Progress indicators: Smooth bar fills when updating
- Achievement unlocks: Brief celebratory animation (confetti effect)
- Loading states: Skeleton screens for content fetching

**No autoplay animations, no distracting motion**