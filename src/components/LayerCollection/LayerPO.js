import React, { useState, useEffect, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { FormattedMessage } from 'react-intl';

import { LoadingView } from '@folio/stripes/components';
import {
  stripesConnect,
} from '@folio/stripes/core';
import {
  baseManifest,
  ORDER_STATUSES,
  prefixesResource,
  suffixesResource,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  createOrEditOrderResource,
} from '../Utils/orderResource';
import {
  ADDRESSES,
  ORDER,
  ORDER_NUMBER,
  ORDER_NUMBER_SETTING,
  ORDER_TEMPLATES,
  USERS,
} from '../Utils/resources';
import { useHandleOrderUpdateError } from '../../common/hooks/useHandleOrderUpdateError';
import POForm from '../PurchaseOrder/POForm';
import { UpdateOrderErrorModal } from '../PurchaseOrder/UpdateOrderErrorModal';

const NEW_ORDER = {
  reEncumber: true,
  workflowStatus: ORDER_STATUSES.pending,
};

function LayerPO({
  history,
  location,
  match: { params: { id } },
  mutator,
  resources,
}) {
  const sendCallout = useShowCallout();
  const [handleErrorResponse] = useHandleOrderUpdateError(mutator.expenseClass);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedMutator = useMemo(() => mutator, []);

  const [savingValues, setSavingValues] = useState();
  const [isLoading, setIsLoading] = useState(true);
  const [updateOrderError, setUpdateOrderError] = useState();
  const [isErrorsModalOpened, toggleErrorsModal] = useModalToggle();
  const order = id ? resources?.order?.records[0] : NEW_ORDER;

  useEffect(() => {
    memoizedMutator.orderNumber.reset();
    memoizedMutator.orderNumber.GET()
      .finally(setIsLoading);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const closeErrorModal = useCallback(() => {
    toggleErrorsModal();
    setUpdateOrderError();
  }, [toggleErrorsModal]);

  const openOrderErrorModalShow = useCallback((errors) => {
    toggleErrorsModal();
    setUpdateOrderError(errors);
  }, [toggleErrorsModal]);

  const updatePO = useCallback(values => {
    setIsLoading(true);
    setSavingValues(values);

    return createOrEditOrderResource(values, memoizedMutator.order)
      .then(savedOrder => {
        sendCallout({
          message: <FormattedMessage id="ui-orders.order.save.success" values={{ orderNumber: savedOrder.poNumber }} />,
        });
        history.push({
          pathname: `/orders/view/${savedOrder.id}`,
          search: location.search,
        });
      })
      .catch(async e => {
        setIsLoading(false);
        await handleErrorResponse(e, openOrderErrorModalShow);
      });
  }, [handleErrorResponse, history, location.search, memoizedMutator.order, openOrderErrorModalShow, sendCallout]);

  const onCancel = useCallback(
    () => {
      history.push({
        pathname: id ? `/orders/view/${id}` : '/orders',
        search: location.search,
      });
    },
    [history, id, location.search],
  );

  if (isLoading || !order) return <LoadingView dismissible onClose={onCancel} />;

  const { poNumber, poNumberPrefix, poNumberSuffix } = order;
  const generatedNumber = get(resources, 'orderNumber.records.0.poNumber');
  const purePONumber = id
    ? poNumber.slice(poNumberPrefix?.length, -poNumberSuffix?.length || undefined)
    : generatedNumber;
  const patchedOrder = {
    ...order,
    poNumber: purePONumber,
  };
  const initialValues = savingValues || patchedOrder; // use entered values in case of error response

  return (
    <>
      <POForm
        generatedNumber={generatedNumber}
        initialValues={initialValues}
        onCancel={onCancel}
        onSubmit={updatePO}
        parentMutator={memoizedMutator}
        parentResources={resources}
      />
      {isErrorsModalOpened && (
        <UpdateOrderErrorModal
          orderNumber={patchedOrder.poNumber}
          errors={updateOrderError}
          cancel={closeErrorModal}
        />
      )}
    </>
  );
}

LayerPO.manifest = Object.freeze({
  order: ORDER,
  addresses: ADDRESSES,
  users: {
    ...USERS,
    accumulate: true,
    fetch: false,
  },
  orderNumber: ORDER_NUMBER,
  orderNumberSetting: ORDER_NUMBER_SETTING,
  prefixesSetting: prefixesResource,
  suffixesSetting: suffixesResource,
  orderTemplates: {
    ...ORDER_TEMPLATES,
    shouldRefresh: () => false,
  },
  expenseClass: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
});

LayerPO.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
  mutator: PropTypes.object.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(LayerPO);
