import React, { Component } from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  get,
  some,
  uniq,
} from 'lodash';

import {
  Callout,
  Checkbox,
  KeyValue,
  Modal,
  MultiColumnList,
  Select,
  TextField,
} from '@folio/stripes/components';

import { receiveItems } from './util';
import ItemDetailsFooter from './ItemDetailsFooter';
import ReviewDetails from './ReviewDetails';
import {
  RECEIVING_HISTORY,
  RECEIVING_ITEMS,
} from './ReceivingLinks';
import css from './ItemDetails.css';

const ITEM_STATUS = {
  received: 'Received',
};

class ItemDetails extends Component {
  static propTypes = {
    close: PropTypes.func.isRequired,
    linesItemList: PropTypes.object.isRequired,
    location: PropTypes.object,
    locationsOptions: PropTypes.arrayOf(PropTypes.object).isRequired,
    mutator: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.callout = React.createRef();

    this.state = {
      allChecked: {},
      checkedItems: [],
      currentLine: 0,
      finalCheckedItemList: [],
      isFinalAllChecked: true,
      lineItems: this.props.linesItemList,
    };
  }

  isItemChecked = (item) => (
    Boolean(this.state.checkedItems.filter(id => id === item.id).length)
  );

  toggleAll = (poLineId) => {
    this.setState(({ allChecked, checkedItems, lineItems }) => {
      const allCheckedLine = !allChecked[poLineId];
      const itemsToRemove = lineItems[poLineId].map(el => el.id);
      const checkedLineItems = allCheckedLine
        ? uniq([...checkedItems, ...lineItems[poLineId].map(el => el.id)])
        : [...checkedItems].filter(id => !itemsToRemove.includes(id));

      allChecked[poLineId] = allCheckedLine;

      return {
        allChecked,
        checkedItems: checkedLineItems,
      };
    });
  }

  toggleItem = (item) => {
    this.setState(({ allChecked, checkedItems }) => {
      const checkedItemList = checkedItems.filter(id => id !== item.id);

      allChecked[item.poLineId] = false;

      return {
        allChecked,
        checkedItems: this.isItemChecked(item) ? [...checkedItemList] : [...checkedItems, item.id],
      };
    });
  }

  finalToggleAll = () => (
    this.setState(state => {
      const isFinalAllChecked = !state.isFinalAllChecked;
      const finalCheckedItemList = [...state.finalCheckedItemList];

      if (state.isFinalAllChecked) {
        const toggledItems = finalCheckedItemList.map(item => {
          item.isSelected = false;

          return item;
        });

        return {
          isFinalAllChecked,
          finalCheckedItemList: toggledItems,
        };
      } else {
        const toggledItems = finalCheckedItemList.map(item => {
          item.isSelected = true;

          return item;
        });

        return {
          isFinalAllChecked,
          finalCheckedItemList: toggledItems,
        };
      }
    })
  )

  finalToggleItem = (item) => {
    this.setState(state => {
      const finalCheckedItemList = [...state.finalCheckedItemList];
      const toggledItem = finalCheckedItemList.filter(el => el.id === item.id)[0];

      toggledItem.isSelected = !toggledItem.isSelected;

      return {
        finalCheckedItemList,
        isFinalAllChecked: false,
      };
    });
  }

  isReceiveButtonDisabled = () => (
    !some(this.state.finalCheckedItemList, { isSelected: true })
  )

  onClickNext = (linesCounter) => {
    this.setState(state => {
      if (state.currentLine + 1 === linesCounter) {
        const checkedItems = [...state.checkedItems];
        const checkedItemsList = checkedItems.map(item => {
          const piece = Object.values(state.lineItems).flat().filter(el => el.id === item)[0];

          piece.isSelected = true;

          return piece;
        });

        return {
          finalCheckedItemList: checkedItemsList,
          currentLine: state.currentLine + 1,
        };
      } else {
        return {
          currentLine: state.currentLine + 1,
        };
      }
    });
  }

  onClickPrevious = () => (
    this.setState(({ currentLine }) => ({
      currentLine: currentLine - 1,
    }))
  );

  onChangeField = (item, value, key) => {
    this.setState(({ lineItems }) => {
      const updatedLineItems = { ...lineItems };
      const selectedItem = updatedLineItems[item.poLineId].filter(el => el.id === item.id)[0];

      selectedItem[key] = value;

      return {
        lineItems: updatedLineItems,
      };
    });
  }

