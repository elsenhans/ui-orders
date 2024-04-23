/* eslint-disable max-lines */
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import {
  IfPermission,
  TitleManager,
  stripesConnect,
} from '@folio/stripes/core';
import {
  baseManifest,
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  getErrorCodeFromResponse,
  LIMIT_MAX,
  handleKeyCommand,
  Tags,
  TagsBadge,
  useAcqRestrictions,
  useModalToggle,
  useShowCallout,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Col,
  checkScope,
  collapseAllSections,
  ConfirmationModal,
  Dropdown,
  DropdownMenu,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  Loading,
  LoadingPane,
  Pane,
  PaneMenu,
  Row,
  ErrorModal,
} from '@folio/stripes/components';
import {
  ColumnManagerMenu,
  useColumnManager,
  ViewCustomFieldsRecord,
} from '@folio/stripes/smart-components';

import {
  ExportDetailsAccordion,
  ReexportModal,
} from '../../common';
import {
  ERROR_CODES,
  INVOICES_ROUTE,
  ORDERS_ROUTE,
  REEXPORT_SOURCES,
  WORKFLOW_STATUS,
} from '../../common/constants';
import {
  useExportHistory,
  useHandleOrderUpdateError,
  useOrderTemplate,
} from '../../common/hooks';
import { isOngoing } from '../../common/POFields';
import {
  reasonsForClosureResource,
  updateEncumbrancesResource,
} from '../../common/resources';
import {
  getAddresses,
  getCommonErrorMessage,
  getExportAccountNumbers,
} from '../../common/utils';
import {
  PrintOrder,
} from '../../PrintOrder';
import ModalDeletePieces from '../ModalDeletePieces';
import { LINES_LIMIT_DEFAULT } from '../Utils/const';
import {
  cloneOrder,
  updateOrderResource,
} from '../Utils/orderResource';
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
import CloseOrderModal from './CloseOrder';
import OpenOrderConfirmationModal from './OpenOrderConfirmationModal';
import LineListing from './LineListing';
import LinesLimit from './LinesLimit';
import POInvoicesContainer from './POInvoices';
import { LINE_LISTING_COLUMN_MAPPING } from './constants';
import { getPOActionMenu } from './getPOActionMenu';
import { useOrderMutation } from './hooks';
import { OngoingOrderInfoView } from './OngoingOrderInfo';
import { PODetailsView } from './PODetails';
import { SummaryView } from './Summary';
import { UnopenOrderConfirmationModal } from './UnopenOrderConfirmationModal';
import { UpdateOrderErrorModal } from './UpdateOrderErrorModal';

