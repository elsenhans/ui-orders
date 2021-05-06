import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import moment from 'moment';

import { stripesConnect } from '@folio/stripes/core';
import { exportCsv } from '@folio/stripes/util';
import {
  useShowCallout,
} from '@folio/stripes-acq-components';

import { getExportData, exportManifest } from './utils';
import ExportSettingsModal from './ExportSettingsModal';
import {
  EXPORT_LINE_FIELDS,
  EXPORT_ORDER_FIELDS,
} from './constants';

const ExportSettingsModalContainer = ({
  onCancel,
  mutator,
  fetchOrdersAndLines,
}) => {
  const [isExporting, setIsExporting] = useState(false);
  const showCallout = useShowCallout();
  const intl = useIntl();

  const onExportCSV = useCallback(async (exportFields) => {
    try {
      setIsExporting(true);

      const { lines, orders } = await fetchOrdersAndLines();

      const exportData = await getExportData(mutator, lines, orders, intl);

      setIsExporting(false);

      onCancel();

      const filename = `order-export-${moment().format('YYYY-MM-DD-hh:mm')}`;

      return exportCsv(
        [{ ...EXPORT_ORDER_FIELDS, ...EXPORT_LINE_FIELDS }, ...exportData],
        {
          onlyFields: exportFields,
          header: false,
          filename,
        },
      );
    } catch {
      onCancel();

      return showCallout({
        messageId: 'ui-orders.exportSettings.load.error',
        type: 'error',
      });
    }
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [fetchOrdersAndLines, showCallout, onCancel]);

  return (
    <ExportSettingsModal
      isExporting={isExporting}
      onExportCSV={onExportCSV}
      onCancel={onCancel}
    />
  );
};

ExportSettingsModalContainer.manifest = exportManifest;

ExportSettingsModalContainer.propTypes = {
  fetchOrdersAndLines: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(ExportSettingsModalContainer);
