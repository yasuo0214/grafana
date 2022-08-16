package explorevariables

import (
	"context"

	"github.com/grafana/grafana/pkg/api/routing"
	"github.com/grafana/grafana/pkg/infra/log"
	"github.com/grafana/grafana/pkg/services/sqlstore"
	"github.com/grafana/grafana/pkg/services/user"
	"github.com/grafana/grafana/pkg/setting"
)

func ProvideService(cfg *setting.Cfg, sqlStore *sqlstore.SQLStore, routeRegister routing.RouteRegister) *ExploreVariableService {
	s := &ExploreVariableService{
		SQLStore:      sqlStore,
		Cfg:           cfg,
		RouteRegister: routeRegister,
		log:           log.New("explore-variable"),
	}

	s.registerAPIEndpoints()

	return s
}

type Service interface {
	CreateVariableInExploreVariable(ctx context.Context, user *user.SignedInUser, cmd CreateVariableInExploreVariableCommand) (ExploreVariableDTO, error)
	DeleteVariableInExploreVariable(ctx context.Context, user *user.SignedInUser, UID string) (int64, error)
	PatchVariableInExploreVariable(ctx context.Context, user *user.SignedInUser, UID string, cmd PatchVariableInExploreVariableCommand) (ExploreVariableDTO, error)
}

type ExploreVariableService struct {
	SQLStore      *sqlstore.SQLStore
	Cfg           *setting.Cfg
	RouteRegister routing.RouteRegister
	log           log.Logger
}

func (s ExploreVariableService) CreateVariableInExploreVariable(ctx context.Context, user *user.SignedInUser, cmd CreateVariableInExploreVariableCommand) (ExploreVariableDTO, error) {
	return s.createVariable(ctx, user, cmd)
}

func (s ExploreVariableService) SearchInExploreVariable(ctx context.Context, user *user.SignedInUser, query SearchInExploreVariableQuery) (ExploreVariableSearchResult, error) {
	return s.searchVariables(ctx, user, query)
}

func (s ExploreVariableService) DeleteVariableInExploreVariable(ctx context.Context, user *user.SignedInUser, UID string) (int64, error) {
	return s.deleteVariable(ctx, user, UID)
}

func (s ExploreVariableService) PatchVariableInExploreVariable(ctx context.Context, user *user.SignedInUser, UID string, cmd PatchVariableInExploreVariableCommand) (ExploreVariableDTO, error) {
	return s.patchVariable(ctx, user, UID, cmd)
}