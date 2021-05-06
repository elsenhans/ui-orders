import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';
import { useReactToPrint } from 'react-to-print';

import {
  IfPermission,
  stripesConnect,
} from '@folio/stripes/core';
import {
  baseManifest,
  LIMIT_MAX,
  Tags,
  TagsBadge,
  useAcqRestrictions,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  ConfirmationModal,
  ExpandAllButton,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';

import { PrintSettingsModalContainer } from '../../common/ExportSettingsModal';
import {
  getAddresses,
} from '../../common/utils';
import { useHandleOrderUpdateError } from '../../common/hooks/useHandleOrderUpdateError';
import { isOngoing } from '../../common/POFields';
import { WORKFLOW_STATUS } from '../../common/constants';
import {
  reasonsForClosureResource,
  updateEncumbrancesResource,
} from '../../common/resources';
import {
  hydrateOrderToPrint,
  PrintContent,
} from '../../PrintOrder';
import {
  ADDRESSES,
  APPROVALS_SETTING,
  FUND,
  LINES_LIMIT,
  ORDER_INVOICES,
  ORDER_LINES,
  ORDER_NUMBER,
  ORDER,
  ORDERS,
} from '../Utils/resources';
import {
  cloneOrder,
  updateOrderResource,
} from '../Utils/orderResource';
import { LINES_LIMIT_DEFAULT } from '../Utils/const';
import CloseOrderModal from './CloseOrder';
import OpenOrderConfirmationModal from './OpenOrderConfirmationModal';
import LineListing from './LineListing';
import { PODetailsView } from './PODetails';
import { SummaryView } from './Summary';
import { OngoingOrderInfoView } from './OngoingOgderInfo';
import LinesLimit from './LinesLimit';
import POInvoicesContainer from './POInvoices';
import { UpdateOrderErrorModal } from './UpdateOrderErrorModal';
import { getPOActionMenu } from './getPOActionMenu';
import ModalDeletePieces from '../ModalDeletePieces';

const PO = ({
  history,
  location,
  match,
  mutator,
  resources,
  refreshList,
}) => {
  const sendCallout = useShowCallout();
  const orderId = match.params.id;
  const [handleErrorResponse] = useHandleOrderUpdateError(mutator.expenseClass);

  const [order, setOrder] = useState();
  const [orderInvoicesIds, setOrderInvoicesIds] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [isErrorsModalOpened, toggleErrorsModal] = useModalToggle();
  const [updateOrderErrors, setUpdateOrderErrors] = useState();
  const orderErrorModalShow = useCallback((errors) => {
    toggleErrorsModal();
    setUpdateOrderErrors(errors);
  }, [toggleErrorsModal]);

  const orderErrorModalClose = useCallback(() => {
    toggleErrorsModal();
    setUpdateOrderErrors();
  }, [toggleErrorsModal]);

  const fetchOrder = useCallback(
    () => Promise.all([
      mutator.orderDetails.GET()
        .catch((response) => {
          const isGeneralError = response.message?.indexOf('Operator failed: CurrencyConversion') === -1;
          const errorKey = isGeneralError ? 'orderNotLoaded' : 'conversionError';

          sendCallout({
            message: <FormattedMessage id={`ui-orders.errors.${errorKey}`} />,
            type: 'error',
          });

          return {};
        }),
      mutator.orderInvoicesRelns.GET({
        params: {
          query: `purchaseOrderId==${orderId}`,
          limit: LIMIT_MAX,
        },
      })
        .catch(() => []),
      mutator.orderLines.GET({
        params: {
          query: `purchaseOrderId==${orderId}`,
          limit: LIMIT_MAX,
        },
      })
        .catch(() => {
          sendCallout({
            message: <FormattedMessage id="ui-orders.errors.orderLinesNotLoaded" />,
            type: 'error',
          });

          return [];
        }),
      mutator.orderDetailsList.GET({ params: { query: `id==${orderId}` } }),
    ])
      .then(([orderResp, orderInvoicesResp, compositePoLines, orderListResp]) => {
        setOrder({
          ...(orderListResp[0] || {}),
          compositePoLines,
          ...orderResp,
        });
        const invoicesIds = orderInvoicesResp.map(({ invoiceId }) => invoiceId);

        setOrderInvoicesIds(invoicesIds);
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [orderId, sendCallout],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchOrder().finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [match.params.id],
  );

  const [isCloneConfirmation, toggleCloneConfirmation] = useModalToggle();
  const [isTagsPaneOpened, toggleTagsPane] = useModalToggle();
  const [isLinesLimitExceededModalOpened, toggleLinesLimitExceededModal] = useModalToggle();
  const [isCloseOrderModalOpened, toggleCloseOrderModal] = useModalToggle();
  const [showConfirmDelete, toggleDeleteOrderConfirm] = useModalToggle();
  const [isOpenOrderModalOpened, toggleOpenOrderModal] = useModalToggle();
  const [isUnopenOrderModalOpened, toggleUnopenOrderModal] = useModalToggle();
  const [isDeletePiecesOpened, toggleDeletePieces] = useModalToggle();
  const [isPrintModalOpened, togglePrintModal] = useModalToggle();
  const reasonsForClosure = get(resources, 'closingReasons.records');
  const orderNumber = get(order, 'poNumber', '');
  const poLines = order?.compositePoLines;
  const poLinesCount = poLines?.length || 0;
  const workflowStatus = get(order, 'workflowStatus');
  const isAbleToAddLines = workflowStatus === WORKFLOW_STATUS.pending;
  const tags = get(order, 'tags.tagList', []);

  const lastMenu = (
    <PaneMenu>
      <TagsBadge
        tagsToggle={toggleTagsPane}
        tagsQuantity={tags.length}
      />
    </PaneMenu>
  );

  const onCloneOrder = useCallback(
    () => {
      toggleCloneConfirmation();
      setIsLoading(true);
      cloneOrder(order, mutator.orderDetails, mutator.generatedOrderNumber, poLines)
        .then(newOrder => {
          sendCallout({
            message: <FormattedMessage id="ui-orders.order.clone.success" />,
            type: 'success',
          });
          history.push({
            pathname: `/orders/view/${newOrder.id}`,
            search: location.search,
          });
          refreshList();
        })
        .catch(e => {
          setIsLoading();

          return handleErrorResponse(e, orderErrorModalShow, 'clone.error');
        });
    },
    [
      toggleCloneConfirmation,
      order,
      sendCallout,
      history,
      location.search,
      refreshList,
      handleErrorResponse,
      orderErrorModalShow,
      poLines,
    ],
  );

  const deletePO = useCallback(
    () => {
      toggleDeleteOrderConfirm();
      setIsLoading(true);
      mutator.orderDetails.DELETE(order, { silent: true })
        .then(() => {
          sendCallout({
            message: <FormattedMessage id="ui-orders.order.delete.success" values={{ orderNumber }} />,
            type: 'success',
          });
          refreshList();
          history.replace({
            pathname: '/orders',
            search: location.search,
          });
        })
        .catch(() => {
          sendCallout({
            message: <FormattedMessage id="ui-orders.errors.orderWasNotDeleted" />,
            type: 'error',
          });
          setIsLoading();
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleDeleteOrderConfirm, order, sendCallout, orderNumber, history, location.search],
  );

  const closeOrder = useCallback(
    (reason, note) => {
      const closeOrderProps = {
        workflowStatus: WORKFLOW_STATUS.closed,
        closeReason: {
          reason,
          note,
        },
      };

      toggleCloseOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, closeOrderProps)
        .then(
          () => {
            sendCallout({ message: <FormattedMessage id="ui-orders.closeOrder.success" /> });
            refreshList();

            return fetchOrder();
          },
          e => {
            return handleErrorResponse(e, orderErrorModalShow, 'closeOrder');
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleCloseOrderModal, order, sendCallout, refreshList, fetchOrder, handleErrorResponse, orderErrorModalShow],
  );

  const approveOrder = useCallback(
    () => {
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, { approved: true })
        .then(
          () => {
            sendCallout({
              message: <FormattedMessage id="ui-orders.order.approved.success" values={{ orderNumber }} />,
            });
            refreshList();

            return fetchOrder();
          },
          e => {
            return handleErrorResponse(e, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, sendCallout, orderNumber, refreshList, fetchOrder, handleErrorResponse, orderErrorModalShow],
  );

  const openOrder = useCallback(
    () => {
      const openOrderProps = {
        workflowStatus: WORKFLOW_STATUS.open,
      };

      if (isOpenOrderModalOpened) toggleOpenOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, openOrderProps)
        .then(
          () => {
            sendCallout({
              message: <FormattedMessage id="ui-orders.order.open.success" values={{ orderNumber: order?.poNumber }} />,
              type: 'success',
            });
            refreshList();

            return fetchOrder();
          },
          e => {
            return handleErrorResponse(e, orderErrorModalShow, 'orderGenericError1', toggleDeletePieces);
          },
        )
        .finally(setIsLoading);
    },
    [
      isOpenOrderModalOpened,
      toggleOpenOrderModal,
      order,
      sendCallout,
      refreshList,
      fetchOrder,
      handleErrorResponse,
      orderErrorModalShow,
      toggleDeletePieces,
    ],
  );

  const reopenOrder = useCallback(
    () => {
      const openOrderProps = {
        workflowStatus: WORKFLOW_STATUS.open,
      };

      updateOrderResource(order, mutator.orderDetails, openOrderProps)
        .then(
          () => {
            sendCallout({
              message: <FormattedMessage id="ui-orders.order.reopen.success" values={{ orderNumber }} />,
              type: 'success',
            });
            refreshList();

            return fetchOrder();
          },
          e => {
            return handleErrorResponse(e, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [order, sendCallout, orderNumber, refreshList, fetchOrder, handleErrorResponse, orderErrorModalShow],
  );

  const unopenOrder = useCallback(
    () => {
      const orderProps = {
        workflowStatus: WORKFLOW_STATUS.pending,
      };

      toggleUnopenOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, orderProps)
        .then(
          () => {
            sendCallout({
              message: <FormattedMessage id="ui-orders.order.unopen.success" values={{ orderNumber }} />,
              type: 'success',
            });
            refreshList();

            return fetchOrder();
          },
          e => {
            return handleErrorResponse(e, orderErrorModalShow);
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      toggleUnopenOrderModal,
      order,
      sendCallout,
      orderNumber,
      refreshList,
      fetchOrder,
      handleErrorResponse,
      orderErrorModalShow,
    ],
  );

  const createNewOrder = useCallback(
    () => {
      toggleLinesLimitExceededModal();
      cloneOrder(order, mutator.orderDetails, mutator.generatedOrderNumber)
        .then(newOrder => {
          history.push({
            pathname: `/orders/view/${newOrder.id}/po-line/create`,
            search: location.search,
          });
        })
        .catch(e => {
          setIsLoading();

          return handleErrorResponse(e, orderErrorModalShow, 'noCreatedOrder');
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleErrorResponse, history, location.search, order, orderErrorModalShow, toggleLinesLimitExceededModal],
  );

  const gotToOrdersList = useCallback(
    () => {
      history.push({
        pathname: '/orders',
        search: location.search,
      });
    },
    [history, location.search],
  );

  const goToReceiving = useCallback(
    () => {
      history.push({
        pathname: '/receiving',
        search: `qindex=purchaseOrder.poNumber&query=${orderNumber}`,
      });
    },
    [orderNumber, history],
  );

  const onEdit = useCallback(
    () => {
      history.push({
        pathname: `/orders/edit/${match.params.id}`,
        search: location.search,
      });
    },
    [location.search, match.params.id, history],
  );

  const onAddPOLine = useCallback(
    () => {
      const linesLimit = Number(get(resources, ['linesLimit', 'records', '0', 'value'], LINES_LIMIT_DEFAULT));

      if (linesLimit <= poLinesCount) {
        toggleLinesLimitExceededModal();
      } else {
        history.push({
          pathname: `/orders/view/${match.params.id}/po-line/create`,
          search: location.search,
        });
      }
    },
    [resources, match.params.id, history, location.search, poLinesCount, toggleLinesLimitExceededModal],
  );

  const updateOrderCB = useCallback(async (orderWithTags) => {
    await mutator.orderDetails.PUT(orderWithTags);
    await fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOrder]);

  const addPOLineButton = (
    <IfPermission perm="orders.po-lines.item.post">
      <Button
        data-test-add-line-button
        disabled={!isAbleToAddLines}
        onClick={onAddPOLine}
      >
        <FormattedMessage id="ui-orders.button.addLine" />
      </Button>
    </IfPermission>
  );

  const updateEncumbrances = useCallback(
    () => {
      setIsLoading(true);
      mutator.updateEncumbrances.POST({})
        .then(
          () => {
            sendCallout({ message: <FormattedMessage id="ui-orders.order.updateEncumbrances.success" /> });

            return fetchOrder();
          },
          e => {
            return handleErrorResponse(e, orderErrorModalShow, 'ui-orders.order.updateEncumbrances.error');
          },
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fetchOrder, handleErrorResponse, orderErrorModalShow, sendCallout],
  );

  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const [orderToPrint, setOrderToPrint] = useState();
  const printOrderModal = (exportData) => {
    setOrderToPrint(exportData);
    handlePrint();
  };

  const hydratedOrderToPrint = useMemo(() => {
    return hydrateOrderToPrint({ order: orderToPrint });
  }, [orderToPrint]);

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(
    order?.id, order?.acqUnitIds,
  );

  if (isLoading || order?.id !== match.params.id) {
    return (
      <LoadingPane
        id="order-details"
        dismissible
        defaultWidth="fill"
        onClose={gotToOrdersList}
      />
    );
  }

  const orderType = get(order, 'orderType');
  const addresses = getAddresses(get(resources, 'addresses.records', []));
  const funds = get(resources, 'fund.records', []);
  const approvalsSetting = get(resources, 'approvalsSetting.records', {});

  const POPane = (
    <Pane
      id="order-details"
      actionMenu={getPOActionMenu({
        approvalsSetting,
        clickApprove: approveOrder,
        clickClone: toggleCloneConfirmation,
        clickClose: toggleCloseOrderModal,
        clickDelete: toggleDeleteOrderConfirm,
        clickEdit: onEdit,
        clickOpen: toggleOpenOrderModal,
        clickReceive: goToReceiving,
        clickReopen: reopenOrder,
        clickUnopen: toggleUnopenOrderModal,
        clickUpdateEncumbrances: updateEncumbrances,
        handlePrint: togglePrintModal,
        isRestrictionsLoading,
        order,
        restrictions,
      })}
      data-test-order-details
      defaultWidth="fill"
      paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.details" values={{ orderNumber }} />}
      lastMenu={lastMenu}
      dismissible
      onClose={gotToOrdersList}
    >
      <AccordionStatus>
        <Row end="xs">
          {isCloseOrderModalOpened && (
            <CloseOrderModal
              cancel={toggleCloseOrderModal}
              closeOrder={closeOrder}
              closingReasons={reasonsForClosure}
              orderNumber={orderNumber}
            />
          )}
          {isOpenOrderModalOpened && (
            <OpenOrderConfirmationModal
              orderNumber={orderNumber}
              submit={openOrder}
              cancel={toggleOpenOrderModal}
            />
          )}

          <ExpandAllButton />
        </Row>
        <AccordionSet>
          <Accordion
            id="purchaseOrder"
            label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
          >
            <PODetailsView
              addresses={addresses}
              order={order}
            />
          </Accordion>
          {isOngoing(orderType) && (
            <Accordion
              id="ongoing"
              label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
            >
              <OngoingOrderInfoView order={order} />
            </Accordion>
          )}
          <Accordion
            id="POSummary"
            label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
          >
            <SummaryView
              order={order}
            />
          </Accordion>
          <Accordion
            displayWhenOpen={addPOLineButton}
            id="POListing"
            label={<FormattedMessage id="ui-orders.paneBlock.POLines" />}
          >
            <LineListing
              baseUrl={match.url}
              funds={funds}
              poLines={poLines}
            />
          </Accordion>
          <POInvoicesContainer
            label={<FormattedMessage id="ui-orders.paneBlock.relatedInvoices" />}
            orderInvoicesIds={orderInvoicesIds}
          />
        </AccordionSet>
      </AccordionStatus>
      {isLinesLimitExceededModalOpened && (
        <LinesLimit
          cancel={toggleLinesLimitExceededModal}
          createOrder={createNewOrder}
        />
      )}
      {isErrorsModalOpened && (
        <UpdateOrderErrorModal
          orderNumber={orderNumber}
          errors={updateOrderErrors}
          cancel={orderErrorModalClose}
        />
      )}
      {showConfirmDelete && (
        <ConfirmationModal
          id="delete-order-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.order.delete.heading" values={{ orderNumber }} />}
          message={<FormattedMessage id="ui-orders.order.delete.message" />}
          onCancel={toggleDeleteOrderConfirm}
          onConfirm={deletePO}
          open
        />
      )}
      {isCloneConfirmation && (
        <ConfirmationModal
          id="order-clone-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.order.clone.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.order.clone.heading" />}
          message={<FormattedMessage id="ui-orders.order.clone.message" />}
          onCancel={toggleCloneConfirmation}
          onConfirm={onCloneOrder}
          open
        />
      )}
      {isUnopenOrderModalOpened && (
        <ConfirmationModal
          id="order-unopen-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.unopenOrderModal.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.unopenOrderModal.title" values={{ orderNumber }} />}
          message={<FormattedMessage id="ui-orders.unopenOrderModal.message" />}
          onCancel={toggleUnopenOrderModal}
          onConfirm={unopenOrder}
          open
        />
      )}
      {isDeletePiecesOpened && (
        <ModalDeletePieces
          onCancel={toggleDeletePieces}
          onSubmit={openOrder}
          poLines={poLines}
        />
      )}
      {isPrintModalOpened && (
        <PrintSettingsModalContainer
          onCancel={togglePrintModal}
          printOrder={printOrderModal}
          orderToPrint={order}
        />
      )}
      <PrintContent
        ref={componentRef}
        dataSource={hydratedOrderToPrint}
      />
    </Pane>
  );

  return (
    <>
      {POPane}
      {isTagsPaneOpened && (
        <Tags
          putMutator={updateOrderCB}
          recordObj={order}
          onClose={toggleTagsPane}
        />
      )}
    </>
  );
};

PO.manifest = Object.freeze({
  orderDetails: {
    ...ORDER,
    accumulate: true,
    fetch: false,
  },
  linesLimit: LINES_LIMIT,
  closingReasons: reasonsForClosureResource,
  fund: FUND,
  approvalsSetting: APPROVALS_SETTING,
  addresses: ADDRESSES,
  expenseClass: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  orderInvoicesRelns: {
    ...ORDER_INVOICES,
    fetch: false,
    accumulate: true,
  },
  generatedOrderNumber: ORDER_NUMBER,
  orderLines: ORDER_LINES,
  orderDetailsList: {
    ...ORDERS,
    accumulate: true,
    fetch: false,
  },
  updateEncumbrances: updateEncumbrancesResource,
});

PO.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
};

export default stripesConnect(PO);
