package domain

type QualityType string

const (
	QualityTypePositive QualityType = "positive"
	QualityTypeNegative QualityType = "negative"
)

type Qualities []Quality

type Quality struct {
	ID          string      `json:"id"`
	Name        string      `json:"name"`
	Description string      `json:"description"`
	Type        QualityType `json:"type"`
}

