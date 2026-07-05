# Garden Autonomy Visibility Design

## Purpose

Cypher Garden already has a hybrid pet autonomy system: rule-driven world constraints, LLM-assisted action selection, goals, social intent, memories, relationships, event narration, and off-page ticks. The current `/garden` experience does not make that intelligence visible enough. Players mostly see a pixel map, a long selected-pet info panel, and a narrative list.

This phase turns the existing autonomy data into a stronger open-world experience. The goal is to make pets feel like active agents with intentions, moods, relationships, and ongoing off-page lives, without rewriting memory, model providers, or the simulation core.

## Open-World North Star

The long-term product direction is a small-scale pet open world inspired by the systemic feel of games like GTA and Red Dead Redemption, not by their combat, crime, or mission structure. The relevant qualities are:

- autonomous characters who appear to live their own lives when the player is not directly controlling them
- ambient encounters that are discoverable rather than presented only as menu items
- spatially meaningful places, objects, and routes
- social relationships that create grudges, friendships, avoidance, reconciliation, rivalry, and recurring behavior
- player actions that influence the world without turning every pet into a direct command puppet
- visible consequences over time: changed mood, changed relationship, remembered events, altered routines
- off-page simulation that can produce interesting stories before the player arrives

This spec is the first implementation slice toward that north star. It does not claim to deliver full GTA/RDR-like systemic freedom by itself. It makes the current hidden autonomy legible so future simulation and interaction expansions have a visible surface to land on.

## Product Goals

- Make `/garden` feel more like a live open-world observation surface than a dashboard.
- Make each selected pet's agency visible: current goal, chosen activity, reason, emotional state, recent event, relationships, and social context.
- Make off-page and background activity visible through a compact world feed and recent-event replay.
- Preserve current interaction paths: select pet, chat, owner actions, move owned pets, switch zones, report public pets.
- Improve layout clarity and scanability on desktop and mobile.
- Establish UI patterns that can later support richer open-world features: ambient encounters, schedules, territory, object ownership, routines, and player intervention.

## Non-Goals

- Do not redesign memory storage or memory compression.
- Do not change Kimi/Qwen provider configuration.
- Do not add a new backend database shape.
- Do not make LLM directly mutate world state.
- Do not expand the full owner action system beyond better presentation of existing actions.
- Do not replace PixiJS garden rendering with a new engine.
- Do not attempt to build a full mission system, quest system, inventory system, faction system, economy, or pathfinding rewrite in this phase.

## Current Project Context

Relevant existing data is already available in `GardenPetSnapshot`:

- `state.activity`, `state.mood`, `state.currentBubble`, `state.lastAutonomyDecision`
- `currentGoals`
- `recentEvent`
- `bonds`
- `relationshipModels`
- `ledgerFacts`
- `memories`, `memoryDigest`, `semanticMemoryDigest`
- `conversationSummary`

Relevant UI currently lives in:

- `app/garden/page.tsx`
- `components/garden/garden-experience.tsx`
- `components/garden/garden-canvas.tsx`
- `components/garden/narrative-feed.tsx`
- `components/chat/chat-drawer.tsx`
- `components/forms/cyber-forms.tsx`

The design should primarily reorganize and clarify these surfaces before adding new state.

## Recommended Approach

Use a focused "Garden HUD + Autonomy Overlay" pass.

The center of the experience remains the live garden canvas. Around it, introduce a clearer open-world HUD:

- top world status bar for zone, time, live transport, pet count, and object count
- selected-pet command and autonomy panel
- compact world feed emphasizing recent and off-page events
- stronger in-map pet labels for mood, activity, and selected state

This approach creates an immediate perception shift while staying close to the existing architecture.

This is intentionally a foundation pass. The player should leave this phase believing "the pets are doing things for reasons." Later phases can then add "the world keeps creating situations I can discover and influence."

## Open-World Gap Analysis

Compared with the desired mini GTA/RDR feeling, the current project has some strong pieces and some missing pieces.

Already present:

- persistent pet state
- autonomous activity selection
- mood and needs
- relationship graph
- memories and digests
- event narration
- world objects
- multiple zones
- off-page ticks
- owner actions
- public social observation

