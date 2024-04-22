import { MemoryRouter } from 'react-router';

import { render, screen, act } from '@folio/jest-config-stripes/testing-library/react';

import { order, orderLine } from 'fixtures';
import { useOrderLines } from './hooks';
import OrderLinesListContainer from './OrderLinesListContainer';
import OrderLinesList from './OrderLinesList';

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  useCustomFields: jest.fn(() => []),
}), { virtual: true });
jest.mock('./hooks', () => ({
  useOrderLines: jest.fn().mockReturnValue({}),
}));
jest.mock('./OrderLinesList', () => jest.fn().mockReturnValue('OrderLinesList'));

const defaultProps = {
  mutator: {
    lineOrders: {
      GET: jest.fn().mockResolvedValue([order]),
    },
    orderAcqUnits: {
      GET: jest.fn().mockResolvedValue(order.acqUnitIds),
    },
  },
};

const renderOrderLinesListContainer = (props = {}) => render(
  <OrderLinesListContainer
    {...defaultProps}
    {...props}
  />,
  { wrapper: MemoryRouter },
);

describe('OrderLinesListContainer', () => {
  beforeEach(() => {
    useOrderLines.mockClear();

    defaultProps.mutator.lineOrders.GET.mockClear();
  });

  it('should render OrderLinesList', () => {
    renderOrderLinesListContainer();

    expect(screen.getByText('OrderLinesList')).toBeInTheDocument();
  });

  it('should pass useOrderLines result to OrderLinesList', () => {
    const orderLines = [orderLine];

    OrderLinesList.mockClear();
    useOrderLines.mockReturnValue({ orderLines });
    renderOrderLinesListContainer();

    expect(OrderLinesList.mock.calls[0][0].orderLines).toBe(orderLines);
  });

  it('should load orders when fetchReferences is called', async () => {
    renderOrderLinesListContainer();

    await act(() => useOrderLines.mock.calls[0][0].fetchReferences([orderLine]));

    expect(defaultProps.mutator.lineOrders.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${orderLine.purchaseOrderId}`,
      },
    });
    expect(defaultProps.mutator.orderAcqUnits.GET).toHaveBeenCalledWith({
      params: {
        limit: 1000,
        query: `id==${order.acqUnitIds[0]}`,
      },
    });
  });
});
