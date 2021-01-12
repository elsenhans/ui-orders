import React from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Icon,
  MenuSection,
} from '@folio/stripes/components';
import { IfPermission } from '@folio/stripes/core';

const OrderLinesListActionMenu = ({ orderLinesCount, onToggle, onExportCSV }) => {
  const intl = useIntl();

  return (
    <MenuSection id="orders-list-actions">
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
          disabled={!orderLinesCount}
        >
          <Icon size="small" icon="download">
            <FormattedMessage id="ui-orders.button.exportCSV" />
          </Icon>
        </Button>
      </IfPermission>
    </MenuSection>
  );
};

OrderLinesListActionMenu.propTypes = {
  search: PropTypes.string.isRequired,
  orderLinesCount: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onExportCSV: PropTypes.func.isRequired,
};

export default OrderLinesListActionMenu;