const PO = ({
  history,
  location,
  match,
  mutator,
  resources,
  refreshList,
  stripes,
}) => {
  const intl = useIntl();
  const sendCallout = useShowCallout();
  const accordionStatusRef = useRef();
  const [handleErrorResponse] = useHandleOrderUpdateError(mutator.expenseClass);
  const { visibleColumns, toggleColumn } = useColumnManager('line-listing-column-manager', LINE_LISTING_COLUMN_MAPPING);
  const { updateOrder } = useOrderMutation();

  const [order, setOrder] = useState({});
  const [orderInvoicesIds, setOrderInvoicesIds] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [updateOrderErrors, setUpdateOrderErrors] = useState();
  const [hiddenFields, setHiddenFields] = useState({});
  const [accountNumbers, setAccountNumbers] = useState([]);
  const [isCancelReason, setIsCancelReason] = useState(false);

  const [isErrorsModalOpened, toggleErrorsModal] = useModalToggle();
  const [isCloneConfirmation, toggleCloneConfirmation] = useModalToggle();
  const [isTagsPaneOpened, toggleTagsPane] = useModalToggle();
  const [isLinesLimitExceededModalOpened, toggleLinesLimitExceededModal] = useModalToggle();
  const [isCloseOrderModalOpened, toggleCloseOrderModal] = useModalToggle();
  const [showConfirmDelete, toggleDeleteOrderConfirm] = useModalToggle();
  const [isOpenOrderModalOpened, toggleOpenOrderModal] = useModalToggle();
  const [isUnopenOrderModalOpened, toggleUnopenOrderModal] = useModalToggle();
  const [isDeletePiecesOpened, toggleDeletePieces] = useModalToggle();
  const [isPrintModalOpened, togglePrintModal] = useModalToggle();
  const [isDifferentAccountModalOpened, toggleDifferentAccountModal] = useModalToggle();
  const [isCreateInvoiceModalOpened, toggleCreateInvoiceModal] = useModalToggle();
  const [isOrderReexportModalOpened, toggleOrderReexportModal] = useModalToggle();

  const orderId = match.params.id;
  const poLines = order?.compositePoLines;

  const {
    isLoading: isRestrictionsLoading,
    restrictions,
  } = useAcqRestrictions(order?.id, order?.acqUnitIds);

  const {
    isLoading: isOrderTemplateLoading,
    orderTemplate,
  } = useOrderTemplate(order?.template);

  const {
    isLoading: isExportHistoryLoading,
    exportHistory,
  } = useExportHistory(poLines?.map(({ id }) => id));

  const reasonsForClosure = get(resources, 'closingReasons.records');
  const orderNumber = get(order, 'poNumber', '');
  const poLinesCount = poLines?.length || 0;
  const workflowStatus = get(order, 'workflowStatus');
  const isAbleToAddLines = workflowStatus === WORKFLOW_STATUS.pending;
  const tags = get(order, 'tags.tagList', []);
  const orderType = get(order, 'orderType');
  const addresses = getAddresses(get(resources, 'addresses.records', []));
  const funds = get(resources, 'fund.records', []);
  const approvalsSetting = get(resources, 'approvalsSetting.records', {});
  const customFieldsValues = get(order, 'customFields', {});

  const deleteOrderModalLabel = intl.formatMessage(
    { id: 'ui-orders.order.delete.heading' },
    { orderNumber },
  );
  const cloneOrderModalLabel = intl.formatMessage({ id: 'ui-orders.order.clone.heading' });
  const differentAccountModalLabel = intl.formatMessage({ id: 'ui-orders.differentAccounts.title' });
  const createInvoiceModalLabel = intl.formatMessage({ id: 'ui-orders.createInvoice.confirmationModal.title' });

  const openVersionHistory = useCallback(() => {
    history.push({
      pathname: `${ORDERS_ROUTE}/view/${order.id}/versions`,
      search: location.search,
    });
  }, [history, location.search, order.id]);

  const lastMenu = (
    <PaneMenu>
      <TagsBadge
        tagsToggle={toggleTagsPane}
        tagsQuantity={tags.length}
      />
      <VersionHistoryButton
        onClick={openVersionHistory}
      />
    </PaneMenu>
  );

  const fetchOrder = useCallback(
    () => Promise.all([
      mutator.orderDetails.GET()
        .catch(async (errorResponse) => {
          const isConversionError = errorResponse?.message && errorResponse.message?.indexOf('Operator failed: CurrencyConversion') !== -1;

          const errorCode = isConversionError
            ? 'conversionError'
            : await getErrorCodeFromResponse(errorResponse);
          const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.orderNotLoaded' });
          const message = getCommonErrorMessage(errorCode, defaultMessage);

          sendCallout({
            message,
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
        .catch(async (errorResponse) => {
          const errorCode = await getErrorCodeFromResponse(errorResponse);
          const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.orderLinesNotLoaded' });
          const message = getCommonErrorMessage(errorCode, defaultMessage);

          sendCallout({
            message,
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

  useEffect(() => {
    setHiddenFields(orderTemplate.hiddenFields);
  }, [orderTemplate]);

  const orderErrorModalShow = useCallback((errors) => {
    toggleErrorsModal();
    setUpdateOrderErrors(errors);
  }, [toggleErrorsModal]);

  const orderErrorModalClose = useCallback(() => {
    toggleErrorsModal();
    setUpdateOrderErrors();
  }, [toggleErrorsModal]);

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
        .catch(async (errorResponse) => {
          const errorCode = await getErrorCodeFromResponse(errorResponse);
          const defaultMessage = intl.formatMessage({ id: 'ui-orders.errors.orderWasNotDeleted' });
          const message = getCommonErrorMessage(errorCode, defaultMessage);

          sendCallout({
            message,
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

      setIsCancelReason(false);
      toggleCloseOrderModal();
      setIsLoading(true);
      updateOrderResource(order, mutator.orderDetails, closeOrderProps)
        .then(
          () => {
            sendCallout({ message: <FormattedMessage id="ui-orders.closeOrder.success" /> });
            refreshList();

            return fetchOrder();
          },
          e => handleErrorResponse(e, orderErrorModalShow, 'closeOrder'),
        )
        .finally(setIsLoading);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [toggleCloseOrderModal, order, sendCallout, refreshList, fetchOrder, handleErrorResponse, orderErrorModalShow],
  );

  const cancelClosingOrder = useCallback(() => {
    setIsCancelReason(false);
    toggleCloseOrderModal();
  }, [toggleCloseOrderModal]);

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

      const exportAccountNumbers = getExportAccountNumbers(order.compositePoLines);

      if (!order.manualPo && exportAccountNumbers.length > 1) {
        setAccountNumbers(exportAccountNumbers);

        return toggleDifferentAccountModal();
      }

      setIsLoading(true);

      return updateOrderResource(order, mutator.orderDetails, openOrderProps)
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
            return handleErrorResponse(e, orderErrorModalShow, ERROR_CODES.orderGenericError1, toggleDeletePieces);
          },
        )
        .finally(setIsLoading);
    },
    [
      isOpenOrderModalOpened,
      toggleOpenOrderModal,
      order,
      accountNumbers,
      toggleDifferentAccountModal,
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

  const unopenOrder = useCallback(({ deleteHoldings }) => {
    const searchParams = { deleteHoldings };
    const changedData = {
      workflowStatus: WORKFLOW_STATUS.pending,
    };

    toggleUnopenOrderModal();
    setIsLoading(true);
    updateOrder({ searchParams, order, changedData })
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
  }, [
    fetchOrder,
    handleErrorResponse,
    order,
    orderErrorModalShow,
    orderNumber,
    refreshList,
    sendCallout,
    toggleUnopenOrderModal,
    updateOrder,
  ]);

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

  const lineListingActionMenu = useMemo(() => (
    <Dropdown
      data-testid="line-listing-action-dropdown"
      label={<FormattedMessage id="stripes-components.paneMenuActionsToggleLabel" />}
      buttonProps={{ buttonStyle: 'primary' }}
    >
      <DropdownMenu>
        <IfPermission perm="orders.po-lines.item.post">
          <Button
            data-test-add-line-button
            data-testid="add-line-button"
            buttonStyle="dropdownItem"
            disabled={!isAbleToAddLines}
            onClick={onAddPOLine}
          >
            <Icon size="small" icon="plus-sign">
              <FormattedMessage id="ui-orders.button.addLine" />
            </Icon>
          </Button>
        </IfPermission>
        <ColumnManagerMenu
          prefix="line-listing"
          columnMapping={LINE_LISTING_COLUMN_MAPPING}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
          excludeColumns={['arrow']}
        />
      </DropdownMenu>
    </Dropdown>
  ), [isAbleToAddLines, onAddPOLine, toggleColumn, visibleColumns]);

  const updateOrderCB = useCallback(async (orderWithTags) => {
    await mutator.orderDetails.PUT(orderWithTags);
    await fetchOrder();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchOrder]);

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

  const onCreateInvoice = useCallback(() => {
    history.push(`${INVOICES_ROUTE}/create`, { orderIds: [order.id] });
  }, [history, order]);

  const toggleForceVisibility = () => {
    setHiddenFields(prevHiddenFields => (
      prevHiddenFields
        ? undefined
        : (orderTemplate?.hiddenFields || {})
    ));
  };

  const onReexportConfirm = useCallback(() => {
    toggleOrderReexportModal();
    setIsLoading(true);
    fetchOrder().finally(() => setIsLoading(false));
  }, [fetchOrder, toggleOrderReexportModal]);

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-orders.orders.create')) {
          history.push('/orders/create');
        }
      }),
    },
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (
          stripes.hasPerm('ui-orders.orders.edit') &&
          !isRestrictionsLoading &&
          !restrictions.protectUpdate
        ) onEdit();
      }),
    },
    {
      name: 'duplicateRecord',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-orders.orders.create')) {
          toggleCloneConfirmation();
        }
      }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'addPOL',
      shortcut: 'alt+a',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('orders.po-lines.item.post') && isAbleToAddLines) {
          onAddPOLine();
        }
      }),
    },
  ];

  if (isLoading || order?.id !== match.params.id || isOrderTemplateLoading) {
    return (
      <LoadingPane
        id="order-details"
        dismissible
        defaultWidth="fill"
        onClose={gotToOrdersList}
      />
    );
  }

  const POPane = (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager record={orderNumber} />
      <Pane
        id="order-details"
        actionMenu={getPOActionMenu({
          approvalsSetting,
          clickApprove: approveOrder,
          clickCancel: () => {
            setIsCancelReason(true);
            toggleCloseOrderModal();
          },
          clickClone: toggleCloneConfirmation,
          clickClose: toggleCloseOrderModal,
          clickCreateInvoice: toggleCreateInvoiceModal,
          clickDelete: toggleDeleteOrderConfirm,
          clickEdit: onEdit,
          clickOpen: toggleOpenOrderModal,
          clickReceive: goToReceiving,
          clickReexport: toggleOrderReexportModal,
          clickReopen: reopenOrder,
          clickUnopen: toggleUnopenOrderModal,
          clickUpdateEncumbrances: updateEncumbrances,
          handlePrint: togglePrintModal,
          isRestrictionsLoading,
          order,
          restrictions,
          toggleForceVisibility,
          hiddenFields,
          orderTemplate,
        })}
        data-test-order-details
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.details" values={{ orderNumber }} />}
        lastMenu={lastMenu}
        dismissible
        onClose={gotToOrdersList}
      >
        <AccordionStatus ref={accordionStatusRef}>
          <Row
            end="xs"
            bottom="xs"
          >
            <Col xs={10}>
              {isPrintModalOpened && <Loading size="large" />}

              {isCloseOrderModalOpened && (
                <CloseOrderModal
                  cancel={cancelClosingOrder}
                  closeOrder={closeOrder}
                  closingReasons={reasonsForClosure}
                  orderNumber={orderNumber}
                  isCancelReason={isCancelReason}
                />
              )}

              {isOpenOrderModalOpened && (
                <OpenOrderConfirmationModal
                  orderNumber={orderNumber}
                  submit={openOrder}
                  cancel={toggleOpenOrderModal}
                />
              )}
            </Col>

            <Col xs={2}>
              <ExpandAllButton />
            </Col>
          </Row>
          <AccordionSet>
            <Accordion
              id="purchaseOrder"
              label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
            >
              <PODetailsView
                addresses={addresses}
                order={order}
                hiddenFields={hiddenFields}
              />
            </Accordion>
            {isOngoing(orderType) && (
              <Accordion
                id="ongoing"
                label={<FormattedMessage id="ui-orders.paneBlock.ongoingInfo" />}
              >
                <OngoingOrderInfoView
                  order={order}
                  hiddenFields={hiddenFields}
                />
              </Accordion>
            )}
            <Accordion
              id="POSummary"
              label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
            >
              <SummaryView
                order={order}
                hiddenFields={hiddenFields}
              />
            </Accordion>
            <Accordion
              displayWhenOpen={lineListingActionMenu}
              id="POListing"
              label={<FormattedMessage id="ui-orders.paneBlock.POLines" />}
            >
              <LineListing
                baseUrl={`${ORDERS_ROUTE}/view/${order.id}`}
                funds={funds}
                poLines={poLines}
                visibleColumns={visibleColumns}
              />
            </Accordion>
            <POInvoicesContainer
              label={<FormattedMessage id="ui-orders.paneBlock.relatedInvoices" />}
              orderInvoicesIds={orderInvoicesIds}
            />
            <ViewCustomFieldsRecord
              accordionId="customFieldsPO"
              backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
              customFieldsValues={customFieldsValues}
              entityType="purchase_order"
            />
            {Boolean(exportHistory?.length) && (
              <ExportDetailsAccordion
                id="exportDetails"
                exportHistory={exportHistory}
                isLoading={isExportHistoryLoading}
              />
            )}
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
            ariaLabel={deleteOrderModalLabel}
            id="delete-order-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
            heading={deleteOrderModalLabel}
            message={<FormattedMessage id="ui-orders.order.delete.message" />}
            onCancel={toggleDeleteOrderConfirm}
            onConfirm={deletePO}
            open
          />
        )}
        {isCloneConfirmation && (
          <ConfirmationModal
            aria-label={cloneOrderModalLabel}
            id="order-clone-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.clone.confirmLabel" />}
            heading={cloneOrderModalLabel}
            message={<FormattedMessage id="ui-orders.order.clone.message" />}
            onCancel={toggleCloneConfirmation}
            onConfirm={onCloneOrder}
            open
          />
        )}
        {isUnopenOrderModalOpened && (
          <UnopenOrderConfirmationModal
            onCancel={toggleUnopenOrderModal}
            onConfirm={unopenOrder}
            compositeOrder={order}
          />
        )}
        {isDeletePiecesOpened && (
          <ModalDeletePieces
            onCancel={toggleDeletePieces}
            onSubmit={openOrder}
            poLines={poLines}
          />
        )}
        {isDifferentAccountModalOpened && (
          <ErrorModal
            aria-label={differentAccountModalLabel}
            id="order-open-different-account"
            label={differentAccountModalLabel}
            content={<FormattedMessage id="ui-orders.differentAccounts.message" values={{ accountNumber: accountNumbers.length }} />}
            onClose={toggleDifferentAccountModal}
            open
          />
        )}
        {isCreateInvoiceModalOpened && (
          <ConfirmationModal
            aria-label={createInvoiceModalLabel}
            id="create-invoice-from-order"
            heading={createInvoiceModalLabel}
            message={<FormattedMessage id="ui-orders.createInvoice.confirmationModal.order.message" />}
            onCancel={toggleCreateInvoiceModal}
            onConfirm={onCreateInvoice}
            open
          />
        )}
        {isOrderReexportModalOpened && (
          <ReexportModal
            id="reexport-order-confirm-modal"
            onCancel={toggleOrderReexportModal}
            onConfirm={onReexportConfirm}
            order={order}
            poLines={poLines}
            exportHistory={exportHistory}
            isLoading={isExportHistoryLoading}
            source={REEXPORT_SOURCES.order}
          />
        )}
      </Pane>
    </HasCommand>
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

      {isPrintModalOpened && (
        <PrintOrder
          onCancel={togglePrintModal}
          order={order}
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
  stripes: PropTypes.object.isRequired,
};

export default stripesConnect(PO);
