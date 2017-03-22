"use strict";

var fs = require('fs');
var path = require('path');
var PDF = require('pdfkit');
var PromiseA = require('bluebird');
var iconv = require('iconv-lite');
var cheerio = require('cheerio')

var npos = require('../');

//TODO - Try different escpos binary - see bellow commented lines
var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'receipt.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_LF_ESCdn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESC!n_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCEn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCGn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCMn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCan_commands.bin'));

var parser = npos.parser();

//TODO - Change between pdf and html
//var formating = npos.formating("PDF"); //pdf
var formating = npos.formating(); //html

// parse raw to ast
parser.parse(raw).then(function (ast) {
  return PromiseA.map(ast.entries, function (entry) {
    // entry.type is the codec name
    switch (entry.type) {
      case 'text':
        formating.addText(decode(entry.data));
        break;
      case 'font':
        formating.setFont(entry.data);
        break;
      case 'text-bold':
        formating.setBold(entry.data);
        break;
      case 'printlinefeed':
        formating.appendPrintLinefeed(entry.data);
        break;
      case 'printmode':
        formating.setPrintmode(entry.data);
        break;
      case 'double-strike':
        formating.setDoubleStrike(entry.data);
        break;
      case 'justification':
        formating.setJustification(entry.data);
        break;
      // TODO render more esc pos command
      default:
        console.log('[pdf]', 'Unknown entry type:', entry.type);
        break;
    }
  });
}).finally(function () {
  formating.finish();
  //doc.end();
});

function decode(data) {
  return iconv.decode(data, 'GB18030');
}
