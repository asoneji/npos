"use strict";

var _ = require('lodash');

exports.name = 'justification';
exports.commands = ['ESCa'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);
  const value = raw[node.offset + 2];
  if (value === 0 || value === 48) {
    return 0;
  }
  if (value === 1 || value === 49) {
    return 1;
  }
  if (value === 2 || value === 50) {
    return 2;
  }
  return 0;
};