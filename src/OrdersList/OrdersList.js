import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { Callout } from '@folio/stripes/components';
import { stripesShape } from '@folio/stripes/core';
import { SearchAndSort, makeQueryFunction } from '@folio/stripes/smart-components';

import packageInfo from '../../package';
import {
  CONFIG_CLOSING_REASONS,
  CONFIG_CREATE_INVENTORY,
  CONFIG_ORDER_NUMBER,
  MODULE_ORDERS,
} from '../components/Utils/const';
import Panes from '../components/Panes';
import { POForm } from '../components/PurchaseOrder';
import FolioFormattedTime from '../components/FolioFormattedTime';
import { createOrderResource } from '../components/Utils/orderResource';
import {
  LOCATIONS,
  MATERIAL_TYPES,
  IDENTIFIER_TYPES,
} from '../components/Utils/resources';
import {
  CONFIG_API,
  LINES_API,
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
  ORDERS_API,
  VENDORS_API,
} from '../components/Utils/api';
import {
  lineMutatorShape,
  orderNumberMutatorShape,
  orderRecordsMutatorShape,
} from '../components/Utils/mutators';
import OrdersNavigation from '../common/OrdersNavigation';
import {
  getActiveFilters,
  handleFilterChange,
} from '../common/utils';

import OrdersListFilters from './OrdersListFilters';
import { filterConfig } from './OrdersListFilterConfig';

const INITIAL_RESULT_COUNT = 30;
const RESULT_COUNT_INCREMENT = 30;

