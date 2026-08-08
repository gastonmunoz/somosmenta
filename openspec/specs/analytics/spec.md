## Purpose

Tracks visitor behavior on the marketing site via Google Analytics (GA4) so the client can measure traffic and conversions.

## Requirements

### Requirement: GA4 tag loads on every page
The system SHALL load the Google Analytics gtag.js library with measurement ID `G-55BLPGG5BT` on every page of the site.

#### Scenario: Visitor loads the homepage
- **WHEN** a visitor requests any page of the site
- **THEN** the page response includes the gtag.js script tag pointing to `https://www.googletagmanager.com/gtag/js?id=G-55BLPGG5BT`
- **THEN** `gtag('config', 'G-55BLPGG5BT')` is called, initializing page view tracking

### Requirement: Analytics script does not block rendering
The system SHALL load the analytics script in a way that does not delay the page's initial interactive render.

#### Scenario: Page load performance
- **WHEN** the page loads
- **THEN** the gtag.js script loads asynchronously and does not block parsing of the main document
