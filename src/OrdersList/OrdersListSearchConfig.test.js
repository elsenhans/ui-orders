import { CUSTOM_FIELDS } from '../../test/jest/fixtures/customFields';
import { makeSearchQuery } from './OrdersListSearchConfig';

describe('makeSearchQuery', () => {
  const QUERY = 'abc';

  it('should return keyword query without custom fields', () => {
    const query = makeSearchQuery()(QUERY);

    expect(query).toBe(`metadata.createdDate=="Invalid date*" or dateOrdered=="Invalid date*" or poNumber=="*${QUERY}*"`);
  });

  it('should return keyword query with custom fields', () => {
    const query = makeSearchQuery(null, CUSTOM_FIELDS)(QUERY);

    expect(query).toBe(
      `metadata.createdDate=="Invalid date*" or dateOrdered=="Invalid date*" or poNumber=="*${QUERY}*" or ` +
      `customFields.datepicker=="Invalid date*" or customFields.longtext=="*${QUERY}*" or customFields.shorttext=="*${QUERY}*"`,
    );
  });

  it('should return correct query without custom fields', () => {
    const query = makeSearchQuery()(QUERY, 'qindex');

    expect(query).toBe(`(qindex==*${QUERY}*)`);
  });

  it('should return correct query for custom field type DATE_PICKER', () => {
    const query = makeSearchQuery('MM/DD/YYYY', CUSTOM_FIELDS)('03/24/2020', 'customFields.datepicker');

    expect(query).toBe('(customFields.datepicker==2020-03-24*)');
  });

  it('should return correct query for custom field type TEXTBOX_SHORT', () => {
    const query = makeSearchQuery(null, CUSTOM_FIELDS)(QUERY, 'customFields.shorttext');

    expect(query).toBe(`(customFields.shorttext==*${QUERY}*)`);
  });
});
