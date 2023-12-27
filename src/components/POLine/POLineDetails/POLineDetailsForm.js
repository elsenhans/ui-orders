import get from 'lodash/get';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  KeyValue,
  Row,
} from '@folio/stripes/components';
import {
  FolioFormattedTime,
  sourceLabels,
  FieldTags,
  RECEIPT_STATUS,
} from '@folio/stripes-acq-components';

import {
  FieldPOLineNumber,
  FieldAcquisitionMethod,
  FieldAutomaticExport,
  FieldOrderFormat,
  FieldReceiptDate,
  FieldDonor,
  FieldPaymentStatus,
  FieldReceiptStatus,
  FieldSelector,
  FieldCancellationRestriction,
  FieldRush,
  FieldCollection,
  FieldCheckInItems,
  FieldRequester,
  FieldCancellationRestrictionNote,
  FieldPOLineDescription,
  FieldClaimingActive,
  FieldClaimingInterval,
} from '../../../common/POLFields';
import { IfFieldVisible } from '../../../common/IfFieldVisible';
import getCreateInventorySetting from '../../../common/utils/getCreateInventorySetting';
import { isWorkflowStatusIsPending } from '../../PurchaseOrder/util';
import { toggleAutomaticExport } from '../../Utils/toggleAutomaticExport';

const isReceiptNotRequired = (status) => status === RECEIPT_STATUS.receiptNotRequired;

