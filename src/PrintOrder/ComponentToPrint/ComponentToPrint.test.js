import React from 'react';
import { render } from '@testing-library/react';

import ComponentToPrint from './ComponentToPrint';

const renderComponentToPrint = (props = {}) => render(
  <ComponentToPrint
    {...props}
  />,
);

describe('ComponentToPrint', () => {
  it('should render fields to print', () => {
    const { getByText } = renderComponentToPrint();

    expect(getByText('ui-orders.print.po')).toBeInTheDocument();
    expect(getByText('ui-orders.orderSummary.workflowStatus')).toBeInTheDocument();
    expect(getByText('ui-orders.print.vendor')).toBeInTheDocument();
    expect(getByText('ui-orders.print.vendorPrimaryAddress')).toBeInTheDocument();
    expect(getByText('ui-orders.print.vendorPhone')).toBeInTheDocument();
    expect(getByText('ui-orders.print.billToAddress')).toBeInTheDocument();
    expect(getByText('ui-orders.dateOrdered')).toBeInTheDocument();
    expect(getByText('ui-orders.print.poNumber')).toBeInTheDocument();
    expect(getByText('ui-orders.orderSummary.closingReason')).toBeInTheDocument();
    expect(getByText('ui-orders.print.shipToAddress')).toBeInTheDocument();
    expect(getByText('ui-orders.print.totalItems')).toBeInTheDocument();
    expect(getByText('ui-orders.print.total')).toBeInTheDocument();
  });
});