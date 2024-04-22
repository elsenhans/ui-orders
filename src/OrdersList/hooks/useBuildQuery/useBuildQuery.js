import { useCallback } from 'react';

import {
  ORDER_STATUSES,
  buildArrayFieldQuery,
  buildDateRangeQuery,
  buildDateTimeRangeQuery,
  getCustomFieldsFilterMap,
  makeQueryBuilder,
  useLocaleDateFormat,
} from '@folio/stripes-acq-components';

import { makeSearchQuery } from '../../OrdersListSearchConfig';
import {
  FILTERS,
} from '../../constants';

export function useBuildQuery(customFields) {
  const localeDateFormat = useLocaleDateFormat();
  const customFieldsFilterMap = getCustomFieldsFilterMap(customFields);

  return useCallback(makeQueryBuilder(
    'cql.allRecords=1',
    makeSearchQuery(localeDateFormat, customFields),
    'sortby metadata.updatedDate/sort.descending',
    {
      [FILTERS.DATE_CREATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_CREATED]),
      [FILTERS.DATE_UPDATED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_UPDATED]),
      [FILTERS.RENEWAL_DATE]: buildDateRangeQuery.bind(null, [FILTERS.RENEWAL_DATE]),
      [FILTERS.DATE_ORDERED]: buildDateTimeRangeQuery.bind(null, [FILTERS.DATE_ORDERED]),
      [FILTERS.CLOSE_REASON]: (filterValue) => {
        return `(${FILTERS.CLOSE_REASON}=="${filterValue}" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}")`;
      },
      [FILTERS.TAGS]: buildArrayFieldQuery.bind(null, [FILTERS.TAGS]),
      [FILTERS.ACQUISITIONS_UNIT]: buildArrayFieldQuery.bind(null, [FILTERS.ACQUISITIONS_UNIT]),
      ...customFieldsFilterMap,
    },
  ),
  [customFieldsFilterMap, localeDateFormat]);
}
