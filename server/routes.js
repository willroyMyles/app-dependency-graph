const express = require('express');
// const { mongo } = require('mongoose');
// const mongodb = require('mongodb');
const router = express.Router();

const nodeService = require('./node.service');

router.get('/node', (req, res) => {
  // const nodes = await loadNodesCollection();
  // res.send(nodes.find({}).toArray);
  nodeService.getNodes(req, res);
});

router.get('/node:id', (req, res) => {
    nodeService.getNode(req, res);
  });

router.post('/node', (req, res) => {
  nodeService.saveNode(req, res);
});

router.put('/node/:id', (req, res) => {
  nodeService.updateNode(req, res);
});

router.delete('/node/:id', (req, res) => {
  nodeService.deleteNode(req, res);
});

// async function loadNodesCollection() {
//   const client = await mongodb.MongoClient.connect
//   ('mongodb://harris-mongo-db:FXAwXTuN1lR1CUeWDWgCufPfgoWf7ZZ5X1Ka4yWhs52PThUo6pWYiXPEHMBApQIAGqxrEpjtMphppINr3mNXiw==@harris-mongo-db.mongo.cosmos.azure.com:10255/?ssl=true', {
//     useNewUrlParser: true
//   })
//   return client.db('node-dependency').collection('nodes');
// }

module.exports = router;