const { readdirSync } = require('fs');
const path = require('path');
const axios = require('axios');
const { flatten, includes, times, constant, padStart } = require('lodash');
const { parallel } = require('async');
const https = require('https');
const { NAMESPACE, PUBLISH_MESSAGE_API, TOKEN, DATA_FOLDER, USE_DATA_GENERATOR } = require('./constants');
const dataGenerators = require('./dataGenerators');

function buildData() {
  return dataGenerators.generate(1, (id) => {
    const ts = new Date();
    const unixTs = (+ ts ) + '';

    const items = dataGenerators.generate(10, (itemId) => ({
      "store_key": "store_test",
      "id": (id) + '-' + padStart(itemId + 0, 7, '0'),
      "recipe_id": "inv-item-" + id + '-' + padStart(itemId, 7, '0'),
      "theoretical_on_hand": 1,
      "item_cost": 1000
    }));
    const msgContent = {
      "data": {store_key: 'store_test', onHands: items},
      "type": "RECIPE_ON_HAND_BY_STORE",
      "action": "create",
      "namespace": NAMESPACE,
      "timestamp": ts
    };

    return msgContent;
  });
}

function exe() {
  const data = buildData();

  const sendMsg = (id) => {
    if (id >= data.length) {
      return;
    }
    console.log(`Send msg ${id + 1}/${data.length}`);
    axios({
      url: PUBLISH_MESSAGE_API,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `ID_TOKEN=${TOKEN}`
      },
      data: data[id],
      httpsAgent: new https.Agent({ rejectUnauthorized: false })
    })
    .then(response => {
      sendMsg(id + 1);
    })
    .catch(error => {
      console.log('ERR:', error);
      sendMsg(id + 1);
    })
  };
  sendMsg(0);
};

exe();
