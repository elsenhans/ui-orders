import {
  INVENTORY_RECORDS_TYPE,
  ORDER_FORMATS,
} from '@folio/stripes-acq-components';

export const ERESOURCES = [ORDER_FORMATS.electronicResource, ORDER_FORMATS.PEMix];
export const PHRESOURCES = [ORDER_FORMATS.physicalResource, ORDER_FORMATS.PEMix];

export const ACCORDION_ID = {
  costDetails: 'costDetails',
  eresources: 'eresources',
  fundDistribution: 'fundDistributionAccordion',
  itemDetails: 'itemDetails',
  lineDetails: 'lineDetails',
  location: 'location',
  other: 'other',
  notes: 'notes',
  physical: 'physical',
  poLine: 'poLine',
  relatedAgreementLines: 'relatedAgreementLines',
  relatedInvoices: 'relatedInvoices',
  vendor: 'vendor',
  linkedInstances: 'linkedInstances',
};

// Mapping between attribute (field) in form and id of accordion
export const MAP_FIELD_ACCORDION = {
  cost: ACCORDION_ID.costDetails,
  details: ACCORDION_ID.itemDetails,
  eresource: ACCORDION_ID.eresources,
  fundDistribution: ACCORDION_ID.fundDistribution,
  locations: ACCORDION_ID.location,
  orderFormat: ACCORDION_ID.lineDetails,
  other: ACCORDION_ID.other,
  physical: ACCORDION_ID.physical,
  poLineNumber: ACCORDION_ID.lineDetails,
  publicationDate: ACCORDION_ID.itemDetails,
  titleOrPackage: ACCORDION_ID.itemDetails,
  vendorDetail: ACCORDION_ID.vendor,
};

export const DISCOUNT_TYPE = {
  amount: 'amount',
  percentage: 'percentage',
};

export const INVENTORY_RECORDS_TYPE_FOR_SELECT = [
  { labelId: 'ui-orders.settings.createInventory.recordType.all', value: INVENTORY_RECORDS_TYPE.all },
  { labelId: 'ui-orders.settings.createInventory.recordType.instance', value: INVENTORY_RECORDS_TYPE.instance },
  { labelId: 'ui-orders.settings.createInventory.recordType.instanceAndHolding', value: INVENTORY_RECORDS_TYPE.instanceAndHolding },
  { labelId: 'ui-orders.settings.createInventory.recordType.none', value: INVENTORY_RECORDS_TYPE.none },
];

export const ALLOWED_YEAR_LENGTH = 4;

export const POL_TEMPLATE_FIELDS_MAP = {
  'tags.tagList': 'polTags.tagList',
};

export const INITIAL_SECTIONS = Object.keys(ACCORDION_ID).reduce(
  (accum, id) => ({ ...accum, [id]: true }), {},
);
