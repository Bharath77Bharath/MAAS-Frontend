# MAAS Monitoring Portal --- Project Plan

## 1. Project Goal

Build a lightweight, company-branded monitoring frontend called **MAAS**
that visually follows the style of the provided enterprise ticketing
software screenshots.

The frontend will provide the application shell, branding, navigation,
light/dark theme, and page layout. The existing Grafana dashboard will
provide the complete monitoring visualization.

### Architecture

``` text
Zabbix
   ↓
Grafana
   ↓
Full Grafana Dashboard
   ↓
iframe
   ↓
MAAS Frontend
```

For Version 1 there is **no custom backend, API, JavaScript, React, or
other frontend framework**.

Grafana continues to handle:

-   Zabbix data
-   Charts
-   Dashboard variables
-   Time range
-   Refresh
-   Monitoring calculations
-   Dashboard interactions

------------------------------------------------------------------------

## 2. Technology

### Required

-   HTML5
-   CSS3
-   Grafana iframe embedding

### Not required initially

-   JavaScript
-   React
-   Angular
-   Vue
-   Spring Boot
-   Node.js
-   Database
-   Custom REST API

The first version should remain a static frontend.

------------------------------------------------------------------------

## 3. Project Structure

Separate HTML and CSS.

``` text
maas-monitoring-portal/
│
├── index.html
│
├── css/
│   └── style.css
│
├── assets/
│   └── maas-logo.svg
│
└── README.md
```

The supplied MAAS SVG should be saved as:

``` text
assets/maas-logo.svg
```

CSS must remain in `css/style.css`; do not put a large `<style>` block
inside `index.html`.

------------------------------------------------------------------------

## 4. Branding

### Brand

**Name:** MAAS

### Logo

Use the supplied SVG logo.

### Primary palette

``` text
Primary Green:    #00A651
Secondary Green:  #67C18C
Light Green:      #76C491
Soft Green:       #9BD3AE
```

Green should be used for:

-   Active navigation
-   Buttons
-   Status indicators
-   Selected states
-   Important accents

The overall interface should remain mostly neutral.

------------------------------------------------------------------------

## 5. Design Direction

Use the provided ticketing software screenshots as the visual reference.

The design should have:

-   Clean enterprise appearance
-   Left sidebar
-   Compact header
-   Large content area
-   Rounded cards
-   Subtle borders
-   Small shadows
-   Clear typography
-   Green active states
-   Comfortable whitespace
-   Minimal visual clutter

Avoid:

-   Excessive gradients
-   Heavy shadows
-   Too many colors
-   Large decorative elements
-   Recreating Grafana's UI
-   Unnecessary frameworks

------------------------------------------------------------------------

## 6. Application Layout

``` text
┌────────────────────────────────────────────────────────────┐
│ MAAS                                  Theme  Notifications │
├───────────────┬────────────────────────────────────────────┤
│               │                                            │
│ MAAS LOGO     │ Monitoring                                 │
│               │ Infrastructure monitoring and health       │
│ Dashboard     │                                            │
│ Monitoring    │ ┌────────────────────────────────────────┐ │
│ Servers       │ │                                        │ │
│ Alerts        │ │       FULL GRAFANA DASHBOARD           │ │
│ Tickets       │ │                                        │ │
│               │ │       Executive Summary                │ │
│               │ │       CPU / Memory / Disk              │ │
│               │ │       Server Inventory                 │ │
│               │ │       Alerts                           │ │
│               │ │                                        │ │
│               │ └────────────────────────────────────────┘ │
│ User/Profile  │                                            │
└───────────────┴────────────────────────────────────────────┘
```

------------------------------------------------------------------------

## 7. Header

The header should contain:

### Left

-   MAAS logo
-   MAAS name

### Right

-   Light/dark theme control
-   Notification placeholder
-   User/profile placeholder

Keep the header compact, similar to the reference applications.

------------------------------------------------------------------------

## 8. Sidebar

Navigation:

``` text
Dashboard
Monitoring
Servers
Alerts
Tickets
```

Only **Monitoring** needs to be functional initially.

Other pages can be visual placeholders.

The active navigation item should use:

-   Green text/icon
-   Light green background in light mode
-   Green-tinted dark background in dark mode
-   Rounded corners

------------------------------------------------------------------------

## 9. Monitoring Page

Page title:

``` text
Monitoring
```

Subtitle:

``` text
Infrastructure monitoring and server health overview
```

The main content is the complete Grafana dashboard.

Do **not** recreate Grafana graphs in HTML/CSS.

------------------------------------------------------------------------

## 10. Grafana Integration

The existing Grafana dashboard is:

``` text
https://dashboard.hamms.space/d/hamms-cloud-monitoring-combined/hamms-test-v2
```

The working embedding configuration is:

``` text
kiosk
hideLogo=true
```

Therefore the iframe URL must preserve:

``` text
&kiosk&hideLogo=true
```

This configuration:

-   Hides Grafana navigation
-   Hides Grafana branding/footer
-   Displays the full dashboard
-   Keeps the existing Zabbix → Grafana monitoring flow

### Iframe structure

``` html
<div class="grafana-container">
    <iframe
        class="grafana-dashboard"
        src="GRAFANA_DASHBOARD_URL"
        title="MAAS Monitoring Dashboard">
    </iframe>
</div>
```

The URL must retain the existing dashboard variables, filters, time
range, and refresh configuration.

Current important variables include:

``` text
var-hostgroup=Muthoot-Exim
var-hostname=$__all
var-os_type=Linux
refresh=30s
```

------------------------------------------------------------------------

## 11. Grafana Container Styling

The iframe should:

-   Fill the main content area
-   Have no border
-   Have rounded corners
-   Have sufficient height for the complete dashboard
-   Be responsive

Example starting point:

``` css
.grafana-dashboard {
    width: 100%;
    min-height: 900px;
    border: none;
    border-radius: 12px;
}
```

Adjust the height after testing against the real dashboard.

------------------------------------------------------------------------

## 12. Light Mode

Light mode should resemble the supplied ticketing application.

Suggested colors:

``` text
Background:       #F5F7FA
Surface:          #FFFFFF
Primary Text:     #1F2937
Secondary Text:   #6B7280
Border:           #E5E7EB
Primary Green:    #00A651
Light Green:      #E8F7EE
```

Visual characteristics:

-   White sidebar
-   White cards
-   Very light gray background
-   Subtle borders
-   Small shadows
-   Green active navigation
-   Dark text
-   Large whitespace

------------------------------------------------------------------------

## 13. Dark Mode

Suggested colors:

``` text
Background:       #0F141A
Surface:          #171D24
Surface Alt:      #1E252D
Primary Text:     #F3F4F6
Secondary Text:   #9CA3AF
Border:           #2D3742
Primary Green:    #00A651
Green Soft:       #123B27
```

Visual characteristics:

-   Dark sidebar
-   Dark content background
-   Slightly lighter cards
-   Green active states
-   Light text
-   Subtle borders

------------------------------------------------------------------------

## 14. CSS-Only Theme Toggle

Version 1 must not use JavaScript.

Use a hidden checkbox and label to switch CSS variables.

Concept:

``` html
<input type="checkbox" id="theme-toggle">
<label for="theme-toggle">Theme</label>
```

Use CSS custom properties:

``` css
:root {
    --bg: #f5f7fa;
    --surface: #ffffff;
    --text: #1f2937;
}

#theme-toggle:checked ~ .app {
    --bg: #0f141a;
    --surface: #171d24;
    --text: #f3f4f6;
}
```

The exact selector should match the final HTML structure.

### Limitation

The CSS-only theme switch controls the **MAAS frontend**, not the
Grafana iframe.

The iframe is a separate document/origin, so the parent CSS cannot
change Grafana's internal theme.

For Version 1:

``` text
MAAS Light → MAAS UI becomes light
MAAS Dark  → MAAS UI becomes dark
Grafana    → keeps its configured dashboard theme
```

Synchronized Grafana theme switching can be added later if JavaScript
becomes acceptable.

------------------------------------------------------------------------

## 15. Pages

### Dashboard

Visual placeholder.

### Monitoring

Functional page containing the full Grafana dashboard.

### Servers

Visual placeholder.

### Alerts

Visual placeholder.

### Tickets

Visual placeholder.

The goal is to establish the complete application shell before
implementing additional functionality.

------------------------------------------------------------------------

## 16. Responsive Design

Primary targets:

``` text
1366 × 768
1440 × 900
1920 × 1080
```

Also support tablet and mobile layouts.

Desktop:

-   Fixed/narrow sidebar
-   Large main content
-   Full Grafana iframe

Tablet:

-   Reduced sidebar width
-   Smaller spacing

Mobile:

-   Simplified sidebar
-   Single-column content
-   Responsive iframe

Since Version 1 uses no JavaScript, mobile navigation can remain a
CSS-based simplified layout.

------------------------------------------------------------------------

## 17. Accessibility

Use semantic HTML:

``` html
<header>
<nav>
<aside>
<main>
<section>
<footer>
```

The iframe must have:

``` html
title="MAAS Monitoring Dashboard"
```

The theme toggle must have a visible accessible label.

Ensure sufficient contrast in both themes.

Navigation must be keyboard accessible.

------------------------------------------------------------------------

## 18. Development Phases

### Phase 1 --- Setup

-   [ ] Create `maas-monitoring-portal`
-   [ ] Create `index.html`
-   [ ] Create `css/style.css`
-   [ ] Create `assets/maas-logo.svg`
-   [ ] Link stylesheet
-   [ ] Verify page loads

### Phase 2 --- Application Shell

