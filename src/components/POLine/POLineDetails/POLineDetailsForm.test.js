import { QueryClient, QueryClientProvider } from 'react-query';
import { Form } from 'react-final-form';

import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { render, screen } from '@folio/jest-config-stripes/testing-library/react';
import { RECEIPT_STATUS } from '@folio/stripes-acq-components';

import POLineDetailsForm from './POLineDetailsForm';

const defaultProps = {
  materialTypes: [{
    label: 'label',
    value: 'value',
  }],
  order: {
    workflowStatus: 'Pending',
  },
  parentResources: {
    createInventory: {
      records: [],
    },
  },
};

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const renderPOLineDetailsForm = (props = {}, _initialValues = {}) => render(
  <Form
    onSubmit={() => jest.fn()}
    initialValues={_initialValues}
    render={({
      initialValues,
      form: { change },
      values,
    }) => (
      <POLineDetailsForm
        initialValues={initialValues}
        formValues={values}
        change={change}
        {...defaultProps}
        {...props}
      />
    )}
  />,
  { wrapper },
);

describe('POLineDetailsForm', () => {
  it('should render \'POLine details form\' fields', () => {
    renderPOLineDetailsForm();

    expect(screen.getByText('ui-orders.poLine.number')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.acquisitionMethod')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.orderFormat')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.createdOn')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiptDate')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receiptStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.paymentStatus')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.source')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.donor')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.selector')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.requester')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.claimingActive')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.claimingInterval')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.cancellationRestriction')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.rush')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.сollection')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.receivingWorkflow')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.cancellationRestrictionNote')).toBeInTheDocument();
    expect(screen.getByText('ui-orders.poLine.poLineDescription')).toBeInTheDocument();
  });

  it('should set to \'Independent order and receipt quantity\' if a user selects \'Receipt not required\'', async () => {
    renderPOLineDetailsForm(null, { checkinItems: false });

    const receiptStatusField = screen.getByRole('combobox', { name: 'ui-orders.poLine.receiptStatus' });
    const receivingWorkflowField = screen.getByRole('combobox', { name: /ui-orders.poLine.receivingWorkflow/ });

    expect(receivingWorkflowField).toHaveValue('false');

    await userEvent.selectOptions(receiptStatusField, RECEIPT_STATUS.receiptNotRequired);

    expect(receivingWorkflowField).toHaveValue('true');
    expect(receivingWorkflowField).toBeDisabled();
  });

  it('should clear the \'Claiming interval\' field when a user unchecked \'Claiming active\' checkbox', async () => {
    renderPOLineDetailsForm(null, { claimingActive: false });

    const claimingActiveField = screen.getByRole('checkbox', { name: 'ui-orders.poLine.claimingActive' });
    const claimingIntervalField = screen.getByLabelText('ui-orders.poLine.claimingInterval');

    await userEvent.click(claimingActiveField);
    await userEvent.type(claimingIntervalField, '42');

    expect(claimingActiveField).toBeChecked();
    expect(claimingIntervalField).toHaveValue(42);

    await userEvent.click(claimingActiveField);

    expect(claimingActiveField).not.toBeChecked();
    expect(claimingIntervalField).toHaveValue(null);
  });

  it('should validate \'Claiming interval\' field', async () => {
    renderPOLineDetailsForm(null, { claimingActive: false });

    const claimingActiveField = screen.getByRole('checkbox', { name: 'ui-orders.poLine.claimingActive' });
    const claimingIntervalField = screen.getByLabelText('ui-orders.poLine.claimingInterval');

    // Shouldn't be required if "Claiming active" unchecked
    expect(claimingIntervalField).not.toBeRequired();
    expect(claimingIntervalField).toBeValid();

    await userEvent.click(claimingActiveField);
    expect(claimingIntervalField).toBeRequired();
    expect(claimingIntervalField).not.toBeValid();

    await userEvent.type(claimingIntervalField, '-1');
    expect(claimingIntervalField).toHaveValue(-1);
    expect(claimingIntervalField).not.toBeValid();

    await userEvent.clear(claimingIntervalField);
    await userEvent.type(claimingIntervalField, '0');
    expect(claimingIntervalField).toHaveValue(0);
    expect(claimingIntervalField).not.toBeValid();

    await userEvent.clear(claimingIntervalField);
    await userEvent.type(claimingIntervalField, '42');
    expect(claimingIntervalField).toHaveValue(42);
    expect(claimingIntervalField).toBeValid();
  });
});
