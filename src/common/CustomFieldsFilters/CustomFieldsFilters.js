import PropTypes from 'prop-types';

import { FILTERS } from '../../OrdersList/constants';
import CustomFieldsFilter from './CustomFieldsFilter';

const CustomFieldsFilters = ({
  activeFilters,
  customFields,
  onChange,
  ...props
}) => {

  if (!customFields) return null;

  return customFields.map((customField) => (
    <CustomFieldsFilter
      activeFilters={
        activeFilters[`${FILTERS.CUSTOM_FIELDS}.${customField.refId}`]
      }
      customField={customField}
      key={`custom-field-${customField.id}`}
      onChange={onChange}
      {...props}
    />
  ));
};

CustomFieldsFilters.propTypes = {
  activeFilters: PropTypes.object,
  customFields: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

export default CustomFieldsFilters;
