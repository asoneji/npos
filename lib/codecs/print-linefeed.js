"use strict";

var _ = require('lodash');

exports.name = 'printlinefeed';
exports.commands = ['ESCd'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);

  return raw[node.offset + 2];
};