class OrdersList extends Component {
  static manifest = Object.freeze({
    query: {
      initialValue: {
        query: '',
        filters: '',
        sort: 'poNumber',
      },
    },
    resultCount: { initialValue: INITIAL_RESULT_COUNT },
    records: {
      type: 'okapi',
      throwErrors: false,
      path: ORDERS_API,
      records: 'purchaseOrders',
      recordsRequired: '%{resultCount}',
      perRequest: RESULT_COUNT_INCREMENT,
      GET: {
        params: {
          query: makeQueryFunction(
            'cql.allRecords=1',
            '',
            {
              created: 'metadata.createdDate',
            },
            filterConfig,
          ),
        },
        staticFallback: { params: {} },
      },
    },
    vendors: {
      type: 'okapi',
      path: VENDORS_API,
      GET: {
        params: {
          query: 'id=="*" sortby name',
        },
      },
      records: 'organizations',
      perRequest: 1000,
    },
    users: {
      type: 'okapi',
      path: 'users',
      records: 'users',
      perRequest: 1000,
    },
    fund: {
      type: 'okapi',
      path: 'fund',
      records: 'funds',
      perRequest: 1000,
    },
    materialTypes: MATERIAL_TYPES,
    closingReasons: {
      type: 'okapi',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_CLOSING_REASONS})`,
        },
      },
      records: 'configs',
    },
    orderNumberSetting: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_ORDER_NUMBER})`,
        },
      },
    },
    orderNumber: {
      accumulate: true,
      fetch: false,
      path: ORDER_NUMBER_API,
      throwErrors: false,
      clientGeneratePk: false,
      type: 'okapi',
      POST: {
        path: ORDER_NUMBER_VALIDATE_API,
      },
    },
    poLine: {
      accumulate: true,
      fetch: false,
      path: LINES_API,
      perRequest: 1000,
      records: 'poLines',
      throwErrors: false,
      type: 'okapi',
    },
    locations: LOCATIONS,
    createInventory: {
      type: 'okapi',
      records: 'configs',
      path: CONFIG_API,
      GET: {
        params: {
          query: `(module=${MODULE_ORDERS} and configName=${CONFIG_CREATE_INVENTORY})`,
        },
      },
    },
    identifierTypes: IDENTIFIER_TYPES,
  });

  static propTypes = {
    mutator: PropTypes.object.isRequired,
    resources: PropTypes.object.isRequired,
    stripes: stripesShape.isRequired,
    showSingleResult: PropTypes.bool, // eslint-disable-line react/no-unused-prop-types
    browseOnly: PropTypes.bool,
    onComponentWillUnmount: PropTypes.func,
    disableRecordCreation: PropTypes.bool,
  }

  static defaultProps = {
    showSingleResult: true,
    browseOnly: false,
  }

  constructor(props, context) {
    super(props, context);
    this.getActiveFilters = getActiveFilters.bind(this);
    this.handleFilterChange = handleFilterChange.bind(this);
  }

  create = async (order) => {
    const { mutator } = this.props;

    try {
      const newOrder = await createOrderResource(order, mutator.records);

      mutator.query.update({
        _path: `/orders/view/${newOrder.id}`,
        layer: null,
      });
    } catch (e) {
      this.callout.sendCallout({
        message: <FormattedMessage id="ui-orders.errors.noCreatedOrder" />,
        type: 'error',
      });
    }
  }

  createCalloutRef = ref => {
    this.callout = ref;
  };

  renderFilters = (onChange) => {
    const { stripes } = this.props;

    return (
      <OrdersListFilters
        activeFilters={this.getActiveFilters()}
        onChange={onChange}
        user={stripes.user.user}
      />
    );
  };

  renderNavigation = () => (
    <OrdersNavigation
      isOrders
      queryMutator={this.props.mutator.query}
    />
  );

  render() {
    const {
      browseOnly,
      disableRecordCreation,
      mutator,
      onComponentWillUnmount,
      resources,
      showSingleResult,
      stripes,
      stripes: {
        user: {
          user: {
            firstName,
            lastName,
          },
        },
      },
    } = this.props;
    const users = get(resources, 'users.records', []);
    const vendors = get(resources, 'vendors.records', []);
    const resultsFormatter = {
      'poNumber': order => get(order, 'poNumber', ''),
      'vendorCode': order => {
        const vendorId = get(order, 'vendor', '');

        return get(vendors.find(({ id }) => id === vendorId), 'code', '');
      },
      'workflowStatus': order => get(order, 'workflowStatus', ''),
      'orderType': order => get(order, 'orderType', ''),
      'created': order => <FolioFormattedTime dateString={get(order, 'metadata.createdDate')} />,
      'owner': ({ owner = '' }) => owner,
      'assignedTo': order => {
        const assignedToId = get(order, 'assignedTo', '');
        const assignedTo = users.find(d => d.id === assignedToId);

        return assignedTo && assignedTo.personal
          ? `${assignedTo.personal.firstName} ${assignedTo.personal.lastName}`
          : '';
      },
    };
    const newRecordInitialValues = {
      createdByName: `${firstName} ${lastName}` || '',
    };

    return (
      <div data-test-order-instances>
        <SearchAndSort
          packageInfo={packageInfo}
          objectName="order"
          baseRoute={packageInfo.stripes.route}
          onFilterChange={this.handleFilterChange}
          renderFilters={this.renderFilters}
          renderNavigation={this.renderNavigation}
          visibleColumns={['poNumber', 'vendorCode', 'workflowStatus', 'orderType', 'created', 'owner', 'assignedTo']}
          resultsFormatter={resultsFormatter}
          viewRecordComponent={Panes}
          editRecordComponent={POForm}
          onCreate={this.create}
          massageNewRecord={this.massageNewRecord}
          newRecordInitialValues={newRecordInitialValues}
          initialResultCount={INITIAL_RESULT_COUNT}
          resultCountIncrement={RESULT_COUNT_INCREMENT}
          onComponentWillUnmount={onComponentWillUnmount}
          disableRecordCreation={disableRecordCreation}
          finishedResourceName="perms"
          viewRecordPerms="orders.item.get"
          newRecordPerms="orders.item.post"
          parentResources={resources}
          parentMutator={mutator}
          stripes={stripes}
          showSingleResult={showSingleResult}
          browseOnly={browseOnly}
          columnMapping={{
            poNumber: <FormattedMessage id="ui-orders.order.po_number" />,
            vendorCode: <FormattedMessage id="ui-orders.order.vendorCode" />,
            workflowStatus: <FormattedMessage id="ui-orders.order.workflow_status" />,
            orderType: <FormattedMessage id="ui-orders.order.orderType" />,
            created: <FormattedMessage id="ui-orders.order.createdDate" />,
            owner: <FormattedMessage id="ui-orders.poLine.owner" />,
            assignedTo: <FormattedMessage id="ui-orders.order.assigned_to" />,
          }}
        />
        <Callout ref={this.createCalloutRef} />
      </div>
    );
  }
}

export default OrdersList;