function POLineDetailsForm({
  change,
  formValues,
  initialValues: poLine,
  order,
  parentResources,
  vendor,
  hiddenFields = {},
  integrationConfigs = [],
}) {
  const createInventorySetting = getCreateInventorySetting(get(parentResources, ['createInventory', 'records'], []));
  const isManualOrder = Boolean(order?.manualPo);
  const isPostPendingOrder = !isWorkflowStatusIsPending(order);
  const isPackage = get(formValues, 'isPackage');

  const isClaimingActive = Boolean(formValues?.claimingActive);

  const checkinItemsFieldDisabled = (
    isPostPendingOrder
    || isPackage
    || (!isPostPendingOrder && isReceiptNotRequired(formValues?.receiptStatus))
  );

  const onAcqMethodChange = useCallback(
    (value) => {
      change('acquisitionMethod', value);
      const vendorAccount = formValues?.vendorDetail?.vendorAccount;

      toggleAutomaticExport({ vendorAccount, acquisitionMethod: value, integrationConfigs, change });
    }, [change, formValues, integrationConfigs],
  );

  const onReceiptStatusChange = useCallback(({ target: { value } }) => {
    change('receiptStatus', value || undefined);

    if (!isPostPendingOrder && isReceiptNotRequired(value)) {
      change('checkinItems', true);
    }
  }, [change, isPostPendingOrder]);

  const onClaimingActiveChange = useCallback((event) => {
    const { target: { checked } } = event;

    change('claimingActive', checked);

    if (!checked) change('claimingInterval', undefined);
  }, [change]);

  return (
    <>
      <Row>
        <Col
          xs={6}
          md={3}
        >
          <FieldPOLineNumber poLineNumber={poLine.poLineNumber} />
        </Col>

        <IfFieldVisible visible={!hiddenFields.acquisitionMethod} name="acquisitionMethod">
          <Col
            xs={6}
            md={3}
          >
            <FieldAcquisitionMethod
              disabled={isPostPendingOrder}
              onChange={onAcqMethodChange}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.automaticExport} name="automaticExport">
          <Col
            xs={6}
            md={3}
          >
            <FieldAutomaticExport
              disabled={isPostPendingOrder || isManualOrder}
              isManualOrder={isManualOrder}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.orderFormat} name="orderFormat">
          <Col
            xs={6}
            md={3}
          >
            <FieldOrderFormat
              formValues={formValues}
              vendor={vendor}
              createInventorySetting={createInventorySetting}
              disabled={isPostPendingOrder}
            />
          </Col>
        </IfFieldVisible>

        <Col
          xs={6}
          md={3}
        >
          <KeyValue label={<FormattedMessage id="ui-orders.poLine.createdOn" />}>
            <FolioFormattedTime dateString={get(poLine, 'metadata.createdDate')} />
          </KeyValue>
        </Col>

        <IfFieldVisible visible={!hiddenFields.receiptDate} name="receiptDate">
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptDate />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.receiptStatus} name="receiptStatus">
          <Col
            xs={6}
            md={3}
          >
            <FieldReceiptStatus
              workflowStatus={order.workflowStatus}
              onChange={onReceiptStatusChange}
            />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.paymentStatus} name="paymentStatus">
          <Col
            xs={6}
            md={3}
          >
            <FieldPaymentStatus workflowStatus={order.workflowStatus} />
          </Col>
        </IfFieldVisible>

        <Col
          xs={6}
          md={3}
        >
          <KeyValue
            label={<FormattedMessage id="ui-orders.poLine.source" />}
            value={sourceLabels[poLine.source]}
          />
        </Col>

        <IfFieldVisible visible={!hiddenFields.donor} name="donor">
          <Col
            xs={6}
            md={3}
          >
            <FieldDonor />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.selector} name="selector">
          <Col
            xs={6}
            md={3}
          >
            <FieldSelector disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.requester} name="requester">
          <Col
            xs={6}
            md={3}
          >
            <FieldRequester disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>
      </Row>

      <Row>
        <IfFieldVisible visible={!hiddenFields.claimingActive} name="claimingActive">
          <Col
            xs={6}
            md={3}
          >
            <FieldClaimingActive onChange={onClaimingActiveChange} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.claimingInterval} name="claimingInterval">
          <Col
            xs={6}
            md={3}
          >
            <FieldClaimingInterval
              disabled={!isClaimingActive}
              required={isClaimingActive}
            />
          </Col>
        </IfFieldVisible>
      </Row>

      <Row>
        <IfFieldVisible visible={!hiddenFields.cancellationRestriction} name="cancellationRestriction">
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestriction />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.rush} name="rush">
          <Col
            xs={6}
            md={3}
          >
            <FieldRush disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.collection} name="collection">
          <Col
            xs={6}
            md={3}
          >
            <FieldCollection disabled={isPostPendingOrder} />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.checkinItems} name="checkinItems">
          <Col
            xs={6}
            md={3}
          >
            <FieldCheckInItems disabled={checkinItemsFieldDisabled} required />
          </Col>
        </IfFieldVisible>
      </Row>
      <Row>
        <IfFieldVisible visible={!hiddenFields.cancellationRestrictionNote} name="cancellationRestrictionNote">
          <Col
            xs={6}
            md={3}
          >
            <FieldCancellationRestrictionNote />
          </Col>
        </IfFieldVisible>

        <IfFieldVisible visible={!hiddenFields.poLineDescription} name="poLineDescription">
          <Col
            xs={6}
            md={3}
          >
            <FieldPOLineDescription />
          </Col>
        </IfFieldVisible>

        <Col
          xs={6}
          md={3}
        >
          <FieldTags
            change={change}
            formValues={formValues}
            name="tags.tagList"
          />
        </Col>
      </Row>
    </>
  );
}

POLineDetailsForm.propTypes = {
  initialValues: PropTypes.object.isRequired,
  change: PropTypes.func.isRequired,
  formValues: PropTypes.object.isRequired,
  order: PropTypes.object,
  vendor: PropTypes.object,
  parentResources: PropTypes.shape({
    createInventory: PropTypes.shape({
      records: PropTypes.arrayOf(PropTypes.object).isRequired,
    }).isRequired,
  }).isRequired,
  hiddenFields: PropTypes.object,
  integrationConfigs: PropTypes.arrayOf(PropTypes.object),
};

export default POLineDetailsForm;
