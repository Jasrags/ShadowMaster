# Application Flow

This document describes how ShadowMaster works from a user perspective.

## Home Page

The home page provides a combined login and registration interface. Users can:
- Log in with their email and password
- Register a new account
- After successful login, view their dashboard with campaigns they are members of

**Note:** The first user to register automatically receives **Administrator** privileges. All subsequent users default to **Player** role but can be elevated by an Administrator.

## Campaign Creation

When creating a campaign, the following must be selected and **cannot be changed** after creation:
- **Edition**: The Shadowrun edition (currently SR3 or SR5)
- **Character Creation Method**: The method used for character creation in this campaign
  - For SR5: Priority (default), Sum to Ten, or Karma
  - For SR3: Priority system

Additional campaign settings:
- **Gameplay Level** (SR5 only): Street, Experienced (default), or Prime
- Campaign name, description, theme, and house rules
- Factions, locations, and other campaign-specific data

## Core Concepts

### Users
- Users are the authentication model
- A user can have multiple characters
- Users have roles: Administrator, Gamemaster, or Player

### Characters
- Characters are linked to a User
- Characters can be either **Player Characters (PCs)** or **NPCs**
  - **Player Characters**: Linked to a User and a Campaign
  - **NPCs**: Not linked to a User, but linked to a Campaign and controlled by the Gamemaster
- Characters are created within a Campaign and are linked to that Campaign
- Characters use the edition and creation method specified by their Campaign

### Campaigns
- Campaigns have an **edition** (SR3, SR5, etc.) which determines the ruleset and available data
- Campaigns have a **character creation method** which is part of their ruleset
- Campaigns can have multiple Characters
- Campaigns can have multiple Sessions
- Campaigns can have multiple Players

### Sessions
- Sessions are linked to a Campaign
- A session represents an individual play session within a campaign
- Sessions can have multiple Scenes

### Scenes
- Scenes are linked to a Session
- A scene represents an individual scene within a session
- Scenes can have multiple Characters

## Character Creation

### Shadowrun 5th Edition (SR5)

SR5 supports three character creation methods:

1. **Priority Method** (default)
   - Assign priorities (A-E) to: Metatype, Attributes, Magic/Resonance, Skills, Resources
   - Each priority level provides different benefits
   - Gameplay levels (Street, Experienced, Prime) affect starting karma and resources

2. **Sum to Ten Method**
   - Similar to Priority but allows more flexibility
   - Priorities must sum to 10 points total

3. **Karma Build Method**
   - Build characters using karma points
   - More flexibility but requires careful point allocation

### Shadowrun 3rd Edition (SR3)

SR3 uses the Priority system:
- Assign priorities (A-E) to: Metatype, Attributes, Magic, Skills, Resources
- Each priority level determines available options and points

## User Management

### Roles

Users have Role-Based Access Control (RBAC) privileges:

- **Administrator**: Full access to the application
  - Can manage users
  - Can access all campaigns
  - Can modify system settings

- **Gamemaster**: Campaign and session management
  - Can create, edit, and delete campaigns
  - Can create, edit, and delete sessions
  - Can create, edit, and delete scenes
  - Can manage characters in their campaigns
  - Can view all campaigns they are assigned to

- **Player**: Access to assigned campaigns
  - Can view campaigns they are members of
  - Can create and manage their own characters in campaigns
  - Can view sessions and scenes in their campaigns

### User Login

- Users log in using their email and password
- Sessions are managed via HTTP-only cookies
- Users can log out to clear their session
- Users can change their password (requires current password)

### Password Requirements

Passwords must:
- Be at least 8 characters long
- Contain at least one uppercase letter
- Contain at least one lowercase letter
- Contain at least one number
- Not contain the username
- Not contain the email
- Not contain the player name
- Not contain the campaign name
- Not contain the session name

### User Registration

- Registration requires: email, password, and username
- Usernames must be unique
- The first user to register becomes an Administrator
- All subsequent users default to Player role
- Email cannot be changed after registration
- Username can be changed (must remain unique)

## Campaign Management

### Creating a Campaign

A Gamemaster can create a campaign by:
1. Selecting an edition (SR3 or SR5)
2. Selecting a character creation method
3. Setting gameplay level (SR5 only)
4. Providing campaign details (name, description, theme, etc.)
5. Configuring campaign-specific settings (factions, locations, etc.)

### Managing a Campaign

A Gamemaster can:
- Edit campaign details (name, description, theme, house rules, etc.)
- View all characters in the campaign
- View all sessions in the campaign
- View all scenes in the campaign
- Delete the campaign (with appropriate warnings)
- Manage campaign players and invitations

**Note:** Edition and character creation method cannot be changed after campaign creation.

## Session Management

A Gamemaster can:
- Create sessions within a campaign
- Edit session details
- Delete sessions
- View all scenes in a session
- View all characters in a session

## Scene Management

A Gamemaster can:
- Create scenes within a session
- Edit scene details
- Delete scenes
- View all characters in a scene

## Planned Features

The following features are planned for future releases:
- Password reset functionality
- Enhanced user management interface
- Detailed RBAC role management
- Real-time updates via WebSocket
- Dice rolling system
- Initiative tracking
- Combat state management
- Notes and journal system
