import { noop } from 'lodash';

import {
  configFunds,
  configMemberships,
  configUnits,
  configUsers,
  configVendors,
  configTags,
  configLocations,
  configMaterialTypes,
  configLines,
  configOrders,
  configConfigs,
  configPieces,
  configItems,
  configRequests,
} from '@folio/stripes-acq-components/test/bigtest/network';
import {
  createGetAll,
} from '@folio/stripes-acq-components/test/bigtest/network/configs';

import {
  AGREEMENT_LINES_API,
  INVOICE_LINES_API,
  INVOICES_API,
  ISBN_VALIDATOR,
  ORDER_INVOICE_RELNS_API,
  ORDER_NUMBER_API,
  ORDER_NUMBER_VALIDATE_API,
  RECEIVING_API,
} from '../../../src/components/Utils/api';
import {
  configClosingReasons,
  configPrefixes,
  configSuffixes,
  configTemplates,
} from './configs';

export default function config() {
  configFunds(this);
  configMemberships(this);
  configUnits(this);
  configUsers(this);
  configVendors(this);
  configTags(this);
  configOrders(this);
  configLines(this);
  configLocations(this);
  configMaterialTypes(this);
  configClosingReasons(this);
  configSuffixes(this);
  configPrefixes(this);
  configConfigs(this);
  configTemplates(this);
  configPieces(this);
  configItems(this);
  configRequests(this);

  this.get('/contributor-name-types');
  this.get('/identifier-types');

  this.get(ORDER_NUMBER_API, () => {
    return { poNumber: '10001' };
  });

  this.post(ORDER_NUMBER_VALIDATE_API, noop);

  this.get(ORDER_INVOICE_RELNS_API, (schema) => {
    return schema.orderInvoiceRelationships.all();
  });
  this.get(INVOICES_API);
  this.get(INVOICE_LINES_API);

  this.get(RECEIVING_API, (schema) => schema.receivingHistories.all());

  this.get('/isbn/convertTo13', () => {
    return { isbn: '1234567890123' };
  });

  this.get(ISBN_VALIDATOR, () => {
    return { isValid: true };
  });

  this.get('/note-types');
  this.get('/notes/:id', ({ notes }, { params }) => {
    return notes.find(params.id);
  });
  this.get('/note-links/domain/orders/type/:type/id/:id', ({ notes }, { params, queryParams }) => {
    if (queryParams.status === 'all') {
      return notes.all();
    }

    return notes.where(note => note.links.some(link => {
      return link.type === params.type && link.id === params.id;
    }));
  });
  this.get(AGREEMENT_LINES_API, createGetAll('agreementLines'));
  this.get('/finance/exchange-rate');
}
