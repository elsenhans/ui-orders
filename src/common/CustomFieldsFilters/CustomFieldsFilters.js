import PropTypes from 'prop-types';

import { useCustomFields } from '@folio/stripes/smart-components';

import CustomFieldsFilter from './CustomFieldsFilter';
import { CUSTOM_FIELDS_BACKEND_MODULE_NAME } from '../constants';
import { FILTERS } from '../../OrdersList/constants';

const CustomFieldsFilters = ({ activeFilters, onChange }) => {
  const [customFields] = useCustomFields(CUSTOM_FIELDS_BACKEND_MODULE_NAME, 'purchase_order');

  if (!customFields) return null;

  return customFields.map(customField => (
    <CustomFieldsFilter
      // activeFilters={activeFilters['customFields.poMultiSelect']}
      // activeFilters={activeFilters[`customFields.${customField.refId}`]}
      activeFilters={activeFilters[`${FILTERS.CUSTOM_FIELDS}.${customField.refId}`]}
      customField={customField}
      key={`custom-field-${customField.id}`}
      onChange={onChange}
    />
    ));
};

CustomFieldsFilters.propTypes = {
  onChange: PropTypes.func.isRequired,
  activeFilters: PropTypes.object,
};

export default CustomFieldsFilters;
