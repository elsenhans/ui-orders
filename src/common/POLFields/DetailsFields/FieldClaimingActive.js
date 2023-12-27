import PropTypes from 'prop-types';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';

import { Checkbox } from '@folio/stripes/components';

export const FieldClaimingActive = ({ onChange }) => {
  return (
    <Field
      component={Checkbox}
      fullWidth
      label={<FormattedMessage id="ui-orders.poLine.claimingActive" />}
      onChange={onChange}
      name="claimingActive"
      type="checkbox"
      vertical
      validateFields={['claimingInterval']}
    />
  );
};

FieldClaimingActive.propTypes = {
  onChange: PropTypes.func,
};
