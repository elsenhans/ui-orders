import { useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  batchRequest,
  LIMIT_MAX,
  LINES_API,
} from '@folio/stripes-acq-components';

export const useLinkedLines = line => {
  const ky = useOkapiKy();

  const { isLoading, data } = useQuery(
    ['ui-orders', 'linked-lines', line.id],
    () => {
      const searchParams = {
        limit: LIMIT_MAX,
        query: `packagePoLineId=${line.id} and instanceId=""`,
      };

      return ky.get(LINES_API, { searchParams }).json();
    },
    { enabled: Boolean(line.isPackage) },
  );

  return {
    isLoading,
    linkedLines: data?.poLines,
  };
};

export const useLinkedInstances = line => {
  const { isLoading: isLinkedLinesLoading, linkedLines = [] } = useLinkedLines(line);
  const ky = useOkapiKy();

  const linkedInstanceIds = linkedLines
    .map(({ instanceId }) => instanceId)
    .filter(Boolean);

  if (line.instanceId && !line.isPackage) {
    linkedInstanceIds.push(line.instanceId);
  }

  const { isLoading, data } = useQuery(
    ['ui-orders', 'linked-instances', line.id],
    () => {
      return batchRequest(
        async ({ params: searchParams }) => {
          const response = await ky.get('inventory/instances', { searchParams }).json();

          return response.instances;
        },
        linkedInstanceIds,
      );
    },
    { enabled: Boolean(linkedInstanceIds.length) },
  );

  return {
    isLoading: isLoading || isLinkedLinesLoading,
    linkedInstances: data,
  };
};
