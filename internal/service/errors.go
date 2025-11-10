package service

import "errors"

var (
	// Generic errors
	ErrForbidden = errors.New("forbidden")

	// Campaign errors
	ErrCampaignEditionRequired        = errors.New("campaign edition is required")
	ErrCampaignCreationMethodRequired = errors.New("campaign creation method is required")
	ErrCampaignImmutableEdition       = errors.New("campaign edition cannot be changed once set")
	ErrCampaignImmutableCreation      = errors.New("campaign creation method cannot be changed once set")
	ErrCampaignNotFound               = errors.New("campaign not found")
	ErrCampaignUnknownGameplayLevel   = errors.New("unknown gameplay level for edition")

	// Session errors
	ErrSessionCampaignRequired  = errors.New("session must be associated with a campaign")
	ErrSessionNotFound          = errors.New("session not found")
	ErrSessionImmutableCampaign = errors.New("session campaign cannot be changed once set")

	// Scene errors
	ErrSceneSessionRequired  = errors.New("scene must be associated with a session")
	ErrSceneNotFound         = errors.New("scene not found")
	ErrSceneImmutableSession = errors.New("scene session cannot be changed once set")
)
