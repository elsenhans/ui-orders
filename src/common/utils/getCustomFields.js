import { useCustomFields } from '@folio/stripes/smart-components';

import { CUSTOM_FIELDS_BACKEND_MODULE_NAME } from '../../common/constants';

export const getCustomFields = () => {
  const [customFields] = useCustomFields(CUSTOM_FIELDS_BACKEND_MODULE_NAME, 'purchase_order');;

  const filterNames = customFields
    ?.filter(customField => (customField.type === 'MULTI_SELECT_DROPDOWN' || customField.type === 'RADIO_BUTTON' || customField.type === 'SINGLE_SELECT_DROPDOWN' || customField.type === 'SINGLE_CHECKBOX'))
    ?.map((customField) => customField.refId);

  return filterNames;
};
