import { Model, belongsTo } from '@bigtest/mirage';

export default Model.extend({
  purchase_order: belongsTo('order'),
});