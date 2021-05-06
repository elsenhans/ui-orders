import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  MultiColumnList,
} from '@folio/stripes/components';
import {
  ColumnManagerMenu,
  PersistedPaneset,
  useColumnManager,
} from '@folio/stripes/smart-components';
import {
  FiltersPane,
  FolioFormattedDate,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useFiltersToogle,
  useLocalStorageFilters,
  useLocationSorting,
  ORDER_STATUS_LABEL,
  useModalToggle,
} from '@folio/stripes-acq-components';

import {
  RESULT_COUNT_INCREMENT,
} from '../common/constants';
import OrdersNavigation from '../common/OrdersNavigation';
import OrdersListFiltersContainer from './OrdersListFiltersContainer';
import Panes from '../components/Panes';
import useSearchableIndexes from './useSearchableIndexes';
import OrdersListActionMenu from './OrdersListActionMenu';
import OrderExportSettingsModalContainer from './OrderExportSettingsModalContainer';

const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orders" />;
const sortableColumns = ['poNumber', 'workflowStatus', 'orderType', UPDATED_DATE];
const resultsFormatter = {
  [UPDATED_DATE]: order => <FolioFormattedDate value={order.metadata?.updatedDate} />,
  workflowStatus: order => ORDER_STATUS_LABEL[order.workflowStatus],
};

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
  onNeedMoreData,
  orders,
  ordersCount,
  resetData,
  refreshList,
  ordersQuery,
}) {
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
  const searchableIndexes = useSearchableIndexes();
  const { visibleColumns, toggleColumn } = useColumnManager('orders-column-manager', columnMapping);

  const selectOrder = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/orders/view/${id}`,
        search: location.search,
      });
    },
    [history, location.search],
  );

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened={isFiltersOpened}
      toggleFilters={toggleFilters}
    />
  );
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
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </>
    ),
    [location.search, ordersCount, toggleExportModal, visibleColumns, toggleColumn],
  );

  return (
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
            disabled={isLoading}
          />
        </FiltersPane>
      )}

      <ResultsPane
        id="orders-results-pane"
        count={ordersCount}
        renderActionMenu={renderActionMenu}
        title={title}
        toggleFiltersPane={toggleFilters}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
      >
        <MultiColumnList
          autosize
          columnMapping={columnMapping}
          contentData={orders}
          formatter={resultsFormatter}
          hasMargin
          id="orders-list"
          isEmptyMessage={resultsStatusMessage}
          loading={isLoading}
          onHeaderClick={changeSorting}
          onNeedMoreData={onNeedMoreData}
          onRowClick={selectOrder}
          pageAmount={RESULT_COUNT_INCREMENT}
          pagingType="click"
          sortDirection={sortingDirection}
          sortOrder={sortingField}
          totalCount={ordersCount}
          virtualize
          visibleColumns={visibleColumns}
        />
      </ResultsPane>

      {isExportModalOpened && (
        <OrderExportSettingsModalContainer
          onCancel={toggleExportModal}
          ordersQuery={ordersQuery}
        />
      )}

      <Route
        path="/orders/view/:id"
        render={props => (
          <Panes
            {...props}
            refreshList={refreshList}
          />
        )}
      />
    </PersistedPaneset>
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
  refreshList: PropTypes.func.isRequired,
  ordersQuery: PropTypes.string,
};

OrdersList.defaultProps = {
  ordersCount: 0,
  isLoading: false,
  orders: [],
  ordersQuery: '',
};

export default withRouter(OrdersList);
