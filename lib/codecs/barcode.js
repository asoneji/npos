"use strict";

var _ = require('lodash');
var iconv = require('iconv-lite');

exports.name = 'barcode';
exports.commands = ['GSk'];

exports.decode = function (raw, nodes) {
  if (!Array.isArray(nodes)) {
    nodes = [nodes];
  }

  const node = _.last(nodes);
  const barcodeValue = raw[node.offset + 2];

  //var buffers = [];

  //buffers.push(raw.slice(node.offset+3, node.offset + node.length));

  const barcodeTextBuffer = raw.slice(node.offset+4, node.offset + node.length);
  //const value2 = Buffer.concat(buffers);


  //TODO - currently just decoding the easy barcode - need to follow the document for escpos barcode and update this decoder
  return {barcodeValue:barcodeValue, barcodeTextBuffer:barcodeTextBuffer};
};
