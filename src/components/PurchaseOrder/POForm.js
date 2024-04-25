import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Field } from 'react-final-form';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { withRouter } from 'react-router-dom';

import stripesForm from '@folio/stripes/final-form';
import { IfPermission } from '@folio/stripes/core';
import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  IconButton,
  MenuSection,
  Pane,
  PaneFooter,
  PaneMenu,
  Paneset,
  Row,
} from '@folio/stripes/components';
import { EditCustomFieldsRecord } from '@folio/stripes/smart-components';
import {
  CUSTOM_FIELDS_ORDERS_BACKEND_NAME,
  FieldSelectionFinal as FieldSelection,
  handleKeyCommand,
} from '@folio/stripes-acq-components';

import { useErrorAccordionStatus } from '../../common/hooks';
import {
  getAddresses,
} from '../../common/utils';
import { isOngoing } from '../../common/POFields';
import getOrderNumberSetting from '../../common/utils/getOrderNumberSetting';
import getOrderTemplatesForSelect from '../Utils/getOrderTemplatesForSelect';
import getOrderTemplateValue from '../Utils/getOrderTemplateValue';
import { getFullOrderNumber } from '../Utils/orderResource';

import {
  ACCORDION_ID,
  INITIAL_SECTIONS,
  MAP_FIELD_ACCORDION,
  PO_TEMPLATE_FIELDS_MAP,
} from './constants';
import { PODetailsForm } from './PODetails';
import { SummaryForm } from './Summary';
import { OngoingInfoForm } from './OngoingOrderInfo';

