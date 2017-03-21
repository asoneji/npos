"use strict";

var _ = require('lodash');

exports.name = 'printmode';
exports.commands = ['ESC!'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);

  var value = raw[node.offset + 2];
  return value;
};
