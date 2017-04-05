"use strict";

var _ = require('lodash');
var iconv = require('iconv-lite');

exports.name = 'leftmargin';
exports.commands = ['GSL'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);

  //see here https://github.com/mike42/escpos-php/blob/development/src/Mike42/Escpos/Printer.php - public function setPrintLeftMargin($margin = 0)
  var value1 = raw[node.offset+2];
  var value2 = raw[node.offset+3];


  var value = value1 + (value2 * 256);

  return value;
};
