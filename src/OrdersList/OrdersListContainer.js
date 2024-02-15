import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';
import {
  organizationsManifest,
  usePagination,
  RESULT_COUNT_INCREMENT,
} from '@folio/stripes-acq-components';
import { useCustomFields } from '@folio/stripes/smart-components';

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

import { CUSTOM_FIELDS_BACKEND_MODULE_NAME } from '../common/constants';
import {
  useOrders,
} from './hooks';

const resetData = () => { };

const OrdersListContainer = ({ mutator }) => {
  const fetchReferences = useCallback(purchaseOrders => {
    const fetchVendorsPromise = fetchOrderVendors(mutator.orderVendors, purchaseOrders, {});
    const fetchAcqUnitsPromise = fetchOrderAcqUnits(mutator.orderAcqUnits, purchaseOrders, {});
    const fetchUsersPromise = fetchOrderUsers(mutator.orderUsers, purchaseOrders, {});

    return Promise.all([fetchVendorsPromise, fetchAcqUnitsPromise, fetchUsersPromise])
      .then(([vendorsResponse, acqUnitsResponse, usersResponse]) => {
        const vendorsMap = vendorsResponse.reduce((acc, vendor) => {
          acc[vendor.id] = vendor;

          return acc;
        }, {});

        const acqUnitsMap = acqUnitsResponse.reduce((acc, unit) => {
          acc[unit.id] = unit;

          return acc;
        }, {});

        const usersMap = usersResponse.reduce((acc, user) => {
          acc[user.id] = user;

          return acc;
        }, {});

        return { usersMap, acqUnitsMap, vendorsMap };
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { pagination, changePage, refreshPage } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });
  const [customFields, isLoadingCustomFields] = useCustomFields(CUSTOM_FIELDS_BACKEND_MODULE_NAME, 'purchase_order');
  const { query, orders, isLoading, ordersCount } = useOrders({ pagination, fetchReferences, customFields });

  return (
    <OrdersList
      ordersCount={ordersCount}
      isLoading={isLoading || isLoadingCustomFields}
      onNeedMoreData={changePage}
      orders={orders}
      pagination={pagination}
      refreshList={refreshPage}
      resetData={resetData}
      ordersQuery={query}
      customFields={customFields}
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
  mutator: PropTypes.object.isRequired,
};

export default stripesConnect(OrdersListContainer);
