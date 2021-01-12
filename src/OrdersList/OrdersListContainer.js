import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';
import { omit, random, chunk } from 'lodash';

import { getFullName, exportCsv } from '@folio/stripes/util';
import { stripesConnect } from '@folio/stripes/core';
import {
  batchFetch,
  makeQueryBuilder,
  organizationsManifest,
  useList,
} from '@folio/stripes-acq-components';

import { RESULT_COUNT_INCREMENT } from '../common/constants';
import {
  ACQUISITIONS_UNITS,
  ORDERS,
  ORDER_LINES,
  USERS,
} from '../components/Utils/resources';
import OrdersList from './OrdersList';
import {
  fetchOrderAcqUnits,
  fetchOrderUsers,
  fetchOrderVendors,
} from './utils';
import { getKeywordQuery } from './OrdersListSearchConfig';
import { customFilterMap } from './OrdersListFilterConfig';

const resetData = () => { };

const buildQuery = makeQueryBuilder(
  'cql.allRecords=1',
  (query, qindex) => {
    if (qindex) {
      return `(${qindex}==*${query}*)`;
    }

    return getKeywordQuery(query);
  },
  'sortby poNumber/sort.descending',
  customFilterMap,
);

const OrdersListContainer = ({ mutator, location }) => {
  const [vendorsMap, setVendorsMap] = useState({});
  const [acqUnitsMap, setAcqUnitsMap] = useState({});
  const [usersMap, setUsersMap] = useState({});
  const [isExporting, setIsExporting] = useState(false);

  const loadOrders = useCallback(async (offset) => {
    return mutator.ordersListRecords.GET({
      params: {
        limit: RESULT_COUNT_INCREMENT,
        offset,
        query: buildQuery(queryString.parse(location.search)),
      },
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.search]);

  const loadOrdersCB = useCallback((setOrders, ordersResponse) => {
    const fetchVendorsPromise = fetchOrderVendors(
      mutator.orderVendors, ordersResponse.purchaseOrders, vendorsMap,
    );
    const fetchAcqUnitsPromise = fetchOrderAcqUnits(
      mutator.orderAcqUnits, ordersResponse.purchaseOrders, acqUnitsMap,
    );
    const fetchUsersPromise = fetchOrderUsers(mutator.orderUsers, ordersResponse.purchaseOrders, usersMap);

    return Promise.all([fetchVendorsPromise, fetchAcqUnitsPromise, fetchUsersPromise])
      .then(([vendorsResponse, acqUnitsResponse, usersResponse]) => {
        const newVendorsMap = {
          ...vendorsMap,
          ...vendorsResponse.reduce((acc, vendor) => {
            acc[vendor.id] = vendor;

            return acc;
          }, {}),
        };

        const newAcqUnitsMap = {
          ...acqUnitsMap,
          ...acqUnitsResponse.reduce((acc, unit) => {
            acc[unit.id] = unit;

            return acc;
          }, {}),
        };

        const newUsersMap = {
          ...usersMap,
          ...usersResponse.reduce((acc, user) => {
            acc[user.id] = user;

            return acc;
          }, {}),
        };

        setVendorsMap(newVendorsMap);
        setAcqUnitsMap(newAcqUnitsMap);
        setUsersMap(newUsersMap);
        setOrders((prev) => [
          ...prev,
          ...ordersResponse.purchaseOrders.map(order => ({
            ...order,
            vendorCode: newVendorsMap[order.vendor]?.code,
            acquisitionsUnit: order.acqUnitIds?.map(unitId => newAcqUnitsMap[unitId]?.name).filter(Boolean).join(', '),
            assignedTo: getFullName(newUsersMap[order.assignedTo]),
          })),
        ]);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [acqUnitsMap, usersMap, vendorsMap]);

  const {
    records: orders,
    recordsCount: ordersCount,
    isLoading,
    onNeedMoreData,
    refreshList,
  } = useList(false, loadOrders, loadOrdersCB, RESULT_COUNT_INCREMENT);

  const fetchReportOrdersData = useCallback(async () => {
    const limit = 1000;
    const data = [];
    let offset = 0;
    let hasData = true;

    while (hasData) {
      try {
        mutator.ordersListRecords.reset();
        // eslint-disable-next-line no-await-in-loop
        const { purchaseOrders } = await mutator.ordersListRecords.GET({
          params: {
            query: buildQuery(queryString.parse(location.search)),
            limit,
            offset,
          },
        });

        hasData = purchaseOrders.length;
        offset += limit;
        if (hasData) {
          data.push(...purchaseOrders);
        }
      } catch (e) {
        hasData = false;
      }
    }

    return data;
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [location.search]);

  const fetchReportLinesData = useCallback(async (purchaseOrders) => {
    const ordersIds = chunk(purchaseOrders.map(({ id }) => id), 10);
    const buildLinesQuery = (itemsChunk) => {
      const query = itemsChunk
        .map(id => `purchaseOrderId==${id}`)
        .join(' or ');

      return query || '';
    };

    const fetchBatchLines = (batchIds) => {
      return batchFetch(mutator.orderLines, batchIds, buildLinesQuery);
    };

    return ordersIds.reduce((acc, nextBatch) => {
      return acc.then(prevLinesResp => {
        return fetchBatchLines(nextBatch).then(nextLinesResp => {
          return [...prevLinesResp, ...nextLinesResp];
        });
      });
    }, Promise.resolve([]));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  []);

  const onExportCSV = useCallback(async () => {
    setIsExporting(true);
    const orderRecords = await fetchReportOrdersData();
    const linesRecords = await fetchReportLinesData(orderRecords);
    const ordersMap = orderRecords.reduce((acc, ord) => {
      acc[ord.id] = ord;

      return acc;
    }, {});

    const exportData = linesRecords.map(lineRecord => ({
      ...lineRecord,
      ...ordersMap[lineRecord.purchaseOrderId],
    }));

    setIsExporting(false);

    return exportCsv(exportData, { excludeFields: ['id'] });
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [location.search, fetchReportOrdersData, fetchReportLinesData]);

  const generateOrders = useCallback(async () => {
    const clonedOrder = { ...orders[0] };
    const orderToPOST = omit(clonedOrder, ['id', 'acquisitionsUnit', 'vendorCode']);

    const generetedOrders = new Array(1000).fill().map(() => {
      return ({
        ...orderToPOST,
        poNumber: random(10000, 99999),
        assignedTo: null,
      });
    });

    await generetedOrders.map(order => mutator.ordersListRecords.POST(order));

    refreshList();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [refreshList, orders]);

  const generatePOLs = useCallback(async () => {
    const testPOL = {
      source: 'User',
      titleOrPackage: 'Test',
      acquisitionMethod: 'Purchase',
      orderFormat: 'Other',
      cost: {
        listUnitPrice: 0,
        poLineEstimatedPrice: 0,
        currency: 'USD',
        additionalCost: 0,
        discount: 0,
        quantityPhysical: 1,
      },
      locations: [{
        locationId: '758258bc-ecc1-41b8-abca-f7b610822ffd',
        quantity: 1,
        quantityElectronic: 0,
        quantityPhysical: 1,
      }],
    };
    const generetedPOLs = new Array(300).fill().map(() => {
      return ({
        ...testPOL,
        purchaseOrderId: orders[random(0, orders.length - 1)].id,
      });
    });

    await generetedPOLs.map(line => mutator.orderLines.POST(line));

    refreshList();
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [refreshList, orders]);

  return (
    <OrdersList
      ordersCount={ordersCount}
      isLoading={isLoading}
      onNeedMoreData={onNeedMoreData}
      orders={orders}
      refreshList={refreshList}
      resetData={resetData}
      onExportCSV={onExportCSV}
      generateOrders={generateOrders}
      generatePOLs={generatePOLs}
      isExporting={isExporting}
    />
  );
};

OrdersListContainer.manifest = Object.freeze({
  ordersListRecords: {
    ...ORDERS,
    records: null,
  },
  orderVendors: {
    ...organizationsManifest,
    accumulate: true,
    fetch: false,
  },
  orderAcqUnits: {
    ...ACQUISITIONS_UNITS,
    accumulate: true,
    fetch: false,
  },
  orderUsers: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
  orderLines: {
    ...ORDER_LINES,
    accumulate: true,
    fetch: false,
  },
});

OrdersListContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrdersListContainer));
