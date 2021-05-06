import React, { useCallback } from 'react';
import PropTypes from 'prop-types';

import {
  AccordionSet,
} from '@folio/stripes/components';
import {
  AcqCheckboxFilter,
  AcqDateRangeFilter,
  AcqTagsFilter,
  AcqUnitFilter,
  BooleanFilter,
  PluggableOrganizationFilter,
  PluggableUserFilter,
} from '@folio/stripes-acq-components';
import OrdersTextFilter from '@folio/plugin-find-po-line/FindPOLine/OrdersTextFilter';
import PrefixFilter from '@folio/plugin-find-po-line/FindPOLine/PrefixFilter';
import SuffixFilter from '@folio/plugin-find-po-line/FindPOLine/SuffixFilter';

import ClosingReasonFilter from '../common/ClosingReasonFilter';
import AddressFilter from '../common/AddressFilter';
import {
  closingReasonsShape,
} from '../common/shapes';
import {
  FILTERS,
  STATUS_FILTER_OPTIONS,
  ORDER_TYPE_FILTER_OPTIONS,
} from './constants';

const applyFiltersAdapter = (applyFilters) => ({ name, values }) => applyFilters(name, values);

function OrdersListFilters({ activeFilters, closingReasons, applyFilters, disabled, addresses }) {
  const onChange = useCallback(
    applyFiltersAdapter(applyFilters),
    [applyFilters],
  );

  return (
    <AccordionSet>
      <AcqCheckboxFilter
        id={FILTERS.STATUS}
        activeFilters={activeFilters[FILTERS.STATUS]}
        labelId="ui-orders.workflowStatus"
        name={FILTERS.STATUS}
        onChange={onChange}
        options={STATUS_FILTER_OPTIONS}
        closedByDefault={false}
        disabled={disabled}
      />
      <PrefixFilter
        id={FILTERS.PREFIX}
        activeFilters={activeFilters[FILTERS.PREFIX]}
        labelId="ui-orders.orderDetails.orderNumberPrefix"
        name={FILTERS.PREFIX}
        onChange={onChange}
        disabled={disabled}
      />
      <SuffixFilter
        id={FILTERS.SUFFIX}
        activeFilters={activeFilters[FILTERS.SUFFIX]}
        labelId="ui-orders.orderDetails.orderNumberSuffix"
        name={FILTERS.SUFFIX}
        onChange={onChange}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.APPROVED}
        activeFilters={activeFilters[FILTERS.APPROVED]}
        labelId="ui-orders.orderSummary.approved"
        name={FILTERS.APPROVED}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqUnitFilter
        id={FILTERS.ACQUISITIONS_UNIT}
        activeFilters={activeFilters[FILTERS.ACQUISITIONS_UNIT]}
        labelId="ui-orders.order.acquisitionsUnit"
        name={FILTERS.ACQUISITIONS_UNIT}
        onChange={onChange}
        disabled={disabled}
      />
      <PluggableUserFilter
        id={FILTERS.ASSIGNED_TO}
        activeFilters={activeFilters[FILTERS.ASSIGNED_TO]}
        labelId="ui-orders.orderDetails.assignedTo"
        name={FILTERS.ASSIGNED_TO}
        onChange={onChange}
        disabled={disabled}
      />
      <PluggableUserFilter
        id={FILTERS.CREATED_BY}
        activeFilters={activeFilters[FILTERS.CREATED_BY]}
        labelId="ui-orders.orderDetails.createdBy"
        name={FILTERS.CREATED_BY}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqDateRangeFilter
        id={FILTERS.DATE_CREATED}
        activeFilters={activeFilters[FILTERS.DATE_CREATED]}
        labelId="ui-orders.filter.dateCreated"
        name={FILTERS.DATE_CREATED}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqDateRangeFilter
        id={FILTERS.DATE_ORDERED}
        activeFilters={activeFilters[FILTERS.DATE_ORDERED]}
        labelId="ui-orders.dateOrdered"
        name={FILTERS.DATE_ORDERED}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqCheckboxFilter
        id={FILTERS.ORDER_TYPE}
        activeFilters={activeFilters[FILTERS.ORDER_TYPE]}
        labelId="ui-orders.order.orderType"
        name={FILTERS.ORDER_TYPE}
        onChange={onChange}
        options={ORDER_TYPE_FILTER_OPTIONS}
        disabled={disabled}
      />
      <PluggableOrganizationFilter
        id={`filter-${FILTERS.VENDOR}`}
        activeFilters={activeFilters[FILTERS.VENDOR]}
        labelId="ui-orders.line.accordion.vendor"
        name={FILTERS.VENDOR}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqTagsFilter
        activeFilters={activeFilters[FILTERS.TAGS]}
        id={FILTERS.TAGS}
        name={FILTERS.TAGS}
        onChange={onChange}
        disabled={disabled}
      />
      <ClosingReasonFilter
        id={FILTERS.CLOSE_REASON}
        activeFilters={activeFilters[FILTERS.CLOSE_REASON]}
        labelId="ui-orders.orderSummary.closingReason"
        name={FILTERS.CLOSE_REASON}
        onChange={onChange}
        closingReasons={closingReasons}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.RE_ENCUMBER}
        activeFilters={activeFilters[FILTERS.RE_ENCUMBER]}
        labelId="ui-orders.orderDetails.reEncumber"
        name={FILTERS.RE_ENCUMBER}
        onChange={onChange}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.SUBSCRIPTION}
        activeFilters={activeFilters[FILTERS.SUBSCRIPTION]}
        labelId="ui-orders.renewals.subscription"
        name={FILTERS.SUBSCRIPTION}
        onChange={onChange}
        disabled={disabled}
      />
      <AcqDateRangeFilter
        id={FILTERS.RENEWAL_DATE}
        activeFilters={activeFilters[FILTERS.RENEWAL_DATE]}
        labelId="ui-orders.renewals.renewalDate"
        name={FILTERS.RENEWAL_DATE}
        onChange={onChange}
        disabled={disabled}
      />
      <BooleanFilter
        id={FILTERS.MANUAL_RENEWAL}
        activeFilters={activeFilters[FILTERS.MANUAL_RENEWAL]}
        labelId="ui-orders.renewals.manualRenewal"
        name={FILTERS.MANUAL_RENEWAL}
        onChange={onChange}
        disabled={disabled}
      />
      <OrdersTextFilter
        id="order-reviewPeriod"
        activeFilters={activeFilters[FILTERS.RENEWAL_REVIEW_PERIOD]}
        labelId="ui-orders.renewals.reviewPeriod"
        name={FILTERS.RENEWAL_REVIEW_PERIOD}
        type="number"
        onChange={onChange}
        disabled={disabled}
      />
      <AddressFilter
        activeFilters={activeFilters[FILTERS.BILL_TO]}
        addresses={addresses}
        disabled={disabled}
        id={FILTERS.BILL_TO}
        labelId="ui-orders.orderDetails.billTo"
        name={FILTERS.BILL_TO}
        onChange={onChange}
      />
      <AddressFilter
        activeFilters={activeFilters[FILTERS.SHIP_TO]}
        addresses={addresses}
        disabled={disabled}
        id={FILTERS.SHIP_TO}
        labelId="ui-orders.orderDetails.shipTo"
        name={FILTERS.SHIP_TO}
        onChange={onChange}
      />
    </AccordionSet>
  );
}

OrdersListFilters.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  closingReasons: closingReasonsShape,
  disabled: PropTypes.bool.isRequired,
  addresses: PropTypes.arrayOf(PropTypes.object),
};

export default OrdersListFilters;
