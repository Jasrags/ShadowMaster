package v5

// DataTips contains tip records keyed by their ID (lowercase with underscores)
// These are character creation tips that appear based on character configuration
var DataTips = map[string]Tip{
	"looks_like_youre_building_a_street_samurai_dont": {
		ID:          "528f605f-9994-46b5-8583-cafe006507e4",
		Text:        "Looks like you're building a street samurai. Don't you need a code of honor?",
		ChargenOnly: nil,
		Required:    &TipRequired{AllOf: nil},
		Forbidden:   &TipForbidden{OneOf: nil},
	},
	"you_have_enough_money_to_retire_with_a_low_lifesty": {
		ID:         "ccaae7df-40ba-4da9-837e-c0df92f07038",
		Text:       "You have enough money to retire with a Low Lifestyle. Keep at it! A nuyen saved is a nuyen earned!",
		CareerOnly: nil,
		Required:   &TipRequired{AllOf: nil},
		Forbidden:  &TipForbidden{AllOf: nil},
	},
	"you_have_enough_money_to_retire_with_a_medium_life": {
		ID:         "ff26b01d-1aa4-45ac-8685-0d199e115d1f",
		Text:       "You have enough money to retire with a Medium Lifestyle. 2.5 kids, picket fence AR overlay, loving partner. Is it really worth saving up for that next upgrade?",
		CareerOnly: nil,
		Required:   &TipRequired{AllOf: nil},
		Forbidden:  &TipForbidden{AllOf: nil},
	},
	"you_have_enough_money_to_retire_with_a_luxury_life": {
		ID:         "b6da9d78-024d-4516-821c-93ad8207075d",
		Text:       "You have enough money to retire with a Luxury Lifestyle. Molly Millions has nothing on you!",
		CareerOnly: nil,
		Required:   &TipRequired{AllOf: nil},
	},
	"why_bother_with_any_other_weapon_when_you_can_have": {
		ID:        "b669df07-528b-4df3-829b-54d095af1791",
		Text:      "Why bother with any other weapon when you can have the Ares Alpha, the last word in automatics! This message brought to you by Ares Macrotechnology.",
		Required:  &TipRequired{AllOf: nil},
		Forbidden: &TipForbidden{OneOf: nil},
	},
	"you_appear_to_be_making_an_alchemist_are_you_sure": {
		ID:       "1e98f6d1-dfca-4dc3-9248-dd3da3589989",
		Text:     "You appear to be making an Alchemist. Are you sure you want to do that?",
		Required: &TipRequired{AllOf: nil},
	},
	"looks_like_youve_chosen_to_make_an_ai_are_you_s": {
		ID:       "42262ca7-b414-4dde-b1b3-b7f72bc160c1",
		Text:     "Looks like you've chosen to make an A.I. Are you sure you wouldn't rather be playing Eclipse Phase?",
		Required: &TipRequired{AllOf: nil},
	},
	"oni_more_like_horny_elves": {
		ID:       "8bdb4ade-46e2-4ff6-b440-d8a8955766ed",
		Text:     "Oni? More like horny elves!",
		Required: &TipRequired{AllOf: nil},
	},
	"looks_like_you_dont_have_any_hobbies_might_i_sug": {
		ID:        "ab52155b-d99e-4e2e-816b-16535afc206f",
		Text:      "Looks like you don't have any hobbies. Might I suggest competitive basket-weaving?",
		Forbidden: &TipForbidden{AllOf: nil},
	},
	"looks_like_youre_into_some_pretty_fine_shootin_t": {
		ID:       "4bf9379e-101a-4664-8049-7db867073943",
		Text:     "Looks like you're into some pretty fine shootin' there, Tex.",
		Required: &TipRequired{AllOf: nil},
	},
	"youre_a_pretty_established_shadowrunner_now_chum": {
		ID:         "ee4bdb97-2b43-49ea-bc1e-487969258880",
		Text:       "You're a pretty established shadowrunner now, chummer. Maybe it's time for you to initiate into the higher arts?",
		CareerOnly: nil,
		Required:   &TipRequired{AllOf: nil},
		Forbidden:  &TipForbidden{AllOf: nil},
	},
	"youre_a_pretty_established_shadowrunner_now_chum_1": {
		ID:         "afc35a4b-a588-4080-9e77-0dbb5d223122",
		Text:       "You're a pretty established shadowrunner now, chummer. Maybe it's time for you to submerge into the Deep Resonance?",
		CareerOnly: nil,
		Required:   &TipRequired{AllOf: nil},
		Forbidden:  &TipForbidden{AllOf: nil},
	},
	"remember_chummer_you_cannot_socialize_in_a_forei": {
		ID:          "250bf4c4-b71a-4ff7-8f99-4d59aaba89c1",
		Text:        "Remember, chummer, you cannot socialize in a foreign language better than you can speak that language! You should probably increase its rating to 6.",
		ChargenOnly: nil,
		Required:    &TipRequired{AllOf: nil, OneOf: nil},
		Forbidden:   &TipForbidden{OneOf: nil},
	},
	"you_appear_to_have_bought_boosted_reflexes_are_yo": {
		ID:       "d6d22084-a292-4938-a9b4-af8963111ce6",
		Text:     "You appear to have bought Boosted Reflexes. Are you sure you want to do that?",
		Required: &TipRequired{AllOf: nil},
	},
	"looks_like_youre_building_a_decker_without_perfec": {
		ID:          "543af3b5-c490-4dcd-8db4-54ad214e32f4",
		Text:        "Looks like you're building a decker without Perfect Time. Are you sure you want to do that?",
		ChargenOnly: nil,
		Required:    &TipRequired{AllOf: nil, OneOf: nil},
		Forbidden:   &TipForbidden{OneOf: nil},
	},
	"did_you_know_that_you_can_concealed_carry_smgs_in_": {
		ID:        "c2d32a52-25a7-4565-a9b6-1bde1f65c83e",
		Text:      "Did you know that you can concealed carry SMGs in a large smuggling compartment? Why not buy an HK-227 to try it out, they're certainly better than the overpriced stuff from Ingram! This message brought to you by Heckler & Koch GmbH.",
		Required:  &TipRequired{AllOf: nil},
		Forbidden: &TipForbidden{OneOf: nil},
	},
}
