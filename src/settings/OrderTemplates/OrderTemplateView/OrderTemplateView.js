import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { get } from 'lodash';

import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  Button,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Icon,
  Layer,
  Pane,
  Row,
} from '@folio/stripes/components';

import {
  FundDistributionView,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

import { PODetailsView } from '../../../components/PurchaseOrder/PODetails';
import { SummaryView } from '../../../components/PurchaseOrder/Summary';
import { OngoingOrderInfoView } from '../../../components/PurchaseOrder/OngoingOgderInfo';
import { ItemView } from '../../../components/POLine/Item';
import { POLineDetails } from '../../../components/POLine/POLineDetails';
import { CostView } from '../../../components/POLine/Cost';
import { VendorView } from '../../../components/POLine/Vendor';
import { EresourcesView } from '../../../components/POLine/Eresources';
import { PhysicalView } from '../../../components/POLine/Physical';
import { OtherView } from '../../../components/POLine/Other';
import LocationView from '../../../components/POLine/Location/LocationView';
import {
  ERESOURCES,
  PHRESOURCES,
} from '../../../components/POLine/const';
import { isOngoing } from '../../../common/POFields';
import {
  ORDER_TEMPLATES_ACCORDION_TITLES,
  ORDER_TEMPLATES_ACCORDION,
} from '../constants';
import TemplateInformationView from './TemplateInformationView';
import OrderTemplateTagsView from './OrderTemplateTagsView';

class OrderTemplateView extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
    orderTemplate: PropTypes.object,
    rootPath: PropTypes.string,
    addresses: PropTypes.arrayOf(PropTypes.object),
    locations: PropTypes.arrayOf(PropTypes.object),
    materialTypes: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    addresses: [],
    locations: [],
    materialTypes: [],
    orderTemplate: {},
  }

  constructor(props, context) {
    super(props, context);

    this.state = {
      sections: {
        [ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]: true,
        [ORDER_TEMPLATES_ACCORDION.PO_INFO]: false,
        [ORDER_TEMPLATES_ACCORDION.PO_TAGS]: false,
        [ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]: false,
        [ORDER_TEMPLATES_ACCORDION.PO_ONGOING]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_DETAILS]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_VENDOR]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_LOCATION]: false,
        [ORDER_TEMPLATES_ACCORDION.POL_TAGS]: false,
      },
      showConfirmDelete: false,
    };
  }

  onToggleSection = ({ id }) => {
    this.setState(({ sections }) => {
      const isSectionOpened = sections[id];

      return {
        sections: {
          ...sections,
          [id]: !isSectionOpened,
        },
      };
    });
  };

  handleExpandAll = (sections) => {
    this.setState({ sections });
  };

  onDeleteOrderTemplate = () => {
    const { onDelete } = this.props;

    this.hideConfirmDelete();
    onDelete();
  };

  showConfirmDelete = () => this.setState({ showConfirmDelete: true });

  hideConfirmDelete = () => this.setState({ showConfirmDelete: false });

  getActionMenu = ({ onToggle }) => {
    const { rootPath, orderTemplate } = this.props;
    const id = get(orderTemplate, 'id');

    return (
      <div data-test-view-order-template-actions>
        <IfPermission perm="ui-orders.settings.order-templates.edit">
          <Button
            data-test-view-order-template-action-edit
            buttonStyle="dropdownItem"
            to={`${rootPath}/${id}/edit`}
          >
            <Icon icon="edit">
              <FormattedMessage id="ui-orders.button.edit" />
            </Icon>
          </Button>
        </IfPermission>
        <IfPermission perm="ui-orders.settings.order-templates.delete">
          <Button
            data-test-view-order-template-action-delete
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              this.showConfirmDelete();
            }}
          >
            <Icon icon="trash">
              <FormattedMessage id="ui-orders.button.delete" />
            </Icon>
          </Button>
        </IfPermission>
      </div>
    );
  };

  render() {
    const {
      close,
      orderTemplate,
      addresses,
      locations,
      materialTypes,
    } = this.props;
    const { sections, showConfirmDelete } = this.state;
    const title = get(orderTemplate, 'templateName', '');
    const orderFormat = get(orderTemplate, 'orderFormat');
    const showEresources = ERESOURCES.includes(orderFormat);
    const showPhresources = PHRESOURCES.includes(orderFormat);
    const showOther = orderFormat === ORDER_FORMATS.other;
    const orderType = get(orderTemplate, 'orderType');

    const estimatedPrice = get(orderTemplate, ['cost', 'poLineEstimatedPrice'], 0);
    const fundDistributions = get(orderTemplate, 'fundDistribution');

    return (
      <Layer
        contentLabel="Order template details"
        isOpen
      >
        <Pane
          actionMenu={this.getActionMenu}
          id="order-settings-order-template-view"
          defaultWidth="fill"
          paneTitle={title}
          dismissible
          onClose={close}
        >

          <Row center="xs">
            <Col xs={12} md={8}>
              <Row end="xs">
                <Col xs={12}>
                  <ExpandAllButton
                    accordionStatus={sections}
                    onToggle={this.handleExpandAll}
                  />
                </Col>
              </Row>
            </Col>
          </Row>

          <Row center="xs">
            <Col xs={12} md={8}>
              <AccordionSet
                accordionStatus={sections}
                onToggle={this.onToggleSection}
              >
                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO]}
                  id={ORDER_TEMPLATES_ACCORDION.TEMPLATE_INFO}
                >
                  <TemplateInformationView
                    orderTemplate={orderTemplate}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_INFO]}
                  id={ORDER_TEMPLATES_ACCORDION.PO_INFO}
                >
                  <PODetailsView
                    addresses={addresses}
                    order={orderTemplate}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_TAGS]}
                  id={ORDER_TEMPLATES_ACCORDION.PO_TAGS}
                >
                  <OrderTemplateTagsView tags={get(orderTemplate, 'poTags.tagList')} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_SUMMARY]}
                  id={ORDER_TEMPLATES_ACCORDION.PO_SUMMARY}
                >
                  <SummaryView order={orderTemplate} />
                </Accordion>

                {isOngoing(orderType) && (
                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.PO_ONGOING]}
                    id={ORDER_TEMPLATES_ACCORDION.PO_ONGOING}
                  >
                    <OngoingOrderInfoView order={orderTemplate} />
                  </Accordion>
                )}

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_ITEM_DETAILS}
                >
                  <ItemView poLineDetails={orderTemplate} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_DETAILS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_DETAILS}
                >
                  <POLineDetails line={orderTemplate} />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_VENDOR]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_VENDOR}
                >
                  <VendorView
                    vendorDetail={orderTemplate.vendorDetail}
                    vendorId={orderTemplate.vendor}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_COST_DETAILS}
                >
                  <CostView
                    cost={orderTemplate.cost}
                    isPackage={orderTemplate.isPackage}
                    orderFormat={orderFormat}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_FUND_DISTIBUTION}
                >
                  <FundDistributionView
                    fundDistributions={fundDistributions}
                    totalAmount={estimatedPrice}
                  />
                </Accordion>

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_LOCATION]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_LOCATION}
                >
                  <LocationView
                    lineLocations={orderTemplate.locations}
                    locations={locations}
                  />
                </Accordion>

                {showPhresources && (
                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_FRESOURCES}
                  >
                    <PhysicalView
                      materialTypes={materialTypes}
                      physical={orderTemplate.physical}
                    />
                  </Accordion>
                )}

                {showEresources && (
                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_ERESOURCES}
                  >
                    <EresourcesView
                      line={orderTemplate}
                      materialTypes={materialTypes}
                    />
                  </Accordion>
                )}

                {showOther && (
                  <Accordion
                    label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES]}
                    id={ORDER_TEMPLATES_ACCORDION.POL_OTHER_RESOURCES}
                  >
                    <OtherView
                      materialTypes={materialTypes}
                      physical={orderTemplate.physical}
                    />
                  </Accordion>
                )}

                <Accordion
                  label={ORDER_TEMPLATES_ACCORDION_TITLES[ORDER_TEMPLATES_ACCORDION.POL_TAGS]}
                  id={ORDER_TEMPLATES_ACCORDION.POL_TAGS}
                >
                  <OrderTemplateTagsView tags={get(orderTemplate, 'polTags.tagList')} />
                </Accordion>
              </AccordionSet>
            </Col>
          </Row>
          {showConfirmDelete && (
            <ConfirmationModal
              id="delete-order-template-modal"
              confirmLabel={<FormattedMessage id="ui-orders.settings.orderTemplates.confirmDelete.confirmLabel" />}
              heading={<FormattedMessage id="ui-orders.settings.orderTemplates.confirmDelete.heading" />}
              message={<FormattedMessage id="ui-orders.settings.orderTemplates.confirmDelete.message" />}
              onCancel={this.hideConfirmDelete}
              onConfirm={this.onDeleteOrderTemplate}
              open
            />
          )}
        </Pane>
      </Layer>
    );
  }
}

export default OrderTemplateView;
