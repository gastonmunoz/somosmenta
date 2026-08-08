## Purpose

Protects Calton from unbounded cost and abuse exposure on its public, unauthenticated API surface by enforcing input limits and rate limits before any paid or side-effecting work happens.

## ADDED Requirements

### Requirement: Request validation on public API routes
The system SHALL validate the shape, type, and size of every request body on `/api/chat`, `/api/generate-brief`, `/api/capture-lead`, and `/api/send-brief` before processing it, rejecting malformed or oversized requests with a 400 response.

#### Scenario: Oversized chat history is rejected
- **WHEN** a client posts a `messages` array exceeding the configured length or per-message character cap to `/api/chat`
- **THEN** the system SHALL reject the request with a 400 response before calling the Anthropic API

#### Scenario: Non-conforming field types are rejected
- **WHEN** a client posts a request body where a field's type does not match its expected schema, such as a non-string `content` value
- **THEN** the system SHALL reject the request with a 400 response

### Requirement: Per-IP rate limiting
The system SHALL enforce a per-IP rate limit on each public API route, returning a 429 response once the limit is exceeded within the configured window.

#### Scenario: Repeated requests from the same client are throttled
- **WHEN** a single client IP exceeds the configured request rate on any of the four public API routes
- **THEN** subsequent requests within the throttling window SHALL receive a 429 response instead of being processed

### Requirement: Bounded AI provider spend per request
The system SHALL cap the maximum characters forwarded to the Anthropic API per request across `/api/chat` and `/api/generate-brief`.

#### Scenario: Conversation exceeding the character budget is rejected
- **WHEN** the cumulative character count of a chat conversation exceeds the configured budget
- **THEN** the system SHALL reject the request rather than forwarding it to the Anthropic API
