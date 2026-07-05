export type Species = "cat" | "dog";
export type Visibility = "public" | "private";
export type GenerationStatus = "queued" | "processing" | "succeeded" | "failed";
export type Role = "user" | "admin";
export type Facing = "up" | "down" | "left" | "right";
export type RelationshipStatus = "friend" | "enemy" | "neutral";
export type WorldTimePhase = "dawn" | "day" | "dusk" | "night";
export type PetDrive =
  | "seek_rest"
  | "seek_food"
  | "seek_play"
  | "seek_owner"
  | "seek_friend"
  | "avoid_threat"
  | "guard_spot"
  | "self_maintain"
  | "explore";
export type SocialIntent =
  | "approach"
  | "invite_play"
  | "tease"
  | "observe"
  | "avoid"
  | "reassure";
export type EnvironmentActorKind =
  | "cloud"
  | "cloud_shadow"
  | "butterfly"
  | "bee"
  | "firefly"
  | "duck"
  | "fish"
  | "leaf"
  | "petal"
  | "mushroom"
  | "grass";
export type EnvironmentActorLayer = "sky" | "shadow" | "air" | "water" | "ground";
export type PetMemoryKind =
  | "favorite_spot"
  | "favorite_toy"
  | "friend_pet"
  | "enemy_pet"
  | "chased_by_dog"
  | "watched_fish"
  | "slept_well"
  | "owner_chat"
  | "stranger_chat"
  | "social_moment"
  | "funny_incident"
  | "scary_moment"
  | "favorite_food"
  | "dislike";
export type PetPersonalityArchetype =
  | "tree poet"
  | "orange chaos"
  | "velcro heart"
  | "shadow watcher"
  | "pond dreamer"
  | "rocket scout";

export type GardenZoneId = "orchard" | "pond" | "grove" | "dog-run";
export type PetMood =
  | "happy"
  | "curious"
  | "playful"
  | "sleepy"
  | "lonely"
  | "grumpy"
  | "dirty";
export type PetActivity =
  | "idle"
  | "wander"
  | "sleep"
  | "eat"
  | "drink"
  | "climb_tree"
  | "hide"
  | "poop"
  | "chase"
  | "scuffle"
  | "seek_owner"
  | "play"
  | "look_around"
  | "sunbathe"
  | "watch_fish"
  | "groom"
  | "dig"
  | "approach_pet"
  | "observe_from_distance"
  | "claim_spot"
  | "escort_owner"
  | "offer_toy"
  | "reconcile"
  | "ignore"
  | "steal_spot"
  | "move_to_zone";
export type OwnerAction =
  | "feed"
  | "pet"
  | "throw_toy"
  | "clean_poop"
  | "call"
  | "scold"
  | "gift"
  | "photo"
  | "rename_spot";
export type OwnerPetCommand =
  | {
      type: "move_to_tile";
      zoneId: GardenZoneId;
      tileX: number;
      tileY: number;
    }
  | {
      type: "move_to_object";
      objectId: string;
    }
  | {
      type: "move_to_pet";
      targetPetId: string;
    }
  | {
      type: "chase_pet";
      targetPetId: string;
    }
  | {
      type: "scuffle_pet";
      targetPetId: string;
    };
export type WorldObjectType =
  | "tree"
  | "bush"
  | "pond_edge"
  | "toy"
  | "poop"
  | "rest_spot"
  | "doghouse"
  | "pet_bed"
  | "butterfly"
  | "stone"
  | "fountain"
  | "lamp"
  | "bridge";
export type PetEventType =
  | "mood_change"
  | "pooped"
  | "climbed_tree"
  | "scuffle"
  | "chased"
  | "slept"
  | "owner_action"
  | "watched_fish"
  | "dug"
  | "groomed"
  | "bonded"
  | "social_chat"
  | "inner_voice"
  | "zone_move";
export type NotificationKind = "mood_change" | "important_event" | "system";
export type ReportTargetType = "pet" | "pet_event";
export type ReportStatus = "open" | "resolved" | "dismissed";
export type ChatParticipantType = "user" | "pet";
export type SpeechBubbleKind = "thought" | "speech";
export type LLMChatFinishReason =
  | "stop"
  | "length"
  | "timeout"
  | "content_filter"
  | "error"
  | "unknown";
export type ChatReplySource = "llm" | "repair" | "fallback";
export type GardenLedgerEventType =
  | "owner_action"
  | "social_interaction"
  | "mood_change"
  | "territory_claim"
  | "conflict"
  | "reconciliation"
  | "zone_move"
  | "object_interaction"
  | "chat"
  | "goal_shift";