Missing or underdeveloped:

- ambient encounter chains that unfold over multiple ticks
- explicit routines or schedules per pet
- territorial claims and favorite routes as first-class gameplay concepts
- richer object affordances such as owned toys, contested beds, favorite trees, and avoided places
- world-level consequences that are visible across sessions
- player intervention options that affect ongoing situations without hard-commanding every outcome
- clear visual language for why a pet is acting, who it cares about, and what might happen next

This phase targets the last gap: clear visual language. It should be followed by systemic expansions, not treated as the whole open-world answer.

## UX Design

### Desktop Layout

Use a three-region composition:

1. World header
   - Shows current zone name, time label, phase, live/polling/paused status, and compact zone tabs.
   - Avoid a marketing-style hero. This is operational game UI.

2. Main world stage
   - Large garden canvas as the main object.
   - Preserve existing canvas interactions.
   - Add a slim world ticker below or beside the canvas for the latest 3-5 events.

3. Selected pet HUD
   - Replaces the current long mixed information panel with compact sections:
     - identity and mood
     - current intent
     - recent event
     - relationship pulse
     - needs meters
     - owner actions
     - memory/social context as secondary expandable or lower-priority sections

### Mobile Layout

Use a stacked layout:

1. World header
2. Horizontal zone selector
3. Garden canvas
4. Selected pet HUD
5. World feed

The selected pet HUD should avoid huge nested cards. Sections should be separated by spacing, subtle borders, and compact headings.

### Garden Canvas Visibility

Pets should communicate state at a glance:

- Selected pet gets a clearer ring and slightly elevated label.
- Mood glyph remains compact and readable.
- Activity label should be human-readable, not raw enum text when practical.
- Current speech/thought bubble remains visible but should not overlap controls.
- Social or conflict activities should stand out visually:
  - `play`, `approach_pet`, `reconcile`, `offer_toy` use friendly cyan/lime treatment.
  - `scuffle`, `chase`, `steal_spot`, `ignore` use amber/rose treatment.
  - `sleep`, `sunbathe`, `groom` use subdued treatment.

No new simulation state is required for this pass. The canvas can derive visual categories from `PetActivity` and `PetMood`.

## Selected Pet HUD

### Identity

Show:

- sprite
- pet name
- owner handle
- species and current activity
- mood
- archetype

The identity block should be compact enough that autonomy content appears without scrolling on common desktop heights.

### Current Intent

Show the latest decision trace when available:

- goal: `state.lastAutonomyDecision.goal`
- chosen activity: `state.lastAutonomyDecision.chosenActivity`
- source: `llm`, `fallback`, or other source value
- reason: `state.lastAutonomyDecision.reason`
- social intent if present

If no decision is available, use `state.activity`, `state.mood`, and `recentEvent` to show a fallback line.

This section is the main "why it feels alive" surface. It should be visually prominent.

### Recent Event

Show the selected pet's `recentEvent` with:

- event body
- relative time
- event type
- social lines if present

This replaces the separate "为什么它这样？" card with a tighter panel inside the selected pet HUD.

### Relationship Pulse

Show the top few relationship signals:

- strongest bond from `bonds`
- relationship model if present, especially trust and resentment
- related pet from recent event if available

The point is not to show every relationship row. It is to tell the player who matters right now.

### Needs

Keep existing meters, but make them easier to scan:

- energy
- hunger
- hygiene
- bladder
- social
- stress

Use stable meter heights and consistent label/value positions.

### Owner Actions

For owned pets, group existing actions by intent:

- care: feed, pet, clean poop
- play: throw toy, call, gift, photo
- discipline/context: scold, rename spot

This is presentation only. It should still call the existing `OwnerActionButtons` behavior or a small refactor of that component.

For public pets owned by others, keep observe/report affordances clear.

## World Feed

The narrative feed should feel like a live world ticker rather than a stack of large cards.

Show:

- latest events for the current zone
- pet sprites for primary and related pets
- event type
- relative time
- short body
- social lines when available

Interaction:

- clicking an event selects the primary pet
- clicking a related pet selects the related pet
- feed should animate new events lightly

