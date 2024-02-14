import PropTypes from 'prop-types';
import { memo } from 'react';

import { FilterAccordion } from '@folio/stripes-acq-components';
import {
  CheckboxFilter,
  MultiSelectionFilter,
} from '@folio/stripes/smart-components';

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
  closedByDefault,
  customField,
  disabled,
  onChange,
}) => {
  const FilterComponent = customFieldTypeToFilterMap[customField.type];

  if (!FilterComponent) {
    return null;
  }

  const { refId, name, selectField } = customField;

  const values = selectField?.options?.values ?? [{ id: 'true', value: name }];
  const filterName = `${FILTERS.CUSTOM_FIELDS}.${refId}`;
  const dataOptions = values.map(({ id: value, value: label }) => ({
    label,
    value,
  }));

  return (
    <FilterAccordion
      activeFilters={activeFilters}
      closedByDefault={closedByDefault}
      disabled={disabled}
      id={`orders-filter-accordion-custom-field-${refId}`}
      label={name}
      name={filterName}
      onChange={onChange}
    >
      <FilterComponent
        aria-labelledby={`orders-filter-accordion-custom-field-${refId}`}
        dataOptions={dataOptions}
        disabled={disabled}
        name={filterName}
        selectedValues={activeFilters}
        onChange={onChange}
      />
    </FilterAccordion>
  );
};

CustomFieldsFilter.propTypes = {
  customField: PropTypes.object,
  closedByDefault: PropTypes.bool,
  disabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.arrayOf(PropTypes.string),
};

CustomFieldsFilter.defaultProps = {
  closedByDefault: true,
  disabled: true,
};

export default memo(CustomFieldsFilter);
