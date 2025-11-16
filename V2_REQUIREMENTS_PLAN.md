# BJJ Checklist v2.0: Class-Based System Requirements

**Version:** 2.0
**Author:** Claude Code
**Date:** 2025-11-15
**Status:** Planning Phase

---

## 🎯 Executive Summary

Transform the BJJ Checklist from an individual progress tracker to a professional class management platform where professors plan curriculum, track class-wide progress, and students engage with their learning journey within structured classes.

### Key Value Propositions

**For Professors:**
- Plan lessons using structured curriculum from 95-technique master library
- Track individual and class-wide progress
- Verify student submissions and provide feedback
- Analyze teaching effectiveness with heatmaps and analytics

**For Students:**
- Join classes with simple 5-digit codes
- Track progress with cross-belt technique system
- See upcoming lessons and prepare ahead
- Get verified feedback from professors

---

## 📊 Current State Analysis

### v1.0 Architecture (Individual Tracking)
- **Data Model:** Belt → Requirement → Progress (3-level nesting)
- **Storage:** AsyncStorage (local only, no sync)
- **Users:** Solo users tracking personal progress
- **Requirements:** 111 requirements across 4 belts
- **Limitations:**
  - No collaboration features
  - Duplicate tracking (one technique counted as separate requirements per belt)
  - No lesson planning or curriculum management
  - No instructor oversight

### v2.0 Vision (Class-Based Platform)
- **Data Model:** Technique-centric (95 techniques, each knows which requirements it fulfills)
- **Storage:** Cloud backend (Firebase/Supabase) with offline-first sync
- **Users:** Professors and Students in organized classes
- **Requirements:** Same content, better structure with cross-belt benefits
- **Enhancements:**
  - 5-digit class codes for easy joining
  - Lesson planning calendar
  - Class-wide analytics
  - Progress verification system

---

## 🏗️ Architecture Overview

### Technology Stack

#### Current (v1.0)
```
Frontend: React Native (Expo SDK 54)
State: Zustand + AsyncStorage
Platform: iOS + Android
Deployment: EAS Build
```

#### Proposed (v2.0)
```
Frontend: React Native (Expo SDK 54+)
State: Zustand + React Query
Backend: Firebase OR Supabase
Auth: Firebase Auth / Supabase Auth
Database: Firestore / PostgreSQL
Storage: Firebase Storage / Supabase Storage
Sync: Real-time listeners + Offline queue
Deployment: EAS Build + Backend hosting
```

### System Architecture Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile App (React Native)            │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Professor  │  │    Student   │  │     Auth     │  │
│  │     View     │  │     View     │  │    Screen    │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │         State Management (Zustand + React Query) │  │
│  └──────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────────────────────────────┐  │
│  │         Offline Queue + Sync Service             │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                            ↓ ↑
                    Real-time Sync
                            ↓ ↑
┌─────────────────────────────────────────────────────────┐
│                    Backend (Firebase/Supabase)          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────┐  ┌──────────┐             │
│  │   Auth   │  │ Firestore│  │  Storage │             │
│  │ Service  │  │ /Postgres│  │  (Photos)│             │
│  └──────────┘  └──────────┘  └──────────┘             │
│  ┌──────────────────────────────────────┐             │
│  │      Cloud Functions / Edge Fns      │             │
│  │   (Business Logic, Notifications)    │             │
│  └──────────────────────────────────────┘             │
└─────────────────────────────────────────────────────────┘
```

---

## 📋 Detailed Requirements

### Phase 1: Foundation & Data Architecture (Week 1-2)

#### 1.1 Technique-Centric Data Model

**Objective:** Implement the proposed data structure from `PROPOSED_DATA_STRUCTURE.md`

**Tasks:**
1. Create `src/data/techniques.ts` with all 95 techniques from `MASTER_TECHNIQUE_LIST.md`
2. Create `src/data/beltRequirements.ts` with requirement definitions
3. Update `src/types/index.ts` with new type definitions
4. Implement cross-belt mapping logic

**New Types:**
```typescript
export interface Technique {
  id: string;                          // e.g., 'armlock-guarda-fechada'
  name: string;                        // e.g., 'Arm lock'
  position?: string;                   // e.g., 'Guarda Fechada'
  category: string;                    // e.g., 'Finalizações'
  countsToward: BeltRequirementMapping[];
  videoUrl?: string;
  description?: string;
  difficulty?: 'basic' | 'intermediate' | 'advanced';
}

export interface BeltRequirementMapping {
  belt: 'azul' | 'roxa' | 'marrom' | 'preta';
  requirementId: string;               // e.g., 'azul-guarda-fechada'
  requirementName: string;             // e.g., 'Guarda Fechada'
}

export interface BeltRequirement {
  id: string;
  belt: 'azul' | 'roxa' | 'marrom' | 'preta';
  category: string;
  name: string;
  targetCount?: number;                // For count-based (Purple+)
  matchesTechnique: (technique: Technique) => boolean;
}

export interface TechniqueProgress {
  techniqueId: string;
  completed: boolean;
  note: string;
  mediaUrl: string;
  photoUri?: string;
  completedAt?: Date;
  verifiedBy?: string;                 // NEW: professorId
  verifiedAt?: Date;                   // NEW
}
```

**Example Technique:**
```typescript
{
  id: 'armlock-guarda-fechada',
  name: 'Arm lock',
  position: 'Guarda Fechada',
  category: 'Finalizações',
  countsToward: [
    { belt: 'azul', requirementId: 'azul-guarda-fechada', requirementName: 'Guarda Fechada' },
    { belt: 'roxa', requirementId: 'roxa-armlocks', requirementName: '03 Arm Locks' },
    { belt: 'marrom', requirementId: 'marrom-armlocks', requirementName: '04 Arm Locks' },
    { belt: 'preta', requirementId: 'preta-armlocks', requirementName: '04 Arm Locks' }
  ]
}
```

**Benefits:**
- ✅ Check one technique → updates 4 belt requirements
- ✅ Blue belt students get 60-70% of Purple requirements automatically
- ✅ Eliminates duplicate data entry
- ✅ Clear progression visibility

#### 1.2 User & Authentication Types

```typescript
export interface User {
  id: string;                          // UUID
  email: string;
  name: string;
  role: 'professor' | 'student';
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  currentBelt?: BeltId;                // For students
  bio?: string;
  phoneNumber?: string;
}
```

#### 1.3 Class Management Types

```typescript
export interface Class {
  id: string;                          // UUID
  code: string;                        // 5-digit alphanumeric (e.g., 'A7X2K')
  name: string;                        // e.g., 'Adult BJJ - Mon/Wed'
  description?: string;
  professorId: string;                 // Creator's user ID
  createdAt: Date;
  isActive: boolean;
  settings: ClassSettings;
}

export interface ClassSettings {
  allowSelfVerification: boolean;      // Students can mark complete without professor approval
  requirePhotos: boolean;              // Force photo upload for verification
  autoArchiveInactiveDays: number;     // Default: 90
}

export interface ClassMembership {
  id: string;
  classId: string;
  userId: string;
  role: 'professor' | 'student';
  currentBelt: BeltId;
  joinedAt: Date;
  isActive: boolean;
}
```

#### 1.4 Lesson Planning Types

```typescript
export interface LessonPlan {
  id: string;
  classId: string;
  date: Date;                          // Scheduled date
  title: string;
  techniqueIds: string[];              // References to TECHNIQUES array
  warmupNotes?: string;
  drillingNotes?: string;
  sparringNotes?: string;
  createdBy: string;                   // professorId
  createdAt: Date;
  isTemplate: boolean;                 // Reusable lesson template
}

export interface ClassSession {
  id: string;
  lessonPlanId: string;
  date: Date;                          // Actual date conducted
  attendeeIds: string[];               // studentIds present
  notes?: string;                      // Post-class notes
  recordedBy: string;                  // professorId
  createdAt: Date;
}

export interface Attendance {
  id: string;
  sessionId: string;
  userId: string;
  present: boolean;
  arrivedLate?: boolean;
  leftEarly?: boolean;
  notes?: string;
}
```

#### 1.5 Progress Tracking Types (Updated)

```typescript
export interface StudentProgress {
  id: string;
  userId: string;                      // Student ID
  classId: string;
  techniqueId: string;
  completed: boolean;
  verifiedBy?: string;                 // professorId who verified
  verifiedAt?: Date;
  note: string;
  mediaUrl: string;
  photoUri?: string;
  completedAt?: Date;
  lastUpdated: Date;
}