  getResultsFormatter = () => {
    const { locationsOptions } = this.props;

    return ({
      'isChecked': (item) => (
        <Checkbox
          checked={this.isItemChecked(item)}
          onChange={() => this.toggleItem(item)}
          type="checkbox"
        />
      ),
      'barcode': (item) => (
        <div className={css.fieldWrapper}>
          <TextField
            onChange={(e) => this.onChangeField(item, e.target.value, 'barcode')}
            type="number"
            value={get(item, 'barcode', '')}
          />
        </div>
      ),
      'format': (item) => (
        <div className={css.fieldWrapper}>
          <KeyValue value={get(item, 'poLineOrderFormat', '')} />
        </div>
      ),
      'location': (item) => (
        <div className={css.fieldWrapper}>
          <Select
            dataOptions={locationsOptions}
            fullWidth
            onChange={(e) => this.onChangeField(item, e.target.value, 'locationId')}
            value={get(item, 'locationId', '')}
          />
        </div>
      ),
      'itemStatus': () => (
        <div className={css.fieldWrapper}>
          <Select
            defaultValue={<FormattedMessage id="ui-orders.receiving.itemStatus.received" />}
            fullWidth
            selectClass={css.itemStatusField}
          >
            {Object.keys(ITEM_STATUS).map((key) => (
              <FormattedMessage
                id={`ui-orders.receiving.itemStatus.${key}`}
                key={key}
              >
                {(message) => <option value={ITEM_STATUS[key]}>{message}</option>}
              </FormattedMessage>
            ))}
          </Select>
        </div>
      ),
    });
  }

  onClickReceive = () => {
    const { close, location, mutator } = this.props;

    receiveItems(this.state.finalCheckedItemList, mutator.receive)
      .then(() => this.callout.current.sendCallout({
        type: 'success',
        message: <FormattedMessage id="ui-orders.receivingList.receive.success" />,
      }))
      .then(() => close())
      .then(() => mutator.query.update({
        _path: location.pathname.replace(RECEIVING_ITEMS, RECEIVING_HISTORY),
      }))
      .catch(() => this.callout.current.sendCallout({
        type: 'error',
        message: <FormattedMessage id="ui-orders.receivingList.receive.error" />,
      }));
  }

  render() {
    const { close, locationsOptions } = this.props;
    const { allChecked, checkedItems, currentLine, lineItems, finalCheckedItemList, isFinalAllChecked } = this.state;
    const poLineIdsList = Object.keys(lineItems);
    const poLineId = poLineIdsList[currentLine];
    const poLineNumber = get(lineItems, [poLineId, 0, 'poLineNumber'], '');
    const title = get(lineItems, [poLineId, 0, 'title'], '');
    const isReviewScreen = currentLine >= poLineIdsList.length;

    return (
      <div data-test-item-details>
        <Modal
          label={
            isReviewScreen
              ? <FormattedMessage id="ui-orders.receiving.reviewDetails" />
              : <FormattedMessage id="ui-orders.receiving.modalPaneTitle" values={{ poLineNumber, title }} />
          }
          footer={
            <ItemDetailsFooter
              checkedItemsListLength={checkedItems.length}
              close={close}
              currentLine={currentLine}
              isReceiveButtonDisabled={this.isReceiveButtonDisabled()}
              onClickNext={this.onClickNext}
              onClickPrevious={this.onClickPrevious}
              onClickReceive={this.onClickReceive}
              poLineIdsListLenght={poLineIdsList.length}
            />
          }
          open
        >
          {isReviewScreen
            ? <ReviewDetails
              checkedItemsList={finalCheckedItemList}
              isAllChecked={isFinalAllChecked}
              locationsOptions={locationsOptions}
              toggleAll={this.finalToggleAll}
              toggleItem={this.finalToggleItem}
              />
            : (
              <MultiColumnList
                contentData={lineItems[poLineId]}
                formatter={this.getResultsFormatter()}
                visibleColumns={['isChecked', 'barcode', 'format', 'location', 'itemStatus']}
                columnMapping={{
                  isChecked: <Checkbox type="checkbox" checked={allChecked[poLineId]} onChange={() => this.toggleAll(poLineId)} />,
                  barcode: <FormattedMessage id="ui-orders.receiving.barcode" />,
                  format: <FormattedMessage id="ui-orders.receiving.format" />,
                  location: <FormattedMessage id="ui-orders.receiving.location" />,
                  itemStatus: <FormattedMessage id="ui-orders.receiving.itemStatus" />,
                }}
                columnWidths={{
                  isChecked: '5%',
                  barcode: '25%',
                  format: '20%',
                  location: '35%',
                  itemStatus: '15%',
                }}
              />
            )
          }
        </Modal>
        <Callout ref={this.callout} />
      </div>
    );
  }
}

export default ItemDetails;
