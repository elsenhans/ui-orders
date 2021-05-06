import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import LineDetailsPage from '../../interactors/line-details-page';
import ConfirmationModal from '../../interactors/confirmation';
import { TIMEOUT } from '../../interactors/const';

describe('Delete Order Line', function () {
  setupApplication();

  this.timeout(TIMEOUT);
  const page = new LineDetailsPage();
  let order = null;
  let line = null;

  beforeEach(async function () {
    line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    });
    order = this.server.create('order', {
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    this.visit(`/orders/view/${order.id}/po-line/view/${line.id}`);
    await page.whenLoaded();
  });

  it('shows Line Details Pane', () => {
    expect(page.isVisible).to.be.true;
  });

  describe('click on header', () => {
    beforeEach(async function () {
      await page.actions.toggle.click();
    });

    it('shows action menu', () => {
      expect(page.actions.isPresent).to.be.true;
    });
  });

  describe('click delete line', () => {
    const deleteLineConfirmation = new ConfirmationModal('#delete-line-confirmation');

    beforeEach(async function () {
      await page.actions.toggle.click();
      await page.actions.delete.click();
    });

    it('shows delete line confirmation', () => {
      expect(deleteLineConfirmation.isVisible).to.be.true;
    });
  });

  describe('click delete line and cancel', () => {
    const deleteLineConfirmation = new ConfirmationModal('#delete-line-confirmation');

    beforeEach(async function () {
      await page.actions.toggle.click();
      await page.actions.delete.click();
      await deleteLineConfirmation.cancel();
    });

    it('closes delete line confirmation', () => {
      expect(deleteLineConfirmation.isPresent).to.be.false;
    });

    it('shows Line Details Pane', () => {
      expect(page.isVisible).to.be.true;
    });
  });

  describe('click delete line and confirm', () => {
    const deleteLineConfirmation = new ConfirmationModal('#delete-line-confirmation');

    beforeEach(async function () {
      await page.actions.toggle.click();
      await page.actions.delete.click();
      await deleteLineConfirmation.confirm();
    });

    it('closes delete line confirmation', () => {
      expect(deleteLineConfirmation.isPresent).to.be.false;
    });

    it('closes Line Details Pane', () => {
      expect(page.isPresent).to.be.false;
    });
  });

  describe('click edit line button in caret menu', () => {
    beforeEach(async function () {
      await page.actions.toggle.click();
      await page.actions.edit.click();
    });

    it('closes Line Details Pane', () => {
      expect(page.isPresent).to.be.false;
    });
  });
});
