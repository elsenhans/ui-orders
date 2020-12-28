import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Modal,
  MultiColumnList,
  Paneset,
  Loading,
} from '@folio/stripes/components';
import {
  FiltersPane,
  FolioFormattedDate,
  NoResultsMessage,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useLocalStorageFilters,
  useLocationSorting,
  useToggle,
  ORDER_STATUS_LABEL,
} from '@folio/stripes-acq-components';

import {
  RESULT_COUNT_INCREMENT,
} from '../common/constants';
import OrdersNavigation from '../common/OrdersNavigation';
import OrdersListFiltersContainer from './OrdersListFiltersContainer';
import Panes from '../components/Panes';
import { searchableIndexes } from './OrdersListSearchConfig';
import OrdersListActionMenu from './OrdersListActionMenu';

const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orders" />;
const visibleColumns = ['poNumber', 'vendorCode', 'workflowStatus', 'orderType', UPDATED_DATE, 'acquisitionsUnit', 'assignedTo'];
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
  onExportCSV,
  generateOrders,
  generatePOLs,
  isExporting,
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
  const [isFiltersOpened, toggleFilters] = useToggle(true);
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
      <OrdersListActionMenu
        ordersCount={ordersCount}
        search={location.search}
        onToggle={onToggle}
        onExportCSV={onExportCSV}
        generateOrders={generateOrders}
        generatePOLs={generatePOLs}
      />
    ),
    [location.search, ordersCount, onExportCSV, generateOrders, generatePOLs],
  );

  return (
    <Paneset data-test-order-instances>
      {isFiltersOpened && (
        <FiltersPane toggleFilters={toggleFilters}>
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

      {isExporting && (
        <Modal
          open
          label="Export results (CSV)"
        >
          Exporting results
          <Loading />
        </Modal>
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
    </Paneset>
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
  onExportCSV: PropTypes.func.isRequired,
  generateOrders: PropTypes.func.isRequired,
  generatePOLs: PropTypes.func.isRequired,
  isExporting: PropTypes.bool,
};

OrdersList.defaultProps = {
  ordersCount: 0,
  isLoading: false,
  orders: [],
  isExporting: false,
};

export default withRouter(OrdersList);
