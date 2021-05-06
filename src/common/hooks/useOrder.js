import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { ORDERS_API } from '@folio/stripes-acq-components';

// tries to fetch order by get, if error comes from back-end - fetch from collection api
export const useOrder = (orderId) => {
  const ky = useOkapiKy();

  const searchParams = {
    query: `id==${orderId}`,
  };

  const { isLoading, data } = useQuery(
    ['ui-orders', 'order', orderId],
    async () => {
      try {
        return ky.get(`${ORDERS_API}/${orderId}`).json();
      } catch {
        const { purchaseOrders } = await ky.get(`${ORDERS_API}`, { searchParams }).json();

        return purchaseOrders[0] || {};
      }
    },
    { enabled: Boolean(orderId) },
  );

  return ({
    order: data,
    isLoading,
  });
};
