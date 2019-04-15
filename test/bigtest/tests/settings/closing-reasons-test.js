import { find } from 'lodash';
import { describe, beforeEach, it } from '@bigtest/mocha';
import { expect } from 'chai';

import { DEFAULT_CLOSE_ORDER_REASONS } from '../../../../src/common/constants';

import setupApplication from '../../helpers/setup-application';
import ClosingReasons from '../../interactors/settings/ClosingReasons/ClosingReasons';

describe('Setting of Closing Reasons', () => {
  const closingReasons = new ClosingReasons();
  const defaultReasonsCount = Object.keys(DEFAULT_CLOSE_ORDER_REASONS).length;

  setupApplication();

  beforeEach(function () {
    this.visit('/settings/orders/closing-reasons', () => {
      expect(closingReasons.$root).to.exist;
    });
  });

  it('renders page correctly', () => {
    expect(closingReasons.isPresent).to.be.true;
    expect(closingReasons.isOrdersListPresent).to.be.true;
  });

  describe('Add Reason', () => {
    it('should render Add button', () => {
      expect(closingReasons.addClosingReason.isPresent).to.be.true;
    });

    describe('button click', () => {
      beforeEach(async () => {
        await closingReasons.addClosingReason.addAction();
      });

      it('should open Closing Reason form', () => {
        expect(closingReasons.addClosingReason.closingReasonForm.isPresent).to.be.true;
      });
    });

    describe('form', () => {
      beforeEach(async () => {
        await closingReasons.addClosingReason.addAction();
      });

      describe('submit action', () => {
        beforeEach(async () => {
          await closingReasons.addClosingReason.closingReasonForm.fillValue('test value');
          await closingReasons.addClosingReason.closingReasonForm.submitAction();
        });

        it('should hide Closing Reason form', () => {
          expect(closingReasons.addClosingReason.closingReasonForm.isPresent).to.be.false;
          expect(closingReasons.addClosingReason.isPresent).to.be.true;
        });
      });

      describe('cancel action', () => {
        beforeEach(async () => {
          await closingReasons.addClosingReason.closingReasonForm.cancelAction();
        });

        it('should hide Closing Reason form', () => {
          expect(closingReasons.addClosingReason.closingReasonForm.isPresent).to.be.false;
          expect(closingReasons.addClosingReason.isPresent).to.be.true;
        });
      });
    });
  });

  describe('System', () => {
    it('should display all system reasons', () => {
      expect(closingReasons.systemReasons().length === defaultReasonsCount).to.be.true;
    });

    it('should hide actions', () => {
      closingReasons.systemReasons().forEach(reason => {
        expect(reason.editAction().length).to.equal(0);
      });
    });
  });

  describe('User', () => {
    it('should display loaded reasons', () => {
      expect(closingReasons.reasons().length > defaultReasonsCount).to.be.true;
    });

    describe('Remove action', () => {
      beforeEach(async () => {
        await (
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
        );

        const userReason = find(closingReasons.reasons(), reason => reason.removeAction().length);

        await userReason.removeAction(0).click();
      });

      it('should refresh items after success', () => {
        expect(closingReasons.reasons().length > defaultReasonsCount).to.be.true;
      });
    });

    describe('Edit action', () => {
      beforeEach(async () => {
        await (
          new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1000);
          })
        );

        const userReason = find(closingReasons.reasons(), reason => reason.editAction().length);

        await userReason.editAction(0).click();
      });

      it('should open Closing Reason form', () => {
        expect(closingReasons.closingReasonItem.closingReasonForm.isPresent).to.be.true;
      });

      describe('form', () => {
        describe('submit action', () => {
          beforeEach(async () => {
            await closingReasons.closingReasonItem.closingReasonForm.fillValue('test value');
            await closingReasons.closingReasonItem.closingReasonForm.submitAction();
          });

          it('should hide Closing Reason form', () => {
            expect(closingReasons.closingReasonItem.closingReasonForm.isPresent).to.be.false;
          });
        });

        describe('cancel action', () => {
          beforeEach(async () => {
            await closingReasons.closingReasonItem.closingReasonForm.cancelAction();
          });

          it('should hide Closing Reason form', () => {
            expect(closingReasons.closingReasonItem.closingReasonForm.isPresent).to.be.false;
          });
        });
      });
    });
  });
});