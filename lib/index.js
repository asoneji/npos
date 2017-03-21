'use strict';

exports.Graphic = exports.graphic = require('./graphic');

exports.USB = require('./connectors/usb');
exports.Console = require('./connectors/console');

exports.Printer = exports.printer = require('./printer');
exports.Parser = exports.parser = require('./parser');
exports.Formating = exports.formating = require('./create-doc/formating');

exports.symbols = require('./parser/symbols');
exports.rules = require('./parser/rules');

exports.codecs = require('./codecs');
exports.commands = require('./commands');

exports.textualize = require('./textualize');
exports.textualizer = function (options) {
  return function (ast) {
    return exports.textualize(ast, options);
  }
};
