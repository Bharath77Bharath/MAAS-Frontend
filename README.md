# MAAS Monitoring Portal

A lightweight, company-branded monitoring frontend application shell designed to encapsulate and present Grafana dashboards in a cohesive enterprise ticketing portal visual style.

## 🏗️ Architecture

```text
Zabbix (Data Source)
   ↓
Grafana (Visualization Engine)
   ↓
Full Grafana Dashboard (Embedded)
   ↓
iframe (Secure Sandbox Wrapper)
   ↓
MAAS Frontend Shell (HTML5 & CSS3)
```

By encapsulating the dashboard in a custom shell, Grafana handles core monitoring calculations, filters, alerts, and live refresh cycles, while MAAS provides the corporate styling, unified navigation sidebar, and layout theme.

## 🛠️ Technology Stack

- **HTML5**: Semantic tags (`<header>`, `<aside>`, `<main>`, `<footer>`) to promote accessibility.
- **CSS3**: Vanilla stylesheets featuring custom variables (CSS variables), flexbox/grid layout systems, transitions, and media queries for responsive resolutions.
- **CSS-Only Theme Toggle**: A pure CSS theme toggling system using a hidden input checkbox selector trick (`#theme-toggle:checked ~ .app-container`), allowing instant toggling without JavaScript.

## 📂 Project Structure

The project has been structured cleanly to keep layout and visual presentation concerns separated:

```text
Grafana-Iframe-Test/
│
├── index.html            # Main markup and semantic shell layout
│
├── css/
│   └── style.css         # Typography, layout, CSS variables, and light/dark mode styles
│
├── assets/
│   └── maas-logo.svg     # Modern brand logo containing network nodes & pulse wave icon
│
├── plan.md               # Master product plan
└── README.md             # Project documentation (this file)
```

## 🎨 Design Systems & Themes

The portal features two distinct, premium enterprise visual profiles conforming to the primary green brand guidelines:

- **Primary Green Accent**: `#00A651`
- **Secondary Greens**: `#67C18C` / `#76C491`

### Light Theme
Designed to resemble enterprise ticketing and collaboration platforms:
- Background: `#F5F7FA`
- Surfaces & Sidebar: `#FFFFFF`
- Borders: Subtle `#E5E7EB` dividers with soft drop shadows
- Primary Text: `#1F2937` (dark gray)

### Dark Theme
An immersive dark dashboard layout:
- Background: `#0F141A`
- Surfaces & Sidebar: `#171D24`
- Borders: Dark `#2D3742` outlines
- Primary Text: `#F3F4F6` (light gray)

## 📊 Grafana Embedding Integration

The dashboard is integrated through a secure HTML iframe pointing to:
`https://dashboard.hamms.space/d/hamms-cloud-monitoring-combined/hamms-test-v2`

### Integration Query Parameters:
- `kiosk`: Hides Grafana's sidebar navigation and main navigation header.
- `hideLogo=true`: Suppresses the "Powered by Grafana" footer icon.
- `var-hostgroup=Muthoot-Exim`: Applies preset target monitoring client.
- `var-os_type=Linux`: Filters target OS.
- `refresh=30s`: Drives live data refreshes.
- `from=now-15m&to=now`: Sets target time range.

## 🚀 How to Run

Since the application requires no backend or complex compilation, you can load it directly by opening `index.html` in any web browser:
1. Double-click [index.html](file:///c:/Users/bhara/Projects/Grafana-Iframe-Test/index.html) or right-click and select "Open with Browser".
2. Use the toggle button in the header (Sun/Moon icon) to change themes.
3. Resize the window to verify the responsive desktop, tablet, and mobile layouts.
