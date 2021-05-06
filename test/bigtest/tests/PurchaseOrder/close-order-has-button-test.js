import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import { TIMEOUT } from '../../interactors/const';
import OrderDetailsPage from '../../interactors/order-details-page';
import { WORKFLOW_STATUS } from '../../../../src/common/constants';

describe('Close Order is enabled', function () {
  setupApplication();

  this.timeout(TIMEOUT);

  let order = null;
  const page = new OrderDetailsPage();

  beforeEach(async function () {
    order = this.server.create('order', {
      workflowStatus: WORKFLOW_STATUS.open,
    });

    this.server.create('closingReason');

    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  it('displays Close Order button', () => {
    expect(page.closeOrderButton.isButton).to.be.true;
    expect(page.closeReasonBlock).to.be.false;
  });
});
