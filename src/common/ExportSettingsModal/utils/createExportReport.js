import {
  calculateFundAmount,
  formatDate,
  formatDateTime,
  FUND_DISTR_TYPE,
} from '@folio/stripes-acq-components';

const getRecordMap = (records) => (
  records.reduce((acc, record) => {
    acc[record.id] = record;

    return acc;
  }, {})
);

const getContributorData = (line, contributorNameTypeMap) => (
  line.contributors?.map(({ contributor, contributorNameTypeId }) => (
    `"${contributor}""${contributorNameTypeMap[contributorNameTypeId]?.name}"`
  )).join(' | ')
);

const getProductIdData = (line, identifierTypeMap) => (
  line.details?.productIds?.map(i => (
    `"${i?.productId}""${i?.qualifier || ''}""${identifierTypeMap[i?.productIdType]?.name}"`
  )).join(' | ')
);

const getFundDistributionData = (line, expenseClassMap) => (
  line.fundDistribution?.map(fund => (
    `"${fund.code || ''}""${expenseClassMap[fund?.expenseClassId]?.name || ''}"
    "${fund.value || '0'}${fund.distributionType === FUND_DISTR_TYPE.percent ? '%' : ''}"
    "${calculateFundAmount(fund, line.cost.poLineEstimatedPrice, line.cost.currency)}"`
  )).join(' | ').replace(/\n\s+/g, '')
);

const getLocationData = (line, locationMap) => (
  line.locations?.map(l => (
    `"${locationMap[l.locationId]?.code}""${l?.quantityPhysical || 0}""${l?.quantityElectronic || 0}"`
  )).join(' | ')
);

const getAddressData = (addressId, addressMap) => (
  addressMap[addressId] ? `"${addressMap[addressId].name}""${addressMap[addressId].address}"` : ''
);

const getReferenceNumbers = (line) => (
  line.vendorDetail?.referenceNumbers?.map(({ refNumber, refNumberType }) => (
    `"${refNumber}""${refNumberType}"`
  )).join(' | ')
);

