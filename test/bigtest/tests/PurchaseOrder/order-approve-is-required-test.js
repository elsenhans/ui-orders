import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import {
  WORKFLOW_STATUS,
} from '../../../../src/common/constants';
import {
  CONFIG_APPROVALS,
  MODULE_ORDERS,
} from '../../../../src/components/Utils/const';
import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import { TIMEOUT } from '../../interactors/const';

describe('Approve order is required', function () {
  setupApplication();

  this.timeout(TIMEOUT);
  const orderDetailsPage = new OrderDetailsPage();

  beforeEach(async function () {
    this.server.create('config', {
      module: MODULE_ORDERS,
      configName: CONFIG_APPROVALS,
      enabled: true,
      value: '{"isApprovalRequired":true}',
    });
    const pendingOrder = this.server.create('order', {
      approved: false,
      workflowStatus: WORKFLOW_STATUS.pending,
    });

    this.visit(`/orders/view/${pendingOrder.id}`);
    await orderDetailsPage.whenLoaded();
  });

  it('approve button should be visible', () => {
    expect(orderDetailsPage.approveOrderButton.isPresent).to.be.true;
  });
});
