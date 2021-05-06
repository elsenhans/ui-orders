import React from 'react';
import { render, screen } from '@testing-library/react';

import '@folio/stripes-acq-components/test/jest/__mock__';

import { useVendor } from '../../../common/hooks';

import VendorView from './VendorView';

jest.mock('../../../common/hooks', () => ({
  useVendor: jest.fn(),
}));

const renderPOLineAgreementLines = ({ vendorDetail = {} }) => (render(
  <VendorView
    vendorDetail={vendorDetail}
    vendorId="vendorUUID"
  />,
));

describe('VendorView', () => {
  beforeEach(() => {
    useVendor.mockClear();
  });

  it('should display vendor account number without name when account is not found/exist', () => {
    const vendorDetail = {
      vendorAccount: '904583',
    };

    useVendor.mockReturnValue({});

    renderPOLineAgreementLines({ vendorDetail });

    expect(screen.getByText(vendorDetail.vendorAccount)).toBeDefined();
  });

  it('should display vendor account number with name when account is found', () => {
    const vendorDetail = {
      vendorAccount: '904583',
    };
    const vendor = {
      accounts: [{ name: 'AMAZON', accountNo: vendorDetail.vendorAccount }],
    };
    const vendorAccount = `${vendor.accounts[0].name} (${vendorDetail.vendorAccount})`;

    useVendor.mockReturnValue({ vendor });

    renderPOLineAgreementLines({ vendorDetail });

    expect(screen.getByText(vendorAccount)).toBeDefined();
  });
});
