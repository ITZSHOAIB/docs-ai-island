# Docs AI Island

Docs AI Island gives documentation readers a small, consistent handoff surface for moving the current page into AI-assisted workflows without requiring the documentation site to operate an AI backend.

## Language

**Island**:
The persistent, compact interface from which a reader discovers and invokes documentation handoff actions.
_Avoid_: Chatbot, assistant, agent

**Action**:
A reader-invoked operation offered by the Island, such as copying page content or opening an external AI destination.
_Avoid_: Tool, command, integration

**Page Context**:
The canonical identity and metadata of the documentation page to which an Action applies.
_Avoid_: Payload, document object, page state

**Content Source**:
The authoritative way the Island obtains a machine-readable representation of the current page.
_Avoid_: Provider, scraper, knowledge base

**AI Target**:
An external AI application to which the Island can hand off Page Context.
_Avoid_: Provider, model, backend

**Handoff**:
The transfer of Page Context or page content from the documentation site to a reader-selected destination.
_Avoid_: Chat, inference, answer

**Adapter**:
A bridge that supplies Page Context and lifecycle signals from a documentation framework to the Island.
_Avoid_: Core, theme, renderer

**Preset**:
A reusable selection and ordering of Actions with opinionated defaults for a common documentation workflow.
_Avoid_: Theme, template, adapter
