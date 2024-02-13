import moment from 'moment';

import { DATE_FORMAT } from '@folio/stripes-acq-components';

const indexes = [
  'metadata.createdDate',
  'dateOrdered',
  'poNumber',
  // 'customFields',
];

const searchByDate = (query, dateFormat) => {
  const isoDate = moment.utc(query, dateFormat).format(DATE_FORMAT);

  return `${isoDate}*`;
};

const customSearchMap = {
  'metadata.createdDate': searchByDate,
  'dateOrdered': searchByDate,
};

function getCqlQuery(query, qindex, dateFormat) {
  return customSearchMap[qindex]?.(query, dateFormat) || `*${query}*`;
}

const getKeywordQuery = (query, dateFormat) => indexes.reduce(
  (acc, sIndex) => {
    const cqlQuery = getCqlQuery(query, sIndex, dateFormat);

    if (acc) {
      return `${acc} or ${sIndex}=="${cqlQuery}"`;
    } else {
      return `${sIndex}=="${cqlQuery}"`;
    }
  },
  '',
);

export function makeSearchQuery(dateFormat) {
  return (query, qindex) => {
    if (qindex) {
      const cqlQuery = getCqlQuery(query, qindex, dateFormat);

      return `(${qindex}==${cqlQuery})`;
    }

    return getKeywordQuery(query, dateFormat);
  };
}
