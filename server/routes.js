const express = require('express');
const router = express.Router();

const nodeService = require('./node.service');

router.get('/node', (req, res) => {
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

module.exports = router;