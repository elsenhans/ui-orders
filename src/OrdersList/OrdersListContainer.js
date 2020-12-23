import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import queryString from 'query-string';
import { omit, random } from 'lodash';

import { getFullName, exportCsv } from '@folio/stripes/util';
import { stripesConnect } from '@folio/stripes/core';
import {
  makeQueryBuilder,
  organizationsManifest,
  useList,
} from '@folio/stripes-acq-components';

import { RESULT_COUNT_INCREMENT } from '../common/constants';
import {
  ACQUISITIONS_UNITS,
  ORDERS,
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

  const onExportCSV = useCallback(() => {
    return mutator.ordersListRecords.GET({
      params: {
        query: buildQuery(queryString.parse(location.search)),
        limit: 10000,
        perRequest: 10000,
      },
    })
      .then(ordersResp => exportCsv(ordersResp.purchaseOrders, {}));
  },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  [location.search]);

  const generateOrders = useCallback(async () => {
    const clonedOrder = { ...orders[0] };
    const orderToPOST = omit(clonedOrder, ['id', 'acquisitionsUnit', 'vendorCode']);

    const generetedOrders = new Array(1000).fill().map(() => {
      return ({
        ...orderToPOST,
        poNumber: random(10000, 99999),
        assignedTo: '994a1be5-170f-5b3c-b7c3-3008f907ef52',
      });
    });

    await generetedOrders.map(order => mutator.ordersListRecords.POST(order));

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
});

OrdersListContainer.propTypes = {
  location: ReactRouterPropTypes.location.isRequired,
  mutator: PropTypes.object.isRequired,
};

export default withRouter(stripesConnect(OrdersListContainer));
