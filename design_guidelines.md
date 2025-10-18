# Design Guidelines: ClickUp OAuth Authentication Application

## Design Approach
**System-Based Approach** inspired by modern productivity tools (Linear, Notion, GitHub) - prioritizing clarity, efficiency, and tech-focused aesthetics. This utility application emphasizes clean authentication flows and readable profile data display.

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 217 19% 12% (deep navy-gray)
- Surface: 217 19% 15% (elevated cards/panels)
- Border: 217 10% 25% (subtle dividers)
- Primary: 213 94% 68% (ClickUp-inspired blue)
- Primary Hover: 213 94% 75%
- Text Primary: 0 0% 98%
- Text Secondary: 217 10% 70%
- Success: 142 76% 56% (OAuth success states)
- Error: 0 84% 60%

**Light Mode:**
- Background: 0 0% 100%
- Surface: 0 0% 98%
- Border: 220 13% 91%
- Primary: 213 94% 58%
- Text Primary: 217 19% 12%
- Text Secondary: 217 10% 40%

### B. Typography
- **Primary Font**: Inter (Google Fonts)
- **Monospace**: JetBrains Mono (for tokens/IDs)
- **Hierarchy**:
  - Headings: font-semibold, tracking-tight
  - Body: font-normal, leading-relaxed
  - Labels: font-medium, text-sm, uppercase tracking-wide

### C. Layout System
**Spacing Units**: Primarily use 2, 4, 6, 8, 12, 16 units
- Component padding: p-6 to p-8
- Section spacing: space-y-6 to space-y-8
- Container max-width: max-w-2xl for auth, max-w-4xl for dashboard

### D. Component Library

**Authentication Page:**
- Centered card layout (max-w-md)
- ClickUp logo/branding at top
- Prominent OAuth button with ClickUp purple accent
- Clean white card on dark background
- Subtle loading states during OAuth flow

**Profile Dashboard:**
- Header: User avatar (circular, 80px), name (text-2xl font-bold), email (text-muted)
- Main content: Card-based layout with labeled sections
- Information grid: 2-column on desktop, 1-column mobile
- Data labels: Uppercase, small, muted
- Data values: Regular weight, primary text color
- Workspace info card with proper hierarchy
- Logout button: Secondary style, positioned in header

**Navigation:**
- Minimal top bar with app branding
- User menu dropdown (avatar trigger)
- No complex navigation needed for single-page app

**Data Display Components:**
- Profile cards with subtle borders and backgrounds
- Key-value pairs with clear visual separation
- Monospace font for IDs/tokens (truncated with ellipsis)
- Status badges for OAuth connection state
- Timestamp formatting (relative: "2 hours ago")

### E. Interactions
**Minimal Animations:**
- Button hover: subtle scale (hover:scale-105)
- Card hover: border color change only
- Page transitions: simple fade
- Loading states: spinner, no skeleton screens needed
- OAuth redirect: clean loading indicator

## Implementation Notes
- Single-page application with conditional rendering (login vs. dashboard)
- Session persistence using localStorage/cookies
- Responsive breakpoint: md (768px) for mobile-to-desktop transition
- Focus states for accessibility (ring-2 ring-primary)
- Dark mode default with theme toggle in header
- Error states displayed as toast notifications or inline alerts

## Images
No hero images required. Use:
- ClickUp logo SVG in authentication card header
- User avatar from OAuth data (circular with border)
- Fallback avatar icon if no profile image available
- Optional: Subtle gradient background behind auth card (213 94% 68% to 240 94% 68%, low opacity)

This design prioritizes clarity, security trust signals, and efficient data presentation over visual flair, appropriate for an authentication and profile management utility.