## Purpose

Ensures that leads captured through the wizard or chatbot are never lost, giving the sales team a reliable, observable record of every prospect who engages with the site.

## ADDED Requirements

### Requirement: Durable lead persistence
The system SHALL persist every captured lead to a durable store before, or as part of, confirming success to the user, independent of whether the notification email succeeds.

#### Scenario: Lead is recorded even if notification fails
- **WHEN** a user completes the wizard or chatbot lead flow and the notification email fails to send
- **THEN** the lead SHALL still be recorded in the durable store and the failure SHALL be logged for follow-up

### Requirement: Accurate success feedback
The system SHALL NOT show the user a success state for a lead submission unless the lead was actually recorded.

#### Scenario: Submission failure is surfaced to the user
- **WHEN** the lead persistence call fails
- **THEN** the user SHALL see an error state instructing them to retry or contact Calton directly, not the success screen

### Requirement: No self-referential HTTP round-trip for internal lead delivery
The system SHALL deliver lead data captured during a chat conversation to the persistence/notification path via a direct in-process call, not an HTTP request back to its own public origin.

#### Scenario: Chat-captured lead is not forwarded via self-fetch
- **WHEN** the chatbot extracts a complete lead from a conversation
- **THEN** the lead SHALL be handed off in-process, without constructing a request back to the same deployment's public URL