export type GardenSemanticSubjectType = "pet" | "zone" | "object" | "owner";
export type GardenSemanticPredicate =
  | "likes"
  | "dislikes"
  | "trusts"
  | "avoids"
  | "claims"
  | "comforts_at"
  | "fears"
  | "bonded_with"
  | "rival_of"
  | "prefers_zone"
  | "favorite_object"
  | "owner_anchor";
export type PetGoalType =
  | "seek_reassurance_from_owner"
  | "guard_favorite_spot"
  | "avoid_pet"
  | "repair_bond"
  | "explore_zone"
  | "inspect_new_toy"
  | "seek_food"
  | "rest_and_reset"
  | "chase_target"
  | "move_to_zone";
export type PetGoalStatus = "active" | "paused" | "completed" | "expired";

export interface Profile {
  id: string;
  email: string;
  handle: string;
  displayName: string;
  bio: string;
  role: Role;
  createdAt: string;
}

export interface Pet {
  id: string;
  ownerId: string;
  name: string;
  species: Species;
  breed?: string;
  bio?: string;
  visibility: Visibility;
  activeGenerationId?: string;
  isFrozen: boolean;
  createdAt: string;
}

export interface PetPersonality {
  archetype: PetPersonalityArchetype;
  summary: string;
  curiosity: number;
  sociability: number;
  boldness: number;
  treeAffinity: number;
  zoomies: number;
  napBias: number;
}

/** Dominant colors sampled from the uploaded pet photo. */
export interface PetPhotoPalette {
  fur: string;
  stripe: string;
  inner: string;
  accent: string;
}

export interface SourcePhoto {
  id: string;
  petId: string;
  storagePath: string;
  mimeType: string;
  sizeBytes: number;
  originalFilename: string;
  createdAt: string;
  palette?: PetPhotoPalette;
}

export interface PetGeneration {
  id: string;
  petId: string;
  sourcePhotoId: string;
  providerJobId: string;
  status: GenerationStatus;
  promptSeed: string;
  worldSpritePath?: string;
  appearanceSeed: string;
  paletteName: string;
  error?: string;
  attempts: number;
  createdAt: string;
  updatedAt: string;
}

export interface GardenZone {
  id: GardenZoneId;
  name: string;
  description: string;
  accent: string;
  speciesBias: Species | "all";
}

export interface PetState {
  petId: string;
  zoneId: GardenZoneId;
  tileX: number;
  tileY: number;
  facing: Facing;
  mood: PetMood;
  activity: PetActivity;
  energy: number;
  hunger: number;
  hygiene: number;
  bladder: number;
  social: number;
  stress: number;
  /** Owner attachment 0-100; grows through care, decays slowly when ignored. */
  bond?: number;
  /** Lifetime growth experience; drives the growth stage. */
  growthXp?: number;
  actionEndsAt: string;
  lastSimulatedAt: string;
  currentBubble?: {
    text: string;
    kind: SpeechBubbleKind;
    expiresAt: string;
  };
  lastAutonomyDecision?: PetAutonomyDecision;
  activeGoals?: string[];
  conversationSummary?: string;
  lastChatTrace?: PetChatTrace;
  lastKnownZonePreference?: GardenZoneId;
}

export interface PetEvent {
  id: string;
  petId: string;
  zoneId: GardenZoneId;
  type: PetEventType;
  body: string;
  createdAt: string;
  hidden?: boolean;
  relatedPetId?: string;
  emotion?: string;
  socialLines?: Array<{
    petId: string;
    text: string;
    emotion: string;
  }>;
  narrationSource?: "template" | "llm";
}

export interface ChatMessage {
  id: string;
  petId: string;
  participantType: ChatParticipantType;
  participantId: string;
  content: string;
  mood?: PetMood;
  createdAt: string;
  source?: ChatReplySource;
}

export interface ChatSession {
  id: string;
  petId: string;
  userId: string;
  messages: ChatMessage[];
  startedAt: string;
  lastMessageAt: string;
  summaryId?: string;
}

export interface LLMChatResult {
  content: string;
  finishReason: LLMChatFinishReason;
  elapsedMs: number;
  tokenCount: number;
  provider: string;
  truncated: boolean;
  timedOut?: boolean;
  abortReason?: string;
  source?: ChatReplySource;
}

