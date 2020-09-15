import React, { Component } from 'react';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Field } from 'react-final-form';

import {
  Col,
  KeyValue,
  NoValue,
  Row,
  TextField,
} from '@folio/stripes/components';
import {
  AcqUnitsField,
  FieldOrganization,
  fieldSelectOptionsShape,
  FieldTags,
  FolioFormattedTime,
} from '@folio/stripes-acq-components';

import { getAddressOptions } from '../../../common/utils';
import {
  FieldPrefix,
  FieldSuffix,
  FieldBillTo,
  FieldShipTo,
  FieldIsManualPO,
  FieldIsReEncumber,
  FieldsNotes,
  FieldAssignedTo,
} from '../../../common/POFields';
import FieldOrderType from './FieldOrderType';
import {
  isWorkflowStatusClosed,
  isWorkflowStatusIsPending,
} from '../util';
import UserValue from './UserValue';
import css from './PODetailsForm.css';

const CREATE_UNITS_PERM = 'orders.acquisitions-units-assignments.assign';
const MANAGE_UNITS_PERM = 'orders.acquisitions-units-assignments.manage';

class PODetailsForm extends Component {
  static propTypes = {
    generatedNumber: PropTypes.string,
    orderNumberSetting: PropTypes.object.isRequired,
    prefixesSetting: fieldSelectOptionsShape.isRequired,
    suffixesSetting: fieldSelectOptionsShape.isRequired,
    formValues: PropTypes.object,
    change: PropTypes.func,
    addresses: PropTypes.arrayOf(PropTypes.object),
    order: PropTypes.object,
    validateNumber: PropTypes.func.isRequired,
  }

  fillBackGeneratedNumber = ({ target: { value } }) => {
    const { change, generatedNumber } = this.props;

    if (value === '') {
      change('poNumber', generatedNumber);
    }
  }

  render() {
    const {
      addresses,
      formValues,
      orderNumberSetting: { canUserEditOrderNumber },
      prefixesSetting,
      suffixesSetting,
      order,
      change,
      validateNumber,
    } = this.props;

    const isEditMode = Boolean(order.id);
    const isPostPendingOrder = Boolean(order.workflowStatus) && !isWorkflowStatusIsPending(order);
    const isClosedOrder = isWorkflowStatusClosed(order);
    const addressesOptions = getAddressOptions(addresses);
    const addressBillTo = get(addresses.find(el => el.id === formValues.billTo), 'address', '');
    const addressShipTo = get(addresses.find(el => el.id === formValues.shipTo), 'address', '');

    return (
      <>
        <Row>
          <Col xs={4}>
            <FieldPrefix
              isNonInteractive={isPostPendingOrder && formValues?.poNumberPrefix}
              prefixes={prefixesSetting}
            />
          </Col>
          <Col xs={4}>
            {(!canUserEditOrderNumber || isPostPendingOrder) ? (
              <KeyValue
                data-test-po-number
                label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
                value={formValues?.poNumber || <NoValue />}
              />
            ) : (
              <Field
                component={TextField}
                data-test-po-number
                fullWidth
                label={<FormattedMessage id="ui-orders.orderDetails.poNumber" />}
                name="poNumber"
                onBlur={this.fillBackGeneratedNumber}
                validate={validateNumber}
                validateFields={[]}
              />
            )}
          </Col>
          <Col xs={4}>
            <FieldSuffix
              isNonInteractive={isPostPendingOrder && formValues?.poNumberSuffix}
              suffixes={suffixesSetting}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={12}
            lg={3}
          >
            <FieldOrganization
              change={change}
              isNonInteractive={isClosedOrder}
              id={formValues.vendor}
              labelId="ui-orders.orderDetails.vendor"
              name="vendor"
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldOrderType isNonInteractive={isPostPendingOrder && formValues?.orderType} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <AcqUnitsField
              id="order-acq-units"
              name="acqUnitIds"
              perm={isEditMode ? MANAGE_UNITS_PERM : CREATE_UNITS_PERM}
              isEdit={isEditMode}
              preselectedUnits={order.acqUnitIds}
              isFinal
            />
          </Col>
          <Col
            xs={12}
            lg={3}
          >
            <FieldAssignedTo
              change={change}
              userId={formValues?.assignedTo}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            lg={3}
          >
            <FieldBillTo
              addresses={addressesOptions}
              isNonInteractive={isClosedOrder && formValues?.billTo}
            />
          </Col>
          <Col
            className={css.addressWrapper}
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.address" />}
              value={addressBillTo}
            />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldShipTo addresses={addressesOptions} />
          </Col>
          <Col
            className={css.addressWrapper}
            xs={6}
            lg={3}
          >
            <KeyValue
              label={<FormattedMessage id="ui-orders.orderDetails.address" />}
              value={addressShipTo}
            />
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            lg={3}
          >
            <FieldIsManualPO disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <FieldIsReEncumber disabled={isPostPendingOrder} />
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.createdBy" />}>
              <UserValue userId={formValues?.metadata?.createdByUserId} />
            </KeyValue>
          </Col>
          <Col
            xs={6}
            lg={3}
          >
            <KeyValue label={<FormattedMessage id="ui-orders.orderDetails.createdOn" />}>
              <FolioFormattedTime dateString={get(formValues, 'metadata.createdDate')} />
            </KeyValue>
          </Col>
        </Row>
        <Row>
          <Col
            xs={6}
            lg={3}
          >
            <FieldTags
              change={change}
              formValues={formValues}
              name="tags.tagList"
            />
          </Col>
        </Row>
        <Row>
          <Col xs={12}>
            <FieldsNotes />
          </Col>
        </Row>
      </>
    );
  }
}

export default PODetailsForm;
