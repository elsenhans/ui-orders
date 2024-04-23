import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import { useCustomFields } from '@folio/stripes/smart-components';
import {
  acqUnitsManifest,
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  usePagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';

import {
  ORDERS,
} from '../components/Utils/resources';

import {
  useOrderLines,
} from './hooks';
import {
  fetchLinesOrders,
} from './utils';
import {
  fetchOrderAcqUnits,
} from '../OrdersList/utils';
import OrderLinesList from './OrderLinesList';

const resetData = () => { };

const OrderLinesListContainer = ({ mutator }) => {
  const fetchReferences = useCallback(async (poLines) => {
    const lineOrders = await fetchLinesOrders(mutator.lineOrders, poLines, {});
    const acqUnits = await fetchOrderAcqUnits(mutator.orderAcqUnits, lineOrders, {});

    const ordersMap = lineOrders.reduce((acc, d) => {
      acc[d.id] = d;

      return acc;
    }, {});

    const acqUnitsMap = acqUnits.reduce((acc, unit) => {
      acc[unit.id] = unit;

      return acc;
    }, {});

    return { ordersMap, acqUnitsMap };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [customFields, isLoadingCustomFields] = useCustomFields(CUSTOM_FIELDS_ORDERS_BACKEND_NAME, 'po_line');
  const { pagination, changePage, refreshPage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const { orderLines, orderLinesCount, isLoading, query } = useOrderLines({
    pagination,
    fetchReferences,
    customFields,
  });

  return (
    <OrderLinesList
      isLoading={isLoading || isLoadingCustomFields}
      orderLines={orderLines}
      orderLinesCount={orderLinesCount}
      pagination={pagination}
      onNeedMoreData={changePage}
      refreshList={refreshPage}
      resetData={resetData}
      linesQuery={query}
      customFields={customFields}
    />
  );
};

OrderLinesListContainer.manifest = Object.freeze({
  lineOrders: {
    ...ORDERS,
    fetch: false,
    accumulate: true,
  },
  orderAcqUnits: {
    ...acqUnitsManifest,
    fetch: false,
    accumulate: true,
  },
});

OrderLinesListContainer.propTypes = {
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLinesListContainer);
