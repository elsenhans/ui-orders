import React from 'react';
import PropTypes from 'prop-types';

import { stripesConnect } from '@folio/stripes/core';

import { getAddresses } from '../common/utils';
import { ADDRESSES } from '../components/Utils/resources';
import { reasonsForClosureResource } from '../common/resources';
import OrdersListFilters from './OrdersListFilters';

const OrdersListFiltersContainer = ({ resources, activeFilters, applyFilters, customFields, disabled }) => {
  const closingReasons = resources?.closingReasons?.records;
  const addresses = getAddresses(resources?.addresses?.records);

  return (
    <OrdersListFilters
      addresses={addresses}
      activeFilters={activeFilters}
      applyFilters={applyFilters}
      closingReasons={closingReasons}
      customFields={customFields}
      disabled={disabled}
    />
  );
};

OrdersListFiltersContainer.manifest = Object.freeze({
  addresses: ADDRESSES,
  closingReasons: reasonsForClosureResource,
});

OrdersListFiltersContainer.propTypes = {
  activeFilters: PropTypes.object.isRequired,
  applyFilters: PropTypes.func.isRequired,
  customFields: PropTypes.arrayOf(PropTypes.object),
  disabled: PropTypes.bool.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrdersListFiltersContainer);
