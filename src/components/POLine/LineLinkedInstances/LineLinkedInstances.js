import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import {
  Accordion,
  Loading,
  MultiColumnList,
} from '@folio/stripes/components';

import { ACCORDION_ID } from '../const';

import { useLinkedInstances } from './useLinkedInstances';

const visibleColumns = ['title'];

export const LineLinkedInstances = ({ line, toggleSection }) => {
  const intl = useIntl();
  const { isLoading, linkedInstances } = useLinkedInstances(line);

  useEffect(() => {
    if (linkedInstances?.length) {
      toggleSection({ id: ACCORDION_ID.linkedInstances });
    }
  }, [toggleSection, linkedInstances]);

  return (
    <Accordion
      label={intl.formatMessage({ id: 'ui-orders.line.accordion.linkedInstances' })}
      id={ACCORDION_ID.linkedInstances}
    >
      {
        isLoading
          ? <Loading size="medium" />
          : (
            <MultiColumnList
              id="lineLinkedInstances"
              contentData={linkedInstances}
              visibleColumns={visibleColumns}
              interactive={false}
            />
          )
      }
    </Accordion>
  );
};

LineLinkedInstances.propTypes = {
  line: PropTypes.object.isRequired,
  toggleSection: PropTypes.func.isRequired,
};
