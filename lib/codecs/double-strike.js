"use strict";

var _ = require('lodash');

exports.name = 'double-strike';
exports.commands = ['ESCG'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);
  const value = raw[node.offset + 2];
  return value === 1;
};
