import React, { useCallback, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { useReactToPrint } from 'react-to-print';

import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  IconButton,
  MenuSection,
  MessageBanner,
  Pane,
  PaneMenu,
  Row,
} from '@folio/stripes/components';
import {
  NotesSmartAccordion,
  ViewMetaData,
} from '@folio/stripes/smart-components';

import {
  FundDistributionView,
  ORDER_FORMATS,
  TagsBadge,
  useAcqRestrictions,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { PrintSettingsModalContainer } from '../../common/ExportSettingsModal';
import {
  hydrateOrderToPrint,
  PrintContent,
} from '../../PrintOrder';
import {
  isCheckInAvailableForLine,
  isReceiveAvailableForLine,
  isWorkflowStatusClosed,
} from '../PurchaseOrder/util';
import {
  NOTE_TYPES,
  NOTES_ROUTE,
  ORDERS_DOMAIN,
} from '../../common/constants';

import LocationView from './Location/LocationView';
import { POLineDetails } from './POLineDetails';
import CostView from './Cost/CostView';
import VendorView from './Vendor/VendorView';
import EresourcesView from './Eresources/EresourcesView';
import ItemView from './Item/ItemView';
import { LineLinkedInstances } from './LineLinkedInstances';
import PhysicalView from './Physical/PhysicalView';
import { OtherView } from './Other';
import POLineInvoicesContainer from './POLineInvoices';
import { POLineAgreementLinesContainer } from './POLineAgreementLines';
import {
  ACCORDION_ID,
  ERESOURCES,
  PHRESOURCES,
} from './const';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList/constants';

const POLineView = ({
  deleteLine,
  editable,
  goToOrderDetails,
  history,
  line,
  location,
  locations,
  match: { params: { lineId } },
  materialTypes,
  onClose,
  order,
  poURL,
  tagsToggle,
}) => {
  const [sections, setSections] = useState({
    CostDetails: true,
    Vendor: true,
    FundDistribution: true,
    ItemDetails: true,
    Renewal: true,
    [ACCORDION_ID.eresources]: true,
    [ACCORDION_ID.location]: true,
    [ACCORDION_ID.other]: true,
    [ACCORDION_ID.physical]: true,
    [ACCORDION_ID.relatedInvoices]: true,
    [ACCORDION_ID.notes]: true,
    [ACCORDION_ID.poLine]: true,
    [ACCORDION_ID.linkedInstances]: false,
  });
  const [showConfirmDelete, toggleConfirmDelete] = useModalToggle();
  const [isPrintModalOpened, togglePrintModal] = useModalToggle();

  const onToggleSection = useCallback(({ id }) => {
    setSections((prevSections) => {
      const isSectionOpened = prevSections[id];

      return {
        ...prevSections,
        [id]: !isSectionOpened,
      };
    });
  }, []);

  const handleExpandAll = useCallback((newSections) => {
    setSections(newSections);
  }, []);

  const onEditPOLine = useCallback((e) => {
    if (e) e.preventDefault();
    const search = lineId ? location.search : `qindex=${ORDER_FILTERS.PO_NUMBER}&query=${order.poNumber}`;

    history.push({
      pathname: `/orders/view/${order.id}/po-line/edit/${line.id}`,
      search,
    });
  }, [history, line.id, lineId, location.search, order.id, order.poNumber]);

  const onConfirmDelete = useCallback(() => {
    toggleConfirmDelete();
    deleteLine();
  }, [deleteLine, toggleConfirmDelete]);

  const { restrictions, isLoading: isRestrictionsLoading } = useAcqRestrictions(
    order?.id, order?.acqUnitIds,
  );

  // eslint-disable-next-line react/prop-types
  const getActionMenu = ({ onToggle }) => {
    const isReceiveButtonVisible = isReceiveAvailableForLine(line, order);
    const isCheckInButtonVisible = isCheckInAvailableForLine(line, order);

    // TODO: unify actions after Order Lines list is implemented fully
    return (
      <MenuSection id="data-test-line-details-actions">
        {editable && (
          <IfPermission perm="orders.po-lines.item.put">
            <Button
              buttonStyle="dropdownItem"
              data-test-button-edit-line
              disabled={isRestrictionsLoading || restrictions.protectUpdate}
              onClick={() => {
                onToggle();
                onEditPOLine();
              }}
            >
              <Icon size="small" icon="edit">
                <FormattedMessage id="ui-orders.button.edit" />
              </Icon>
            </Button>
          </IfPermission>
        )}
        {goToOrderDetails && (
          <Button
            data-test-line-details-actions-view-po
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              goToOrderDetails();
            }}
          >
            <Icon icon="eye-open">
              <FormattedMessage id="ui-orders.poLine.actions.viewPO" />
            </Icon>
          </Button>
        )}
        <IfPermission perm="ui-receiving.view">
          {(isReceiveButtonVisible || isCheckInButtonVisible) && (
            <Button
              buttonStyle="dropdownItem"
              data-test-line-receive-button
              to={`/receiving?qindex=poLine.poLineNumber&query=${line.poLineNumber}`}
            >
              <Icon size="small" icon="receive">
                <FormattedMessage id="ui-orders.paneBlock.receiveBtn" />
              </Icon>
            </Button>
          )}
        </IfPermission>
        <IfPermission perm="orders.po-lines.item.delete">
          <Button
            buttonStyle="dropdownItem"
            data-test-button-delete-line
            disabled={isRestrictionsLoading || restrictions.protectDelete}
            onClick={() => {
              onToggle();
              toggleConfirmDelete();
            }}
          >
            <Icon size="small" icon="trash">
              <FormattedMessage id="ui-orders.button.delete" />
            </Icon>
          </Button>
        </IfPermission>
        <Button
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            togglePrintModal();
          }}
        >
          <Icon size="small" icon="print">
            <FormattedMessage id="ui-orders.button.print" />
          </Icon>
        </Button>
      </MenuSection>
    );
  };

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
  const isClosedOrder = isWorkflowStatusClosed(order);
  const paneTitle = <FormattedMessage id="ui-orders.line.paneTitle.details" values={{ poLineNumber }} />;
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

  return (
    <Pane
      id="order-lines-details"
      defaultWidth="fill"
      firstMenu={poURL ? firstMenu : null}
      actionMenu={getActionMenu}
      dismissible={!poURL}
      onClose={onClose}
      lastMenu={lastMenu}
      paneTitle={paneTitle}
    >
      <AccordionSet
        accordionStatus={sections}
        onToggle={onToggleSection}
      >
        <Row end="xs">
          <Col xs={10}>
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
            <ExpandAllButton
              accordionStatus={sections}
              onToggle={handleExpandAll}
            />
          </Col>
        </Row>
        <Accordion
          label={<FormattedMessage id="ui-orders.line.accordion.itemDetails" />}
          id="ItemDetails"
        >
          {metadata && <ViewMetaData metadata={metadata} />}

          <ItemView poLineDetails={line} />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-orders.line.accordion.poLine" />}
          id={ACCORDION_ID.poLine}
        >
          <POLineDetails line={line} />
        </Accordion>
        <Accordion
          label={<FormattedMessage id="ui-orders.line.accordion.vendor" />}
          id="Vendor"
        >
          <VendorView
            vendorDetail={line.vendorDetail}
            vendorId={order?.vendor}
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
            onToggle={onToggleSection}
            pathToNoteCreate={`${NOTES_ROUTE}/new`}
            pathToNoteDetails={NOTES_ROUTE}
          />
        </IfPermission>
        <POLineInvoicesContainer
          label={<FormattedMessage id="ui-orders.line.accordion.relatedInvoices" />}
          lineId={get(line, 'id')}
        />
        <POLineAgreementLinesContainer
          label={<FormattedMessage id="ui-orders.line.accordion.linkedAgreementLines" />}
          lineId={line.id}
        />

        <LineLinkedInstances
          line={line}
          toggleSection={onToggleSection}
        />
      </AccordionSet>
      {showConfirmDelete && (
        <ConfirmationModal
          id="delete-line-confirmation"
          confirmLabel={<FormattedMessage id="ui-orders.order.delete.confirmLabel" />}
          heading={<FormattedMessage id="ui-orders.order.delete.heading" values={{ orderNumber: poLineNumber }} />}
          message={<FormattedMessage id="ui-orders.line.delete.message" />}
          onCancel={toggleConfirmDelete}
          onConfirm={onConfirmDelete}
          open
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
};

POLineView.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  poURL: PropTypes.string,
  location: ReactRouterPropTypes.location.isRequired,
  locations: PropTypes.arrayOf(PropTypes.object),
  order: PropTypes.object,
  line: PropTypes.object,
  match: ReactRouterPropTypes.match.isRequired,
  materialTypes: PropTypes.arrayOf(PropTypes.object),
  onClose: PropTypes.func,
  editable: PropTypes.bool,
  goToOrderDetails: PropTypes.func,
  deleteLine: PropTypes.func,
  tagsToggle: PropTypes.func.isRequired,
};

POLineView.defaultProps = {
  locations: [],
  materialTypes: [],
  editable: true,
};

export default withRouter(POLineView);
