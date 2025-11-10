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

	// Creation method errors
	ErrCreationMethodUnsupported   = errors.New("creation method is not supported for this edition")
	ErrSumToTenInvalidSelection    = errors.New("invalid Sum-to-Ten selection")
	ErrSumToTenBudgetMismatch      = errors.New("Sum-to-Ten selection does not spend required points")
	ErrSumToTenMissingCategory     = errors.New("Sum-to-Ten selection missing required category")
	ErrSumToTenUnknownPriorityCode = errors.New("Sum-to-Ten selection contains unknown priority code")

	// Karma creation errors
	ErrKarmaInvalidSelection   = errors.New("invalid Karma point-buy selection")
	ErrKarmaBudgetMismatch     = errors.New("Karma point-buy selection does not spend required points")
	ErrKarmaExceedsGearBudget  = errors.New("Karma point-buy gear conversion exceeds limit")
	ErrKarmaAttributeMaxLimit  = errors.New("Karma point-buy cannot max more than one physical or mental attribute")
	ErrKarmaUnknownMetatype    = errors.New("Karma point-buy metatype not recognized")
	ErrKarmaNegativeExpenditure = errors.New("Karma point-buy expenditure must be positive")
)
