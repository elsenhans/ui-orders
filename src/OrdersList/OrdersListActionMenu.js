import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const OrdersListActionMenu = ({ search, ordersCount, onToggle, onExportCSV, generateOrders, generatePOLs }) => {
  const intl = useIntl();

  return (
    <MenuSection id="orders-list-actions">
      <IfPermission perm="ui-orders.order.create">
        <Button
          id="clickable-neworder"
          buttonStyle="dropdownItem"
          data-test-button-new-order
          aria-label={intl.formatMessage({ id: 'stripes-smart-components.addNew' })}
          to={{
            pathname: '/orders/create',
            search,
          }}
        >
          <Icon size="small" icon="plus-sign">
            <FormattedMessage id="stripes-smart-components.new" />
          </Icon>
        </Button>
      </IfPermission>

      <IfPermission perm="ui-orders.order.exportCSV">
        <Button
          id="clickable-export-csv"
          buttonStyle="dropdownItem"
          data-test-button-new-order
          aria-label={intl.formatMessage({ id: 'ui-orders.button.exportCSV' })}
          onClick={() => {
            onToggle();
            onExportCSV();
          }}
          disabled={!ordersCount}
        >
          <Icon size="small" icon="download">
            <FormattedMessage id="ui-orders.button.exportCSV" />
          </Icon>
        </Button>
      </IfPermission>

      <Button
        buttonStyle="dropdownItem"
        disabled={!ordersCount}
        onClick={() => {
          onToggle();
          generateOrders();
        }}
      >
        Generate 1000 orders
      </Button>

      <Button
        buttonStyle="dropdownItem"
        disabled={!ordersCount}
        onClick={() => {
          onToggle();
          generatePOLs();
        }}
      >
        Generate 300 POLs
      </Button>
    </MenuSection>
  );
};

OrdersListActionMenu.propTypes = {
  search: PropTypes.string.isRequired,
  ordersCount: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  generateOrders: PropTypes.func.isRequired,
  generatePOLs: PropTypes.func.isRequired,
};

export default OrdersListActionMenu;
