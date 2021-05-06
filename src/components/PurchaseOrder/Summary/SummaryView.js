import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Checkbox,
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  ORDER_STATUSES,
} from '@folio/stripes-acq-components';

import TotalEncumberedValue from './TotalEncumberedValue';
import TotalExpendedValue from './TotalExpendedValue';
import WorkflowStatus from './WorkflowStatus';
import TotalUnits from './TotalUnits';

const SummaryView = ({ order }) => (
  <>
    <Row start="xs">
      <Col
        xs={6}
        lg={3}
      >
        <TotalUnits value={order.totalItems} />
      </Col>
      <Col
        xs={6}
        lg={3}
      >
        <Checkbox
          checked={order.approved}
          disabled
          label={<FormattedMessage id="ui-orders.orderSummary.approved" />}
          vertical
        />
      </Col>
      <Col
        data-test-workflow-status
        xs={6}
        lg={3}
      >
        <WorkflowStatus value={order.workflowStatus} />
      </Col>
    </Row>

    <Row>
      <Col
        xs={6}
        lg={3}
      >
        <KeyValue label={<FormattedMessage id="ui-orders.orderSummary.totalEstimatedPrice" />}>
          <AmountWithCurrencyField amount={order.totalEstimatedPrice} />
        </KeyValue>
      </Col>
      {order.workflowStatus !== ORDER_STATUSES.pending && (
        <Col
          data-test-total-encumbered
          xs={6}
          lg={3}
        >
          <TotalEncumberedValue
            totalEncumbered={order.totalEncumbered}
            label={<FormattedMessage id="ui-orders.orderSummary.totalEncumbered" />}
          />
        </Col>
      )}
      <Col
        data-test-total-expended
        xs={6}
        lg={3}
      >
        <TotalExpendedValue
          totalExpended={order.totalExpended}
          label={<FormattedMessage id="ui-orders.orderSummary.totalExpended" />}
        />
      </Col>
    </Row>

    {(order.workflowStatus === ORDER_STATUSES.closed) && (
      <Row
        data-test-close-reason-block
        start="xs"
      >
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.orderSummary.closingReason" />}
            value={order.closeReason?.reason}
          />
        </Col>
        <Col xs={6}>
          <KeyValue
            label={<FormattedMessage id="ui-orders.orderSummary.closingNote" />}
            value={order.closeReason?.note}
          />
        </Col>
      </Row>
    )}
  </>
);

SummaryView.propTypes = {
  order: PropTypes.object,
};

SummaryView.defaultProps = {
  order: {},
};

SummaryView.displayName = 'SummaryView';

export default SummaryView;
