import queryString from 'query-string';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import { CUSTOM_FIELDS } from '../../../../test/jest/fixtures/customFields';
import { FILTERS } from '../../constants';
import { useBuildQuery } from './useBuildQuery';

describe('useBuildQuery', () => {
  const SORT_STRING = 'sortby metadata.updatedDate/sort.descending';

  it('should return function, that return query', () => {
    const { result } = renderHook(() => useBuildQuery());

    expect(result.current(queryString.parse(`?foo=bar&${FILTERS.CLOSE_REASON}=cancel`))).toBe(
      `((${FILTERS.CLOSE_REASON}=="cancel" and ${FILTERS.STATUS}=="${ORDER_STATUSES.closed}") and foo=="bar") ${SORT_STRING}`,
    );
  });

  it('returned function should return proper query for custom field type MULTI_SELECT_DROPDOWN', () => {
    const { result } = renderHook(() => useBuildQuery(CUSTOM_FIELDS));
    const query = result.current(queryString.parse(`?${FILTERS.CUSTOM_FIELDS}.multiselect=opt_0`));

    expect(query).toBe(`(${FILTERS.CUSTOM_FIELDS}.multiselect=="*opt_0*") ${SORT_STRING}`);
  });

  it('returned function should return proper query for custom field type SINGLE_SELECT_DROPDOWN', () => {
    const { result } = renderHook(() => useBuildQuery(CUSTOM_FIELDS));
    const query = result.current(queryString.parse(`?${FILTERS.CUSTOM_FIELDS}.singleselect=opt_0`));

    expect(query).toBe(`(${FILTERS.CUSTOM_FIELDS}.singleselect=="opt_0") ${SORT_STRING}`);
  });
});
