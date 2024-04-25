import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { CUSTOM_FIELDS_FIXTURE } from '@folio/stripes-acq-components';

import { useSearchableIndexes } from './useSearchableIndexes';

const SEARCHABLE_INDEXES = [
  {
    'labelId': 'ui-orders.search.keyword',
    'value': '',
  },
  {
    'labelId': 'ui-orders.search.metadata.createdDate',
    'placeholder': 'MM/DD/YYYY',
    'value': 'metadata.createdDate',
  },
  {
    'labelId': 'ui-orders.search.dateOpened',
    'placeholder': 'MM/DD/YYYY',
    'value': 'dateOrdered',
  },
  {
    'labelId': 'ui-orders.search.poNumber',
    'value': 'poNumber',
  },
];

const SEARCHABLE_INDEXES_WITH_CUSTOM_FIELDS = [
  ...SEARCHABLE_INDEXES,
  {
    'label': 'stripes-smart-components.customFields Datepicker',
    'value': 'customFields.datepicker',
    'placeholder': 'MM/DD/YYYY',
  },
  {
    'label': 'stripes-smart-components.customFields Long text',
    'value': 'customFields.longtext',

  },
  {
    'label': 'stripes-smart-components.customFields Short text',
    'value': 'customFields.shorttext',
  },
];

describe('useSearchableIndexes', () => {
  it('should return array of searchable indexes', () => {
    const { result } = renderHook(() => useSearchableIndexes());

    expect(result.current).toEqual(SEARCHABLE_INDEXES);
  });

  it('should return array of searchable indexes and searchable indexes of custom fields', () => {
    const { result } = renderHook(() => useSearchableIndexes(CUSTOM_FIELDS_FIXTURE));

    expect(result.current).toEqual(SEARCHABLE_INDEXES_WITH_CUSTOM_FIELDS);
  });
});
