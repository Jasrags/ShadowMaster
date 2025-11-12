package service

import (
	"errors"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestErrorSentinels(t *testing.T) {
	t.Parallel()

	testCases := []struct {
		name    string
		err     error
		message string
	}{
		{name: "campaign edition required", err: ErrCampaignEditionRequired, message: "campaign edition is required"},
		{name: "campaign unknown book", err: ErrCampaignUnknownBook, message: "campaign enabled book is not recognized"},
		{name: "session campaign required", err: ErrSessionCampaignRequired, message: "session must be associated with a campaign"},
		{name: "scene session required", err: ErrSceneSessionRequired, message: "scene must be associated with a session"},
		{name: "karma budget mismatch", err: ErrKarmaBudgetMismatch, message: "karma point-buy selection does not spend required points"},
	}

	for _, tc := range testCases {
		tc := tc
		t.Run(tc.name, func(t *testing.T) {
			require.NotNil(t, tc.err)
			assert.Equal(t, tc.message, tc.err.Error())
			assert.True(t, errors.Is(tc.err, tc.err))
		})
	}
}
