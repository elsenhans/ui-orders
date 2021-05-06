import {
  beforeEach,
  describe,
  it,
} from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import { TIMEOUT } from '../../interactors/const';
import OrderDetailsPage from '../../interactors/order-details-page';

describe('Approve order is not required', function () {
  setupApplication();

  const orderDetailsPage = new OrderDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    const pendingOrder = this.server.create('order');

    this.visit(`/orders/view/${pendingOrder.id}`);
    await orderDetailsPage.whenLoaded();
  });

  it('should be hide ', () => {
    expect(orderDetailsPage.approveOrderButton.isPresent).to.be.false;
  });
});
