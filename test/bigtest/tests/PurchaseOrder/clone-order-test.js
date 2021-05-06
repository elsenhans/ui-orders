import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import ConfirmationModal from '../../interactors/confirmation';
import { CalloutInteractor } from '../../interactors';
import { TIMEOUT } from '../../interactors/const';

describe('Clone order', function () {
  setupApplication();

  this.timeout(TIMEOUT);
  const page = new OrderDetailsPage();
  const cloneOrderConfirmation = new ConfirmationModal('#order-clone-confirmation');
  const calloutInteractor = new CalloutInteractor();
  let order = null;

  beforeEach(async function () {
    order = this.server.create('order');
    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  describe('click clone order', () => {
    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.clone.click();
    });

    it('shows clone order confirmation', () => {
      expect(cloneOrderConfirmation.isVisible).to.be.true;
    });

    describe('click OK', () => {
      beforeEach(async function () {
        await cloneOrderConfirmation.confirm();
        await page.whenLoaded();
      });

      it('shows Callout', () => {
        expect(calloutInteractor.anyCalloutIsPresent).to.be.true;
        expect(calloutInteractor.list().length).to.equal(1);
        expect(calloutInteractor.list(0).message).to.equal('The purchase order was successfully duplicated');
      });
    });
  });

  describe('click clone order and cancel', () => {
    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.clone.click();
      await cloneOrderConfirmation.cancel();
      await page.whenLoaded();
    });

    it('closes clone order confirmation', () => {
      expect(cloneOrderConfirmation.isPresent).to.be.false;
      expect(page.isVisible).to.be.true;
    });
  });

  describe('click clone order and confirm', () => {
    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.clone.click();
      await cloneOrderConfirmation.confirm();
      await page.whenLoaded();
    });

    it('closes clone order confirmation', () => {
      expect(cloneOrderConfirmation.isPresent).to.be.false;
      expect(page.isVisible).to.be.true;
    });
  });
});