-   [ ] Build header
-   [ ] Add MAAS logo
-   [ ] Add MAAS name
-   [ ] Build sidebar
-   [ ] Add navigation
-   [ ] Build main content
-   [ ] Add footer
-   [ ] Add responsive layout

### Phase 3 --- Branding

-   [ ] Apply MAAS green palette
-   [ ] Add supplied SVG
-   [ ] Establish typography
-   [ ] Establish spacing
-   [ ] Create card styles
-   [ ] Create active navigation states
-   [ ] Create status styles

### Phase 4 --- Light Mode

-   [ ] Define CSS variables
-   [ ] Build light theme
-   [ ] Style sidebar
-   [ ] Style header
-   [ ] Style cards
-   [ ] Style footer
-   [ ] Check contrast

### Phase 5 --- Dark Mode

-   [ ] Define dark variables
-   [ ] Add CSS-only toggle
-   [ ] Test every component
-   [ ] Check navigation visibility
-   [ ] Check text contrast

### Phase 6 --- Grafana

-   [ ] Add iframe
-   [ ] Use complete dashboard URL
-   [ ] Add `kiosk`
-   [ ] Add `hideLogo=true`
-   [ ] Preserve dashboard filters
-   [ ] Preserve 30-second refresh
-   [ ] Test authentication
-   [ ] Test dashboard scrolling
-   [ ] Test iframe sizing

### Phase 7 --- Visual Refinement

-   [ ] Match ticketing software style
-   [ ] Improve spacing
-   [ ] Improve typography
-   [ ] Refine sidebar
-   [ ] Refine theme switch
-   [ ] Refine iframe container
-   [ ] Add subtle hover states
-   [ ] Test desktop resolutions

### Phase 8 --- Final Testing

-   [ ] Light mode
-   [ ] Dark mode
-   [ ] Grafana authentication
-   [ ] Grafana refresh
-   [ ] Dashboard filters
-   [ ] iframe resizing
-   [ ] Browser refresh
-   [ ] Chrome
-   [ ] Edge
-   [ ] Verify Grafana navigation is hidden
-   [ ] Verify Powered by Grafana is hidden

------------------------------------------------------------------------

## 19. Future Enhancements

Only after Version 1 is complete:

### Optional JavaScript

-   Interactive sidebar
-   Theme persistence
-   Mobile menu
-   Active navigation
-   User menu
-   Notifications

### Optional Backend

If later required:

``` text
Spring Boot
     ↓
Zabbix API
```

This would allow MAAS to retrieve monitoring data directly.

### Optional Custom Widgets

Later, MAAS could display its own:

``` text
CPU
Memory
Disk
Network
Server Status
Alerts
```

without relying on Grafana for those individual components.

------------------------------------------------------------------------

## 20. Version 1 Definition of Done

The project is complete when:

-   [ ] MAAS branding is visible
-   [ ] Supplied MAAS logo is used
-   [ ] HTML and CSS are separated
-   [ ] No React is used
-   [ ] No JavaScript is required
-   [ ] No custom backend is required
-   [ ] Light mode works
-   [ ] Dark mode works
-   [ ] Sidebar resembles the reference ticketing software
-   [ ] Header and footer are custom MAAS UI
-   [ ] Full Grafana dashboard is embedded
-   [ ] Grafana navigation is hidden
-   [ ] Powered by Grafana is hidden using `hideLogo=true`
-   [ ] Grafana authentication works
-   [ ] Zabbix data remains live through Grafana
-   [ ] Dashboard filters continue to work
-   [ ] 30-second Grafana refresh continues to work
-   [ ] Layout works on common desktop resolutions

------------------------------------------------------------------------

## 21. Final Version 1 Architecture

``` text
                    MAAS MONITORING PORTAL

┌──────────────────────────────────────────────────────────────┐
│ MAAS                                  Theme  Notifications   │
├───────────────┬──────────────────────────────────────────────┤
│               │                                              │
│ MAAS LOGO     │ Monitoring                                   │
│               │ Infrastructure monitoring and server health  │
│ Dashboard     │                                              │
│ Monitoring    │ ┌──────────────────────────────────────────┐ │
│ Servers       │ │                                          │ │
│ Alerts        │ │       FULL GRAFANA DASHBOARD             │ │
│ Tickets       │ │                                          │ │
│               │ │       Zabbix Monitoring Data             │ │
│               │ │                                          │ │
│               │ │       Executive Summary                  │ │
│               │ │       CPU / Memory / Disk                │ │
│               │ │       Server Inventory                   │ │
│               │ │       Alerts                             │ │
│               │ │                                          │ │
│               │ └──────────────────────────────────────────┘ │
│               │                                              │
└───────────────┴──────────────────────────────────────────────┘

Zabbix → Grafana → iframe → MAAS Frontend
```

The first version intentionally keeps the stack simple so the project
can be completed quickly and polished before adding application logic.
