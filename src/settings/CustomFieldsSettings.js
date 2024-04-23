import { Route, Switch } from 'react-router-dom';

import { CUSTOM_FIELDS_ORDERS_BACKEND_NAME } from '@folio/stripes-acq-components';
import { useStripes } from '@folio/stripes/core';
import {
  EditCustomFieldsSettings,
  ViewCustomFieldsSettings,
} from '@folio/stripes/smart-components';

const CustomFieldsSettings = () => {
  const stripes = useStripes();

  const basePO = '/settings/orders/custom-fields-po';
  const basePOL = '/settings/orders/custom-fields-pol';

  const permissions = {
    canView: stripes.hasPerm('ui-orders.settings.custom-fields.view'),
    canEdit: stripes.hasPerm('ui-orders.settings.custom-fields.edit'),
    canDelete: stripes.hasPerm('ui-orders.settings.custom-fields.delete'),
  };

  const entityTypePO = 'purchase_order';
  const entityTypePOL = 'po_line';

  return (
    <Switch>
      <Route exact path={basePO}>
        <ViewCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={entityTypePO}
          editRoute={`${basePO}/edit`}
          permissions={permissions}
        />
      </Route>
      <Route exact path={`${basePO}/edit`}>
        <EditCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={entityTypePO}
          viewRoute={basePO}
          permissions={permissions}
        />
      </Route>
      <Route exact path={basePOL}>
        <ViewCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={entityTypePOL}
          editRoute={`${basePOL}/edit`}
          permissions={permissions}
        />
      </Route>
      <Route exact path={`${basePOL}/edit`}>
        <EditCustomFieldsSettings
          backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
          entityType={entityTypePOL}
          viewRoute={basePOL}
          permissions={permissions}
        />
      </Route>
    </Switch>
  );
};

export default CustomFieldsSettings;
