import React from 'react';
import PropTypes from 'prop-types';
import get from 'lodash/get';
import { FormattedMessage } from 'react-intl';

import {
  Col,
  Grid,
  KeyValue,
  Label,
  NoValue,
  Row,
} from '@folio/stripes/components';
import {
  AmountWithCurrencyField,
  FolioFormattedTime,
  KeyValueInline,
  ORDER_STATUS_LABEL,
} from '@folio/stripes-acq-components';

import {
  DISCOUNT_TYPE,
} from '../../components/POLine/const';
import { LINE_FIELDS_MAP, LINE_FIELDS_LABELS } from './constants';
import css from './ComponentToPrint.css';

function PrintValue({ path, source, exportedLine }) {
  const value = get(exportedLine, path, null) || get(source, path, null);
  const currency = get(source, LINE_FIELDS_MAP.currency);

  switch (path) {
    case LINE_FIELDS_MAP.listUnitPrice:
    case LINE_FIELDS_MAP.listUnitPriceElectronic:
    case LINE_FIELDS_MAP.additionalCost:
    case LINE_FIELDS_MAP.poLineEstimatedPrice:
      return (
        <AmountWithCurrencyField
          currency={currency}
          amount={value}
        />
      );
    case LINE_FIELDS_MAP.discount:
      if (!value) return <NoValue />;

      return get(source, 'cost.discountType') === DISCOUNT_TYPE.percentage
        ? `${value}%`
        : (
          <AmountWithCurrencyField
            currency={currency}
            amount={value}
          />
        );
    default:
      if (value === true) {
        return <FormattedMessage id="ui-orders.filter.true" />;
      } else if (value === false) {
        return <FormattedMessage id="ui-orders.filter.false" />;
      }

      return value ?? <NoValue />;
  }
}

const ComponentToPrint = ({ dataSource = {} }) => {
  return (
    <>
      <Grid>
        <Row>
          <Col xs={6}>
            <Label>
              <FormattedMessage id="ui-orders.print.po" />
            </Label>
          </Col>
          <Col xs={6}>
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.orderSummary.workflowStatus" />}
              value={ORDER_STATUS_LABEL[dataSource.workflowStatus]}
            />
          </Col>
        </Row>
        <Row>
          <Col xs={6}>
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.vendor" />}
              value={dataSource.vendor?.name}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.vendorPrimaryAddress" />}
              value={dataSource.vendorPrimaryAddress?.addressLine1}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.vendorPhone" />}
              value={dataSource.vendorPrimaryPhone?.phoneNumber}
            />
            <KeyValue
              label={<FormattedMessage id="ui-orders.print.billToAddress" />}
              value={dataSource.billToAddress}
            />
          </Col>
          <Col xs={6}>
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.dateOrdered" />}
              value={<FolioFormattedTime dateString={dataSource.dateOrdered} />}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.print.poNumber" />}
              value={dataSource.poNumber}
            />
            <KeyValueInline
              label={<FormattedMessage id="ui-orders.orderSummary.closingReason" />}
              value={dataSource.closeReason?.reason}
            />
            <KeyValue
              label={<FormattedMessage id="ui-orders.print.shipToAddress" />}
              value={dataSource.shipToAddress}
            />
          </Col>
        </Row>

      </Grid>

      {dataSource.compositePoLines?.map((line, i) => {
        return (
          <div key={line.id}>
            <Row>
              <Col xs={12}>
                <KeyValue
                  label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP.poLineNumber]}
                >
                  {line.poLineNumber}
                </KeyValue>
              </Col>
            </Row>
            <Row className={css.poLineBlock}>
              {Object.keys(LINE_FIELDS_MAP).map((col) => {
                if (col === LINE_FIELDS_MAP.poLineNumber) return null;

                return (
                  <Col xs={3} key={col}>
                    <KeyValue
                      label={LINE_FIELDS_LABELS[LINE_FIELDS_MAP[col]]}
                    >
                      <PrintValue path={LINE_FIELDS_MAP[col]} source={line} exportedLine={dataSource.exportData[i]} />
                    </KeyValue>
                  </Col>
                );
              })}
            </Row>
          </div>
        );
      })}

      <Row>
        <Col xs={6}>
          {LINE_FIELDS_LABELS['vendorDetail.instructions']}: {
            dataSource.compositePoLines?.map((line) => {
              return (
                <div key={line.id}>
                  {line.vendorDetail?.instructions}
                </div>
              );
            })
          }
        </Col>
        <Col xs={6}>
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.print.totalItems" />}
            value={dataSource.totalItems}
          />
          <KeyValueInline
            label={<FormattedMessage id="ui-orders.print.total" />}
            value={<AmountWithCurrencyField amount={dataSource.totalEstimatedPrice} />}
          />
        </Col>
      </Row>
    </>
  );
};

ComponentToPrint.propTypes = {
  dataSource: PropTypes.object,
};

export default ComponentToPrint;