export interface ProgressVerification {
  id: string;
  progressId: string;
  professorId: string;
  status: 'pending' | 'approved' | 'rejected';
  feedback?: string;
  createdAt: Date;
}
```

#### 1.6 Database Schema

**Firebase Firestore Collections:**
```
/users/{userId}
  - email, name, role, photoUrl, createdAt

/classes/{classId}
  - code, name, description, professorId, createdAt, isActive, settings

/class_memberships/{membershipId}
  - classId, userId, role, currentBelt, joinedAt, isActive

/lesson_plans/{lessonPlanId}
  - classId, date, title, techniqueIds, notes, createdBy, isTemplate

/class_sessions/{sessionId}
  - lessonPlanId, date, attendeeIds, notes, recordedBy

/student_progress/{progressId}
  - userId, classId, techniqueId, completed, verifiedBy, verifiedAt, note, mediaUrl

/progress_verifications/{verificationId}
  - progressId, professorId, status, feedback, createdAt
```

**Supabase PostgreSQL Tables:**
```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT CHECK (role IN ('professor', 'student')) NOT NULL,
  photo_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Classes table
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  professor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  settings JSONB DEFAULT '{}'::jsonb
);

-- Class memberships table
CREATE TABLE class_memberships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('professor', 'student')) NOT NULL,
  current_belt TEXT CHECK (current_belt IN ('azul', 'roxa', 'marrom', 'preta')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE,
  UNIQUE(class_id, user_id)
);

-- Lesson plans table
CREATE TABLE lesson_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  title TEXT NOT NULL,
  technique_ids TEXT[] NOT NULL,
  warmup_notes TEXT,
  drilling_notes TEXT,
  sparring_notes TEXT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_template BOOLEAN DEFAULT FALSE
);

-- Class sessions table
CREATE TABLE class_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_plan_id UUID REFERENCES lesson_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  attendee_ids UUID[] NOT NULL,
  notes TEXT,
  recorded_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Student progress table
CREATE TABLE student_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  class_id UUID REFERENCES classes(id) ON DELETE CASCADE,
  technique_id TEXT NOT NULL,
  completed BOOLEAN DEFAULT FALSE,
  verified_by UUID REFERENCES users(id) ON DELETE SET NULL,
  verified_at TIMESTAMPTZ,
  note TEXT DEFAULT '',
  media_url TEXT DEFAULT '',
  photo_uri TEXT,
  completed_at TIMESTAMPTZ,
  last_updated TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, class_id, technique_id)
);

-- Progress verifications table
CREATE TABLE progress_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  progress_id UUID REFERENCES student_progress(id) ON DELETE CASCADE,
  professor_id UUID REFERENCES users(id) ON DELETE CASCADE,
  status TEXT CHECK (status IN ('pending', 'approved', 'rejected')) NOT NULL,
  feedback TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_class_memberships_class ON class_memberships(class_id);
