import React from 'react';

import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import CustomFieldsSettings from './CustomFieldsSettings';

jest.mock('@folio/stripes/smart-components', () => {
  const mockViewCustomFieldsSettings = ({ entityType }) => (
    <div>ViewCustomFieldsSettings-{entityType}</div>
  );

  const mockEditCustomFieldsSettings = ({ entityType }) => (
    <div>EditCustomFieldsSettings-{entityType}</div>
  );

  return {
    ...jest.requireActual('@folio/stripes/smart-components'),
    ViewCustomFieldsSettings: mockViewCustomFieldsSettings,
    EditCustomFieldsSettings: mockEditCustomFieldsSettings,
  };
});

const renderCustomFieldsSettings = ({ initialEntries }) => render(
  <MemoryRouter initialEntries={initialEntries}>
    <CustomFieldsSettings />
  </MemoryRouter>,
);

describe('Custom fields settings page', () => {
  it('should render viewCustomFieldsSettings with entityType=purchase_order', async () => {
    renderCustomFieldsSettings({
      initialEntries: ['/settings/orders/custom-fields-po'],
    });

    const viewCustomFieldsSettingsText = await screen.findByText(
      /ViewCustomFieldsSettings-purchase_order/,
    );

    expect(viewCustomFieldsSettingsText).toBeVisible();
  });

  it('should render editCustomFieldsSettings with entityType=purchase_order', async () => {
    renderCustomFieldsSettings({
      initialEntries: ['/settings/orders/custom-fields-po/edit'],
    });

    const editCustomFieldsSettings = await screen.findByText(
      /EditCustomFieldsSettings-purchase_order/,
    );

    expect(editCustomFieldsSettings).toBeVisible();
  });

  it('should render viewCustomFieldsSettings with entityType=po_line', async () => {
    renderCustomFieldsSettings({
      initialEntries: ['/settings/orders/custom-fields-pol'],
    });

    const viewCustomFieldsSettingsText = await screen.findByText(
      /ViewCustomFieldsSettings-po_line/,
    );

    expect(viewCustomFieldsSettingsText).toBeVisible();
  });

  it('should render editCustomFieldsSettings with entityType=po_line', async () => {
    renderCustomFieldsSettings({
      initialEntries: ['/settings/orders/custom-fields-pol/edit'],
    });

    const editCustomFieldsSettings = await screen.findByText(
      /EditCustomFieldsSettings-po_line/,
    );

    expect(editCustomFieldsSettings).toBeVisible();
  });
});
