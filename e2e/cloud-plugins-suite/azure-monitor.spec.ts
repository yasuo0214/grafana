import { load } from 'js-yaml';
import { e2e } from '@grafana/e2e';

import {
  AzureDataSourceJsonData,
  AzureDataSourceSecureJsonData,
} from '../../public/app/plugins/datasource/grafana-azure-monitor-datasource/types';

import EXAMPLE_DASHBOARD from './example-dashboards/azure-monitor.json';
import { selectors } from '../../public/app/plugins/datasource/grafana-azure-monitor-datasource/e2e/selectors';

const provisioningPath = `../../provisioning/datasources/azmonitor-ds.yaml`;
const e2eSelectors = e2e.getSelectors(selectors.components);

type AzureMonitorConfig = {
  secureJsonData: AzureDataSourceSecureJsonData;
  jsonData: AzureDataSourceJsonData;
};

type AzureMonitorProvision = { datasources: AzureMonitorConfig[] };

function provisionAzureMonitorDatasources(datasources: AzureMonitorProvision[]) {
  const datasource = datasources[0].datasources[0];

  e2e()
    .intercept(/subscriptions/)
    .as('subscriptions');

  e2e.flows.addDataSource({
    type: 'Azure Monitor',
    form: () => {
      e2eSelectors.configEditor.azureCloud.input().find('input').type('Azure').type('{enter}'),
        e2eSelectors.configEditor.tenantID.input().find('input').type(datasource.jsonData.tenantId),
        e2eSelectors.configEditor.clientID.input().find('input').type(datasource.jsonData.clientId),
        e2eSelectors.configEditor.clientSecret.input().find('input').type(datasource.secureJsonData.clientSecret),
        e2eSelectors.configEditor.loadSubscriptions.button().click().wait('@subscriptions').wait(500);
    },
    expectedAlertMessage: 'Successfully connected to all Azure Monitor endpoints',
  });
}

e2e.scenario({
  describeName: 'Add Azure Monitor datasource and import dashboard',
  itName: 'fills out datasource connection configuration and imports JSON dashboard',
  scenario: () => {
    e2e()
      .readFile(provisioningPath)
      .then((azMonitorProvision: string) => {
        const yaml = load(azMonitorProvision) as AzureMonitorProvision;
        provisionAzureMonitorDatasources([yaml]);
        e2e.flows.importDashboard(EXAMPLE_DASHBOARD, undefined, true);
      });
  },
});