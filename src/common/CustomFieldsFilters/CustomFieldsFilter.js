import { memo } from 'react';
import PropTypes from 'prop-types';

import {
  MultiSelectionFilter,
  CheckboxFilter,
} from '@folio/stripes/smart-components';
import {
  FilterAccordion,
} from '@folio/stripes-acq-components';

import { FILTERS } from '../../OrdersList/constants';

// Map custom field types to specific filters
const customFieldTypeToFilterMap = {
  MULTI_SELECT_DROPDOWN: MultiSelectionFilter,
  RADIO_BUTTON: CheckboxFilter,
  SINGLE_SELECT_DROPDOWN: MultiSelectionFilter,
  SINGLE_CHECKBOX: CheckboxFilter,
};

const CustomFieldsFilter = ({
  activeFilters,
  customField,
  onChange,
}) => {
  const FilterComponent = customFieldTypeToFilterMap[customField.type]; // "MULTI_SELECT_DROPDOWN" -> 'MultiSelectionFilter'

  if (!FilterComponent) {
    return null;
  }

  const {
    refId,
    name,
    selectField,
  } = customField;

  const values = selectField?.options?.values ?? [{ id: 'true', value: name }];
  const filterName = `${FILTERS.CUSTOM_FIELDS}.${refId}`;
  // const filterNameM = `customFields-${refId}`;
  // const selectedValues = activeFilters?.filterName?  activeFilters[filterName] : [];
  const dataOptions = values.map(({ id: value, value: label }) => ({ label, value }));
  const closedByDefault = false;

  // console.log('xxx filterName');
  // console.log(filterName);

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      // activeFilters={activeFilters[`customFields.${customField.refId}`]}
      closedByDefault={closedByDefault}
      id={`orders-filter-accordion-custom-field-${refId}`}
      label={name}
      name={filterName}
      onChange={onChange}
    >
      <FilterComponent
        aria-labelledby={`orders-filter-accordion-custom-field-${refId}`}
        dataOptions={dataOptions}
        name={filterName}
        // selectedValues={selectedValues}
        selectedValues={activeFilters}
        onChange={onChange}
      />
    </FilterAccordion>
  );
};

CustomFieldsFilter.propTypes = {
  customField: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

export default memo(CustomFieldsFilter);
