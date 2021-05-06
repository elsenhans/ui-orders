import { beforeEach, describe, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { ORDER_FORMATS } from '@folio/stripes-acq-components';

import setupApplication from '../../helpers/setup-application';
import { TIMEOUT } from '../../interactors/const';
import LineDetailsPage from '../../interactors/line-details-page';
import NoteFormPage from '../../interactors/note-form-page';
import NoteViewPage from '../../interactors/note-view-page';
import { NOTE_TYPES } from '../../../../src/common/constants';

describe('PO line notes', function () {
  setupApplication();

  this.timeout(TIMEOUT);

  const lineDetails = new LineDetailsPage();
  const noteFormPage = new NoteFormPage();
  const noteViewPage = new NoteViewPage();

  beforeEach(async function () {
    const line = this.server.create('line', {
      orderFormat: ORDER_FORMATS.physicalResource,
      cost: {
        quantityPhysical: 2,
      },
    });

    const order = this.server.create('order', {
      compositePoLines: [line.attrs],
      id: line.attrs.purchaseOrderId,
    });

    const noteType = this.server.create('note-type');

    this.server.create('note', {
      type: noteType.name,
      typeId: noteType.id,
      links: [{ type: NOTE_TYPES.poLine, id: line.id }],
    });

    this.visit(`orders/view/${order.id}/po-line/view/${line.id}`);

    await lineDetails.whenLoaded();
  });

  it('should display line details pane', () => {
    expect(lineDetails.$root).to.exist;
  });

  it('should display notes accordion', () => {
    expect(lineDetails.notesAccordion.isPresent).to.be.true;
  });

  describe('open new note form', () => {
    beforeEach(async () => {
      await lineDetails.notesAccordion.newNoteButton.click();
    });

    it('should open create note page', function () {
      expect(lineDetails.isPresent).to.be.false;
      expect(noteFormPage.$root).to.exist;
    });

    it('save button should be disabled', () => {
      expect(noteFormPage.saveButton.isDisabled).to.be.true;
    });

    describe('close new note form', () => {
      beforeEach(async () => {
        await noteFormPage.closeButton.click();
        await lineDetails.whenLoaded();
      });

      it('should go back to line details', function () {
        expect(lineDetails.isPresent).to.be.true;
      });
    });
  });

  describe('open note details page', () => {
    beforeEach(async () => {
      await lineDetails.notesAccordion.notes(0).click();
      await noteViewPage.whenLoaded();
    });

    it('should open note details page', function () {
      expect(lineDetails.isPresent).to.be.false;
      expect(noteViewPage.$root).to.exist;
    });

    describe('open and close note details page', () => {
      beforeEach(async () => {
        await noteViewPage.closeButton.click();
      });

      it('should close note details page', function () {
        expect(noteViewPage.isPresent).to.be.false;
      });
    });

    describe('edit note details page', () => {
      beforeEach(async () => {
        await noteViewPage.editButton.click();
      });

      it('should open edit note page', function () {
        expect(noteFormPage.isPresent).to.be.true;
      });
    });
  });
});
