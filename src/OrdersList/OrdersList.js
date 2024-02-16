import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';
import { omit } from 'lodash';

import { useStripes } from '@folio/stripes/core';
import {
  checkScope,
  HasCommand,
  Icon,
  MultiColumnList,
  TextLink,
  Tooltip,
} from '@folio/stripes/components';
import {
  ColumnManagerMenu,
  PersistedPaneset,
  useColumnManager,
} from '@folio/stripes/smart-components';
import {
  FiltersPane,
  FolioFormattedDate,
  handleKeyCommand,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  PrevNextPagination,
  useFiltersToogle,
  useLocalStorageFilters,
  useLocationSorting,
  ORDER_STATUS_LABEL,
  ORDER_STATUSES,
  useModalToggle,
  useItemToView,
} from '@folio/stripes-acq-components';

import { CANCEL_ORDER_REASON } from '../common/constants';
import { useIsRowSelected } from '../common/hooks';
import OrdersNavigation from '../common/OrdersNavigation';
import Panes from '../components/Panes';

import { useSearchableIndexes } from './hooks';
import OrdersListActionMenu from './OrdersListActionMenu';
import OrderExportSettingsModalContainer from './OrderExportSettingsModalContainer';
import OrdersListFiltersContainer from './OrdersListFiltersContainer';

const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orders" />;
const sortableColumns = ['poNumber', 'workflowStatus', 'orderType', UPDATED_DATE];

export const getResultsFormatter = ({ search }) => ({
  poNumber: order => {
    const isCancelled = order.workflowStatus === ORDER_STATUSES.closed &&
      order.closeReason?.reason === CANCEL_ORDER_REASON;

    const orderLink = <TextLink to={`/orders/view/${order.id}${search}`}>{order.poNumber}</TextLink>;

    return !isCancelled ? orderLink : (
      <>
        {orderLink}
        &nbsp;
        <Tooltip
          id="cancel-tooltip"
          text={<FormattedMessage id="ui-orders.canceled" />}
        >
          {({ ref, ariaIds }) => (
            <Icon
              data-testid="cancel-icon"
              icon="cancel"
              status="warn"
              ref={ref}
              aria-labelledby={ariaIds.text}
            />
          )}
        </Tooltip>
      </>
    );
  },
  [UPDATED_DATE]: order => <FolioFormattedDate value={order.metadata?.updatedDate} utc={false} />,
  workflowStatus: order => ORDER_STATUS_LABEL[order.workflowStatus],
});

export const columnMapping = {
  poNumber: <FormattedMessage id="ui-orders.order.poNumber" />,
  vendorCode: <FormattedMessage id="ui-orders.order.vendorCode" />,
  workflowStatus: <FormattedMessage id="ui-orders.order.workflow_status" />,
  orderType: <FormattedMessage id="ui-orders.order.orderType" />,
  [UPDATED_DATE]: <FormattedMessage id="ui-orders.order.lastUpdated" />,
  acquisitionsUnit: <FormattedMessage id="ui-orders.order.acquisitionsUnit" />,
  assignedTo: <FormattedMessage id="ui-orders.order.assigned_to" />,
};

function OrdersList({
  history,
  isLoading,
  location,
  match,
  onNeedMoreData,
  orders,
  ordersCount,
  resetData,
  refreshList,
  ordersQuery,
  pagination,
  customFields,
}) {
  const stripes = useStripes();
  const [
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
    changeIndex,
    searchIndex,
  ] = useLocalStorageFilters('OrdersList/filters', location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableColumns);
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-orders/orders/filters');
  const [isExportModalOpened, toggleExportModal] = useModalToggle();
  const searchableIndexes = useSearchableIndexes(customFields);
  const { visibleColumns, toggleColumn } = useColumnManager('orders-column-manager', columnMapping);

  const { itemToView, setItemToView, deleteItemToView } = useItemToView('orders-list');

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );

  const isRowSelected = useIsRowSelected(`${match.path}/view/:id`);

  const renderActionMenu = useCallback(
    ({ onToggle }) => (
      <>
        <OrdersListActionMenu
          ordersCount={ordersCount}
          search={location.search}
          onToggle={onToggle}
          toggleExportModal={toggleExportModal}
        />
        <ColumnManagerMenu
          prefix="orders"
          columnMapping={omit(columnMapping, 'poNumber')}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </>
    ),
    [location.search, ordersCount, toggleExportModal, visibleColumns, toggleColumn],
  );

  const renderDetailsPane = useCallback((props) => (
    <Panes
      {...props}
      refreshList={refreshList}
    />
  ), [refreshList]);

  const shortcuts = [
    {
      name: 'new',
      handler: handleKeyCommand(() => {
        if (stripes.hasPerm('ui-orders.orders.create')) {
          history.push('/orders/create');
        }
      }),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <PersistedPaneset
        appId="ui-orders"
        id="orders"
        data-test-order-instances
      >
        {isFiltersOpened && (
          <FiltersPane
            id="orders-filters-pane"
            toggleFilters={toggleFilters}
          >
            <OrdersNavigation isOrders />
            <SingleSearchForm
              applySearch={applySearch}
              changeSearch={changeSearch}
              searchQuery={searchQuery}
              isLoading={isLoading}
              ariaLabelId="ui-orders.search"
              searchableIndexes={searchableIndexes}
              changeSearchIndex={changeIndex}
              selectedIndex={searchIndex}
            />

            <ResetButton
              reset={resetFilters}
              disabled={!location.search || isLoading}
            />

            <OrdersListFiltersContainer
              activeFilters={filters}
              applyFilters={applyFilters}
              customFields={customFields}
              disabled={isLoading}
            />
          </FiltersPane>
        )}

        <ResultsPane
          id="orders-results-pane"
          autosize
          count={ordersCount}
          renderActionMenu={renderActionMenu}
          title={title}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersOpened}
          isLoading={isLoading}
        >
          {({ height, width }) => (
            <>
              <MultiColumnList
                columnMapping={columnMapping}
                contentData={orders}
                formatter={getResultsFormatter(location)}
                id="orders-list"
                hasMargin
                isEmptyMessage={resultsStatusMessage}
                isSelected={isRowSelected}
                loading={isLoading}
                onHeaderClick={changeSorting}
                sortDirection={sortingDirection}
                sortOrder={sortingField}
                totalCount={orders.length}
                visibleColumns={visibleColumns}
                onMarkPosition={setItemToView}
                onMarkReset={deleteItemToView}
                itemToView={itemToView}
                height={height - PrevNextPagination.HEIGHT}
                width={width}
                pagingType="none"
              />

              {orders.length > 0 && (
                <PrevNextPagination
                  {...pagination}
                  totalCount={ordersCount}
                  disabled={isLoading}
                  onChange={onNeedMoreData}
                />
              )}
            </>
          )}
        </ResultsPane>

        {isExportModalOpened && (
          <OrderExportSettingsModalContainer
            onCancel={toggleExportModal}
            ordersQuery={ordersQuery}
          />
        )}

        <Route
          path="/orders/view/:id"
          render={renderDetailsPane}
        />
      </PersistedPaneset>
    </HasCommand>
  );
}

OrdersList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  ordersCount: PropTypes.number,
  isLoading: PropTypes.bool,
  orders: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  refreshList: PropTypes.func.isRequired,
  ordersQuery: PropTypes.string,
  pagination: PropTypes.object,
  customFields: PropTypes.arrayOf(PropTypes.object),
};

OrdersList.defaultProps = {
  ordersCount: 0,
  isLoading: false,
  orders: [],
  ordersQuery: '',
  customFields: [],
};

export default withRouter(OrdersList);
