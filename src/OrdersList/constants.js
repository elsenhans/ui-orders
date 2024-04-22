import React from 'react';
import { FormattedMessage } from 'react-intl';

import {
  ORDER_TYPE,
  WORKFLOW_STATUS,
} from '../common/constants';

export const FILTERS = {
  ACQUISITIONS_UNIT: 'acqUnitIds',
  APPROVED: 'approved',
  ASSIGNED_TO: 'assignedTo',
  BILL_TO: 'billTo',
  CLOSE_REASON: 'closeReason.reason',
  CREATED_BY: 'metadata.createdByUserId',
  DATE_CREATED: 'metadata.createdDate',
  DATE_ORDERED: 'dateOrdered',
  MANUAL_RENEWAL: 'ongoing.manualRenewal',
  ORDER_TYPE: 'orderType',
  PO_NUMBER: 'poNumber',
  PREFIX: 'poNumberPrefix',
  RE_ENCUMBER: 'reEncumber',
  SUBSCRIPTION: 'ongoing.isSubscription',
  RENEWAL_DATE: 'ongoing.renewalDate',
  RENEWAL_REVIEW_PERIOD: 'ongoing.reviewPeriod',
  SHIP_TO: 'shipTo',
  STATUS: 'workflowStatus',
  SUFFIX: 'poNumberSuffix',
  VENDOR: 'vendor',
  TAGS: 'tags.tagList',
  DATE_UPDATED: 'metadata.updatedDate',
  UPDATED_BY: 'metadata.updatedByUserId',
};

export const STATUS_FILTER_OPTIONS = Object.keys(WORKFLOW_STATUS).map(status => ({
  value: WORKFLOW_STATUS[status],
  label: <FormattedMessage id={`ui-orders.workflowStatus.${status}`} />,
}));

export const ORDER_TYPE_FILTER_OPTIONS = Object.keys(ORDER_TYPE).map(key => ({
  value: ORDER_TYPE[key],
  label: <FormattedMessage id={`ui-orders.order_type.${key}`} />,
}));
