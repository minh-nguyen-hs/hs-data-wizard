const { padStart } = require('lodash');

const RecordCount = 1000;

const generate = (count, objBuilder) => {
  const data = [];
  for (let i = 0; i < count; i += 1) {
    data.push(objBuilder(i));
  }
  return data;
};

const ProductionInvUnitOfMeasure = generate(RecordCount, i => ({
  "id": "inv-uom-" + padStart(i, 5, '0'),
  "name": "Each",
  "unique_name": "each",
  "base_unit": {
    "base_unit": "Each",
    "scheme": "Neither",
    "class": "Count"
  },
  "name_plural": "Each",
  "status": "Active",
  "base_unit_amount": 1,
  "system_default": true,
  "base_uom": true
}));

const ProductionInvCategory = generate(RecordCount, i => {
  if ( i === 0 ) {
    return {
      "id": "inv-cat-" + padStart(i, 5, '0'),
      "name": "Category " + padStart(i, 5, '0'),
      "variance_threshold": 10,
      "level": 1,
      "is_parent": true,
      "items_amount": 0,
      "is_transferable": false
    };
  }
  return {
    "id": "inv-cat-" + padStart(i, 5, '0'),
    "name": "Bread",
    "variance_threshold": 10,
    "level": 2,
    "is_parent": false,
    "parent_id": "inv-cat-00001",
    "items_amount": 1,
    "gl_debit": "73095004",
    "gl_credit": "63095004",
    "is_transferable": false
  }
});

const ProductionItemDefinition = generate(RecordCount, i => ({
  "store_key": [
    "store_test"
  ],
  "id": "inv-item-"+ padStart(i, 5, '0'),
  "item_code": "2000",
  "item_name": "Item " + padStart(i, 5, '0'),
  "unique_name": "Item " + padStart(i, 5, '0'),
  "category": "inv-cat-"+ padStart(i, 5, '0'),
  "counting_uoms": [],
  "base_uom": "inv-uom-"+ padStart(i, 5, '0'),
  "reporting_uom": "inv-uom-"+ padStart(i, 5, '0'),
  "status": "Active",
  "theoretical_on_hand": 10000,
  "conversions": [],
  "class_conversions": []
}));

const ProductionRecipeDefinition = generate(RecordCount, i => ({
  "id": "inv-recipe-" + padStart(i, 5, '0'),
  "name": "Recipe " + padStart(i, 5, '0'),
  "uom": "inv-uom-" + padStart(i, 5, '0'),
  "category": "inv-cat-" + padStart(i, 5, '0'),
  "store_key": [
    "store_test"
  ],
  "quantity": 100,
  "is_deleted": false,
  "status": "Active",
  "oh_tracking": true,
  "item_ingredients":
    [
      {
        "entity_id": "inv-item-"  + padStart(i, 5, '0'),
        "uom": "inv-uom-" + padStart(i, 5, '0'),
        "quantity": 10
      },
      {
        "entity_id": "inv-item-" + padStart(i, 5, '0'),
        "uom": "inv-uom-" + padStart(i, 5, '0'),
        "quantity": 10
      }
    ],
  "recipe_ingredients":
    [
      {
        "entity_id": "inv-recipe-" + padStart(i, 5, '0'),
        "uom": "inv-uom-" + padStart(i, 5, '0'),
        "quantity": 10
      }
    ],
  "theoretical_on_hand": 500,
  "conversions":[],
  "class_conversions":[]
}));

const ProductionRecipePreparationSetup = generate(RecordCount, i => ({
  "recipe_id": "inv-recipe-" + padStart(i, 5, '0'),
  "schedule": "prod-sched-0001",
  "hold_time": "01:00",
  "prep_uom": "inv-uom-" + padStart(i, 5, '0'),
  "store_key": {
    "store_test": "prod-sched-0001"
  },
  "minimum_prep_quantity": 15,
  "status": "Active",
  "id": "prod-prep-" + padStart(i, 5, '0'),
  "prep_time": "00:45"
}));

module.exports = {
  ProductionInvUnitOfMeasure,
  ProductionInvCategory,
  ProductionItemDefinition,
  ProductionRecipeDefinition,
  ProductionRecipePreparationSetup
};
