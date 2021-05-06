import uniq from 'lodash/uniq';

import {
  buildArrayFieldQuery,
  batchFetch,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  buildFilterQuery,
  buildSortingQuery,
  connectQuery,
} from '@folio/stripes-acq-components';

import { FILTERS } from '@folio/plugin-find-po-line/FindPOLine/constants';
import {
  getKeywordQuery,
} from './OrdersLinesSearchConfig';

function defaultSearchFn(query, qindex) {
  if (qindex) {
    return `(${qindex}==*${query}*)`;
  }

  return getKeywordQuery(query);
}

export const buildOrderLinesQuery = (queryParams, isbnId, normalizedISBN) => {
  const searchFn = normalizedISBN
    ? () => `details.productIds all \\"productId\\": \\"${normalizedISBN}\\"  AND details.productIds all  \\"productIdType\\": \\"${isbnId}\\"`
    : defaultSearchFn;

  const queryParamsFilterQuery = buildFilterQuery(
    queryParams,
    searchFn,
    {
      [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, `metadata.${FILTERS.DATE_CREATED}`),
      [FILTERS.EXPECTED_ACTIVATION_DATE]: buildDateRangeQuery.bind(null, `eresource.${FILTERS.EXPECTED_ACTIVATION_DATE}`),
      [FILTERS.SUBSCRIPTION_FROM]: buildDateRangeQuery.bind(null, `details.${FILTERS.SUBSCRIPTION_FROM}`),
      [FILTERS.SUBSCRIPTION_TO]: buildDateRangeQuery.bind(null, `details.${FILTERS.SUBSCRIPTION_TO}`),
      [FILTERS.ACTUAL_RECEIPT_DATE]: buildDateRangeQuery.bind(null, [FILTERS.ACTUAL_RECEIPT_DATE]),
      [FILTERS.EXPECTED_RECEIPT_DATE]: buildDateRangeQuery.bind(null, `physical.${FILTERS.EXPECTED_RECEIPT_DATE}`),
      [FILTERS.RECEIPT_DUE]: buildDateRangeQuery.bind(null, `physical.${FILTERS.RECEIPT_DUE}`),
      [FILTERS.CLAIM_SENT]: buildDateRangeQuery.bind(null, [FILTERS.CLAIM_SENT]),
      [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
      [FILTERS.FUND_CODE]: buildArrayFieldQuery.bind(null, ['fundDistribution']),
      [FILTERS.EXPENSE_CLASS]: buildArrayFieldQuery.bind(null, ['fundDistribution']),
      [FILTERS.LOCATION]: buildArrayFieldQuery.bind(null, [FILTERS.LOCATION]),
      [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
      [FILTERS.MATERIAL_TYPE_PHYSICAL]: (filterValue) => `physical.materialType == ${filterValue}`,
      [FILTERS.MATERIAL_TYPE_ELECTRONIC]: (filterValue) => `eresource.materialType == ${filterValue}`,
      [FILTERS.ACCESS_PROVIDER]: (filterValue) => `eresource.${FILTERS.ACCESS_PROVIDER} == ${filterValue}`,
      [FILTERS.ACTIVATED]: (filterValue) => `eresource.${FILTERS.ACTIVATED} == ${filterValue}`,
      [FILTERS.TRIAL]: (filterValue) => `eresource.${FILTERS.TRIAL} == ${filterValue}`,
    },
  );

  const filterQuery = queryParamsFilterQuery || 'cql.allRecords=1';
  const sortingQuery = buildSortingQuery(queryParams) || 'sortby metadata.updatedDate/sort.descending';

  return connectQuery(filterQuery, sortingQuery);
};

export const fetchLinesOrders = (mutator, lines, fetchedOrdersMap) => {
  const unfetched = lines
    .filter(({ purchaseOrderId }) => !fetchedOrdersMap[purchaseOrderId])
    .map(({ purchaseOrderId }) => purchaseOrderId)
    .filter(Boolean);

  const fetchPromise = unfetched.length
    ? batchFetch(mutator, uniq(unfetched))
    : Promise.resolve([]);

  return fetchPromise;
};
