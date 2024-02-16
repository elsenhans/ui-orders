import { useMemo } from 'react';

import { useLocaleDateFormat } from '@folio/stripes-acq-components';

import { FILTERS } from '../../constants';

export function useSearchableIndexes(customFields) {
  const localeDateFormat = useLocaleDateFormat();

  const customFieldsIndexes = useMemo(() => {
    const result = [];

    if (customFields) {
      customFields.forEach(cf => {
        const fieldName = `${FILTERS.CUSTOM_FIELDS}.${cf.refId}`;

        if (cf.type === 'DATE_PICKER') {
          result.push({ label: cf.name, value: fieldName, placeholder: localeDateFormat });
        }
        if (cf.type === 'TEXTBOX_SHORT' || cf.type === 'TEXTBOX_LONG') {
          result.push({ label: cf.name, value: fieldName });
        }
      });
    }

    return result;
  }, [customFields, localeDateFormat]);

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
    ...customFieldsIndexes,
  ], [customFieldsIndexes, localeDateFormat]);
}
