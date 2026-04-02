const mongoose = require('mongoose');
const MyConstants = require('./MyConstants');

const uri = 'mongodb://nam123191:anhee8363@ac-h4tjdlv-shard-00-00.c9ktgvu.mongodb.net:27017,ac-h4tjdlv-shard-00-01.c9ktgvu.mongodb.net:27017,ac-h4tjdlv-shard-00-02.c9ktgvu.mongodb.net:27017/?ssl=true&replicaSet=atlas-m0nd89-shard-0&authSource=admin&appName=test'

mongoose
  .connect(uri)
  .then(() => {
    console.log(
      'Connected to ' +
        MyConstants.DB_SERVER +
        '/' +
        MyConstants.DB_DATABASE
    );
  })
  .catch((err) => {
    console.error(err);
  });
