## Purpose

Ensures the marketing site is operable and perceivable by users of assistive technology and keyboard-only input, meeting WCAG 2.2 AA across the page.

## ADDED Requirements

### Requirement: Visible focus indicators meet contrast minimums
Every interactive element's focus indicator SHALL have a contrast ratio of at least 3:1 against its adjacent background, per WCAG 1.4.11.

#### Scenario: Keyboard focus is visible on light and dark backgrounds
- **WHEN** a user tabs to any button, link, or form field on the page
- **THEN** the focus indicator SHALL be clearly visible with sufficient contrast against its background, regardless of section

### Requirement: Landmark structure is preserved
The page's `<header>` and `<footer>` SHALL expose their implicit `banner` and `contentinfo` landmark roles.

#### Scenario: Header and footer are reachable via landmark navigation
- **WHEN** a screen reader user opens the landmarks list
- **THEN** `banner` and `contentinfo` landmarks SHALL both be present

### Requirement: Section content is reachable via heading navigation
Every major page section SHALL expose its title as a semantic heading element.

#### Scenario: All sections appear in the heading outline
- **WHEN** a screen reader user navigates the page by heading
- **THEN** every section with a visible title, including About and Manifiesto, SHALL appear in the heading list

### Requirement: Form controls are programmatically labeled
Every form input SHALL have a programmatically associated label, via `<label for>`/`id` pairing, `aria-label`, or `aria-labelledby`.

#### Scenario: Wizard fields announce their purpose
- **WHEN** a screen reader user focuses any wizard input, including event type, attendee count, date, budget, and contact fields
- **THEN** the field's accessible name SHALL describe its purpose

### Requirement: Custom interactive controls are keyboard operable
Any element that responds to a pointer interaction to change page state, such as the Services item selector or wizard choice buttons, SHALL also respond to keyboard activation and expose its state via ARIA.

#### Scenario: Services items are selectable by keyboard
- **WHEN** a keyboard user tabs to a service item and presses Enter or Space
- **THEN** the same selection behavior SHALL occur as on click, and the active state SHALL be exposed to assistive technology

### Requirement: Dynamic content updates are announced
Asynchronous content updates the user did not directly trigger via a visible, focused action, such as new chatbot messages, SHALL be exposed via an ARIA live region.

#### Scenario: New chat replies are announced
- **WHEN** the chatbot returns a new message while the user's focus remains on the input
- **THEN** the message SHALL be announced via an `aria-live` region

### Requirement: Autoplaying media provides a pause control
Any autoplaying, looping video content SHALL provide a visible mechanism to pause or stop it.

#### Scenario: Hero video can be paused
- **WHEN** the hero section's autoplaying video is visible
- **THEN** the user SHALL have a way to pause it without needing browser-level media controls
