export const ORGANIZATION_STATUS_ACTIVE = 'Active';

export const PRODUCT_ID_TYPE = {
  asin: 'ASIN',
  coden: 'CODEN',
  doi: 'DOI',
  gpoItemNumber: 'GPO item number',
  isbn: 'ISBN',
  ismn: 'ISMN',
  issn: 'ISSN',
  lccn: 'LCCN',
  publisherOrDistributorNumber: 'Publisher or distributor number',
  reportNumber: 'Report number',
  standardTechnicalReportNumber: 'Standard technical report number',
  upc: 'UPC',
  urn: 'URN',
};
export const QUALIFIER_SEPARATOR = ' ';

export const ORDER_TYPE = {
  oneTime: 'One-Time',
  ongoing: 'Ongoing',
};

export const ORDERS_DOMAIN = 'orders';

export const NOTE_TYPES = {
  poLine: 'poLine',
};

export const CONFIG_INSTANCE_STATUS = 'inventory-instanceStatusCode';
export const CONFIG_INSTANCE_TYPE = 'inventory-instanceTypeCode';
export const CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH_SETTINGS_KEY = 'CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH';

export const CLOSING_REASONS_SOURCE = {
  system: 'System',
  user: 'User',
};

export const RESULT_COUNT_INCREMENT = 30;

export const VALIDATION_ERRORS = {
  duplicateLines: 'duplicateLines',
  differentAccount: 'differentAccount',
};

export const CANCEL_ORDER_REASON = 'Cancelled';

export const REEXPORT_SOURCES = {
  order: 'order',
  orderLine: 'orderLine',
};

export const UNOPEN_ORDER_ABANDONED_HOLDINGS_TYPES = {
  synchronized: 'synchronized',
  independent: 'independent',
  defaultType: 'withoutPieces',
};

export const FIELD_ARRAY_ITEM_IDENTIFIER_KEY = '__key__';
export const OKAPI_TENANT_HEADER = 'X-Okapi-Tenant';

export const HIDDEN_ORDER_FIELDS_FOR_VERSION_HISTORY = ['nextPolNumber'];

export const CENTRAL_ORDERING_DEFAULT_RECEIVING_SEARCH = {
  activeAffiliationOnly: 'Active affiliation only',
  centralOnly: 'Central only',
  centralDefault: 'Central default',
  activeAffiliationDefault: 'Active affiliation default',
};
