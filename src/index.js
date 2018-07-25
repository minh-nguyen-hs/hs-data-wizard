const { readdirSync } = require('fs');
const axios = require('axios');
const { flatten } = require('lodash');
const { parallel } = require('async');
const { NAMESPACE, SUPER_API, TOKEN, DATA_FOLDER } = require('./constants');

function exe() {
  const dataFiles = flatten(readdirSync(`./data/${DATA_FOLDER}`).filter((fileName) => {
    return fileName;
  }));

  parallel(dataFiles.map((fileName) => {
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
            type: fileName.substring(0, fileName.lastIndexOf('.')),
            reqData: require(`../data/${DATA_FOLDER}/${fileName}`)
          }],
          isCallbackFunc: false
        }
      }).then(response => callback(null, response))
        .catch(error => callback(null, error))
    }
  }), () => {
    console.log('DONE!');
  });
};

exe();
