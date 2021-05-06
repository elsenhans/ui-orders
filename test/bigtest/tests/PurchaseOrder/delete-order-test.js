import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import OrderEditPage from '../../interactors/order-edit-page';
import ConfirmationModal from '../../interactors/confirmation';
import { TIMEOUT } from '../../interactors/const';

describe('Delete Order', function () {
  setupApplication();

  this.timeout(TIMEOUT);
  const page = new OrderDetailsPage();
  const editOrderPage = new OrderEditPage();
  let order = null;

  beforeEach(async function () {
    order = this.server.create('order');
    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  it('shows Order Details Pane', () => {
    expect(page.isVisible).to.be.true;
  });

  describe('click on header', () => {
    beforeEach(async function () {
      await page.header.click();
    });

    it('shows action menu', () => {
      expect(page.actionsMenu.isPresent).to.be.true;
    });
  });

  describe('click delete order', () => {
    const deleteOrderConfirmation = new ConfirmationModal('#delete-order-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.delete.click();
    });

    it('shows delete order confirmation', () => {
      expect(deleteOrderConfirmation.isVisible).to.be.true;
    });
  });

  describe('click delete order and cancel', () => {
    const deleteOrderConfirmation = new ConfirmationModal('#delete-order-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.delete.click();
      await deleteOrderConfirmation.cancel();
    });

    it('closes delete order confirmation', () => {
      expect(deleteOrderConfirmation.isPresent).to.be.false;
    });

    it('shows Order Details Pane', () => {
      expect(page.isVisible).to.be.true;
    });
  });

  describe('click delete order and confirm', () => {
    const deleteOrderConfirmation = new ConfirmationModal('#delete-order-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.delete.click();
      await deleteOrderConfirmation.confirm();
    });

    it('closes delete order confirmation', () => {
      expect(deleteOrderConfirmation.isPresent).to.be.false;
    });

    it('closes Order Details Pane', () => {
      expect(page.isPresent).to.be.false;
    });
  });

  describe('click edit order button in caret dropdown', () => {
    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.edit.click();
    });

    it('closes Order Details Pane', () => {
      expect(editOrderPage.isPresent).to.be.true;
    });
  });
});
