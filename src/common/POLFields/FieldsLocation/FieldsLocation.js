import React from 'react';
import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FieldArray } from 'react-final-form-arrays';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  MessageBanner,
  Row,
} from '@folio/stripes/components';
import {
  FieldLocationFinal,
  RepeatableFieldWithValidation,
  TextField,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import FieldHolding from '../FieldHolding';
import {
  isLocationEresourceQuantityRequired,
  isLocationPhysicalQuantityRequired,
  isLocationsRequired,
  parseQuantity,
  validateLocation,
  validateQuantityElectronic,
  validateQuantityPhysical,
} from './validate';

const NO_VALIDATE = undefined;

const FieldsLocation = ({
  changeLocation,
  isDisabledToChangePaymentInfo,
  isPostPendingOrder,
  isQuantityDisabled,
  locationIds,
  locations,
  pOLineFormValues: { orderFormat, physical, eresource, instanceId, isPackage } = {},
  withValidation,
}) => {
  if (!locations) return null;

  const isPhysicalQuantityRequired = isLocationPhysicalQuantityRequired(orderFormat, physical?.createInventory);
  const isElectronicQuantityRequired = isLocationEresourceQuantityRequired(orderFormat, eresource?.createInventory);
  const isPhysicalQuantityVisible = !isPackage || (orderFormat !== ORDER_FORMATS.electronicResource);
  const isElectronicQuantityVisible = !isPackage ||
    (orderFormat === ORDER_FORMATS.electronicResource || orderFormat === ORDER_FORMATS.PEMix);
  const validate = withValidation ? validateLocation : NO_VALIDATE;

  return (
    <>
      {isQuantityDisabled && (
        <MessageBanner type="warning">
          <FormattedMessage id="ui-orders.cost.quantityPopover" />
        </MessageBanner>
      )}
      <FieldArray
        addLabel={isDisabledToChangePaymentInfo ? null : <FormattedMessage id="ui-orders.location.button.addLocation" />}
        component={RepeatableFieldWithValidation}
        name="locations"
        validate={withValidation ? isLocationsRequired : NO_VALIDATE}
        canAdd={!(isDisabledToChangePaymentInfo || isQuantityDisabled)}
        canRemove={!(isDisabledToChangePaymentInfo || isQuantityDisabled)}
        renderField={(field) => (
          <Row>
            <Col xs={6}>
              {instanceId
                ? (
                  <FieldHolding
                    isDisabled={isPostPendingOrder}
                    labelId="ui-orders.location.selectHoldings"
                    locationsForDict={locations}
                    name={`${field}.holdingId`}
                    locationFieldName={`${field}.locationId`}
                    onChange={changeLocation}
                    required={withValidation}
                    validate={validate}
                    instanceId={instanceId}
                    locationLabelId="ui-orders.location.nameCode"
                  />
                )
                : (
                  <FieldLocationFinal
                    isDisabled={isPostPendingOrder}
                    labelId="ui-orders.location.nameCode"
                    locationsForDict={locations}
                    name={`${field}.locationId`}
                    onChange={changeLocation}
                    prepopulatedLocationsIds={locationIds}
                    required={withValidation}
                    validate={validate}
                  />
                )
              }
            </Col>
            {isPhysicalQuantityVisible && (
              <Col xs={3}>
                <Field
                  component={TextField}
                  disabled={isQuantityDisabled}
                  label={<FormattedMessage id="ui-orders.location.quantityPhysical" />}
                  name={`${field}.quantityPhysical`}
                  parse={parseQuantity}
                  required={withValidation && isPhysicalQuantityRequired}
                  type="number"
                  validate={withValidation ? validateQuantityPhysical : NO_VALIDATE}
                  isNonInteractive={isDisabledToChangePaymentInfo}
                />
              </Col>
            )}
            {isElectronicQuantityVisible && (
              <Col xs={3}>
                <Field
                  component={TextField}
                  disabled={isQuantityDisabled}
                  label={<FormattedMessage id="ui-orders.location.quantityElectronic" />}
                  name={`${field}.quantityElectronic`}
                  parse={parseQuantity}
                  required={withValidation && isElectronicQuantityRequired}
                  type="number"
                  validate={withValidation ? validateQuantityElectronic : NO_VALIDATE}
                  isNonInteractive={isDisabledToChangePaymentInfo}
                />
              </Col>
            )}
          </Row>
        )}
      />
    </>
  );
};

FieldsLocation.propTypes = {
  changeLocation: PropTypes.func.isRequired,
  isDisabledToChangePaymentInfo: PropTypes.bool,
  isPostPendingOrder: PropTypes.bool,
  isQuantityDisabled: PropTypes.bool,
  locationIds: PropTypes.arrayOf(PropTypes.string),
  locations: PropTypes.arrayOf(PropTypes.object),
  pOLineFormValues: PropTypes.object,
  withValidation: PropTypes.bool,
};

FieldsLocation.defaultProps = {
  locations: [],
  isDisabledToChangePaymentInfo: false,
  isPostPendingOrder: false,
  isQuantityDisabled: false,
  withValidation: true,
};

export default FieldsLocation;
