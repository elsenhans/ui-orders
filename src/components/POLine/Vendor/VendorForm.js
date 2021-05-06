import React from 'react';
import PropTypes from 'prop-types';

import {
  Col,
  Row,
} from '@folio/stripes/components';
import { VendorReferenceNumbersFields } from '@folio/stripes-acq-components';

import {
  FieldVendorInstructions,
  FieldVendorAccountNumber,
} from '../../../common/POLFields';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';

const VendorForm = ({
  accounts,
  order,
}) => {
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const accountsDataOptions = accounts.map(({ name, accountNo }) => ({
    label: `${name} (${accountNo})`,
    value: accountNo,
  }));

  return (
    <>
      <VendorReferenceNumbersFields
        fieldName="vendorDetail.referenceNumbers"
      />
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldVendorAccountNumber
            accounts={accountsDataOptions}
            disabled={isPostPendingOrder}
          />
        </Col>
        <Col
          xs={6}
          md={3}
        >
          <FieldVendorInstructions disabled={isPostPendingOrder} />
        </Col>
      </Row>
    </>
  );
};

VendorForm.propTypes = {
  accounts: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object.isRequired,
};

VendorForm.defaultProps = {
  accounts: [],
};

export default VendorForm;
