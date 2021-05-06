import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_STATUSES } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import OrderDetailsPage from '../../interactors/order-details-page';
import ConfirmationModal from '../../interactors/confirmation';
import { TIMEOUT } from '../../interactors/const';

describe('Unopen order', function () {
  setupApplication();

  this.timeout(TIMEOUT);
  const page = new OrderDetailsPage();

  beforeEach(async function () {
    const order = this.server.create('order', {
      workflowStatus: ORDER_STATUSES.open,
    });

    this.visit(`/orders/view/${order.id}`);
    await page.whenLoaded();
  });

  describe('click unopen order', () => {
    const unopenOrderConfirmation = new ConfirmationModal('#order-unopen-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.unopen.click();
    });

    it('shows unopen order confirmation', () => {
      expect(unopenOrderConfirmation.isVisible).to.be.true;
    });
  });

  describe('click unopen order and cancel', () => {
    const unopenOrderConfirmation = new ConfirmationModal('#order-unopen-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.unopen.click();
      await unopenOrderConfirmation.cancel();
    });

    it('closes unopen order confirmation', () => {
      expect(unopenOrderConfirmation.isPresent).to.be.false;
      expect(page.isVisible).to.be.true;
    });
  });

  describe('click unopen order and confirm', () => {
    const unopenOrderConfirmation = new ConfirmationModal('#order-unopen-confirmation');

    beforeEach(async function () {
      await page.header.click();
      await page.actionsMenu.unopen.click();
      await unopenOrderConfirmation.confirm();
    });

    it('closes unopen order confirmation', () => {
      expect(unopenOrderConfirmation.isPresent).to.be.false;
      expect(page.isVisible).to.be.true;
    });
  });
});
