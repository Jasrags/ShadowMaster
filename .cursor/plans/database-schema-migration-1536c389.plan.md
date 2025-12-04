<!-- 1536c389-3657-41dc-a5df-0eda1801651a 6a97c2fb-9ff0-459e-b0fe-b91907ffe14a -->
# Database Schema & Migrations Implementation

## Overview

Create a comprehensive Supabase database schema for the Shadowrun VTT application with proper relationships, security policies, and type safety.

## Implementation Steps

### 1. Create Migration File Structure

- Create `supabase/migrations/` directory if it doesn't exist
- Create `supabase/migrations/001_initial_schema.sql` with the complete schema

### 2. Define Database Schema

Create the following tables in the migration file:

**Enums:**

- `player_role` enum: `'player'`, `'gamemaster'`, `'administrator'`
- `session_status` enum: `'planned'`, `'active'`, `'completed'`
- `character_state` enum: `'creation'`, `'advancement'`

**Tables:**

- `users_profile` - extends Supabase auth.users with username, avatar_url, timestamps
- `campaigns` - campaign data with GM reference, setting, active status
- `campaign_players` - many-to-many relationship with composite primary key
- `characters` - character data with JSONB for game data, linked to campaigns and players
- `sessions` - game sessions with status enum
- `game_state` - session-specific game state with JSONB fields for initiative, effects, map
- `maps` - campaign maps with grid configuration and metadata

### 3. Implement Row Level Security (RLS)

Add RLS policies for:

- `users_profile`: Users can read/update their own profile
- `campaigns`: GMs can manage their campaigns; players can read campaigns they're in
- `campaign_players`: Campaign members can read; GMs can manage
- `characters`: Campaign members can read; owners/GMs can update
- `sessions`: Campaign members can read; GMs can manage
- `game_state`: Campaign members can read; only GMs can update
- `maps`: Campaign members can read; GMs can manage

### 4. Create Performance Indexes

Add indexes on:

- `campaigns.gm_user_id`
- `characters.campaign_id`
- `characters.player_user_id`
- `sessions.campaign_id`
- `maps.campaign_id`

### 5. Generate TypeScript Types

- Use Supabase CLI command: `npx supabase gen types typescript --local > src/types/database.ts`
- This will replace the existing placeholder types in [src/types/database.ts](src/types/database.ts)

### 6. Create Type-Safe Query Builder Helper

- Create [src/lib/supabase/schema.ts](src/lib/supabase/schema.ts) with helper functions for type-safe queries
- Include helpers for common operations like fetching campaigns, characters, sessions with proper joins
- Use the generated Database types for full type safety

## Files to Create/Modify

1. **Create**: `supabase/migrations/001_initial_schema.sql` - Complete migration with tables, enums, RLS, indexes
2. **Update**: `src/types/database.ts` - Generated types from Supabase CLI
3. **Create**: `src/lib/supabase/schema.ts` - Type-safe query builder helpers

## Key Implementation Details

- Use `uuid` for all primary keys with `gen_random_uuid()` default
- Use `timestamptz` for all timestamp fields with appropriate defaults
- Foreign keys should use `ON DELETE CASCADE` or `ON DELETE RESTRICT` as appropriate
- RLS policies should check `auth.uid()` for user context
- Helper functions in `schema.ts` should leverage the generated Database types for autocomplete and type safety

### To-dos

- [ ] Create supabase/migrations/001_initial_schema.sql with all table definitions, enums, foreign keys, and constraints
- [ ] Add Row Level Security policies for all tables with appropriate access controls for GMs, players, and campaign members
- [ ] Create indexes on foreign key columns and frequently queried fields (campaign_id, player_user_id, gm_user_id)
- [ ] Run Supabase CLI to generate TypeScript types from the schema and update src/types/database.ts
- [ ] Create src/lib/supabase/schema.ts with type-safe query builder helper functions for common operations