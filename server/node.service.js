const Node = require('./node.model');
const ReadPreference = require('mongodb').ReadPreference;

require('./mongo').connect();

function getNodes(req, res) {
  const docquery = Node.find({}).read(ReadPreference.NEAREST);
  docquery
    .exec()
    .then(nodes => {
      res.status(200).json(nodes);
      console.log("NODES: " + nodes);
    })
    .catch(error => {
      res.status(500).send(error);
      console.log("ERROR: " + error);
    });
}

function saveNode(req, res) {
  const node = new Node(req.body.node);
  console.log("New node: " + node);
  node.save(error => {
    if (checkServerError(res, error)) return;
    res.status(201).json(node);
    console.log('Node created successfully!');
  });
}

function updateNode(req, res) {
  Node.findOneAndUpdate(
    { id: req.body.node.id },
    { $set: req.body.node },
    { upsert: true, new: true },
    (error, doc) => {
      if (checkServerError(res, error)) return;
      res.status(200).json(doc);
      console.log('Node updated successfully!');
    }
  );
}

function deleteNode(req, res) {
  const id = parseInt(req.params.id, 10);
  Node.findOneAndRemove({ id: id })
    .then(node => {
      if (!checkFound(res, node)) return;
      res.status(200).json(node);
      console.log('Node deleted successfully!');
    })
    .catch(error => {
      if (checkServerError(res, error)) return;
    });
}

function checkServerError(res, error) {
  console.log("Error: " + error);
  if (error) {
    res.status(500).send(error);
    return error;
  }
}

function checkFound(res, node) {
  if (!node) {
    res.status(404).send('Node not found.');
    return;
  }
  return node;
}

module.exports = {
  getNodes,
  saveNode,
  updateNode,
  deleteNode
};