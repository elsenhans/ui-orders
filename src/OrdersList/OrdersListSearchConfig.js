import moment from 'moment';

import {
  CUSTOM_FIELDS_FILTER,
  CUSTOM_FIELDS_TYPES,
  DATE_FORMAT,
  getCustomFieldsKeywordIndexes,
} from '@folio/stripes-acq-components';

const indexes = ['metadata.createdDate', 'dateOrdered', 'poNumber'];

const searchByDate = (query, dateFormat) => {
  const isoDate = moment.utc(query, dateFormat).format(DATE_FORMAT);

  return `${isoDate}*`;
};

const customSearchMap = {
  'metadata.createdDate': searchByDate,
  'dateOrdered': searchByDate,
};

function getCqlQuery(query, qindex, dateFormat, customField) {
  return customField?.type === CUSTOM_FIELDS_TYPES.DATE_PICKER
    ? searchByDate(query, dateFormat)
    : customSearchMap[qindex]?.(query, dateFormat) || `*${query}*`;
}

const getKeywordQuery = (query, dateFormat, customFields) => {
  const customFieldIndexes = getCustomFieldsKeywordIndexes(customFields);

  return [...indexes, ...customFieldIndexes].reduce((acc, sIndex) => {
    const customField = customFields?.find(
      (cf) => `${CUSTOM_FIELDS_FILTER}.${cf.refId}` === sIndex,
    );
    const cqlQuery = getCqlQuery(query, sIndex, dateFormat, customField);

    if (acc) {
      return `${acc} or ${sIndex}=="${cqlQuery}"`;
    } else {
      return `${sIndex}=="${cqlQuery}"`;
    }
  }, '');
};

export function makeSearchQuery(dateFormat, customFields) {
  return (query, qindex) => {
    if (qindex) {
      const customField = customFields?.find(
        (cf) => `${CUSTOM_FIELDS_FILTER}.${cf.refId}` === qindex,
      );

      const cqlQuery = getCqlQuery(query, qindex, dateFormat, customField);

      return `(${qindex}==${cqlQuery})`;
    }

    return getKeywordQuery(query, dateFormat, customFields);
  };
}
