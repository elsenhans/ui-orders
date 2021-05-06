import React, { useCallback } from 'react';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import {
  Route,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  MultiColumnList,
  NoValue,
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
  ORDER_STATUS_LABEL,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useFiltersToogle,
  useLocalStorageFilters,
  useLocationSorting,
  useModalToggle,
} from '@folio/stripes-acq-components';

import OrdersNavigation from '../common/OrdersNavigation';
import OrderLinesFiltersContainer from './OrderLinesFiltersContainer';
import Details from './Details';
import { searchableIndexes } from './OrdersLinesSearchConfig';
import OrderLinesListActionMenu from './OrderLinesListActionMenu';
import LineExportSettingsModalContainer from './LineExportSettingModalContainer';

const VENDOR_REF_NUMBER = 'vendorDetail.refNumber';
const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orderLines" />;
const sortableColumns = ['poLineNumber', UPDATED_DATE, 'title'];
const resultsFormatter = {
  [UPDATED_DATE]: line => <FolioFormattedDate value={get(line, 'metadata.updatedDate')} />,
  productIds: line => get(line, 'details.productIds', []).map(product => product.productId).join(', '),
  [VENDOR_REF_NUMBER]: line => (
    line.vendorDetail?.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
  ),
  title: line => get(line, 'titleOrPackage', ''),
  funCodes: line => line.fundDistribution?.map(({ code }) => code).filter(Boolean).join(', '),
  orderWorkflow: line => ORDER_STATUS_LABEL[line.orderWorkflow],
};

export const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-orders.orderLineList.poLineNumber" />,
  [UPDATED_DATE]: <FormattedMessage id="ui-orders.orderLineList.updatedDate" />,
  title: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
  productIds: <FormattedMessage id="ui-orders.orderLineList.productIds" />,
  [VENDOR_REF_NUMBER]: <FormattedMessage id="ui-orders.orderLineList.vendorRefNumber" />,
  funCodes: <FormattedMessage id="ui-orders.orderLineList.funCodes" />,
  orderWorkflow: <FormattedMessage id="ui-orders.orderLineList.orderWorkflow" />,
};

function OrderLinesList({
  history,
  isLoading,
  location,
  onNeedMoreData,
  resetData,
  orderLines,
  orderLinesCount,
  refreshList,
  linesQuery,
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
  ] = useLocalStorageFilters('OrderLinesList/filters', location, history, resetData);
  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableColumns);
  const { isFiltersOpened, toggleFilters } = useFiltersToogle('ui-orders/order-lines/filters');
  const [isExportModalOpened, toggleExportModal] = useModalToggle();
  const selectOrderLine = useCallback(
    (e, { id }) => {
      history.push({
        pathname: `/orders/lines/view/${id}`,
        search: location.search,
      });
    },
    [history, location.search],
  );
  const { visibleColumns, toggleColumn } = useColumnManager('order-lines-column-manager', columnMapping);

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
        <OrderLinesListActionMenu
          orderLinesCount={orderLinesCount}
          onToggle={onToggle}
          toggleExportModal={toggleExportModal}
        />
        <ColumnManagerMenu
          prefix="order-lines"
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </>
    ),
    [orderLinesCount, toggleExportModal, visibleColumns, toggleColumn],
  );

  return (
    <PersistedPaneset
      appId="ui-orders"
      id="order-lines"
      data-test-order-line-instances
    >
      {isFiltersOpened && (
        <FiltersPane
          id="order-lines-filters-pane"
          toggleFilters={toggleFilters}
        >
          <OrdersNavigation isOrderLines />
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

          <OrderLinesFiltersContainer
            activeFilters={filters}
            applyFilters={applyFilters}
            disabled={isLoading}
          />
        </FiltersPane>
      )}

      <ResultsPane
        id="order-lines-results-pane"
        count={orderLinesCount}
        renderActionMenu={renderActionMenu}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        title={title}
        toggleFiltersPane={toggleFilters}
      >
        <MultiColumnList
          autosize
          columnMapping={columnMapping}
          contentData={orderLines}
          formatter={resultsFormatter}
          hasMargin
          id="order-line-list"
          isEmptyMessage={resultsStatusMessage}
          loading={isLoading}
          onHeaderClick={changeSorting}
          onNeedMoreData={onNeedMoreData}
          onRowClick={selectOrderLine}
          pagingType="click"
          sortDirection={sortingDirection}
          sortOrder={sortingField}
          totalCount={orderLinesCount}
          virtualize
          visibleColumns={visibleColumns}
        />
      </ResultsPane>

      {isExportModalOpened && (
        <LineExportSettingsModalContainer
          onCancel={toggleExportModal}
          linesQuery={linesQuery}
        />
      )}

      <Route
        exact
        path="/orders/lines/view/:id"
        render={props => (
          <Details
            {...props}
            refreshList={refreshList}
          />
        )}
      />
    </PersistedPaneset>
  );
}

OrderLinesList.propTypes = {
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  orderLinesCount: PropTypes.number,
  isLoading: PropTypes.bool,
  orderLines: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  refreshList: PropTypes.func.isRequired,
  linesQuery: PropTypes.string,
};

OrderLinesList.defaultProps = {
  orderLinesCount: 0,
  isLoading: false,
  orderLines: [],
  linesQuery: '',
};

export default withRouter(OrderLinesList);