Transport state should stay visible:

- live
- polling
- paused

## Off-Page Activity

This phase will not create a new off-page system. It should surface existing background activity:

- `recentEvents` from snapshots
- `notifications`
- `state.lastSimulatedAt`
- `recentEvent`
- `currentBubble`

When the page refreshes or zone changes, recently created events should read as "what happened while you were away." If needed, copy can say "刚刚发生" or "后台发生" based on relative time, but avoid adding a fake offline summary unless the backend provides one.

## Data Flow

No new API is required for the first implementation pass.

Existing flow:

1. `/garden` calls `getGardenSnapshot({ zoneId, viewerId, llmMode: "off" })`.
2. `GardenExperience` hydrates `useGardenZoneState`.
3. `useGardenZoneState` pulls `/api/garden/snapshot` and listens to `/api/garden/events-stream`.
4. Selected pet is derived from `snapshot.pets`.
5. UI components derive presentation from `GardenSnapshot` and `GardenPetSnapshot`.

Optional small helper modules:

- `components/garden/garden-labels.ts` for activity, goal, mood, and intent labels.
- `components/garden/pet-autonomy-hud.tsx` for selected pet HUD.
- `components/garden/world-feed.tsx` or a refactor of `narrative-feed.tsx`.

## Error Handling

Existing errors should remain:

- zone sync failure
- unauthorized movement
- failed owner action
- failed chat

The redesigned layout should keep errors near the action that caused them:

- zone and stream errors near world header or canvas
- owner action errors inside action panel
- movement errors below canvas

If autonomy fields are missing, UI must degrade gracefully:

- show current activity and mood
- hide decision source
- show a short fallback sentence

## Accessibility and Responsiveness

- Buttons must have visible labels and focus states.
- Do not rely only on color for activity categories.
- Text must fit on mobile and desktop without overlapping the canvas.
- Use stable dimensions for HUD meters, icon buttons, zone tabs, and ticker rows.
- Avoid nested cards.
- Use concise headings and compact labels; this is game UI, not a marketing page.

## Testing Plan

Automated tests should cover derived presentation helpers:

- activity labels map important `PetActivity` values to readable copy.
- intent category maps social/rest/conflict/explore activities correctly.
- missing autonomy decision produces a safe fallback summary.

Existing checks should still pass:

- `npm run lint`
- `npm run test`

Browser verification should cover:

- `/garden` renders without CSS/Turbopack errors.
- selecting a pet updates the HUD.
- owner action buttons still call the existing API.
- event feed click selects the right pet.
- mobile viewport has no text overlap or horizontal overflow.
- both model test servers can still load the garden page if they are running.

## Implementation Risks

- `garden-experience.tsx` may become too large if all HUD markup is kept inline. Split focused components early.
- Pixi labels can overlap at high pet density. Keep labels compact and only emphasize selected/active pets.
- Current snapshot polling uses `llmMode: "off"`, so autonomy source may often be fallback. The UI must not overpromise LLM-driven behavior.
- The right panel currently exposes many debug-like details. The redesign should preserve access to important details without making the main HUD unreadable.

## Acceptance Criteria

- `/garden` has a clearer open-world HUD layout.
- Selecting a pet immediately shows its intent, mood, recent event, relationship pulse, and needs.
- The map communicates selected state and activity category more clearly.
- The world feed is more compact and feels live.
- Existing chat, owner actions, movement, zone switching, and report flows still work.
- No memory/provider/storage changes are required.
- Lint and tests pass.

## Follow-Up Phase Direction

After this phase, the next open-world phases should be:

1. Ambient encounter chains
   - Multi-step pet situations such as toy theft, territorial standoffs, reconciliation attempts, hiding after stress, returning to a favorite place, and owner-seeking loops.

2. Spatial memory and routines
   - Favorite places, avoided places, regular routes, claimed spots, and zone-to-zone habits.

3. Player intervention layer
   - Contextual actions that let the player interrupt, encourage, call over, gift, observe, comfort, or redirect a live situation.

4. Consequence and replay layer
   - A lightweight "what happened while you were away" recap that is generated from real events, not fake summaries.
