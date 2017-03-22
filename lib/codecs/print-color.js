"use strict";

var _ = require('lodash');

exports.name = 'printcolor';
exports.commands = ['ESCr'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);
  const value = raw[node.offset + 2];
  if (value === 0 || value === 48) {
    return 1;
  }
  if (value === 1 || value === 49) {
    return 2;
  }
  return 1;
};
