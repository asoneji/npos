"use strict";

var _ = require('lodash');

exports.name = 'barcodeheight';
exports.commands = ['GSh'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);

  return raw[node.offset + 2];
};
