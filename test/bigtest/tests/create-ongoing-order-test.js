import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_TYPE } from '../../../src/common/constants';
import setupApplication from '../helpers/setup-application';
import { TIMEOUT } from '../interactors/const';
import OrderDetailsPage from '../interactors/order-details-page';
import OrderEditPage from '../interactors/order-edit-page';

describe('Create ongoing order', function () {
  setupApplication();
  const form = new OrderEditPage();
  const orderDetailsPage = new OrderDetailsPage();

  this.timeout(TIMEOUT);

  beforeEach(async function () {
    this.visit('/orders/create');
    await form.whenLoaded();
  });

  describe('Create new ongoing order', () => {
    beforeEach(async () => {
      await form.orderTypeSelect.select(ORDER_TYPE.ongoing);
      await form.fillVendor('Vendor');
      await form.createOrderButton.click();
      await orderDetailsPage.whenLoaded();
    });

    it('closes the Create ongoing PO form', () => {
      expect(form.isPresent).to.be.false;
      expect(orderDetailsPage.isPresent).to.be.true;
    });
  });
});
