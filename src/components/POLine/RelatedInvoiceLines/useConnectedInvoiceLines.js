import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  LIMIT_MAX,
  VENDORS_API,
  batchRequest,
} from '@folio/stripes-acq-components';

import {
  INVOICES_API,
  INVOICE_LINES_API,
} from '../../../common/constants';

const convertToMap = (arr, key = 'id') => arr.reduce((acc, el) => {
  acc[el[key]] = el;

  return acc;
}, {});

export const useConnectedInvoiceLines = (orderLineId) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'connected-invoice-lines' });

  const { isLoading, data = [] } = useQuery(
    [namespace],
    async () => {
      const { invoiceLines = [] } = await ky.get(INVOICE_LINES_API, { searchParams: {
        query: `poLineId==${orderLineId}`,
        limit: LIMIT_MAX,
      }}).json();

      const invoicesIds = invoiceLines.map(({ invoiceId }) => invoiceId);
      const invoices = await batchRequest(
        async ({ params: searchParams }) => {
          const invoicesData = await ky.get(INVOICES_API, { searchParams }).json();

          return invoicesData.invoices;
        },
        invoicesIds,
      );
      const invoicesMap = convertToMap(invoices);

      const vendorIds = invoices.map(({ vendorId }) => vendorId);
      const vendors = await batchRequest(
        async ({ params: searchParams }) => {
          const vendorsData = await ky.get(VENDORS_API, { searchParams }).json();

          return vendorsData.organizations;
        },
        vendorIds,
      );
      const vendorsMap = convertToMap(vendors);

      return invoiceLines.map(invoiceLine => {
        const invoice = invoicesMap[invoiceLine.invoiceId];
        const vendor = vendorsMap[invoice.vendorId];

        return {
          ...invoiceLine,
          invoice,
          vendor,
        };
      });
    },
    { enabled: Boolean(orderLineId) },
  );

  return {
    invoiceLines: data,
    isLoading,
  };
};