export type ChatStreamEvent =
  | {
      type: "ack";
      petId: string;
      sessionId: string;
      traceId: string;
    }
  | {
      type: "status" | "repairing" | "fallback";
      message: string;
      traceId: string;
    }
  | {
      type: "token";
      token: string;
      traceId: string;
    }
  | {
      type: "done";
      traceId: string;
      result: LLMChatResult;
      session: ChatSession;
      reply: string;
      mood: PetMood;
      suggestedAction: OwnerAction | null;
      stateChanges: Partial<{ social: number; stress: number; hunger: number; energy: number }>;
    }
  | {
      type: "error";
      traceId: string;
      message: string;
    };

export interface WorldObject {
  id: string;
  zoneId: GardenZoneId;
  type: WorldObjectType;
  tileX: number;
  tileY: number;
  petId?: string;
  createdAt: string;
  removedAt?: string;
}

export interface PetRelationship {
  id: string;
  petAId: string;
  petBId: string;
  affinity: number;
  rivalry: number;
  updatedAt: string;
}

export interface PetMemory {
  id: string;
  petId: string;
  kind: PetMemoryKind;
  body: string;
  zoneId?: GardenZoneId;
  relatedPetId?: string;
  weight: number;
  createdAt: string;
  updatedAt: string;
}

export interface PetAutonomyProfile {
  id: string;
  petId: string;
  source: "derived" | "llm";
  coreIdentity: string;
  identityNarrative: string;
  motivations: string[];
  comfortSources: string[];
  stressSignals: string[];
  socialStrategy: string;
  attachmentStyle: string;
  conflictStyle: string;
  favoriteActivities: PetActivity[];
  avoidedActivities: PetActivity[];
  dailyRhythm: string;
  ownerBondStyle: string;
  revision: number;
  confidence: number;
  refreshReason: string;
  updatedAt: string;
}

export interface PetMemoryDigest {
  petId: string;
  source: "derived" | "llm";
  summary: string;
  socialSummary: string;
  activeDrives: PetDrive[];
  notableMemories: string[];
  updatedAt: string;
}

export interface PetEpisodicMemoryIndex {
  petId: string;
  people: string[];
  places: string[];
  objects: string[];
  owner: string[];
  conflicts: string[];
  comforts: string[];
  updatedAt: string;
}

export interface PetSemanticMemoryDigest {
  petId: string;
  source: "derived" | "llm";
  summary: string;
  longTermPreferences: string[];
  longTermAversions: string[];
  socialJudgments: string[];
  placeMeanings: string[];
  objectMeanings: string[];
  ownerInteractionPattern: string;
  updatedAt: string;
}

export interface GardenLedgerEvent {
  id: string;
  type: GardenLedgerEventType;
  participants: string[];
  zoneId: GardenZoneId;
  objectId?: string;
  salience: number;
  body: string;
  semanticTags: string[];
  createdAt: string;
}

export interface GardenSemanticFact {
  id: string;
  subjectType: GardenSemanticSubjectType;
  subjectId: string;
  predicate: GardenSemanticPredicate;
  objectType: GardenSemanticSubjectType;
  objectId?: string;
  objectLabel: string;
  weight: number;
  evidenceEventIds: string[];
  updatedAt: string;
}

export interface PetGoal {
  id: string;
  petId: string;
  goalType: PetGoalType;
  priority: number;
  targetPetId?: string;
  targetZoneId?: GardenZoneId;
  targetObjectId?: string;
  status: PetGoalStatus;
  progress: number;
  expiresAt?: string;
  reason: string;
  createdAt: string;
  updatedAt: string;
}

export interface PairRelationshipModel {
  id: string;
  petAId: string;
  petBId: string;
  trust: number;
  playCompatibility: number;
  intimidation: number;
  curiosity: number;
  resentment: number;
  attachmentPattern: string;
  updatedAt: string;
}

export interface ConversationSummary {
  id: string;
  petId: string;
  userId: string;
  summary: string;
  highlights: string[];
  source: "derived" | "llm";
  turnCount: number;
  updatedAt: string;
}

export interface PetChatTrace {
  id: string;
  petId: string;
  userId: string;
  sessionId: string;
  provider: string;
  source: ChatReplySource;
  finishReason: LLMChatFinishReason;
  elapsedMs: number;
  tokenCount: number;
  truncated: boolean;
  repaired: boolean;
  fallbackReason?: string;
  promptDigest: string;
  createdAt: string;
}

