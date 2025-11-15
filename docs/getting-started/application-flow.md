Application flow
Home page:
It will have a login form and a register form and a link to a user registration page.
If a user successfully logs in, they will be redirected to the home page which will have a list of campaigns they are a member of.
If a user clicks the registration link, they will be redirected to the user registration page.
If a user complete the registration form, they will be redirected to the home page.

When creating a campaign an edition and creation method must be selected and can not be changed once the campaign is created.

Concepts for all editions except where noted to a specific edition.
Users are the model for authentication, a player can have multiple characters.
Characters are linked to a User
Characters can be either player characters or NPCs.
Player characters are linked to a User, and are linked to a Campaign.
NPCs are not linked to a User, and are linked to a Campaign and controled by the Gamemaster.
Characters are created in a Campaign, and are linked to the Campaign.
Campaigns have a edition which is used to determine the ruleset and data for the campaign
Campaigns have a character creation methods as part of their ruleset which will have a default method for that edition.
Campaigns can have multiple Characters
Campaigns can have multiple Sessions, as session is a individual play session within a campaign.
Sessions can have multiple Scenes, as scene is a individual scene within a session.
[5th edition] A Campaign has a character creation method which is defaulted to Priority, the other options are Sum to Ten and Karma. I'll provide details of the new options later.
[5th edition] A Campaign has a set edition which is used to determine the ruleset and data for the campaign
[5th edition] A Campaign has a gameplay level which is used to determine the difficulty of the campaign and creation details
[5th edition] Gameplay levels are street, experienced (default), and Prime, I'll provide the priority details later.
Sessions are linked to a campaign, a session can have multiple scenes, a scene can have multiple characters.
Scenes are linked to a session, a scene can have multiple characters.

User registration and management:
Users will have RBAC (Role Based Access Control) privileges.
The roles are: Administrator, Gamemaster, and Guest.
Administrator: Has full access to the application.  
Gamemaster: Has access to the campaign and session creation and management.
Player: Has access to the campaign that they are a member of.

User login:
Users can login to the application using their email and password.
Users can logout of the application.
Users can reset their password. We will add password reset later. 
Users can change their password. Passwords must be at least 8 characters long. Passwords must contain at least one uppercase letter, one lowercase letter, and one number. Passwords must not contain the username. Passwords must not contain the email. Passwords must not contain the player name. Passwords must not contain the campaign name. Passwords must not contain the session name.
Users can NOT change their email.
Users can change their username. Usernames must be unique.

User registration:
The first user to register is granted Administrator privileges.
All users after the first are granted player privileges.
Registration requires a email, password, and a username.
Usernames must be unique.
Passwords must be at least 8 characters long.
Passwords must contain at least one uppercase letter, one lowercase letter, and one number.
Passwords must not contain the username.
Passwords must not contain the email.
Passwords must not contain the player name.
Passwords must not contain the campaign name.
Passwords must not contain the session name.

Campaign creation and management:
A Gamemaster can create a campaign.
A Gamemaster can edit a campaign.
A Gamemaster can delete a campaign.
A Gamemaster can view a campaign.
A Gamemaster can view a campaign's characters.
A Gamemaster can view a campaign's sessions.
A Gamemaster can view a campaign's scenes.

Session creation and management:
A Gamemaster can create a session.
A Gamemaster can edit a session.
A Gamemaster can delete a session.
A Gamemaster can view a session.
A Gamemaster can view a session's characters.
A Gamemaster can view a session's scenes.

Scene creation and management:
A Gamemaster can create a scene.
A Gamemaster can edit a scene.
A Gamemaster can delete a scene.
A Gamemaster can view a scene.
A Gamemaster can view a scene's characters.
A Gamemaster can view a scene's scenes.


We will add user management later.
We will add password reset later. 
We will add full user management later.
We will add detailed user RBAC roles later.


