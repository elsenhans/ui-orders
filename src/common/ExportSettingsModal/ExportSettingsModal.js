import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Button,
  Label,
  Layout,
  Loading,
  Modal,
  ModalFooter,
  RadioButton,
  RadioButtonGroup,
  MultiSelection,
} from '@folio/stripes/components';

import {
  EXPORT_LINE_FIELDS,
  EXPORT_ORDER_FIELDS,
  EXPORT_LINE_FIELDS_OPTIONS,
  EXPORT_ORDER_FIELDS_OPTIONS,
} from './constants';

const MODAL_CONFIG_DEFAULT = {
  actionLabel: <FormattedMessage id="ui-orders.exportSettings.export" />,
  lineDataOptions: EXPORT_LINE_FIELDS_OPTIONS,
  lineFieldsLabel: <FormattedMessage id="ui-orders.exportSettings.lineFieldsLabel" />,
  message: <FormattedMessage id="ui-orders.exportSettings.message" />,
  modalLabel: <FormattedMessage id="ui-orders.exportSettings.label" />,
  orderDataOptions: EXPORT_ORDER_FIELDS_OPTIONS,
  orderFieldsLabel: <FormattedMessage id="ui-orders.exportSettings.orderFieldsLabel" />,
};

const ExportSettingsModal = ({
  onCancel,
  isExporting,
  onExportCSV,
  modalConfig: {
    actionLabel,
    lineDataOptions,
    lineFieldsLabel,
    message,
    modalLabel,
    orderDataOptions,
    orderFieldsLabel,
  },
}) => {
  const intl = useIntl();
  const [isOrderExportAll, setIsOrderExportAll] = useState(true);
  const [orderFieldsToExport, setOrderFieldsToExport] = useState([]);
  const [isLineExportAll, setIsLineExportAll] = useState(true);
  const [lineFieldsToExport, setLineFieldsToExport] = useState([]);

  const isExportBtnDisabled = isExporting ||
    (!isOrderExportAll && !orderFieldsToExport.length) ||
    (!isLineExportAll && !lineFieldsToExport.length);

  const onExport = useCallback(() => {
    const orderFields = isOrderExportAll
      ? Object.keys(EXPORT_ORDER_FIELDS)
      : orderFieldsToExport.map(({ value }) => value);
    const lineFields = isLineExportAll
      ? Object.keys(EXPORT_LINE_FIELDS)
      : lineFieldsToExport.map(({ value }) => value);

    return onExportCSV([...orderFields, ...lineFields]);
  },
  [isOrderExportAll, isLineExportAll, orderFieldsToExport, lineFieldsToExport, onExportCSV]);

  const exportModalFooter = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={onExport}
        disabled={isExportBtnDisabled}
        marginBottom0
      >
        {actionLabel}
      </Button>
      <Button
        marginBottom0
        onClick={onCancel}
      >
        <FormattedMessage id="ui-orders.exportSettings.cancel" />
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open
      label={modalLabel}
      footer={exportModalFooter}
    >

      <p>{message}</p>

      {isExporting
        ? <Loading size="large" />
        : (
          <>
            <Label>
              {orderFieldsLabel}
            </Label>

            <Layout
              className="display-flex flex-align-items-start"
              data-test-order-fields-export
            >
              <Layout
                className="padding-end-gutter"
                data-test-order-radio-buttons
              >
                <RadioButtonGroup>
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.order.all' })}
                    name="orderExport"
                    onChange={() => setIsOrderExportAll(true)}
                    checked={isOrderExportAll}
                  />
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.order.selected' })}
                    name="orderExport"
                    onChange={() => setIsOrderExportAll(false)}
                  />
                </RadioButtonGroup>

              </Layout>
              <Layout data-test-order-labels>
                <Label>
                  <FormattedMessage id="ui-orders.exportSettings.all" />
                </Label>
                <MultiSelection
                  dataOptions={orderDataOptions}
                  onChange={setOrderFieldsToExport}
                  value={orderFieldsToExport}
                  disabled={isOrderExportAll}
                />
              </Layout>
            </Layout>

            <Label>
              {lineFieldsLabel}
            </Label>

            <Layout
              className="display-flex flex-align-items-start"
              data-test-line-fields-export
            >
              <Layout
                className="padding-end-gutter"
                data-test-line-radio-buttons
              >
                <RadioButtonGroup>
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.line.all' })}
                    name="lineExport"
                    onChange={() => setIsLineExportAll(true)}
                    checked={isLineExportAll}
                  />
                  <RadioButton
                    aria-label={intl.formatMessage({ id: 'ui-orders.exportSettings.line.selected' })}
                    name="lineExport"
                    onChange={() => setIsLineExportAll(false)}
                  />
                </RadioButtonGroup>

              </Layout>
              <Layout data-test-order-labels>
                <Label>
                  <FormattedMessage id="ui-orders.exportSettings.all" />
                </Label>
                <MultiSelection
                  dataOptions={lineDataOptions}
                  onChange={setLineFieldsToExport}
                  value={lineFieldsToExport}
                  disabled={isLineExportAll}
                />
              </Layout>
            </Layout>
          </>
        )
      }
    </Modal>
  );
};

ExportSettingsModal.propTypes = {
  onCancel: PropTypes.func.isRequired,
  isExporting: PropTypes.bool.isRequired,
  onExportCSV: PropTypes.func.isRequired,
  modalConfig: PropTypes.object,
};

ExportSettingsModal.defaultProps = {
  modalConfig: MODAL_CONFIG_DEFAULT,
};

export default ExportSettingsModal;