export const createExportReport = (
  intl,
  poLines = [],
  orders = [],
  vendors = [],
  users = [],
  acqUnits = [],
  materialTypes = [],
  locations = [],
  contributorNameTypes = [],
  identifierTypes = [],
  expenseClasses = [],
  addresses = [],
) => {
  const poLinesMap = getRecordMap(poLines);
  const ordersMap = getRecordMap(orders);
  const vendorMap = getRecordMap(vendors);
  const userMap = getRecordMap(users);
  const acqUnitMap = getRecordMap(acqUnits);
  const materialTypeMap = getRecordMap(materialTypes);
  const locationMap = getRecordMap(locations);
  const contributorNameTypeMap = getRecordMap(contributorNameTypes);
  const identifierTypeMap = getRecordMap(identifierTypes);
  const expenseClassMap = getRecordMap(expenseClasses);
  const addressMap = getRecordMap(addresses);

  return poLines.map(lineRecord => ({
    poNumber: ordersMap[lineRecord.purchaseOrderId].poNumber,
    vendor: vendorMap[ordersMap[lineRecord.purchaseOrderId].vendor].code,
    vendorRecord: vendorMap[ordersMap[lineRecord.purchaseOrderId].vendor],
    orderType: ordersMap[lineRecord.purchaseOrderId].orderType,
    acquisitionsUnits: ordersMap[lineRecord.purchaseOrderId].acqUnitIds.map(id => acqUnitMap[id].name).join(' | '),
    approvalDate: formatDateTime(ordersMap[lineRecord.purchaseOrderId].approvalDate, intl),
    assignedTo: userMap[ordersMap[lineRecord.purchaseOrderId].assignedTo]?.username,
    billTo: getAddressData(ordersMap[lineRecord.purchaseOrderId]?.billTo, addressMap),
    billToRecord: addressMap[ordersMap[lineRecord.purchaseOrderId]?.billTo],
    shipTo: getAddressData(ordersMap[lineRecord.purchaseOrderId]?.shipTo, addressMap),
    shipToRecord: addressMap[ordersMap[lineRecord.purchaseOrderId]?.shipTo],
    manualPo: ordersMap[lineRecord.purchaseOrderId].manualPo,
    reEncumber: ordersMap[lineRecord.purchaseOrderId].reEncumber,
    createdByUserId: userMap[ordersMap[lineRecord.purchaseOrderId].metadata?.createdByUserId]?.username,
    createdDate: formatDateTime(ordersMap[lineRecord.purchaseOrderId].metadata?.createdDate, intl),
    note: ordersMap[lineRecord.purchaseOrderId].notes?.join('|'),
    workflowStatus: ordersMap[lineRecord.purchaseOrderId].workflowStatus,
    approved: ordersMap[lineRecord.purchaseOrderId].approved,
    interval: ordersMap[lineRecord.purchaseOrderId]?.ongoing?.interval,
    isSubscription: ordersMap[lineRecord.purchaseOrderId]?.ongoing?.isSubscription,
    manualRenewal: ordersMap[lineRecord.purchaseOrderId]?.ongoing?.manualRenewal,
    ongoingNotes: ordersMap[lineRecord.purchaseOrderId]?.ongoing?.notes,
    reviewPeriod: ordersMap[lineRecord.purchaseOrderId]?.ongoing?.reviewPeriod,
    renewalDate: formatDate(ordersMap[lineRecord.purchaseOrderId]?.ongoing?.renewalDate, intl),
    reviewDate: formatDate(ordersMap[lineRecord.purchaseOrderId]?.ongoing?.reviewDate, intl),
    poLineNumber: lineRecord.poLineNumber,
    titleOrPackage: lineRecord.titleOrPackage,
    instanceId: lineRecord.instanceId,
    subscriptionFrom: formatDate(lineRecord.details?.subscriptionFrom, intl),
    subscriptionTo: formatDate(lineRecord.details?.subscriptionTo, intl),
    subscriptionInterval: lineRecord.details?.subscriptionInterval,
    receivingNote: lineRecord.details?.receivingNote,
    publisher: lineRecord.publisher,
    edition: lineRecord.edition,
    packagePoLineId: poLinesMap[lineRecord.packagePoLineId]?.poLineNumber || lineRecord.packagePoLineId,
    contributor: getContributorData(lineRecord, contributorNameTypeMap),
    productIdentifier: getProductIdData(lineRecord, identifierTypeMap),
    description: lineRecord.description,
    acquisitionMethod: lineRecord.acquisitionMethod,
    orderFormat: lineRecord.orderFormat,
    createdDateLine: formatDate(lineRecord.metadata?.createdDate, intl),
    receiptDate: formatDate(lineRecord.receiptDate, intl),
    receiptStatus: lineRecord.receiptStatus,
    paymentStatus: lineRecord.paymentStatus,
    source: lineRecord.source,
    donor: lineRecord.donor,
    selector: lineRecord.selector,
    requester: lineRecord.requester,
    cancellationRestriction: lineRecord.cancellationRestriction,
    cancellationRestrictionNote: lineRecord.cancellationRestrictionNote,
    rush: lineRecord.rush,
    collection: lineRecord.collection,
    poLineDescription: lineRecord.poLineDescription,
    refNumber: getReferenceNumbers(lineRecord),
    instructions: lineRecord.vendorDetail?.instructions,
    vendorAccount: lineRecord.vendorDetail?.vendorAccount,
    listUnitPrice: lineRecord.cost?.listUnitPrice,
    quantityPhysical: lineRecord.cost?.quantityPhysical,
    listUnitPriceElectronic: lineRecord.cost?.listUnitPriceElectronic,
    quantityElectronic: lineRecord.cost?.quantityElectronic,
    discount: `"${lineRecord.cost?.discount}""${lineRecord.cost?.discountType}"`,
    poLineEstimatedPrice: lineRecord.cost.poLineEstimatedPrice,
    currency: lineRecord.cost.currency,
    fundDistribution: getFundDistributionData(lineRecord, expenseClassMap),
    location: getLocationData(lineRecord, locationMap),
    materialSupplier: vendorMap[lineRecord.physical?.materialSupplier]?.code,
    receiptDue: formatDate(lineRecord.physical?.receiptDue, intl),
    expectedReceiptDate: formatDate(lineRecord.physical?.expectedReceiptDate, intl),
    volumes: lineRecord.physical?.volumes.join('|'),
    createInventory: lineRecord.physical?.createInventory,
    materialType: materialTypeMap[lineRecord.physical?.materialType]?.name,
    accessProvider: vendorMap[lineRecord.eresource?.accessProvider]?.code,
    activated: lineRecord.eresource?.activated,
    activationDue: formatDate(lineRecord.eresource?.activationDue, intl),
    createInventoryE: lineRecord.eresource?.createInventory,
    materialTypeE: materialTypeMap[lineRecord.eresource?.materialType]?.name,
    trial: lineRecord.eresource?.trial,
    expectedActivation: formatDate(lineRecord.eresource?.expectedActivation, intl),
    userLimit: lineRecord.eresource?.userLimit,
    resourceUrl: lineRecord.eresource?.resourceUrl,
  }));
};
