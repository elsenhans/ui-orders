import React, { useCallback } from 'react';
import {
  FormattedMessage,
} from 'react-intl';
import PropTypes from 'prop-types';
import { get, omit } from 'lodash';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Icon,
  MultiColumnList,
  NoValue,
  TextLink,
  Tooltip,
} from '@folio/stripes/components';
import { TitleManager } from '@folio/stripes/core';
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
  PrevNextPagination,
  ResetButton,
  ResultsPane,
  SingleSearchForm,
  useCustomFieldsSearchableIndexes,
  useFiltersReset,
  useFiltersToogle,
  useLocalStorageFilters,
  useLocationSorting,
  useModalToggle,
  useItemToView,
} from '@folio/stripes-acq-components';
import { searchableIndexes } from '@folio/plugin-find-po-line';

import OrdersNavigation from '../common/OrdersNavigation';
import {
  useIsRowSelected,
  useResultsPageTitle,
} from '../common/hooks';
import { POLineVersionView } from '../components/POLine';
import { isOrderLineCancelled } from '../components/POLine/utils';
import OrderLinesFiltersContainer from './OrderLinesFiltersContainer';
import Details from './Details';
import OrderLinesListActionMenu from './OrderLinesListActionMenu';
import LineExportSettingsModalContainer from './LineExportSettingModalContainer';

const VENDOR_REF_NUMBER = 'vendorDetail.refNumber';
const UPDATED_DATE = 'metadata.updatedDate';
const title = <FormattedMessage id="ui-orders.navigation.orderLines" />;
const sortableColumns = ['poLineNumber', UPDATED_DATE, 'titleOrPackage'];

export const getResultsFormatter = ({ search }) => ({
  poLineNumber: line => {
    const isCancelled = isOrderLineCancelled(line);
    const orderLineLink = <TextLink to={`/orders/lines/view/${line.id}${search}`}>{line.poLineNumber}</TextLink>;

    return !isCancelled ? orderLineLink : (
      <>
        {orderLineLink}
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
  [UPDATED_DATE]: line => <FolioFormattedDate value={get(line, 'metadata.updatedDate')} utc={false} />,
  productIds: line => get(line, 'details.productIds', []).map(product => product.productId).join(', '),
  [VENDOR_REF_NUMBER]: line => (
    line.vendorDetail?.referenceNumbers?.map(({ refNumber }) => refNumber)?.join(', ') || <NoValue />
  ),
  funCodes: line => line.fundDistribution?.map(({ code }) => code).filter(Boolean).join(', '),
  orderWorkflow: line => ORDER_STATUS_LABEL[line.orderWorkflow],
});

export const columnMapping = {
  poLineNumber: <FormattedMessage id="ui-orders.orderLineList.poLineNumber" />,
  [UPDATED_DATE]: <FormattedMessage id="ui-orders.orderLineList.updatedDate" />,
  titleOrPackage: <FormattedMessage id="ui-orders.orderLineList.titleOrPackage" />,
  productIds: <FormattedMessage id="ui-orders.orderLineList.productIds" />,
  [VENDOR_REF_NUMBER]: <FormattedMessage id="ui-orders.orderLineList.vendorRefNumber" />,
  funCodes: <FormattedMessage id="ui-orders.orderLineList.funCodes" />,
  orderWorkflow: <FormattedMessage id="ui-orders.orderLineList.orderWorkflow" />,
  acqUnit: <FormattedMessage id="ui-orders.order.acquisitionsUnit" />,
};

function OrderLinesList({
  customFields,
  history,
  isLoading,
  location,
  match,
  onNeedMoreData,
  resetData,
  orderLines,
  orderLinesCount,
  refreshList,
  linesQuery,
  pagination,
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
  const { visibleColumns, toggleColumn } = useColumnManager('order-lines-column-manager', columnMapping);
  const { itemToView, setItemToView, deleteItemToView } = useItemToView('order-lines-list');

  const customFieldsSearchableIndexes = useCustomFieldsSearchableIndexes(customFields);
  const pageTitle = useResultsPageTitle(filters);

  useFiltersReset(resetFilters);

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
        <OrderLinesListActionMenu
          orderLinesCount={orderLinesCount}
          onToggle={onToggle}
          toggleExportModal={toggleExportModal}
        />
        <ColumnManagerMenu
          prefix="order-lines"
          columnMapping={omit(columnMapping, 'poLineNumber')}
          visibleColumns={visibleColumns}
          toggleColumn={toggleColumn}
        />
      </>
    ),
    [orderLinesCount, toggleExportModal, visibleColumns, toggleColumn],
  );

  const renderLineDetails = useCallback((props) => (
    <Details
      {...props}
      refreshList={refreshList}
    />
  ), [refreshList]);

  return (
    <PersistedPaneset
      appId="ui-orders"
      id="order-lines"
      data-test-order-line-instances
    >
      <TitleManager page={pageTitle} />
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
            searchableIndexes={[...searchableIndexes, ...customFieldsSearchableIndexes]}
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
            customFields={customFields}
            disabled={isLoading}
          />
        </FiltersPane>
      )}

      <ResultsPane
        id="order-lines-results-pane"
        autosize
        count={orderLinesCount}
        renderActionMenu={renderActionMenu}
        filters={filters}
        isFiltersOpened={isFiltersOpened}
        title={title}
        toggleFiltersPane={toggleFilters}
        isLoading={isLoading}
      >
        {({ height, width }) => (
          <>
            <MultiColumnList
              columnMapping={columnMapping}
              contentData={orderLines}
              formatter={getResultsFormatter(location)}
              hasMargin
              id="order-line-list"
              isEmptyMessage={resultsStatusMessage}
              isSelected={isRowSelected}
              loading={isLoading}
              onHeaderClick={changeSorting}
              onNeedMoreData={onNeedMoreData}
              pagingType="none"
              sortDirection={sortingDirection}
              sortOrder={sortingField}
              totalCount={orderLines.length}
              visibleColumns={visibleColumns}
              height={height - PrevNextPagination.HEIGHT}
              width={width}
              onMarkPosition={setItemToView}
              onMarkReset={deleteItemToView}
              itemToView={itemToView}
            />

            {orderLines.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={orderLinesCount}
                disabled={isLoading}
                onChange={onNeedMoreData}
              />
            )}
          </>
        )}
      </ResultsPane>

      {isExportModalOpened && (
        <LineExportSettingsModalContainer
          onCancel={toggleExportModal}
          linesQuery={linesQuery}
        />
      )}

      <Switch>
        <Route
          exact
          path="/orders/lines/view/:id"
          render={renderLineDetails}
        />

        <Route
          exact
          path="/orders/lines/view/:id/versions/:versionId?"
          component={POLineVersionView}
        />
      </Switch>
    </PersistedPaneset>
  );
}

OrderLinesList.propTypes = {
  customFields: PropTypes.arrayOf(PropTypes.object),
  onNeedMoreData: PropTypes.func.isRequired,
  resetData: PropTypes.func.isRequired,
  orderLinesCount: PropTypes.number,
  isLoading: PropTypes.bool,
  orderLines: PropTypes.arrayOf(PropTypes.object),
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  refreshList: PropTypes.func.isRequired,
  linesQuery: PropTypes.string,
  pagination: PropTypes.object,
};

OrderLinesList.defaultProps = {
  customFields: [],
  orderLinesCount: 0,
  isLoading: false,
  orderLines: [],
  linesQuery: '',
};

export default withRouter(OrderLinesList);
