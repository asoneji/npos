"use strict";

var _ = require('lodash');

exports.name = 'textsize';
exports.commands = ['GS!'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);
  const value = raw[node.offset + 2];

  var quotient = Math.floor(value/16) + 1;
  var remainder = (value % 16) + 1;

  return {textSizeWidth:quotient, textSizeHeight:remainder};
};
