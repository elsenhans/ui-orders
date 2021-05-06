import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import { get } from 'lodash';

import { LoadingPane } from '@folio/stripes/components';
import { stripesConnect } from '@folio/stripes/core';
import {
  baseManifest,
  Tags,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  ORDERS_API,
  LINES_API,
} from '../../components/Utils/api';
import {
  FUND,
  LOCATIONS,
  MATERIAL_TYPES,
} from '../../components/Utils/resources';
import { POLineView } from '../../components/POLine';
import { FILTERS as ORDER_FILTERS } from '../../OrdersList';

const OrderLineDetails = ({
  history,
  location,
  match,
  mutator,
  refreshList,
  resources,
}) => {
  const lineId = match.params.id;
  const [isLoading, setIsLoading] = useState(true);
  const [line, setLine] = useState({});
  const [order, setOrder] = useState({});
  const showToast = useShowCallout();

  const fetchLineDetails = useCallback(
    () => {
      setLine({});
      setOrder({});

      return mutator.orderLine.GET()
        .then(lineResponse => {
          setLine(lineResponse);

          return mutator.order.GET({ path: `${ORDERS_API}/${lineResponse.purchaseOrderId}` });
        })
        .then(setOrder);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId],
  );

  useEffect(
    () => {
      setIsLoading(true);
      fetchLineDetails().finally(setIsLoading);
    },
    [fetchLineDetails, lineId],
  );

  const goToOrderDetails = useCallback(
    () => {
      history.push({
        pathname: `/orders/view/${order.id}`,
        search: `qindex=${ORDER_FILTERS.PO_NUMBER}&query=${order.poNumber}`,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId, order],
  );

  const deleteLine = useCallback(
    () => {
      const lineNumber = line.poLineNumber;

      setIsLoading(true);
      mutator.orderLine.DELETE(line)
        .then(() => {
          showToast({
            messageId: 'ui-orders.line.delete.success',
            type: 'success',
            values: { lineNumber },
          });
          refreshList();
          history.replace({
            pathname: '/orders/lines',
            search: location.search,
          });
        })
        .catch(() => {
          setIsLoading();
          showToast({
            messageId: 'ui-orders.errors.lineWasNotDeleted',
            type: 'error',
          });
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [lineId, location.search, showToast],
  );

  const updateLineTagList = async (orderLine) => {
    await mutator.orderLine.PUT(orderLine);
    fetchLineDetails();
  };

  const [isTagsPaneOpened, setIsTagsPaneOpened] = useState(false);

  const toggleTagsPane = () => setIsTagsPaneOpened(!isTagsPaneOpened);

  const locations = get(resources, 'locations.records', []);
  const materialTypes = get(resources, 'materialTypes.records', []);
  const funds = get(resources, 'funds.records', []);

  const onClose = useCallback(
    () => {
      history.push({
        pathname: '/orders/lines',
        search: location.search,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [location.search],
  );

  if (isLoading || line?.id !== lineId) {
    return (
      <LoadingPane
        id="order-lines-details"
        defaultWidth="fill"
        dismissible
        onClose={onClose}
      />
    );
  }

  return (
    <Fragment>
      <POLineView
        line={line}
        order={order}
        locations={locations}
        materialTypes={materialTypes}
        funds={funds}
        goToOrderDetails={goToOrderDetails}
        deleteLine={deleteLine}
        tagsToggle={toggleTagsPane}
        onClose={onClose}
      />
      {isTagsPaneOpened && (
        <Tags
          putMutator={updateLineTagList}
          recordObj={line}
          onClose={toggleTagsPane}
        />
      )}
    </Fragment>
  );
};

OrderLineDetails.manifest = Object.freeze({
  orderLine: {
    ...baseManifest,
    path: `${LINES_API}/:{id}`,
    accumulate: true,
    fetch: false,
  },
  order: {
    ...baseManifest,
    accumulate: true,
    fetch: false,
  },
  locations: LOCATIONS,
  materialTypes: MATERIAL_TYPES,
  funds: FUND,
});

OrderLineDetails.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  match: ReactRouterPropTypes.match,
  mutator: PropTypes.object.isRequired,
  refreshList: PropTypes.func.isRequired,
  resources: PropTypes.object.isRequired,
};

export default stripesConnect(OrderLineDetails);
