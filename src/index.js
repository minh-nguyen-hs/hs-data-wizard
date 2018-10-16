const { readdirSync } = require('fs');
const path = require('path');
const axios = require('axios');
const { flatten, includes } = require('lodash');
const { parallel } = require('async');
const https = require('https');
const { NAMESPACE, SUPER_API, TOKEN, DATA_FOLDER, USE_DATA_GENERATOR } = require('./constants');
const dataGenerators = require('./dataGenerators');

function exe() {
  const skippedFiles = [
    // 'ProductionItemThawSetup.json',
    // 'ProductionRecipePreparationSetup.json'
  ];

  const dataFiles = flatten(readdirSync(`./data/${DATA_FOLDER}`).filter((fileName) => {
    return fileName;
  })).filter(fileName => !includes(skippedFiles, fileName));

  parallel(dataFiles.map((fileName) => {
    const keyName = path.parse(fileName).name;
    const data = USE_DATA_GENERATOR && dataGenerators[keyName]
      ? dataGenerators[keyName]
      : require(`../data/${DATA_FOLDER}/${fileName}`);

    console.log('Generate: ', fileName, ' - ', data.length);

    return (callback) => {
      axios({
        url: SUPER_API,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cookie': `ID_TOKEN=${TOKEN}`
        },
        data: {
          service: "debugService",
          funcName: "seedData",
          args: [{
            namespace: NAMESPACE,
            type: keyName,
            reqData: data
          }],
          isCallbackFunc: false
        },
        httpsAgent: new https.Agent({ rejectUnauthorized: false })
      }).then(response => callback(null, response))
        .catch(error => callback(error))
    }
  }), (err) => {
    if (err) {
      console.log('ERROR: ', err)
    } else {
      console.log('DONE!');
    }
  });
};

exe();
