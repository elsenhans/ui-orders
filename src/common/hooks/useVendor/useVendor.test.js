import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import '@folio/stripes-acq-components/test/jest/__mock__';
import { useOkapiKy } from '@folio/stripes/core';

import { useVendor } from './useVendor';

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useVendor', () => {
  it('should fetch vendor', async () => {
    const vendor = {
      id: 'uidVendor',
      name: 'AMAZON',
    };

    useOkapiKy.mockClear().mockReturnValue({
      get: () => ({
        json: () => vendor,
      }),
    });

    const { result, waitFor } = renderHook(() => useVendor('uid'), { wrapper });

    await waitFor(() => {
      return !result.current.isLoading;
    });

    expect(result.current.vendor).toEqual(vendor);
  });
});