const POForm = ({
  form: {
    batch,
    change,
    getFieldState,
    getRegisteredFields,
    getState,
  },
  values: formValues,
  generatedNumber,
  handleSubmit,
  pristine,
  submitting,
  history,
  initialValues,
  onCancel,
  parentMutator,
  parentResources,
  instanceId,
}) => {
  const [template, setTemplate] = useState();
  const [hiddenFields, setHiddenFields] = useState({});

  const accordionStatusRef = useRef();

  const errors = getState()?.errors;
  const errorAccordionStatus = useErrorAccordionStatus({ errors, fieldsMap: MAP_FIELD_ACCORDION });

  useEffect(() => {
    if (initialValues.template) {
      const orderTemplate = parentResources?.orderTemplates?.records?.find(
        ({ id }) => id === initialValues.template,
      );

      setTemplate(orderTemplate);
      setHiddenFields((prev) => ({
        ...prev,
        ...(orderTemplate?.hiddenFields || {}),
      }));
    }
  }, []);

  const callAPI = useCallback((_fieldName, values) => {
    const { orderNumber: validator } = parentMutator;
    const fullOrderNumber = getFullOrderNumber(values);
    const initialFullOrderNumber = getFullOrderNumber(formValues);

    return (values.poNumber && initialFullOrderNumber) !== fullOrderNumber
      ? validator.POST({ poNumber: fullOrderNumber })
        .then(() => { })
        .catch(() => <FormattedMessage id="ui-orders.errors.orderNumberIsNotValid" />)
      : Promise.resolve();
  }, [formValues, parentMutator]);

  const validateNumber = useCallback((poNumber, values) => {
    const isDirty = getFieldState('poNumber')?.dirty;

    return poNumber && isDirty
      ? callAPI('poNumber', values)
      : Promise.resolve();
  }, [callAPI, getFieldState]);

  const toggleForceVisibility = useCallback(() => {
    setHiddenFields(prev => (prev ? undefined : template?.hiddenFields || {}));
  }, [template]);

  const firstMenu = useMemo(() => {
    return (
      <PaneMenu>
        <FormattedMessage id="ui-orders.buttons.line.close">
          {([title]) => (
            <IconButton
              ariaLabel={title}
              icon="times"
              id="clickable-close-new-purchase-order-dialog"
              onClick={onCancel}
            />
          )}
        </FormattedMessage>
      </PaneMenu>
    );
  }, [onCancel]);

  const getActionMenu = useCallback(({ onToggle }) => (
    Boolean(template?.hiddenFields) && (
      <MenuSection id="po-form-actions">
        <IfPermission perm="ui-orders.order.showHidden">
          <Button
            id="clickable-show-hidden"
            buttonStyle="dropdownItem"
            data-testid="toggle-fields-visibility"
            onClick={() => {
              toggleForceVisibility();
              onToggle();
            }}
          >
            <Icon size="small" icon={`eye-${hiddenFields ? 'open' : 'closed'}`}>
              <FormattedMessage id={`ui-orders.order.${hiddenFields ? 'showHidden' : 'hideFields'}`} />
            </Icon>
          </Button>
        </IfPermission>
      </MenuSection>
    )
  ), [hiddenFields, template, toggleForceVisibility]);

  const getPaneFooter = useCallback((id, label) => {
    const start = (
      <FormattedMessage id="ui-orders.buttons.line.cancel">
        {(btnLabel) => (
          <Button
            id="clickable-close-new-purchase-order-dialog-footer"
            buttonStyle="default mega"
            onClick={onCancel}
          >
            {btnLabel}
          </Button>
        )}
      </FormattedMessage>
    );

    const end = (
      <FormattedMessage id={label}>
        {btnLabel => (
          <Button
            id={id}
            type="submit"
            buttonStyle="primary mega"
            disabled={pristine || submitting}
            onClick={handleSubmit}
          >
            {btnLabel}
          </Button>
        )}
      </FormattedMessage>
    );

    return (
      <PaneFooter
        renderStart={start}
        renderEnd={end}
      />
    );
  }, [handleSubmit, onCancel, pristine, submitting]);

  const onChangeTemplate = useCallback((value) => {
    const templateValue = getOrderTemplateValue(parentResources, value);

    setTemplate(templateValue);
    setHiddenFields(prev => (prev ? (templateValue?.hiddenFields || {}) : undefined));

    batch(() => {
      change('template', value);
      change('vendor', null);
      change('assignedTo', null);
      change('manualPo', false);
      change('reEncumber', false);
      change('orderType', null);
      change('acqUnitIds', []);
      change('tags', { tagList: [] });
      change('notes', []);
      change('billTo', null);
      change('shipTo', null);
    });

    getRegisteredFields()
      .forEach(field => {
        const templateField = PO_TEMPLATE_FIELDS_MAP[field] || field;
        const templateFieldValue = get(templateValue, templateField);

        if (templateFieldValue) change(field, templateFieldValue);
      });
    if (isOngoing(templateValue.orderType)) {
      change('ongoing', templateValue.ongoing || {});
      setTimeout(() => {
        getRegisteredFields()
          .forEach(field => get(templateValue, field) && change(field, get(templateValue, field)));
      });
    }
  }, [batch, change, getRegisteredFields, parentResources]);

  const orderNumber = getFullOrderNumber(initialValues);
  const orderNumberSetting = getOrderNumberSetting(get(parentResources, 'orderNumberSetting.records', {}));
  const addresses = getAddresses(get(parentResources, 'addresses.records', []));
  const orderTemplates = getOrderTemplatesForSelect(parentResources);
  const poLinesLength = get(initialValues, 'compositePoLines', []).length;
  const customFieldsValues = getState().values.customFields;

  const paneTitle = initialValues.id
    ? <FormattedMessage id="ui-orders.order.paneTitle.edit" values={{ orderNumber }} />
    : <FormattedMessage id="ui-orders.paneMenu.createPurchaseOrder" />;

  const buttonLabelId = instanceId ? 'ui-orders.paneMenu.addPOLine' : 'ui-orders.paneMenu.saveOrder';
  const paneFooter = initialValues.id
    ? getPaneFooter('clickable-update-purchase-order', 'ui-orders.paneMenu.saveOrder')
    : getPaneFooter('clickable-create-new-purchase-order', buttonLabelId);

  const prefixesSetting = get(parentResources, 'prefixesSetting.records', [])
    .map(({ name }) => ({ label: name, value: name }));
  const suffixesSetting = get(parentResources, 'suffixesSetting.records', [])
    .map(({ name }) => ({ label: name, value: name }));

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onCancel),
    },
    {
      name: 'save',
      handler: handleKeyCommand(handleSubmit, { disabled: pristine || submitting }),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
    {
      name: 'search',
      handler: handleKeyCommand(() => history.push('/orders')),
    },
  ];

  if (!initialValues) {
    return (
      <Pane
        defaultWidth="fill"
        firstMenu={firstMenu}
        id="pane-podetails"
        footer={paneFooter}
        onClose={onCancel}
        paneTitle={<FormattedMessage id="ui-orders.order.paneTitle.detailsLoading" />}
      >
        <div style={{ paddingTop: '1rem' }}><Icon icon="spinner-ellipsis" width="100px" /></div>
      </Pane>
    );
  }

  return (
    <div style={{ height: '100vh' }}>
      <HasCommand
        commands={shortcuts}
        isWithinScope={checkScope}
        scope={document.body}
      >
        <Paneset>
          <Pane
            defaultWidth="100%"
            firstMenu={firstMenu}
            actionMenu={getActionMenu}
            id="pane-poForm"
            footer={paneFooter}
            onClose={onCancel}
            paneTitle={paneTitle}
          >
            <AccordionStatus ref={accordionStatusRef}>
              {({ status }) => (
                <form
                  id="form-po"
                  data-test-form-page
                >
                  <Row>
                    <Col xs={12}>
                      <Row center="xs">
                        <Col xs={12} md={8}>
                          <Row end="xs">
                            <Col xs={12}>
                              <ExpandAllButton />
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={12} md={8}>
                          <Row>
                            <Col xs={4}>
                              <FieldSelection
                                dataOptions={orderTemplates}
                                onChange={onChangeTemplate}
                                labelId="ui-orders.settings.orderTemplates.editor.template.name"
                                name="template"
                                id="order-template"
                                disabled={Boolean(poLinesLength)}
                              />
                            </Col>
                          </Row>
                        </Col>

                        <Col xs={12} md={8} style={{ textAlign: 'left' }}>
                          <AccordionSet
                            initialStatus={INITIAL_SECTIONS}
                            accordionStatus={{ ...status, ...errorAccordionStatus }}
                          >
                            <Accordion
                              id={ACCORDION_ID.purchaseOrder}
                              label={<FormattedMessage id="ui-orders.paneBlock.purchaseOrder" />}
                            >
                              <PODetailsForm
                                addresses={addresses}
                                change={change}
                                formValues={formValues}
                                generatedNumber={generatedNumber}
                                order={initialValues}
                                orderNumberSetting={orderNumberSetting}
                                prefixesSetting={prefixesSetting}
                                suffixesSetting={suffixesSetting}
                                validateNumber={validateNumber}
                                hiddenFields={hiddenFields}
                              />
                            </Accordion>
                            {isOngoing(formValues.orderType) && (
                              <OngoingInfoForm hiddenFields={hiddenFields} />
                            )}
                            <Accordion
                              id={ACCORDION_ID.poSummary}
                              label={<FormattedMessage id="ui-orders.paneBlock.POSummary" />}
                            >
                              <SummaryForm
                                initialValues={initialValues}
                                hiddenFields={hiddenFields}
                              />
                            </Accordion>
                            <EditCustomFieldsRecord
                              accordionId="customFieldsPO"
                              backendModuleName={CUSTOM_FIELDS_ORDERS_BACKEND_NAME}
                              changeFinalFormField={change}
                              entityType="purchase_order"
                              fieldComponent={Field}
                              finalFormCustomFieldsValues={customFieldsValues}
                            />
                          </AccordionSet>
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </form>
              )}
            </AccordionStatus>
          </Pane>
        </Paneset>
      </HasCommand>
    </div>
  );
};

POForm.propTypes = {
  values: PropTypes.object,
  form: PropTypes.object.isRequired,
  generatedNumber: PropTypes.string.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  onCancel: PropTypes.func.isRequired,
  pristine: PropTypes.bool.isRequired,
  submitting: PropTypes.bool.isRequired,
  parentResources: PropTypes.object.isRequired,
  parentMutator: PropTypes.object.isRequired,
  instanceId: PropTypes.string,
};

export default withRouter(stripesForm({
  enableReinitialize: true,
  keepDirtyOnReinitialize: true,
  navigationCheck: true,
  subscription: { values: true },
})(POForm));