export interface PetDecisionCandidateSummary {
  activity: PetActivity;
  summary: string;
  targetPetId?: string;
  targetObjectId?: string;
  targetZoneId?: GardenZoneId;
}

export interface PetAutonomyDecision {
  goal: PetDrive;
  chosenActivity: PetActivity;
  source: "fallback" | "llm";
  reason: string;
  candidates: PetDecisionCandidateSummary[];
  targetPetId?: string;
  targetObjectId?: string;
  targetZoneId?: GardenZoneId;
  socialIntent?: SocialIntent;
  decidedAt: string;
}

export interface PetBond {
  otherPetId: string;
  otherPetName: string;
  status: RelationshipStatus;
  affinity: number;
  rivalry: number;
  updatedAt: string;
}

export interface GardenWorldState {
  clockLabel: string;
  phase: WorldTimePhase;
  cycleProgress: number;
  minuteOfDay: number;
  isNight: boolean;
  skyTop: string;
  skyBottom: string;
  ambientGlow: string;
  overlayAlpha: number;
  neonAlpha: number;
  ambienceLabel: string;
}

export interface EnvironmentActor {
  id: string;
  kind: EnvironmentActorKind;
  zoneId: GardenZoneId;
  tileX: number;
  tileY: number;
  layer: EnvironmentActorLayer;
  scale: number;
  drift: number;
  tint?: string;
}

export interface OwnerActionRecord {
  id: string;
  ownerId: string;
  petId: string;
  action: OwnerAction;
  createdAt: string;
  summary: string;
}

export interface Notification {
  id: string;
  userId: string;
  kind: NotificationKind;
  petId?: string;
  eventId?: string;
  body: string;
  createdAt: string;
  readAt?: string;
}

