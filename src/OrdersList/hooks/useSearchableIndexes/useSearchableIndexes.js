import { useMemo } from 'react';

import { useCustomFieldsSearchableIndexes, useLocaleDateFormat } from '@folio/stripes-acq-components';

export function useSearchableIndexes(customFields) {
  const localeDateFormat = useLocaleDateFormat();
  const customFieldsSearchableIndexes = useCustomFieldsSearchableIndexes(customFields);

  return useMemo(() => [
    {
      labelId: 'ui-orders.search.keyword',
      value: '',
    },
    {
      labelId: 'ui-orders.search.metadata.createdDate',
      value: 'metadata.createdDate',
      placeholder: localeDateFormat,
    },
    {
      labelId: 'ui-orders.search.dateOpened',
      value: 'dateOrdered',
      placeholder: localeDateFormat,
    },
    {
      labelId: 'ui-orders.search.poNumber',
      value: 'poNumber',
    },
    ...customFieldsSearchableIndexes,
  ], [localeDateFormat, customFieldsSearchableIndexes]);
}
