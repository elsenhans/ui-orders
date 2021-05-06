import React from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import { act, render, screen } from '@testing-library/react';

import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import PO from './PO';

jest.mock('@folio/stripes-acq-components/lib/AcqUnits/hooks/useAcqRestrictions', () => {
  return {
    useAcqRestrictions: jest.fn().mockReturnValue({ restrictions: {} }),
  };
});

const ORDER = {
  id: '73a9b376-844f-41b5-8b3f-71f2fae63f1f',
  workflowStatus: ORDER_STATUSES.open,
};

const renderComponent = (configProps = {}) => {
  window.history.pushState({}, 'Test page', '/orders/view/73a9b376-844f-41b5-8b3f-71f2fae63f1f');

  return render(
    <IntlProvider locale="en">
      <Route
        path="/orders/view/:id"
        render={props => (
          <PO
            {...props}
            refreshList={() => { }}
            mutator={{
              orderDetails: { GET: () => Promise.resolve(ORDER) },
              orderInvoicesRelns: { GET: () => Promise.resolve([]) },
              orderLines: { GET: () => Promise.resolve([]) },
              orderDetailsList: { GET: () => Promise.resolve([ORDER]) },
            }}
            {...configProps}
          />
        )}
      />
    </IntlProvider>,
    { wrapper: BrowserRouter },
  );
};

describe('PO', () => {
  it('should render update encumbrance', async () => {
    renderComponent();
    await act(() => Promise.resolve());

    expect(screen.getByText('ui-orders.paneBlock.updateEncumbrances')).toBeDefined();
  });
});
