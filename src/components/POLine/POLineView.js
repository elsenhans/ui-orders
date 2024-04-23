import React, { useCallback, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage, useIntl } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  IfPermission,
  TitleManager,
  useStripes,
} from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  IconButton,
  Loading,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import {
  NotesSmartAccordion,
  ViewCustomFieldsRecord,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import {
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  DonorsListContainer,
  FundDistributionView,
  handleKeyCommand,
  ORDER_FORMATS,
  TagsBadge,
  useAcqRestrictions,
  useModalToggle,
  VersionHistoryButton,
} from '@folio/stripes-acq-components';

import {
  PrintOrder,
} from '../../PrintOrder';
import { isWorkflowStatusClosed } from '../PurchaseOrder/util';
import {
  ExportDetailsAccordion,
  ReexportModal,
} from '../../common';
import {
  NOTE_TYPES,
  NOTES_ROUTE,
  ORDERS_DOMAIN,
  ORDERS_ROUTE,
  REEXPORT_SOURCES,
  ORDER_LINES_ROUTE,
} from '../../common/constants';
import { useExportHistory } from '../../common/hooks';
import { isOngoing } from '../../common/POFields';

import LocationView from './Location/LocationView';
import { POLineDetails } from './POLineDetails';
import CostView from './Cost/CostView';
import VendorView from './Vendor/VendorView';
import EresourcesView from './Eresources/EresourcesView';
import InstancePlugin from './Item/InstancePlugin';
import ItemView from './Item/ItemView';
import { LineLinkedInstances } from './LineLinkedInstances';
import PhysicalView from './Physical/PhysicalView';
import { OtherView } from './Other';
import { POLineAgreementLinesContainer } from './POLineAgreementLines';
import { RelatedInvoiceLines } from './RelatedInvoiceLines';
import {
  ChangeInstanceModal,
  useChangeInstanceConnection,
} from './ChangeInstanceConnection';
import { OngoingOrderView } from './OngoingOrder';
import { POLineActionMenu } from './POLineActionMenu';
import {
  ACCORDION_ID,
  ERESOURCES,
  PHRESOURCES,
} from './const';
import {
  isCancelableLine,
} from './utils';

const initialAccordionStatus = {
  CostDetails: true,
  Vendor: true,
  FundDistribution: true,
  ItemDetails: true,
  Renewal: true,
  [ACCORDION_ID.eresources]: true,
  [ACCORDION_ID.location]: true,
  [ACCORDION_ID.other]: true,
  [ACCORDION_ID.physical]: true,
  [ACCORDION_ID.relatedInvoiceLines]: true,
  [ACCORDION_ID.notes]: true,
  [ACCORDION_ID.poLine]: true,
  [ACCORDION_ID.linkedInstances]: false,
  [ACCORDION_ID.exportDetails]: false,
  [ACCORDION_ID.ongoingOrder]: true,
};

const POLineView = ({
  cancelLine,
  deleteLine,
  editable,
  goToOrderDetails,
  history,
  line,
  location,
  locations,
  materialTypes,
  onClose,
  order,
  poURL,
  tagsToggle,
  orderTemplate,
  refetch,
}) => {
  const intl = useIntl();
  const stripes = useStripes();
  const [showConfirmDelete, toggleConfirmDelete] = useModalToggle();
  const [showConfirmCancel, toggleConfirmCancel] = useModalToggle();
  const [isPrintOrderModalOpened, togglePrintOrderModal] = useModalToggle();
  const [isPrintLineModalOpened, togglePrintLineModal] = useModalToggle();
  const [isInstancePluginOpen, toggleInstancePlugin] = useModalToggle();
  const [isOrderLineReexportModalOpened, toggleOrderLineReexportModal] = useModalToggle();
  const [hiddenFields, setHiddenFields] = useState({});

  const accordionStatusRef = useRef();

  const {
    cancelChangeInstance,
    onSelectInstance,
    selectedInstance,
    showConfirmChangeInstance,
    submitChangeInstance,
  } = useChangeInstanceConnection(line, { refetch });

  const {
    isLoading: isExportHistoryLoading,
    exportHistory,
  } = useExportHistory([line.id]);

  const isCancelable = isCancelableLine(line, order);

  useEffect(() => {
    setHiddenFields(orderTemplate.hiddenFields);
  }, [orderTemplate.hiddenFields]);

  const toggleForceVisibility = useCallback(() => {
    setHiddenFields(prevHiddenFields => (
      prevHiddenFields
        ? undefined
        : (orderTemplate.hiddenFields || {})
    ));
  }, [orderTemplate.hiddenFields]);

  const openVersionHistory = useCallback(() => {
    history.push({
      pathname: poURL
        ? `${ORDERS_ROUTE}/view/${order.id}/po-line/view/${line.id}/versions`
        : `${ORDER_LINES_ROUTE}/view/${line.id}/versions`,
      search: location.search,
    });
  }, [history, line.id, location.search, order.id, poURL]);

  const onEditPOLine = useCallback((e) => {
    if (e) e.preventDefault();
    history.push({
      pathname: `/orders/view/${order.id}/po-line/edit/${line.id}`,
      search: location.search,
      state: { backPathname: location.pathname },
    });
  }, [history, order.id, line.id, location.pathname, location.search]);

  const onConfirmDelete = useCallback(() => {
    toggleConfirmDelete();
    deleteLine();
  }, [deleteLine, toggleConfirmDelete]);

  const onConfirmCancel = useCallback(() => {
    toggleConfirmCancel();
    cancelLine();
  }, [cancelLine, toggleConfirmCancel]);

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(
    order?.id, order?.acqUnitIds,
  );

  const onReexportConfirm = useCallback(() => {
    toggleOrderLineReexportModal();
    refetch();
  }, [refetch, toggleOrderLineReexportModal]);

  const renderInstancePlugin = useCallback(({
    onSelect,
    onClose: onClosePlugin,
  }) => (
    <InstancePlugin
      addInstance={onSelect}
      onClose={onClosePlugin}
      withTrigger={false}
    />
  ), []);

  const shortcuts = [
    {
      name: 'edit',
      handler: handleKeyCommand(() => {
        if (
          stripes.hasPerm('ui-orders.orders.edit') &&
          !isRestrictionsLoading &&
          !restrictions.protectUpdate
        ) onEditPOLine();
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
  ];

  // eslint-disable-next-line react/prop-types
  const getActionMenu = useCallback(({ onToggle }) => {
    return (
      <POLineActionMenu
        hiddenFields={hiddenFields}
        line={line}
        order={order}
        orderTemplate={orderTemplate}
        restrictions={restrictions}
        isCancelable={isCancelable}
        isEditable={editable}
        isRestrictionsLoading={isRestrictionsLoading}
        onToggle={onToggle}
        onCancelLine={toggleConfirmCancel}
        onChangeInstance={toggleInstancePlugin}
        onDeleteLine={toggleConfirmDelete}
        onEditLine={onEditPOLine}
        onNavigateToOrder={goToOrderDetails}
        onPrintLine={togglePrintLineModal}
        onPrintOrder={togglePrintOrderModal}
        onReexport={toggleOrderLineReexportModal}
        toggleForceVisibility={toggleForceVisibility}
      />
    );
  }, [
    editable,
    goToOrderDetails,
    hiddenFields,
    isCancelable,
    isRestrictionsLoading,
    line,
    onEditPOLine,
    order,
    orderTemplate,
    restrictions,
    toggleConfirmCancel,
    toggleConfirmDelete,
    toggleForceVisibility,
    toggleInstancePlugin,
    toggleOrderLineReexportModal,
    togglePrintLineModal,
    togglePrintOrderModal,
  ]);

  const tags = get(line, ['tags', 'tagList'], []);

  const firstMenu = (
    <PaneMenu>
      <IconButton
        icon="arrow-left"
        id="clickable-backToPO"
        onClick={onClose}
        title="Back to PO"
      />
    </PaneMenu>);
  const lastMenu = (
    <PaneMenu>
      <TagsBadge
        tagsToggle={tagsToggle}
        tagsQuantity={tags.length}
      />
      <VersionHistoryButton
        onClick={openVersionHistory}
      />
    </PaneMenu>
  );

  const orderFormat = get(line, 'orderFormat');
  const poLineNumber = line.poLineNumber;
  const showEresources = ERESOURCES.includes(orderFormat);
  const showPhresources = PHRESOURCES.includes(orderFormat);
  const showOther = orderFormat === ORDER_FORMATS.other;
  const estimatedPrice = get(line, ['cost', 'poLineEstimatedPrice'], 0);
  const fundDistributions = get(line, 'fundDistribution');
  const currency = get(line, 'cost.currency');
  const metadata = get(line, 'metadata');
  const paneTitle = <FormattedMessage id="ui-orders.line.paneTitle.details" values={{ poLineNumber }} />;
  const isClosedOrder = isWorkflowStatusClosed(order);
  const cancelPOLModalLabel = intl.formatMessage({ id: 'ui-orders.line.cancel.heading' }, { poLineNumber });
  const deletePOLModalLabel = intl.formatMessage(
    { id: 'ui-orders.order.delete.heading' },
    { orderNumber: poLineNumber },
  );
  const customFieldsValues = get(line, 'customFields', {});

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager record={poLineNumber} />
      <Pane
        id="order-lines-details"
        defaultWidth="fill"
        firstMenu={poURL ? firstMenu : null}
        actionMenu={getActionMenu}
        dismissible={!poURL}
        onClose={onClose}
        lastMenu={lastMenu}
        paneTitle={paneTitle}
        paneSub={line?.titleOrPackage}
      >
        <AccordionStatus ref={accordionStatusRef}>
          {({ setStatus }) => (
            <>
              <Row
                end="xs"
                bottom="xs"
              >
                <Col xs={10}>
                  {(isPrintOrderModalOpened || isPrintLineModalOpened) && <Loading size="large" />}

                  {isClosedOrder && (
                    <MessageBanner type="warning">
                      <FormattedMessage
                        id="ui-orders.line.closedOrderMessage"
                        values={{ reason: order.closeReason?.reason }}
                      />
                    </MessageBanner>
                  )}
                </Col>
                <Col xs={2}>
                  <ExpandAllButton />
                </Col>
              </Row>
              <AccordionSet initialStatus={initialAccordionStatus}>
                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.itemDetails" />}
                  id="ItemDetails"
                >
                  {metadata && <ViewMetaData metadata={metadata} />}

                  <ItemView
                    poLineDetails={line}
                    hiddenFields={hiddenFields}
                  />
                </Accordion>

                {line.isPackage && (
                  <LineLinkedInstances
                    line={line}
                    labelId="ui-orders.line.accordion.packageTitles"
                    setStatus={setStatus}
                  />
                )}

                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.poLine" />}
                  id={ACCORDION_ID.poLine}
                >
                  <POLineDetails
                    line={line}
                    hiddenFields={hiddenFields}
                  />
                </Accordion>
                {isOngoing(order.orderType) && (
                  <Accordion
                    label={<FormattedMessage id="ui-orders.line.accordion.ongoingOrder" />}
                    id={ACCORDION_ID.ongoingOrder}
                  >
                    <OngoingOrderView
                      renewalNote={line.renewalNote}
                      hiddenFields={hiddenFields}
                    />
                  </Accordion>
                )}
                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.donorInformation" />}
                  id={ACCORDION_ID.donorsInformation}
                >
                  <DonorsListContainer donorOrganizationIds={line.donorOrganizationIds} />
                </Accordion>
                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
                  id="Vendor"
                >
                  <VendorView
                    vendorDetail={line.vendorDetail}
                    vendorId={order?.vendor}
                    hiddenFields={hiddenFields}
                  />
                </Accordion>
                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.cost" />}
                  id="CostDetails"
                >
                  <CostView
                    cost={line.cost}
                    isPackage={line.isPackage}
                    orderFormat={orderFormat}
                    hiddenFields={hiddenFields}
                  />
                </Accordion>
                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.fund" />}
                  id="FundDistribution"
                >
                  <FundDistributionView
                    currency={currency}
                    fundDistributions={fundDistributions}
                    totalAmount={estimatedPrice}
                  />
                </Accordion>
                <Accordion
                  label={<FormattedMessage id="ui-orders.line.accordion.location" />}
                  id={ACCORDION_ID.location}
                >
                  <LocationView
                    lineLocations={line.locations}
                    locations={locations}
                  />
                </Accordion>
                {showPhresources && (
                  <Accordion
                    label={<FormattedMessage id="ui-orders.line.accordion.physical" />}
                    id={ACCORDION_ID.physical}
                  >
                    <PhysicalView
                      materialTypes={materialTypes}
                      physical={get(line, 'physical', {})}
                      hiddenFields={hiddenFields}
                    />
                  </Accordion>
                )}
                {showEresources && (
                  <Accordion
                    label={<FormattedMessage id="ui-orders.line.accordion.eresource" />}
                    id={ACCORDION_ID.eresources}
                  >
                    <EresourcesView
                      line={line}
                      materialTypes={materialTypes}
                      order={order}
                      hiddenFields={hiddenFields}
                    />
                  </Accordion>
                )}
                {showOther && (
                  <Accordion
                    label={<FormattedMessage id="ui-orders.line.accordion.other" />}
                    id={ACCORDION_ID.other}
                  >
                    <OtherView
                      materialTypes={materialTypes}
                      physical={get(line, 'physical', {})}
                      hiddenFields={hiddenFields}
                    />
                  </Accordion>
                )}
                <IfPermission perm="ui-notes.item.view">
                  <NotesSmartAccordion
                    domainName={ORDERS_DOMAIN}
                    entityId={line.id}
                    entityName={poLineNumber}
                    entityType={NOTE_TYPES.poLine}
                    hideAssignButton
                    id={ACCORDION_ID.notes}
                    pathToNoteCreate={`${NOTES_ROUTE}/new`}
                    pathToNoteDetails={NOTES_ROUTE}
                  />
                </IfPermission>

                {Boolean(exportHistory?.length) && (
                  <ExportDetailsAccordion
                    id={ACCORDION_ID.exportDetails}
                    exportHistory={exportHistory}
                    isLoading={isExportHistoryLoading}
                  />
                )}

                <RelatedInvoiceLines
                  label={<FormattedMessage id="ui-orders.line.accordion.relatedInvoiceLines" />}
                  lineId={line?.id}
                />

                <POLineAgreementLinesContainer
                  label={<FormattedMessage id="ui-orders.line.accordion.linkedAgreementLines" />}
                  lineId={line.id}
                />

                {!line.isPackage && (
                  <LineLinkedInstances
                    line={line}
                    labelId="ui-orders.line.accordion.linkedInstance"
                    setStatus={setStatus}
                  />
                )}

                <ViewCustomFieldsRecord
                  accordionId="customFieldsPOLine"
                  backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
                  customFieldsValues={customFieldsValues}
                  entityType="po_line"
                />
              </AccordionSet>
            </>
          )}
        </AccordionStatus>

        {showConfirmDelete && (
          <ConfirmationModal
            aria-label={deletePOLModalLabel}
            id="delete-line-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
            heading={deletePOLModalLabel}
            message={<FormattedMessage id="ui-orders.line.delete.message" />}
            onCancel={toggleConfirmDelete}
            onConfirm={onConfirmDelete}
            open
          />
        )}
        {showConfirmCancel && (
          <ConfirmationModal
            aria-label={cancelPOLModalLabel}
            id="cancel-line-confirmation"
            confirmLabel={<FormattedMessage id="ui-orders.line.cancel.confirmLabel" />}
            heading={cancelPOLModalLabel}
            message={<FormattedMessage id="ui-orders.line.cancel.message" />}
            onCancel={toggleConfirmCancel}
            onConfirm={onConfirmCancel}
            open
          />
        )}

        {isInstancePluginOpen && renderInstancePlugin({
          onSelect: onSelectInstance,
          onClose: toggleInstancePlugin,
        })}

        {showConfirmChangeInstance && (
          <ChangeInstanceModal
            onCancel={cancelChangeInstance}
            onSubmit={submitChangeInstance}
            poLine={line}
            selectedInstance={selectedInstance}
          />
        )}

        {isOrderLineReexportModalOpened && (
          <ReexportModal
            id="reexport-order-line-confirm-modal"
            onCancel={toggleOrderLineReexportModal}
            onConfirm={onReexportConfirm}
            order={order}
            poLines={[line]}
            exportHistory={exportHistory}
            isLoading={isExportHistoryLoading}
            source={REEXPORT_SOURCES.orderLine}
          />
        )}
      </Pane>

      {
        isPrintOrderModalOpened && (
          <PrintOrder
            order={order}
            onCancel={togglePrintOrderModal}
          />
        )
      }

      {
        isPrintLineModalOpened && (
          <PrintOrder
            order={order}
            orderLine={line}
            onCancel={togglePrintLineModal}
          />
        )
      }
    </HasCommand>
  );
};

POLineView.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  poURL: PropTypes.string,
  location: ReactRouterPropTypes.location.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object,
  line: PropTypes.object,
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func,
  editable: PropTypes.bool,
  goToOrderDetails: PropTypes.func,
  deleteLine: PropTypes.func,
  cancelLine: PropTypes.func,
  tagsToggle: PropTypes.func.isRequired,
  orderTemplate: PropTypes.object,
  refetch: PropTypes.func.isRequired,
};

POLineView.defaultProps = {
  locations: [],
  materialTypes: [],
  editable: true,
  orderTemplate: {},
};

export default withRouter(POLineView);
