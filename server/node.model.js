const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const nodeSchema = new Schema(
  {
    id: { type: String, required: true, unique: true },
    name : String,
    x : Number,
    y : Number,
    type : String,
    ipAddresses: [{name : String, ipAddress : String, hostName : String}],
    connections: [{type : String}]
  },
  {
    collection: 'todoes',
    read: 'nearest'
  }
);

const Node = mongoose.model('Node', todoSchema);

module.exports = Node;