CREATE INDEX idx_class_memberships_user ON class_memberships(user_id);
CREATE INDEX idx_lesson_plans_class ON lesson_plans(class_id);
CREATE INDEX idx_student_progress_user ON student_progress(user_id);
CREATE INDEX idx_student_progress_class ON student_progress(class_id);
CREATE INDEX idx_student_progress_technique ON student_progress(technique_id);
```

---

### Phase 2: Authentication & User Roles (Week 2-3)

#### 2.1 Authentication System

**Provider Choice:** Firebase Auth OR Supabase Auth

**Methods:**
- Email/Password (Primary)
- Google Sign-In (Optional for MVP)
- Phone Authentication (Future)

**Implementation:**
```typescript
// src/services/authService.ts
export interface AuthService {
  signUp(email: string, password: string, name: string, role: 'professor' | 'student'): Promise<User>;
  signIn(email: string, password: string): Promise<User>;
  signOut(): Promise<void>;
  resetPassword(email: string): Promise<void>;
  getCurrentUser(): Promise<User | null>;
  onAuthStateChanged(callback: (user: User | null) => void): () => void;
}
```

#### 2.2 Onboarding Flow

**First Launch Screens:**

1. **Splash Screen** (3s)
   - App logo + tagline
   - Auto-navigate to Sign In if no user

2. **Sign In Screen**
   - Email input
   - Password input
   - "Sign In" button
   - "Don't have an account? Sign Up" link
   - "Forgot Password?" link

3. **Sign Up Screen**
   - Name input
   - Email input
   - Password input (with strength indicator)
   - Confirm password
   - Role selection: Toggle between "I'm a Professor" / "I'm a Student"
   - "Create Account" button
   - "Already have an account? Sign In" link

4. **Profile Setup Screen**
   - Photo upload (optional, can skip)
   - For students: Current belt selection
   - For professors: Bio (optional)
   - "Continue" button

5. **Role-Specific Flow:**

   **Professor:**
   - Welcome message: "Ready to create your first class?"
   - "Create a Class" button → CreateClassWizard
   - "Skip for now" → Dashboard (empty state)

   **Student:**
   - Welcome message: "Join your first class!"
   - 5-digit code input with large numeric keypad
   - "Join Class" button
   - "I don't have a code yet" → Contact professor prompt

#### 2.3 Role-Based Navigation

**Bottom Tab Navigator:**

**Student Tabs:**
```
┌─────────────────────────────────────────┐
│  [Home]  [Class]  [Techniques]  [Profile]│
└─────────────────────────────────────────┘
```
- **Home:** My progress overview, next lesson card
- **Class:** Class info, roster, upcoming lessons
- **Techniques:** Browse 95-technique library
- **Profile:** Settings, account, help

**Professor Tabs:**
```
┌─────────────────────────────────────────┐
│ [Dashboard] [Planner] [Students] [Profile]│
└─────────────────────────────────────────┘
```
- **Dashboard:** Class analytics, recent activity
- **Planner:** Lesson calendar, create lessons
- **Students:** Roster, individual progress, verifications
- **Profile:** Settings, account, help

---

### Phase 3: Class Management Features (Week 3-4)

#### 3.1 Professor: Create Class

**CreateClassWizard Component:**

**Step 1: Basic Info**
- Class Name input (e.g., "Adult BJJ - Monday/Wednesday")
- Description textarea (optional)
- "Next" button

**Step 2: Settings**
- Allow self-verification toggle (default: ON)
- Require photo verification toggle (default: OFF)
- Auto-archive after X days of inactivity (default: 90)
- "Next" button

**Step 3: Class Code Generation**
- Display generated 5-digit alphanumeric code (e.g., "A7X2K")
- "Generate New Code" button
- Copy to clipboard button
- Share button (SMS, WhatsApp, Email)
- "Create Class" button

**Code Generation Logic:**
```typescript
// src/utils/classCodeGenerator.ts
export function generateClassCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Exclude O, 0, I, 1
  let code = '';
  for (let i = 0; i < 5; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

// Ensure uniqueness
export async function generateUniqueClassCode(): Promise<string> {
  let code = generateClassCode();
  let exists = await checkCodeExists(code);

  while (exists) {
    code = generateClassCode();
    exists = await checkCodeExists(code);
  }

  return code;
}
```

#### 3.2 Student: Join Class

**JoinClassModal Component:**

**UI:**
- Large header: "Join a Class"
- Instruction: "Enter the 5-digit code provided by your professor"
- Code input (5 character boxes, auto-advance)
- Preview card (shows class name, professor, member count after valid code)
- Current belt selection dropdown
- "Join Class" button (enabled only after valid code)
- "Cancel" button

**Flow:**
1. Student enters code character-by-character
2. On 5th character, validate code exists
3. If valid, show class preview card
4. Student selects current belt
5. Tap "Join Class" → Create membership record
6. Navigate to Home screen with welcome message

**Error Handling:**
- Invalid code: "Class code not found. Please check with your professor."
- Duplicate join: "You're already a member of this class!"
- Inactive class: "This class is no longer active. Contact your professor."

#### 3.3 Class Code Display (CRITICAL)

**Persistent Header Component:**

**ClassCodeBadge.tsx:**
```typescript
interface ClassCodeBadgeProps {
  classCode: string;
  className: string;
}

// Visual design:
┌─────────────────────────────────┐
│ 📚 Adult BJJ - Mon/Wed          │
│ Code: A7X2K  [📋 Copy] [📤 Share]│
└─────────────────────────────────┘
```

**Features:**
- Always visible in header (sticky)
- Tap code to copy to clipboard → Show "Copied!" toast
- Share button → Native share sheet (SMS, WhatsApp, Email)
- Truncate class name if too long (ellipsis)

**Implementation:**
```typescript
// src/components/shared/Header.tsx
export function Header() {
  const classCode = useStore(state => state.currentClass?.code);
  const className = useStore(state => state.currentClass?.name);

  const handleCopyCode = async () => {
    await Clipboard.setStringAsync(classCode);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    Toast.show({ type: 'success', text1: 'Code copied!' });
  };

  const handleShareCode = async () => {
    await Share.share({
      message: `Join my BJJ class "${className}"! Use code: ${classCode}\n\nDownload the app: [App Store/Play Store link]`
    });
  };

  return (
    <View style={styles.header}>
      <Text style={styles.className} numberOfLines={1}>{className}</Text>
      <View style={styles.codeRow}>
        <Text style={styles.label}>Code:</Text>
        <TouchableOpacity onPress={handleCopyCode}>
          <Text style={styles.code}>{classCode}</Text>
        </TouchableOpacity>
        <IconButton icon="content-copy" onPress={handleCopyCode} />
        <IconButton icon="share" onPress={handleShareCode} />
      </View>
    </View>
  );
}
```

#### 3.4 Class Roster Management (Professor View)

**RosterScreen.tsx:**

**Header Section:**
- Total students count
- Active students (attended in last 30 days)
- "Invite Students" button → Share code modal
- "Export Roster" button → CSV download

**Student List:**
```
┌─────────────────────────────────────────┐
│ [Photo] João Silva              🔵 Azul │
│         Progress: 45/60 (75%)           │
│         Last active: 2 days ago         │
│         [View Progress] [Remove]        │
├─────────────────────────────────────────┤
│ [Photo] Maria Santos            🟣 Roxa │
│         Progress: 12/15 (80%)           │
│         Last active: 5 days ago         │
│         [View Progress] [Remove]        │
└─────────────────────────────────────────┘
```

**Features:**
- Tap student → View detailed progress
- Swipe left → Remove from class (with confirmation)
- Filter by belt
- Sort by: Name, Progress %, Last Active
- Search by name

**Remove Student Dialog:**
```
⚠️ Remove João Silva from class?

This will:
- Revoke their access to class progress
- Keep their progress data for records
- They can rejoin with the class code

[Cancel] [Remove]
```

---

### Phase 4: Lesson Planning & Curriculum (Week 4-6)

#### 4.1 Lesson Planner (Professor View)

**LessonPlannerScreen.tsx:**

**Calendar View:**
- Monthly calendar grid
- Dots under dates with lessons (color-coded by belt focus)
- Tap date → View lesson or Create new
- "Today" button to jump to current date
- Previous/Next month navigation

**Date Selection → Create Lesson:**

**CreateLessonModal:**

```
┌─────────────────────────────────────────┐
│ Create Lesson Plan - Dec 15, 2025      │
├─────────────────────────────────────────┤
│ Title: ________________________________ │
│                                         │
│ Select Techniques:                      │
│ [+ Add Technique] (opens selector)      │
│                                         │
│ Selected Techniques (0):                │
│ (empty state)                           │
│                                         │
│ Warmup Notes:                           │
│ ___________________________________     │
│                                         │
│ Drilling Notes:                         │
│ ___________________________________     │
│                                         │
│ Sparring Notes:                         │
│ ___________________________________     │
│                                         │
│ ☐ Save as template                      │
│                                         │
│ [Cancel]           [Save Lesson Plan]  │
└─────────────────────────────────────────┘
```

**TechniqueSelector Component:**

**UI:**
- Search bar (filter by name, position, category)
- Category tabs: All | Quedas | Passagem | Finalizações | etc.
- Belt filter pills: 🔵 🟣 🟤 ⚫ (multi-select)
- Technique list with checkboxes

**Technique Card in Selector:**
```
┌─────────────────────────────────────────┐
│ ☐ Arm lock - Guarda Fechada             │
│   Finalizações                          │
│   🔵 🟣 🟤 ⚫                           │
│   Counts toward: Azul Guarda, Roxa Arm  │
│   Locks (3), Marrom Arm Locks (4)...    │
└─────────────────────────────────────────┘
```

**After Adding Techniques:**
```
Selected Techniques (3):
┌─────────────────────────────────────────┐
│ 1. Arm lock - Guarda Fechada      [✕]  │
│ 2. Triangle - Guarda Fechada      [✕]  │
│ 3. Omoplata - Guarda Fechada      [✕]  │
└─────────────────────────────────────────┘

💡 Suggestion: Add a guard passing technique
to balance submissions and positional work.
```

**Auto-Suggestions (Future Enhancement):**
- "These techniques pair well with..."
- "Students are struggling with... (based on class progress)"
- "You haven't taught [category] in 4 weeks"

#### 4.2 Lesson Templates

**Save Template Flow:**
- Check "Save as template" when creating lesson
- Prompt for template name
- Store with `isTemplate: true` flag

**Use Template:**
- "Templates" tab in Planner
- List of saved templates
- Tap template → Pre-fill new lesson with techniques and notes
- Modify date and any details
- Save as new lesson plan

**Default Templates (Pre-seeded):**
1. "Fundamentals - Week 1" (8 basic techniques)
2. "Guard Passing Clinic" (4 passing techniques)
3. "Submission Fundamentals" (6 common submissions)
4. "Escapes & Defense" (6 escape techniques)

#### 4.3 Lesson History

**PastLessonsScreen.tsx:**

**List View:**
```
┌─────────────────────────────────────────┐
│ Dec 10, 2025 - Guard Passing Basics     │
│ 4 techniques | 18 students attended    │
│ [View Details]                          │
├─────────────────────────────────────────┤
│ Dec 8, 2025 - Submissions from Mount    │
│ 3 techniques | 20 students attended    │
│ [View Details]                          │
└─────────────────────────────────────────┘
```

**Lesson Detail View:**
- Techniques taught (with checkmarks for which students demonstrated)
- Attendance list
- Post-class notes
- "Repeat This Lesson" button → Create duplicate
- "Edit" button (if no session recorded yet)

**Heatmap Visualization:**
- Grid showing all 95 techniques
- Color intensity = times taught (darker = more frequent)
- Identify under-taught techniques
- Filter by category or belt

#### 4.4 Student View: Upcoming Lessons

**UpcomingLessonsCard Component:**

**Home Screen Widget:**
```
┌─────────────────────────────────────────┐
│ 📅 Next Lesson - Monday, Dec 18         │
│                                         │
│ Guard Passing Fundamentals              │
│                                         │
│ Techniques:                             │
│ • Passagem guarda fechada               │
│ • Toreador pass                         │
│ • Knee slice                            │
│                                         │
│ [View Full Plan] [Add to Calendar]      │
└─────────────────────────────────────────┘
```

**Features:**
- Shows next 3 upcoming lessons
- Add to device calendar integration
- Notification reminder (1 day before, 1 hour before)
- Student can add notes/questions to prepare

---

### Phase 5: Progress Tracking & Analytics (Week 6-8)

#### 5.1 Individual Progress (Student View - Enhanced)

**ProgressScreen.tsx (Redesigned):**

**Hero Section:**
```
┌─────────────────────────────────────────┐
│          Current Belt: Azul             │
│                                         │
│         [Progress Ring: 75%]            │
│            45 / 60 complete             │
│                                         │
│   Class Average: 60%  |  Your Rank: #3  │
└─────────────────────────────────────────┘
```

**Verification Status Indicators:**
- ✅ Self-checked (green)
- 🏆 Professor-verified (gold)
- ⏳ Pending review (orange)
- ❌ Rejected (red, with feedback)

**Technique List Item (Updated):**
```
┌─────────────────────────────────────────┐
│ [🏆] Arm lock - Guarda Fechada          │
│      Verified by Prof. Silva on Dec 10  │
│      🔵 🟣 🟤 ⚫                        │
│      Note: "Clean execution"            │
│      [📷 View Photo] [📹 Video Link]     │
└─────────────────────────────────────────┘
```

**Filter Options:**
- All | Completed | Pending | Verified
- Sort: Alphabetical | Recently completed | Verification status

#### 5.2 Class-Wide Progress (Professor Dashboard)

**DashboardScreen.tsx:**

**Top Stats Cards:**
```
┌─────────┬─────────┬─────────┬─────────┐
│ Total   │ Active  │ Avg     │ Next    │
│Students │Students │Progress │Lesson   │
│   25    │   22    │  68%    │ Dec 18  │
└─────────┴─────────┴─────────┴─────────┘
```

**Belt Distribution Chart:**
```
Azul:    ████████████ 12 students (48%)
Roxa:    ██████ 6 students (24%)
Marrom:  ████ 4 students (16%)
Preta:   ██ 3 students (12%)
```

**Class Progress Overview:**
```
Overall Completion by Belt:
Azul:    ████████░░ 68% (average across 12 students)
Roxa:    ██████░░░░ 55% (average across 6 students)
Marrom:  ████░░░░░░ 42% (average across 4 students)
Preta:   ██░░░░░░░░ 30% (average across 3 students)
```

**Recent Activity Feed:**
```
┌─────────────────────────────────────────┐
│ 🏆 João Silva verified Arm lock - Mount │
│    2 hours ago                          │
├─────────────────────────────────────────┤
│ ✅ Maria Santos completed Triangle       │
│    5 hours ago                          │
├─────────────────────────────────────────┤
│ 📚 Lesson "Guard Passing" taught         │
│    Yesterday at 7:00 PM                 │
└─────────────────────────────────────────┘
```

**Quick Actions:**
- Plan New Lesson
- Take Attendance (for today's lesson)
- Review Pending Verifications (badge count)
- Export Class Report

#### 5.3 Detailed Analytics (Professor)

**AnalyticsScreen.tsx:**

**Technique Mastery Heatmap:**
- Grid of all 95 techniques
- Color = % of students who completed it
- Dark green = 80%+
- Light green = 50-80%
- Yellow = 20-50%
- Red = <20%
- Tap technique → See which students completed it

**Student Progress Comparison:**
- Table view of all students
- Columns: Name, Belt, Progress %, Last Active, Pending Verifications
- Sort by any column
- Identify students who need attention

**Category Analysis:**
```
Quedas:         ████████░░ 75% class average
Passagem:       ██████████ 85% class average
Finalizações:   ██████░░░░ 60% class average
Raspagem:       ████░░░░░░ 45% class average  ⚠️ Focus area
Saídas:         ███████░░░ 70% class average
```

**Recommendations:**
- "Schedule more Raspagem techniques in next lessons"
- "5 students haven't attended in 2+ weeks"
- "João Silva ready for belt promotion (95% complete)"

#### 5.4 Progress Verification System

**Pending Verifications Screen (Professor):**

**List View:**
```
┌─────────────────────────────────────────┐
│ João Silva - Arm lock (Guarda Fechada)  │
│ Submitted: Dec 15, 2025 at 3:45 PM     │
│ Note: "Practiced 10 times"              │
│ [📷 View Photo] [📹 Video Link]          │
│                                         │
│ [✓ Approve] [✕ Reject] [💬 Add Feedback]│
└─────────────────────────────────────────┘
```

**Approve Flow:**
- Tap "✓ Approve"
- Optional feedback text
- Progress updated: `verifiedBy`, `verifiedAt` set
- Student notified (push notification if enabled)

**Reject Flow:**
- Tap "✕ Reject"
- Required feedback text explaining why
- Progress remains unchecked
- Student notified with feedback

**Bulk Verification:**
- "Verify All from Today's Lesson" button
- Select multiple students who demonstrated technique in class
- One-tap approve for all selected

---

### Phase 6: UI/UX Redesign (Week 8-10)

#### 6.1 Navigation Structure

**Bottom Tab Navigator:**

**Student Tabs:**
1. **Home** (Icon: home)
   - My progress overview
   - Next lesson card
   - Recent achievements
   - Quick stats

2. **Class** (Icon: people)
   - Class info card (name, professor, member count)
   - Roster list
   - Upcoming lessons
   - Attendance history

3. **Techniques** (Icon: book)
   - Browse all 95 techniques
   - Filter by category, belt, position
   - Search
   - Technique details (video, description, requirements)

4. **Profile** (Icon: person)
   - User info
   - Settings
   - Help & Support
   - Sign Out

**Professor Tabs:**
1. **Dashboard** (Icon: chart)
   - Class stats overview
   - Recent activity
   - Quick actions

2. **Planner** (Icon: calendar)
   - Lesson calendar
   - Create/edit lessons
   - Templates
   - Lesson history

3. **Students** (Icon: people)
   - Roster
   - Individual progress views
   - Pending verifications
   - Analytics

4. **Profile** (Icon: person)
   - User info
   - Class settings
   - Help & Support
   - Sign Out

#### 6.2 Professor Dashboard (Detailed)

**Layout:**
```
┌─────────────────────────────────────────┐
│ [Header with Class Code Badge]          │
├─────────────────────────────────────────┤
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐        │
│ │ 25  │ │ 22  │ │ 68% │ │Dec18│        │
│ │Total│ │Activ│ │Avg %│ │Next │        │
│ └─────┘ └─────┘ └─────┘ └─────┘        │
├─────────────────────────────────────────┤
│ Next Lesson Preview:                    │
│ ┌─────────────────────────────────────┐ │
│ │ Mon, Dec 18 - Guard Passing         │ │
│ │ 3 techniques | 20 expected          │ │
│ │ [View Plan] [Take Attendance]       │ │
│ └─────────────────────────────────────┘ │
├─────────────────────────────────────────┤
│ Quick Actions:                          │
│ [+ Plan Lesson] [✓ Verify (5)]          │
│ [📊 Analytics] [📤 Share Code]           │
├─────────────────────────────────────────┤
│ Recent Activity:                        │
│ • João verified Arm lock (2h ago)       │
│ • Maria completed Triangle (5h ago)     │
│ • Lesson taught yesterday              │
│ [View All]                              │
└─────────────────────────────────────────┘
```

#### 6.3 Student Home Screen (Redesigned)

**Layout:**
```
┌─────────────────────────────────────────┐
│ [Header with Class Code Badge]          │
├─────────────────────────────────────────┤
│         Current Belt: Azul              │
│      [Progress Ring: 75%]               │
│         45 / 60 complete                │
│   Class Avg: 60% | Your Rank: #3/12    │
├─────────────────────────────────────────┤
│ 📅 Next Lesson - Monday, Dec 18         │
│ Guard Passing Fundamentals              │
│ 3 techniques | [View Details]           │
├─────────────────────────────────────────┤
│ Quick Stats:                            │
│ 🏆 42 Verified | ⏳ 3 Pending            │
│ 🔥 15-day streak | 📚 Last active today │
├─────────────────────────────────────────┤
│ Technique Checklist:                    │
│ ▼ Quedas (2/2) ✓                        │
│ ▶ Passagem (3/4)                        │
│ ▶ Cem Kilos (4/5)                       │
│ ... (collapsible categories)            │
└─────────────────────────────────────────┘
```

#### 6.4 Responsive Design

**Tablet Landscape Mode (Professors):**
```
┌─────────────────────────────────────────────────────────┐
│ [Header with Class Code Badge]                          │
├───────────────────┬─────────────────────────────────────┤
│ Lesson Calendar   │ Lesson Details / Student List       │
│                   │                                     │
│ [Month View]      │ [Selected Lesson Plan]              │
│                   │ or                                  │
│ Dec 15: [•]       │ [Student Roster]                    │
│ Dec 18: [•]       │                                     │
│ Dec 20:           │ Quick filters, search               │
│                   │                                     │
│ [Create Lesson]   │ [Bulk actions]                      │
│                   │                                     │
└───────────────────┴─────────────────────────────────────┘
```

**Tablet Portrait Mode:**
- Maintains single-column layout
- Larger cards
- More whitespace

**Phone:**
- Full-screen single-column layout
- Collapsible sections
- Bottom tab navigation

#### 6.5 Design System

**Colors (Maintain WCAG AA Compliance):**
- Primary: #1E40AF (Blue)
- Secondary: #7C3AED (Purple)
- Success: #10B981 (Green)
- Warning: #F59E0B (Orange)
- Error: #EF4444 (Red)
- Background: #FFFFFF
- Surface: #F9FAFB
- Text Primary: #111827
- Text Secondary: #6B7280

**Typography:**
- Headings: SF Pro Display / Roboto Bold
- Body: SF Pro Text / Roboto Regular
- Code: SF Mono / Roboto Mono (for class codes)

**Spacing:**
- Base unit: 4px
- Common: 8px, 12px, 16px, 24px, 32px

**Components:**
- Buttons: 48px height (touch-friendly)
- Cards: 8px border radius, subtle shadow
- Input fields: 56px height
- Icons: 24px standard, 32px for important actions

---

### Phase 7: Data Sync & Offline Support (Week 10-12)

#### 7.1 Backend Architecture

**Option A: Firebase**

**Pros:**
- Real-time sync with Firestore listeners
- Built-in authentication
- Cloud Functions for business logic
- Firebase Storage for photos
- Generous free tier
- Great React Native support

**Cons:**
- NoSQL data model (less flexible queries)
- Vendor lock-in

**Setup:**
```bash
npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage
```

**Option B: Supabase**

**Pros:**
- PostgreSQL (relational, powerful queries)
- Real-time subscriptions
- Row-level security policies
- Open source (self-hostable)
- Edge Functions (TypeScript)
- Good free tier

**Cons:**
- Younger ecosystem
- Real-time slightly less mature than Firebase

**Setup:**
```bash
npm install @supabase/supabase-js
```

**Recommendation:** **Firebase** for MVP (faster development, proven React Native integration)

#### 7.2 Sync Strategy

**Architecture:**
```
Local State (Zustand)
       ↓ ↑
  Sync Queue
       ↓ ↑
React Query Cache
       ↓ ↑
Firebase/Supabase
```

**Optimistic Updates:**
```typescript
// src/services/syncService.ts
export async function updateTechniqueProgress(
  userId: string,
  classId: string,
  techniqueId: string,
  completed: boolean
) {
  // 1. Update local state immediately (optimistic)
  useStore.setState({
    progress: {
      ...progress,
      [techniqueId]: { completed, lastUpdated: new Date() }
    }
  });

  // 2. Queue mutation
  await syncQueue.add({
    type: 'UPDATE_PROGRESS',
    payload: { userId, classId, techniqueId, completed },
    timestamp: Date.now()
  });

  // 3. Sync when online
  if (isOnline()) {
    await syncQueue.flush();
  }
}
```

**Conflict Resolution:**
- **Strategy:** Last-write-wins (based on `lastUpdated` timestamp)
- **Exception:** Professor verifications always win over student self-checks

**Sync Queue Implementation:**
```typescript
// src/services/offlineQueue.ts
interface QueuedMutation {
  id: string;
  type: 'UPDATE_PROGRESS' | 'CREATE_LESSON' | 'VERIFY_PROGRESS';
  payload: any;
  timestamp: number;
  retries: number;
}

class SyncQueue {
  private queue: QueuedMutation[] = [];

  async add(mutation: Omit<QueuedMutation, 'id' | 'retries'>) {
    const item = {
      id: nanoid(),
      ...mutation,
      retries: 0
    };

    this.queue.push(item);
    await this.persistQueue();

    if (isOnline()) {
      await this.flush();
    }
  }

  async flush() {
    const failed: QueuedMutation[] = [];

    for (const item of this.queue) {
      try {
        await this.executeMutation(item);
      } catch (error) {
        item.retries++;
        if (item.retries < 3) {
          failed.push(item);
        } else {
          console.error('Mutation failed after 3 retries:', item);
          // TODO: Show error to user
        }
      }
    }

    this.queue = failed;
    await this.persistQueue();
  }

  private async executeMutation(item: QueuedMutation) {
    switch (item.type) {
      case 'UPDATE_PROGRESS':
        await updateProgressInFirebase(item.payload);
        break;
      case 'CREATE_LESSON':
        await createLessonInFirebase(item.payload);
        break;
      // ... other cases
    }
  }

  private async persistQueue() {
    await AsyncStorage.setItem('sync-queue', JSON.stringify(this.queue));
  }
}
```

#### 7.3 Real-time Sync

**Firebase Implementation:**
```typescript
// src/hooks/useRealtimeProgress.ts
export function useRealtimeProgress(classId: string) {
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useEffect(() => {
    const unsubscribe = firestore()
      .collection('student_progress')
      .where('classId', '==', classId)
      .onSnapshot(snapshot => {
        const updates = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setProgress(updates);
      });

    return unsubscribe;
  }, [classId]);

  return progress;
}
```

**Supabase Implementation:**
```typescript
// src/hooks/useRealtimeProgress.ts
export function useRealtimeProgress(classId: string) {
  const [progress, setProgress] = useState<StudentProgress[]>([]);

  useEffect(() => {
    const subscription = supabase
      .from('student_progress')
      .on('*', payload => {
        if (payload.new.class_id === classId) {
          setProgress(prev => [...prev, payload.new]);
        }
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, [classId]);

  return progress;
}
```

#### 7.4 Offline Mode

**Features:**
- Full read/write capability offline
- Sync queue indicator in header: "3 changes pending sync"
- Auto-sync on reconnect
- Manual "Sync Now" button if needed

**Offline Indicator:**
```
┌─────────────────────────────────────────┐
│ [Header]                  📶 Offline    │
│                           3 pending ⏳   │
└─────────────────────────────────────────┘
```

**Network Status Detection:**
```typescript
// src/hooks/useNetworkStatus.ts
import NetInfo from '@react-native-community/netinfo';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(state => {
      setIsOnline(state.isConnected && state.isInternetReachable);
    });

    return unsubscribe;
  }, []);

  return isOnline;
}
```

---

### Phase 8: Security & Privacy (Week 12-13)

#### 8.1 Access Control

**Firestore Security Rules:**
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users can only read/write their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Classes: professor can manage, students can read
    match /classes/{classId} {
      allow read: if request.auth != null &&
                     exists(/databases/$(database)/documents/class_memberships/$(request.auth.uid + '_' + classId));
      allow create: if request.auth != null;
      allow update, delete: if request.auth != null &&
                               resource.data.professorId == request.auth.uid;
    }

    // Class memberships: professor can manage, students can read own
    match /class_memberships/{membershipId} {
      allow read: if request.auth != null &&
                     (resource.data.userId == request.auth.uid ||
                      get(/databases/$(database)/documents/classes/$(resource.data.classId)).data.professorId == request.auth.uid);
      allow create: if request.auth != null;
      allow delete: if request.auth != null &&
                       get(/databases/$(database)/documents/classes/$(resource.data.classId)).data.professorId == request.auth.uid;
    }

    // Student progress: student can manage own, professor can read/verify
    match /student_progress/{progressId} {
      allow read: if request.auth != null &&
                     (resource.data.userId == request.auth.uid ||
                      get(/databases/$(database)/documents/classes/$(resource.data.classId)).data.professorId == request.auth.uid);
      allow create, update: if request.auth != null && resource.data.userId == request.auth.uid;
      allow update: if request.auth != null &&
                       get(/databases/$(database)/documents/classes/$(resource.data.classId)).data.professorId == request.auth.uid;
    }

    // Lesson plans: professor can manage, students can read
    match /lesson_plans/{planId} {
      allow read: if request.auth != null &&
                     exists(/databases/$(database)/documents/class_memberships/$(request.auth.uid + '_' + resource.data.classId));
      allow create, update, delete: if request.auth != null &&
                                        resource.data.createdBy == request.auth.uid;
    }
  }
}
```

**Supabase Row-Level Security (RLS):**
```sql
-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_plans ENABLE ROW LEVEL SECURITY;

-- Users can only see their own data
CREATE POLICY "Users can view own data" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own data" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Classes: members can read, professor can manage
CREATE POLICY "Class members can view" ON classes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM class_memberships
      WHERE class_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Professor can manage class" ON classes
  FOR ALL USING (professor_id = auth.uid());

-- Student progress: student owns, professor can verify
CREATE POLICY "Student can manage own progress" ON student_progress
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Professor can view class progress" ON student_progress
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id AND professor_id = auth.uid()
    )
  );

CREATE POLICY "Professor can verify progress" ON student_progress
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM classes
      WHERE id = class_id AND professor_id = auth.uid()
    )
  );
```

#### 8.2 Data Privacy (GDPR Compliance)

**Privacy Policy Updates:**
- Update existing `PRIVACY_POLICY.md`
- Add section on class data collection
- Explain professor's access to student progress
- Right to data export
- Right to deletion

**Data Export:**
```typescript
// src/services/dataExport.ts
export async function exportUserData(userId: string): Promise<Blob> {
  const user = await getUser(userId);
  const progress = await getUserProgress(userId);
  const memberships = await getUserMemberships(userId);

  const exportData = {
    user,
    progress,
    memberships,
    exportedAt: new Date().toISOString()
  };

  return new Blob([JSON.stringify(exportData, null, 2)], {
    type: 'application/json'
  });
}
```

**Account Deletion:**
```typescript
// Cloud Function (Firebase) / Edge Function (Supabase)
export async function deleteUserAccount(userId: string) {
  // 1. Delete user progress
  await deleteCollection('student_progress', { userId });

  // 2. Remove from class memberships
  await deleteCollection('class_memberships', { userId });

  // 3. Delete uploaded photos
  await deleteUserPhotos(userId);

  // 4. Anonymize or delete user record
  await firestore().collection('users').doc(userId).delete();

  // 5. Delete auth account
  await admin.auth().deleteUser(userId);
}
```

#### 8.3 Rate Limiting & Abuse Prevention

**Class Creation Limits:**
- Max 5 classes per professor account
- Max 1 class creation per hour
- Implement server-side validation

**Class Code Reuse:**
- Class codes expire after 90 days of inactivity
- Auto-archive inactive classes
- Codes can be reused after archival

**Content Moderation:**
```typescript
// Report inappropriate content
interface ContentReport {
  id: string;
  reporterId: string;
  contentType: 'note' | 'photo' | 'video';
  contentId: string;
  reason: string;
  createdAt: Date;
}

// Professor can remove student submissions
export async function removeStudentSubmission(
  professorId: string,
  progressId: string,
  reason: string
) {
  // Verify professor has authority
  const progress = await getProgress(progressId);
  const classData = await getClass(progress.classId);

  if (classData.professorId !== professorId) {
    throw new Error('Unauthorized');
  }

  // Clear submission data
  await updateProgress(progressId, {
    note: '',
    mediaUrl: '',
    photoUri: null
  });

  // Log action
  await logAudit({
    action: 'REMOVE_SUBMISSION',
    professorId,
    progressId,
    reason,
    timestamp: new Date()
  });
}
```

---

### Phase 9: Testing & Deployment (Week 13-14)

#### 9.1 Testing Strategy

**Unit Tests (Jest):**
```typescript
// src/__tests__/classCodeGenerator.test.ts
describe('generateClassCode', () => {
  it('generates 5-character code', () => {
    const code = generateClassCode();
    expect(code).toHaveLength(5);
  });

  it('excludes confusing characters', () => {
    const code = generateClassCode();
    expect(code).not.toMatch(/[O0I1]/);
  });

  it('generates unique codes', async () => {
    const codes = new Set();
    for (let i = 0; i < 1000; i++) {
      codes.add(generateClassCode());
    }
    expect(codes.size).toBe(1000);
  });
});
```

**Integration Tests:**
```typescript
// src/__tests__/integration/classFlow.test.ts
describe('Class creation and joining flow', () => {
  it('professor creates class, student joins', async () => {
    // 1. Professor signs up
    const professor = await signUp('prof@test.com', 'password', 'Professor', 'professor');

    // 2. Create class
    const classData = await createClass({
      name: 'Test Class',
      professorId: professor.id
    });

    expect(classData.code).toBeDefined();

    // 3. Student signs up
    const student = await signUp('student@test.com', 'password', 'Student', 'student');

    // 4. Student joins class
    const membership = await joinClass(student.id, classData.code, 'azul');

    expect(membership.classId).toBe(classData.id);
    expect(membership.userId).toBe(student.id);
  });
});
```

**E2E Tests (Detox):**
```typescript
// e2e/professorFlow.e2e.ts
describe('Professor flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  it('should create class and plan lesson', async () => {
    // Sign in as professor
    await element(by.id('email-input')).typeText('prof@test.com');
    await element(by.id('password-input')).typeText('password');
    await element(by.id('sign-in-button')).tap();

    // Create class
    await element(by.id('create-class-button')).tap();
    await element(by.id('class-name-input')).typeText('Test Class');
    await element(by.id('create-class-submit')).tap();

    // Verify class code is visible
    await expect(element(by.id('class-code-badge'))).toBeVisible();

    // Plan lesson
    await element(by.id('planner-tab')).tap();
    await element(by.id('create-lesson-button')).tap();
    await element(by.id('lesson-title-input')).typeText('Test Lesson');
    await element(by.id('add-technique-button')).tap();
    // ... select techniques
    await element(by.id('save-lesson-button')).tap();

    await expect(element(by.text('Test Lesson'))).toBeVisible();
  });
});
```

#### 9.2 Beta Testing

**Beta Program Setup:**
1. Create Firebase App Distribution / TestFlight beta builds
2. Invite Brothers Fight academy professors and students
3. Aim for 3-4 classes (15-25 students each)

**Feedback Collection:**
- In-app feedback button (Instabug or similar)
- Weekly survey links
- Professor interview sessions (30 min each)

**Metrics to Track:**
- Crash-free rate (target: >99.5%)
- DAU/MAU ratio (target: >0.3)
- Avg session duration (target: >5 min)
- Feature usage: Lesson planning, verification, etc.
- Performance: API response times, sync latency

#### 9.3 Phased Rollout

**Phase 1: Closed Beta (Week 14)**
- Invite-only via TestFlight / App Distribution
- 50-100 users max
- Daily monitoring and rapid bug fixes

**Phase 2: Open Beta (Week 15-16)**
- Public beta signup form
- Release to TestFlight Public Link / Google Play Beta
- 200-500 users
- Weekly updates based on feedback

**Phase 3: Production Release (Week 17)**
- Soft launch (no marketing push)
- Monitor for critical issues
- Ensure backend scales properly

**Phase 4: Marketing Push (Week 18+)**
- App Store feature submission
- Social media announcements
- BJJ community forums (Reddit, Facebook groups)

---

### Phase 10: Migration from v1.0 to v2.0

#### 10.1 Migration Strategy

**Detection:**
```typescript
// Check if user has v1 data
const hasV1Data = await AsyncStorage.getItem('bjj-checklist-storage');
const migrated = await AsyncStorage.getItem('migrated-to-v2');

if (hasV1Data && !migrated) {
  // Show migration wizard
  navigation.navigate('MigrationWizard');
}
```

**Migration Wizard Screens:**

**Screen 1: Welcome**
```
┌─────────────────────────────────────────┐
│        🎉 Welcome to BJJ v2.0!          │
│                                         │
│ We've detected progress from v1.        │
│ Let's upgrade your data!                │
│                                         │
│ What's new:                             │
│ • Join classes with professors          │
│ • Cross-belt progress tracking          │
│ • Lesson planning & calendar            │
│ • Get verified by instructors           │
│                                         │
│ [Continue]                              │
└─────────────────────────────────────────┘
```

**Screen 2: Create Account**
```
┌─────────────────────────────────────────┐
│     Create Your Account                 │
│                                         │
│ Email: _____________________________    │
│ Password: __________________________    │
│ Confirm: ___________________________    │
│                                         │
│ [Create Account]                        │
└─────────────────────────────────────────┘
```

**Screen 3: Class Choice**
```
┌─────────────────────────────────────────┐
│     Join a Class                        │
│                                         │
│ Do you have a class code from your      │
│ professor?                              │
│                                         │
│ [Yes, I have a code]                    │
│ [No, I'll create my own class]          │
│ [Skip for now]                          │
└─────────────────────────────────────────┘
```

**Screen 4: Import Progress**
```
┌─────────────────────────────────────────┐
│     Importing Your Progress...          │
│                                         │
│ [Progress Bar: 75%]                     │
│                                         │
│ Mapping techniques...                   │
│ 45 / 60 techniques imported             │
│                                         │
│ Please wait...                          │
└─────────────────────────────────────────┘
```

**Screen 5: Complete**
```
┌─────────────────────────────────────────┐
│        ✅ Migration Complete!            │
│                                         │
│ Your progress has been upgraded:        │
│ • 45 techniques imported                │
│ • Cross-belt benefits activated         │
│ • Notes and photos preserved            │
│                                         │
│ You're now ready to use BJJ v2.0!       │
│                                         │
│ [Get Started]                           │
└─────────────────────────────────────────┘
```

#### 10.2 Data Mapping Script

```typescript
// src/services/migration.ts
interface V1Progress {
  [beltId: string]: {
    [requirementId: string]: {
      completed: boolean;
      note: string;
      mediaUrl: string;
      photoUri?: string;
    };
  };
}

// Map old requirement IDs to new technique IDs
const V1_TO_V2_MAPPING: Record<string, string> = {
  // Blue belt
  'azul-quedas-1': 'queda-double-leg',
  'azul-quedas-2': 'queda-single-leg',
  'azul-passagem-1': 'passagem-guarda-fechada',
  'azul-passagem-2': 'passagem-meia-joelho',
  'azul-passagem-3': 'passagem-meia-montada',
  'azul-passagem-4': 'passagem-aberta-toreador',
  'azul-cemkilos-1': 'americana-cem-kilos',
  'azul-cemkilos-2': 'katagatame-cem-kilos',
  'azul-cemkilos-3': 'kimura-cem-kilos',
  'azul-cemkilos-4': 'kimura-norte-sul',
  'azul-cemkilos-5': 'armlock-cem-kilos',
  'azul-joelho-1': 'armlock-joelho-barriga',
  'azul-joelho-2': 'estrang-cruzado-joelho',
  'azul-joelho-3': 'estrang-cruzado-joelho-lapela',
  'azul-montada-1': 'americana-montada',
  'azul-montada-2': 'ezequiel-montada',
  'azul-montada-3': 'armlock-montada',
  'azul-montada-4': 'estrang-cruzado-montada',
  'azul-guarda-1': 'armlock-guarda-fechada',
  'azul-guarda-2': 'omoplata-guarda-fechada',
  'azul-guarda-3': 'triangulo-guarda-fechada',
  'azul-guarda-4': 'kimura-guarda-fechada',
  'azul-guarda-5': 'estrang-cruzado-guarda-fechada',
  'azul-meia-1': 'raspagem-meia-esgrima',
  'azul-meia-2': 'raspagem-meia-esgrima-costa',
  'azul-costas-1': 'mata-leao-costas',
  'azul-costas-2': 'estrang-cruzado-costas',
  'azul-costas-3': 'arco-flexa-costas',
  'azul-raspagem-1': 'raspagem-guarda-fechada-montada',
  'azul-raspagem-2': 'raspagem-tesoura',
  'azul-raspagem-3': 'raspagem-kimura',
  'azul-raspagem-4': 'raspagem-gancho',
  'azul-saidas-1': 'saida-montada-upa',
  'azul-saidas-2': 'saida-100-kilos',
  'azul-saidas-3': 'saida-costas-hand-fight',
  'azul-saidas-4': 'saida-triangulo',
  'azul-saidas-5': 'saida-armlock-guarda',
  'azul-saidas-6': 'saida-armlock-costas',
  'azul-saidas-7': 'reposicao-guarda-fechada',
  'azul-fund-1': 'fund-amarrar-faixa',
  'azul-fund-2': 'fund-pontuacoes',
  'azul-fund-3': 'fund-saida-quadril',
  'azul-fund-4': 'fund-rolamento-frente',
  'azul-fund-5': 'fund-rolamento-costas',
  'azul-fund-6': 'fund-sprawl',
  'azul-fund-7': 'fund-chamar-guarda-fechada',
  'azul-fund-8': 'fund-chamar-guarda-aberta',
  'azul-fund-9': 'fund-chamar-meia-guarda',
  'azul-ataque-1': 'ataque-botinha-passagem'
};

export async function migrateV1ToV2(
  userId: string,
  classId: string
): Promise<void> {
  // 1. Read v1 data
  const v1Data = await AsyncStorage.getItem('bjj-checklist-storage');
  if (!v1Data) return;

  const parsedData: { progress: V1Progress } = JSON.parse(v1Data);

  // 2. Map to new structure
  const newProgress: StudentProgress[] = [];

  Object.entries(parsedData.progress).forEach(([beltId, requirements]) => {
    Object.entries(requirements).forEach(([reqId, reqData]) => {
      const techniqueId = V1_TO_V2_MAPPING[reqId];

      if (techniqueId) {
        newProgress.push({
          id: `${userId}_${classId}_${techniqueId}`,
          userId,
          classId,
          techniqueId,
          completed: reqData.completed,
          note: reqData.note || '',
          mediaUrl: reqData.mediaUrl || '',
          photoUri: reqData.photoUri,
          completedAt: reqData.completed ? new Date() : undefined,
          lastUpdated: new Date()
        });
      }
    });
  });

  // 3. Upload to backend
  const batch = firestore().batch();
  newProgress.forEach(progress => {
    const ref = firestore().collection('student_progress').doc(progress.id);
    batch.set(ref, progress);
  });

  await batch.commit();

  // 4. Mark as migrated
  await AsyncStorage.setItem('migrated-to-v2', 'true');

  // 5. Clear old data (optional, keep as backup)
  // await AsyncStorage.removeItem('bjj-checklist-storage');
}
```

---

## 🎯 Implementation Roadmap

### Timeline (14 Weeks Total)

**Week 1-2: Foundation**
- ✅ Implement technique-centric data model
- ✅ Create 95-technique master list
- ✅ Update TypeScript types
- ✅ Write migration mapping

**Week 2-3: Authentication**
- ✅ Set up Firebase/Supabase project
- ✅ Implement auth screens (Sign In, Sign Up)
- ✅ Build onboarding flow
- ✅ Create user profile setup

**Week 3-4: Class Management**
- ✅ Build CreateClassWizard
- ✅ Implement class code generator
- ✅ Build JoinClassModal
- ✅ Create persistent ClassCodeBadge header
- ✅ Build RosterScreen

**Week 4-6: Lesson Planning**
- ✅ Create lesson calendar UI
- ✅ Build CreateLessonModal
- ✅ Implement TechniqueSelector
- ✅ Add lesson templates
- ✅ Build lesson history view

**Week 6-8: Progress & Analytics**
- ✅ Redesign student progress screen
- ✅ Add verification indicators
- ✅ Build professor dashboard
- ✅ Create analytics screen
- ✅ Implement verification workflow

**Week 8-10: UI/UX Polish**
- ✅ Finalize navigation structure
- ✅ Responsive layouts (tablet/phone)
- ✅ Design system consistency
- ✅ Accessibility audit (WCAG AA)

**Week 10-12: Backend & Sync**
- ✅ Set up Firestore/Supabase schema
- ✅ Implement real-time sync
- ✅ Build offline queue system
- ✅ Add conflict resolution
- ✅ Network status handling

**Week 12-13: Security & Privacy**
- ✅ Configure security rules
- ✅ Update privacy policy
- ✅ Implement data export
- ✅ Add account deletion
- ✅ Rate limiting

**Week 13-14: Testing & Launch**
- ✅ Unit tests
- ✅ Integration tests
- ✅ E2E tests
- ✅ Beta testing program
- ✅ Production deployment

---

## 📊 Success Metrics

### User Engagement
- **DAU/MAU:** >0.3 (students check app 3x/week)
- **Session Duration:** >5 minutes average
- **30-day Retention:** >70%
- **Weekly Active:** >50% of users

### Professor Adoption
- **Lesson Planning:** 80% create ≥1 lesson/month
- **Verification Rate:** >60% of submissions verified
- **Class Size:** 15-25 students average
- **Active Professors:** >80% log in weekly

### Technical Health
- **Crash-Free Rate:** >99.5%
- **Sync Success:** >99% of mutations synced
- **API Response Time:** <500ms p95
- **Offline Queue:** <5% failed syncs

### Business Goals
- **1000 Total Users** by end of Q2 2025
- **100 Active Classes** by end of Q2 2025
- **4.5+ Star Rating** on both app stores
- **<5% Churn Rate** monthly

---

## 🔧 Technology Dependencies

### New Packages (v2.0)

```json
{
  "dependencies": {
    "@react-native-async-storage/async-storage": "2.2.0",
    "@react-native-community/netinfo": "^11.0.0",
    "@tanstack/react-query": "^5.17.0",
    "expo": "^54.0.23",
    "expo-clipboard": "~7.0.0",
    "expo-file-system": "~19.0.17",
    "expo-haptics": "~15.0.7",
    "expo-image-manipulator": "~14.0.7",
    "expo-image-picker": "~17.0.8",
    "expo-notifications": "~0.30.0",
    "expo-screen-orientation": "~9.0.7",
    "expo-sharing": "~14.0.7",
    "firebase": "^11.0.0",
    "nanoid": "^5.0.0",
    "react": "19.1.0",
    "react-native": "0.81.5",
    "react-native-calendars": "^1.1305.0",
    "react-native-gesture-handler": "~2.28.0",
    "react-native-paper": "^5.14.5",
    "react-native-reanimated": "~4.1.1",
    "react-native-safe-area-context": "~5.6.0",
    "zustand": "^5.0.8"
  },
  "devDependencies": {
    "@babel/core": "^7.20.0",
    "@testing-library/react-native": "^12.0.0",
    "@types/jest": "^29.5.0",
    "@types/react": "~19.1.10",
    "babel-preset-expo": "^54.0.6",
    "detox": "^20.0.0",
    "jest": "^29.7.0",
    "typescript": "~5.9.2"
  }
}
```

---

## 🎓 Next Immediate Steps

### Week 1 Tasks (Start Here)

1. **Choose Backend:** Firebase vs Supabase decision
   - Create new Firebase/Supabase project
   - Set up authentication
   - Initialize database

2. **Implement Technique Data Model:**
   - Create `src/data/techniques.ts` with all 95 techniques
   - Create `src/data/beltRequirements.ts`
   - Update `src/types/index.ts`

3. **Build Class Code Generator:**
   - Implement `generateClassCode()` function
   - Add uniqueness check
   - Unit tests

4. **Create Authentication Screens:**
   - SignInScreen.tsx
   - SignUpScreen.tsx
   - OnboardingScreen.tsx

5. **Persistent Header Component:**
   - ClassCodeBadge.tsx
   - Copy to clipboard functionality
   - Share button

---

## 📝 Open Questions / Decisions Needed

1. **Backend Choice:** Firebase or Supabase?
   - **Recommendation:** Firebase for faster MVP

2. **Payment Model (Future):**
   - Free for students, paid for professors?
   - Freemium (free tier + premium features)?
   - One-time purchase vs subscription?

3. **Push Notifications:**
   - Include in MVP or v2.1?
   - **Recommendation:** v2.1 (not critical for launch)

4. **Multi-Language Support:**
   - Start with Portuguese only or add English?
   - **Recommendation:** Portuguese only for MVP

5. **Video Hosting:**
   - Embed YouTube links (current) or host videos?
   - **Recommendation:** Continue with YouTube links

6. **Professor Verification:**
   - How to verify someone is actually a BJJ professor?
   - **Recommendation:** Honor system for MVP, manual verification later

---

## 📄 Appendix

### A. Glossary

- **BJJ:** Brazilian Jiu-Jitsu
- **Azul:** Blue belt (1st belt after white)
- **Roxa:** Purple belt (2nd belt)
- **Marrom:** Brown belt (3rd belt)
- **Preta:** Black belt (highest belt)
- **Technique:** A specific move or skill (e.g., "Arm lock from Closed Guard")
- **Requirement:** A belt graduation criteria (e.g., "3 Arm Locks")
- **Lesson Plan:** A structured class outline with techniques to teach
- **Verification:** Professor approval of a student's technique completion

### B. File Structure (Complete)

```
app-checklist-graduacao-jiu-jitsu/
├── src/
│   ├── api/
│   │   ├── auth.ts
│   │   ├── classes.ts
│   │   ├── lessonPlans.ts
│   │   ├── progress.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── auth/
│   │   │   ├── SignInForm.tsx
│   │   │   └── SignUpForm.tsx
│   │   ├── class/
│   │   │   ├── ClassCodeBadge.tsx
│   │   │   ├── CreateClassWizard.tsx
│   │   │   ├── JoinClassModal.tsx
│   │   │   └── RosterList.tsx
│   │   ├── lesson/
│   │   │   ├── CalendarView.tsx
│   │   │   ├── CreateLessonModal.tsx
│   │   │   ├── LessonCard.tsx
│   │   │   └── TechniqueSelector.tsx
│   │   ├── progress/
│   │   │   ├── ProgressRing.tsx
│   │   │   ├── TechniqueItem.tsx
│   │   │   └── VerificationBadge.tsx
│   │   └── shared/
│   │       ├── Header.tsx
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   ├── data/
│   │   ├── belts.ts
│   │   ├── beltRequirements.ts
│   │   ├── requirements.ts (legacy, to be deprecated)
│   │   └── techniques.ts (NEW - 95 techniques)
│   ├── hooks/
│   │   ├── useAuth.ts
│   │   ├── useClass.ts
│   │   ├── useLessonPlans.ts
│   │   ├── useNetworkStatus.ts
│   │   ├── useProgress.ts
│   │   └── useRealtimeSync.ts
│   ├── navigation/
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   ├── ProfessorNavigator.tsx
│   │   └── StudentNavigator.tsx
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── OnboardingScreen.tsx
│   │   │   ├── SignInScreen.tsx
│   │   │   └── SignUpScreen.tsx
│   │   ├── professor/
│   │   │   ├── AnalyticsScreen.tsx
│   │   │   ├── DashboardScreen.tsx
│   │   │   ├── LessonPlannerScreen.tsx
│   │   │   ├── RosterScreen.tsx
│   │   │   └── VerificationsScreen.tsx
│   │   ├── student/
│   │   │   ├── ClassInfoScreen.tsx
│   │   │   ├── HomeScreen.tsx
│   │   │   ├── ProgressScreen.tsx
│   │   │   └── TechniquesScreen.tsx
│   │   └── shared/
│   │       ├── ProfileScreen.tsx
│   │       └── SettingsScreen.tsx
│   ├── services/
│   │   ├── authService.ts
│   │   ├── dataExport.ts
│   │   ├── migration.ts
│   │   ├── offlineQueue.ts
│   │   └── syncService.ts
│   ├── store/
│   │   └── index.ts (Zustand store)
│   ├── types/
│   │   └── index.ts
│   └── utils/
│       ├── classCodeGenerator.ts
│       ├── dateUtils.ts
│       └── photoUtils.ts
├── assets/
├── firebase.json (or supabase config)
├── app.json
├── babel.config.js
├── eas.json
├── package.json
├── tsconfig.json
├── MASTER_TECHNIQUE_LIST.md
├── PROPOSED_DATA_STRUCTURE.md
├── V2_REQUIREMENTS_PLAN.md (this document)
└── README.md
```

---

## 🚀 Conclusion

This requirements document outlines a comprehensive transformation of the BJJ Checklist app from a solo progress tracker to a professional class management platform. The 14-week roadmap balances ambition with practical MVP scope, prioritizing core features that deliver immediate value to both professors and students.

**Key Success Factors:**
1. **Technique-centric data model** eliminates duplication and unlocks cross-belt benefits
2. **5-digit class codes** make joining frictionless
3. **Offline-first architecture** ensures reliability in gym environments
4. **Role-based views** tailor the experience to professors vs students
5. **Real-time sync** keeps everyone on the same page

By following this plan, BJJ Checklist v2.0 will become the go-to tool for BJJ academies worldwide to manage curriculum, track student progress, and build stronger training communities.

**Questions?** Contact development team or refer to specific phase documentation.

---

**Document Version:** 1.0
**Last Updated:** 2025-11-15
**Status:** ✅ Approved for Implementation
