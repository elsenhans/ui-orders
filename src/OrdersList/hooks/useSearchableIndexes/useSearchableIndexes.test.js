import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { CUSTOM_FIELDS } from '../../../../test/jest/fixtures/customFields';
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

const CUSTOM_FIELD_INDEXES = [
  {
    'label': 'Datepicker',
    'value': 'customFields.datepicker',
    'placeholder': 'MM/DD/YYYY',
  },
  {
    'label': 'Long text',
    'value': 'customFields.longtext',
  },
  {
    'label': 'Short text',
    'value': 'customFields.shorttext',
  },
];

describe('useSearchableIndexes', () => {
  it('should return array of searchable indexes', () => {
    const { result } = renderHook(() => useSearchableIndexes());

    expect(result.current).toEqual(SEARCHABLE_INDEXES);
  });

  it('should return array of searchable indexes including custom fields', () => {
    const { result } = renderHook(() => useSearchableIndexes(CUSTOM_FIELDS));

    expect(result.current).toEqual([...SEARCHABLE_INDEXES, ...CUSTOM_FIELD_INDEXES]);
  });
});
