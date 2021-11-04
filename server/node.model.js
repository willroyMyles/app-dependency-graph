const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nodeSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name : String,
    x : Number,
    y : Number,
    type : {value: String},
    ipAddresses: [{name : String, ipAddress : String, hostName : String}],
    connections: [{type : String}]
  },
  {
    collection: 'nodes',
    read: 'nearest'
  }
);

const Node = mongoose.model('Node', nodeSchema);

module.exports = Node;