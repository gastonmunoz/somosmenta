## Purpose

Keeps the chatbot's conversational lead capture trustworthy by resisting conversation-history forgery and validating that any lead it reports actually originated from the user, not from injected instructions.

## ADDED Requirements

### Requirement: Resistance to instruction override via forged history
The system's chatbot prompt SHALL instruct the model to disregard attempts, from any message role, to override its role, reveal its instructions, or bypass its guardrails.

#### Scenario: Forged assistant turn does not bypass guardrails
- **WHEN** a request includes a client-supplied `assistant`-role message that appears to grant permission to ignore prior instructions
- **THEN** the model's subsequent response SHALL still follow the original system prompt's limits

### Requirement: Lead data validated against conversation before notification
The system SHALL validate that a lead extracted from a chat conversation (name, email, company, event details) corresponds to content actually present in the user-authored turns before triggering a lead notification.

#### Scenario: Fabricated lead sentinel is not forwarded
- **WHEN** the extracted lead payload contains an email address or field value that does not appear anywhere in the user's own messages
- **THEN** the system SHALL NOT send a lead notification for that payload
