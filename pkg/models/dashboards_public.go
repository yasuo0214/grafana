package models

var (
	ErrPublicDashboardFailedGenerateUniqueUid = DashboardErr{
		Reason:     "Failed to generate unique dashboard id",
		StatusCode: 500,
	}
	ErrPublicDashboardNotFound = DashboardErr{
		Reason:     "Public dashboard not found",
		StatusCode: 404,
		Status:     "not-found",
	}
	ErrPublicDashboardPanelNotFound = DashboardErr{
		Reason:     "Panel not found in dashboard",
		StatusCode: 404,
		Status:     "not-found",
	}
	ErrPublicDashboardIdentifierNotSet = DashboardErr{
		Reason:     "No Uid for public dashboard specified",
		StatusCode: 400,
	}
)

type PublicDashboard struct {
	Uid          string `json:"uid" xorm:"uid"`
	DashboardUid string `json:"dashboardUid" xorm:"dashboard_uid"`
	OrgId        int64  `json:"-" xorm:"org_id"` // Don't ever marshal orgId to Json
	TimeSettings string `json:"timeSettings" xorm:"time_settings"`
	IsEnabled    bool   `json:"isEnabled" xorm:"is_enabled"`
}

func (pd PublicDashboard) TableName() string {
	return "dashboard_public"
}

//
// COMMANDS
//

type SavePublicDashboardConfigCommand struct {
	DashboardUid    string
	OrgId           int64
	PublicDashboard PublicDashboard
}