export interface Report {
  id: string;
  reporterUserId: string;
  targetType: ReportTargetType;
  targetId: string;
  reason: string;
  status: ReportStatus;
  resolutionAction?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface AppStore {
  schemaVersion: number;
  profiles: Profile[];
  pets: Pet[];
  sourcePhotos: SourcePhoto[];
  petGenerations: PetGeneration[];
  gardenZones: GardenZone[];
  petStates: PetState[];
  petEvents: PetEvent[];
  worldObjects: WorldObject[];
  petRelationships: PetRelationship[];
  petMemories: PetMemory[];
  petAutonomyProfiles: PetAutonomyProfile[];
  petMemoryDigests: PetMemoryDigest[];
  petSemanticMemoryDigests: PetSemanticMemoryDigest[];
  gardenLedgerEvents: GardenLedgerEvent[];
  gardenSemanticFacts: GardenSemanticFact[];
  gardenEncounterThreads: GardenEncounterThread[];
  petGoals: PetGoal[];
  pairRelationshipModels: PairRelationshipModel[];
  conversationSummaries: ConversationSummary[];
  petChatTraces: PetChatTrace[];
  ownerActions: OwnerActionRecord[];
  chatSessions: ChatSession[];
  notifications: Notification[];
  reports: Report[];
  gardenPresences: GardenPresence[];
}

export type PetGrowthStage = "proto" | "synced" | "awakened";

export interface PetGrowthSummary {
  stage: PetGrowthStage;
  stageLabel: string;
  bond: number;
  xp: number;
  /** 0-1 progress toward the next stage; 1 when fully awakened. */
  stageProgress: number;
}

export interface GardenPresence {
  profileId: string;
  zoneId: GardenZoneId;
  tileX: number;
  tileY: number;
  updatedAt: string;
  /** Day key (UTC date) of the last daily reunion bonus. */
  lastDailyGiftDay?: string;
}

export interface GardenPetSnapshot {
  pet: Pet;
  generation: PetGeneration;
  state: PetState;
  owner: Profile;
  personality: PetPersonality;
  growth?: PetGrowthSummary;
  autonomyProfile?: PetAutonomyProfile;
  memoryDigest?: PetMemoryDigest;
  semanticMemoryDigest?: PetSemanticMemoryDigest;
  bonds: PetBond[];
  memories: PetMemory[];
  currentGoals: PetGoal[];
  relationshipModels: PairRelationshipModel[];
  ledgerFacts: GardenSemanticFact[];
  conversationSummary?: ConversationSummary;
  recentEvent?: PetEvent;
}

export type GardenEncounterKind =
  | "conflict"
  | "social"
  | "territory"
  | "needs_attention";
export type GardenEncounterTone = "conflict" | "social" | "explore" | "care" | "rest";
export type GardenEncounterStage = "spark" | "unfolding" | "cooldown";
export type GardenEncounterThreadStatus = "active" | "resolving" | "resolved" | "expired";
export type GardenEncounterWorldAction = "observe" | "approach";

export interface GardenEncounterIntervention {
  ownerId: string;
  petId: string;
  action: OwnerAction;
  createdAt: string;
}

export interface GardenEncounterWorldActionRecord {
  viewerId: string;
  action: GardenEncounterWorldAction;
  actorPetId?: string;
  targetPetId?: string;
  createdAt: string;
}

export interface GardenEncounter {
  id: string;
  threadId?: string;
  kind: GardenEncounterKind;
  tone: GardenEncounterTone;
  stage: GardenEncounterStage;
  status?: GardenEncounterThreadStatus;
  zoneId: GardenZoneId;
  title: string;
  summary: string;
  participantPetIds: string[];
  relatedEventIds: string[];
  suggestedOwnerActions: OwnerAction[];
  lastIntervention?: GardenEncounterIntervention;
  lastWorldAction?: GardenEncounterWorldActionRecord;
  updatedAt: string;
}

export interface GardenEncounterThread {
  id: string;
  kind: GardenEncounterKind;
  tone: GardenEncounterTone;
  stage: GardenEncounterStage;
  status: GardenEncounterThreadStatus;
  zoneId: GardenZoneId;
  title: string;
  summary: string;
  participantPetIds: string[];
  relatedEventIds: string[];
  suggestedOwnerActions: OwnerAction[];
  lastIntervention?: GardenEncounterIntervention;
  lastWorldAction?: GardenEncounterWorldActionRecord;
  createdAt: string;
  updatedAt: string;
  expiresAt: string;
}

export interface GardenEncounterMapMarker {
  id: string;
  encounterId: string;
  threadId?: string;
  zoneId: GardenZoneId;
  tileX: number;
  tileY: number;
  tone: GardenEncounterTone;
  stage: GardenEncounterStage;
  status?: GardenEncounterThreadStatus;
  title: string;
  participantPetIds: string[];
}

export interface GardenSnapshot {
  zone: GardenZone;
  serverTime: string;
  world: GardenWorldState;
  pets: GardenPetSnapshot[];
  objects: WorldObject[];
  environmentActors: EnvironmentActor[];
  recentEvents: PetEvent[];
  encounters: GardenEncounter[];
  encounterMarkers: GardenEncounterMapMarker[];
}

export interface DashboardPetCard {
  pet: Pet;
  generation?: PetGeneration;
  state?: PetState;
  zone?: GardenZone;
  personality: PetPersonality;
  autonomyProfile?: PetAutonomyProfile;
  memoryDigest?: PetMemoryDigest;
  semanticMemoryDigest?: PetSemanticMemoryDigest;
  episodicMemoryIndex?: PetEpisodicMemoryIndex;
  bonds: PetBond[];
  memories: PetMemory[];
  currentGoals: PetGoal[];
  relationshipModels: PairRelationshipModel[];
  ledgerFacts: GardenSemanticFact[];
  conversationSummary?: ConversationSummary;
  recentEvents: PetEvent[];
}

export interface ViewerDashboard {
  profile: Profile;
  pets: DashboardPetCard[];
  notifications: Notification[];
}

export interface HomeSignalItem {
  id: string;
  source: "notification" | "event";
  kind: NotificationKind | "public_event";
  body: string;
  createdAt: string;
  href: string;
  petId?: string;
  petName?: string;
  zoneId?: GardenZoneId;
  zoneName?: string;
}

export interface HomeSignalFeed {
  audience: "viewer" | "public";
  refreshedAt: string;
  viewerName?: string;
  items: HomeSignalItem[];
}

export interface PetDetailsView {
  pet: Pet;
  owner: Profile;
  generation?: PetGeneration;
  state?: PetState;
  zone?: GardenZone;
  personality: PetPersonality;
  autonomyProfile?: PetAutonomyProfile;
  memoryDigest?: PetMemoryDigest;
  semanticMemoryDigest?: PetSemanticMemoryDigest;
  episodicMemoryIndex?: PetEpisodicMemoryIndex;
  bonds: PetBond[];
  memories: PetMemory[];
  currentGoals: PetGoal[];
  relationshipModels: PairRelationshipModel[];
  ledgerFacts: GardenSemanticFact[];
  conversationSummary?: ConversationSummary;
  recentEvents: PetEvent[];
}
