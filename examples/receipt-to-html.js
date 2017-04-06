"use strict";

var fs = require('fs');
var path = require('path');
var PDF = require('pdfkit');
var PromiseA = require('bluebird');
var iconv = require('iconv-lite');
var cheerio = require('cheerio')

var npos = require('../');

//TODO - Try different escpos binary - see bellow commented lines
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'receipt.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_LF_ESCdn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESC!n_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCEn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCGn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCMn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCan_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_ESCrn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_GSBn_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_GSL_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_GSk_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'escposbin_GS!n_commands.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_lucky.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_restaurant1.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_shell.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_target.bin'));

//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_lucky_bitimage.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_restaurant1.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_shell.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'sample_target_bitimage.bin'));


var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'demo_sample_lucky.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'demo_sample_restaurant1.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'demo_sample_shell.bin'));
//var raw = fs.readFileSync(path.join(__dirname, 'fixtures', 'demo_sample_target.bin'));

var parser = npos.parser();

//TODO - Change between pdf and html
//var formating = npos.formating("PDF"); //pdf
var formating = npos.formating(); //html


//TODO - need to better understand bellow commands
/*
 **********************************************************************
 NOT IMPLEMENTING ESCPOS commands - need to better understand these commands
 **********************************************************************
 ESCPOS command: ESC e n - Print and reverse feed n lines - need to better understand this command
 ESCPOS command: ESC t n - Select character code table (not able to get n and the data length)
 ESCPOS command:
 ESCPOS command:
 */

/*
**********************************************************************
NOT IMPLEMENTING ESCPOS commands that do not have rendering/formatting
**********************************************************************
ESCPOS command: ESC @ - Initialize printer
ESCPOS command: ESC c 3 n - Select paper sensor(s) to output paper-end signal
ESCPOS command: ESC p m t1 t2 - Generate pulse
ESCPOS command: GS V m and GS V m n - Select cut mode and cut paper
ESCPOS command:
ESCPOS command:
*/
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
      case 'printcolor':
        formating.setColor(entry.data);
        break;
      case 'reversecolor':
        formating.setReverseColor(entry.data);
        break;
      case 'leftmargin':
        formating.setLeftmargin(entry.data);
        break;
      case 'barcodeheight':
        formating.setBarcodeheight(entry.data);
        break;
      case 'barcodewidth':
        formating.setBarcodewidth(entry.data);
        break;
      case 'barcodetextposition':
        formating.setBarcodetextposition(entry.data);
        break;
      case 'barcode':
        formating.setBarcodetype(entry.data.barcodeValue);
        formating.setBarcodetext(decode(entry.data.barcodeTextBuffer));
        formating.addBarcode();
        break;
      case 'textsize':
        formating.setTextSize(entry.data.textSizeWidth, entry.data.textSizeHeight);
        break;
      case 'raster':
        return formating.addImage(entry.data);
      // TODO render more esc pos command
      default:
        console.log('[pdf]', 'Unknown entry type:', entry.type);
        break;
    }
  });
}).then(function () {

  //formating.finish();
  //doc.end();
})
  .finally(function () {
  formating.finish();
  //doc.end();
});

//TODO Updated the iconv decode to be 'latin1'. This should be set by parsing the binary as different decoded needs to be used depending on the printer binary.
function decode(data) {

  var encode = "latin1";

  return iconv.decode(data, encode);
}
