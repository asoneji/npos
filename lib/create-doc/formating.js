var fs = require('fs')
var PDF = require('pdfkit');
var cheerio = require('cheerio')
//const JsBarcode = require('jsbarcode');

var PromiseA = require('bluebird');
var Jimp = require('jimp');

const Canvas = require("canvas");

//TODO - Check if the __dirname is ok or should the path be different
htmldoc = fs.readFileSync(__dirname + '/template.html', 'utf8');
styles = fs.readFileSync(__dirname + '/styles.css', 'utf8');
jsbarcode = fs.readFileSync(__dirname + '/JsBarcode.all.js', 'utf8');
$ = cheerio.load(htmldoc);


//TODO - Update the size and margin for actual thermal printer (need to make the height dynamic)
pdfdoc = new PDF({
  margin: 20,
  size: [500, 500]
});
// pipe to pdf file
//TODO - Check if the __dirname is ok or should the path be different
pdfdoc.pipe(fs.createWriteStream(__dirname + '/../../examples/output/receipt.pdf'));


//http://book.mixu.net/node/ch6.html
function Formating(docTypeValue = this.DOC_TYPE_HTML) {
  if (!(this instanceof Formating)) {
    return new Formating(docTypeValue);
  }

  // always initialize all instance properties

  switch(docTypeValue) {
    case this.DOC_TYPE_HTML:
      this.docType = docTypeValue;
      break;
    case this.DOC_TYPE_PDF:

      //this.pdfdoc = new PDF();
      // pipe to pdf file
      //TODO - Check if the __dirname is ok or should the path be different
      //this.pdfdoc.pipe(fs.createWriteStream(__dirname + '/../../examples/output/receipt.pdf'));


      this.docType = docTypeValue;
      break;
    default:
      this.docType = this.DOC_TYPE_HTML;
  }

  this.resetDefaultSettings();
}

Formating.prototype.resetDefaultSettings = function() {

  this.bold = false;
  this.underline = false;
  this.font = this.FONT_A_TYPE;
  this.doubleHeight = false;
  this.doubleWidth = false;
  this.doubleStrike = false;
  this.justification = this.JUSTIFY_LEFT_VALUE;
  this.color = this.COLOR_1_VALUE;
  this.reverseColor = false;
  this.leftmargin;
  this.barcodeheight = 100;
  this.barcodewidth = 2;

  //this.barcodeheight = 8;
  //this.barcodewidth = 3;
  this.barcodeposition = this.BARCOD_POSITION_0_TYPE;
  this.barcodetype;
  this.barcodetext;
};



// class methods
Formating.prototype.getBold = function() {
  return this.bold;
};

Formating.prototype.setBold = function(setBoldValue) {
  this.bold = Boolean(setBoldValue);
};

Formating.prototype.setUnderline = function(setUnderlineValue) {
  this.underline = Boolean(setUnderlineValue);
};

Formating.prototype.getUnderline = function() {
  return this.underline;
};

Formating.prototype.setDoubleHeight = function(setDoubleHeightValue) {
  this.doubleHeight = Boolean(setDoubleHeightValue);
};

Formating.prototype.getDoubleHeight = function() {
  return this.doubleHeight;
};

Formating.prototype.setDoubleWidth = function(setDoubleWidthValue) {
  this.doubleWidth = Boolean(setDoubleWidthValue);
};

Formating.prototype.getDoubleWidth = function() {
  return this.doubleWidth;
};

Formating.prototype.setDoubleStrike = function(setDoubleStrikeValue) {
  this.doubleStrike = Boolean(setDoubleStrikeValue);
};

Formating.prototype.getDoubleStrike = function() {
  return this.doubleStrike;
};



Formating.prototype.getFont = function() {
  return this.font;
};

Formating.prototype.setFont = function(setFontValue) {

  switch(setFontValue) {
    case this.FONT_A:
      this.font = this.FONT_A_TYPE;
      break;
    case this.FONT_B:
      this.font = this.FONT_B_TYPE;
      break;
    case this.FONT_C:
      this.font = this.FONT_C_TYPE;
      break;
    default:
      this.font = this.FONT_A_TYPE;
  }

};

Formating.prototype.setPrintmode = function(setPrintmodeValue) {

  //TODO - Check if should handel the mode type here or in the codec file
  //TODO - implement page mode formatting actions

  //now we can set the page mode and not have other settings (this is how thermal printer page mode works)
  this.resetDefaultSettings();

  switch(setPrintmodeValue) {

    case this.MODE_FONT_A:
      this.setFont(this.FONT_A);
      break;
    case this.MODE_FONT_B:
      this.setFont(this.FONT_B);
      break;
    case this.MODE_EMPHASIZED:
      this.setBold(true);
      break;
    case this.MODE_DOUBLE_HEIGHT:
      this.setDoubleHeight(true);
      break;
    case this.MODE_DOUBLE_WIDTH:
      this.setDoubleWidth(true);
      break;
    case this.MODE_UNDERLINE:
      this.setUnderline(true);
      break;
    default:
      this.setFont(this.FONT_A);
  }

};

Formating.prototype.getFormatingList = function() {

  var formatingList = "";

  var myFont = this.getFont();

  if(this.getBold())
  {
    formatingList += "bold "
  }

  if(this.getUnderline())
  {
    formatingList += "underline "
  }

  if(this.getDoubleHeight())
  {
    formatingList += "doubleheight "
  }

  if(this.getDoubleWidth())
  {
    formatingList += "doublewidth "
  }

  if(this.getDoubleStrike())
  {
    formatingList += "doublestrike "
  }

  if(this.getReverseColor())
  {
    formatingList += "reversecolor "
  }

  //TODO - add the style to css class using cheerio
  /*
  if(this.getLeftmargin())
  {
    formatingList += "leftmargin "
  }*/

  formatingList += "font_" + this.font.toLowerCase().replace(" ", "_") + " ";

  formatingList += "justification_" + this.justification.toLowerCase() + " ";

  formatingList += "color_" + this.color.toLowerCase() + " ";

  return formatingList;
};

Formating.prototype.appendPrintLinefeed = function(linefeedCountValue) {

  if(this.docType === this.DOC_TYPE_PDF) {
      for(var i = 0; i < linefeedCountValue; i++)
      {
        pdfdoc.text("\n");
      }
  }
  else {
          for(var i = 0; i < linefeedCountValue; i++)
          {
            $('<br>').appendTo($( ".receipt" ));
          }
  }
}

Formating.prototype.getJustification = function() {
  return this.justification;
};

Formating.prototype.setJustification = function(setJustificationValue) {

  switch(setJustificationValue) {
    case this.JUSTIFY_LEFT:
      this.justification = this.JUSTIFY_LEFT_VALUE;
      break;
    case this.JUSTIFY_CENTER:
      this.justification = this.JUSTIFY_CENTER_VALUE;
      break;
    case this.JUSTIFY_RIGHT:
      this.justification = this.JUSTIFY_RIGHT_VALUE;
      break;
    default:
      this.justification = this.JUSTIFY_LEFT_VALUE;
  }

};


Formating.prototype.getColor = function() {
  return this.color;
};

Formating.prototype.setColor = function(setColorValue) {

  switch(setColorValue) {
    case this.COLOR_1:
      this.color = this.COLOR_1_VALUE;
      break;
    case this.COLOR_2:
      this.color = this.COLOR_2_VALUE;
      break;
    default:
      this.color = this.COLOR_1_VALUE;
  }

};

Formating.prototype.getReverseColor = function() {
  return this.reverseColor;
};

Formating.prototype.setReverseColor = function(setReverseColorValue) {
  this.reverseColor = Boolean(setReverseColorValue);
};

Formating.prototype.getLeftmargin = function() {
  return this.leftmargin;
};

Formating.prototype.setLeftmargin = function(setLeftmarginValue) {
  this.leftmargin = setLeftmarginValue;
};

Formating.prototype.getBarcodeheight = function() {
  return this.barcodeheight;
};

Formating.prototype.setBarcodeheight = function(setBarcodeheightValue) {
  this.barcodeheight = setBarcodeheightValue;
};

Formating.prototype.getBarcodewidth = function() {
  return this.barcodewidth;
};

Formating.prototype.setBarcodewidth = function(setBarcodewidthValue) {
  this.barcodewidth = setBarcodewidthValue;
};

Formating.prototype.getBarcodetextposition = function() {
  return this.barcodeposition;
};

Formating.prototype.setBarcodetextposition = function(setBarcodepositionValue) {

  switch(setBarcodepositionValue) {
    case this.BARCOD_POSITION_0:
      this.barcodeposition = this.BARCOD_POSITION_0_TYPE;
      break;
    case this.BARCOD_POSITION_1:
      this.barcodeposition = this.BARCOD_POSITION_1_TYPE;
      break;
    case this.BARCOD_POSITION_2:
      this.barcodeposition = this.BARCOD_POSITION_2_TYPE;
      break;
    case this.BARCOD_POSITION_3:
      this.barcodeposition = this.BARCOD_POSITION_3_TYPE;
      break;
    default:
      this.barcodeposition = this.BARCOD_POSITION_0_TYPE;
  }
};


Formating.prototype.setBarcodetype = function(setBarcodetypeValue) {

  switch (setBarcodetypeValue) {
    case 69:
      this.barcodetype = this.BARCODE_TYPE_CODE39;
      break;
    case 67:
      this.barcodetype = this.BARCODE_TYPE_EAN13;
      break;
    case 65:
      this.barcodetype = this.BARCODE_TYPE_UPC;
      break;
    case 66:
      this.barcodetype = this.BARCODE_TYPE_UPC;
      break;
    case 68:
      this.barcodetype = this.BARCODE_TYPE_EAN8;
      break;
    case 70:
      this.barcodetype = this.BARCODE_TYPE_ITF;
      break;
    case 71:
      this.barcodetype = this.BARCODE_TYPE_CODABAR;
      break;
    case 72:
      this.barcodetype = this.BARCODE_TYPE_CODE93;
      break;
    case 73:
      this.barcodetype = this.BARCODE_TYPE_CODE128;
      break;
    default:
      this.barcodetype = undefined;
  }
  ;
}

Formating.prototype.getBarcodetype = function() {
  return this.barcodetype;
};
Formating.prototype.setBarcodetext = function(setBarcodetextValue) {
  this.barcodetext = setBarcodetextValue;
};

Formating.prototype.getBarcodetext = function() {
  return this.barcodetext;
};


Formating.prototype.addBarcode = function() {

  //TODO - add this feature for PDF rendering
  //TODO - look at using JsBarcode node package instead using svg directly
  var formatingList = this.getFormatingList();
  if(this.getBarcodetextposition() == this.BARCOD_POSITION_0_TYPE)
  {
    var barcodeTemp = '<svg class=\"barcode\" jsbarcode-format=' +  this.getBarcodetype() + ' jsbarcode-value=' + this.getBarcodetext() + ' jsbarcode-textposition=' + this.getBarcodetextposition()
      + ' jsbarcode-width=' + this.getBarcodewidth()  + ' jsbarcode-height=' + this.getBarcodeheight() + ' jsbarcode-displayvalue=false'  + ' > </svg>';
  }
  else{
    var barcodeTemp = '<svg class=\"barcode\" jsbarcode-format=' +  this.getBarcodetype() + ' jsbarcode-value=' + this.getBarcodetext() + ' jsbarcode-textposition=' + this.getBarcodetextposition()
      + ' jsbarcode-width=' + this.getBarcodewidth()  + ' jsbarcode-height=' + this.getBarcodeheight()  + ' > </svg>';
  }
  $('<div>' + barcodeTemp + '</div>').addClass(formatingList).appendTo($( ".receipt" ));
};

Formating.prototype.addImage = function(imageValue) {
  var formatingList = this.getFormatingList();

  var imageID = "image_" + + new Date();

  $('<div><img src='+'></img></div>').attr("id", imageID).addClass(formatingList).appendTo($( ".receipt" ));

  return PromiseA.fromCallback(function (cb) {
    Jimp.read(imageValue.toBuffer(), cb);
  }).then(function (image) {
    return PromiseA.fromCallback(function (cb) {
      image.getBase64(Jimp.MIME_PNG, cb)
    });
  }).then(function (buffer) {
    $('#'+imageID+" img").attr("src", buffer);
  });
};

Formating.prototype.addText = function(textValue) {

  //TODO - all the fonts not available for PDF so change the font or add the bold font
  if(this.docType === this.DOC_TYPE_PDF) {

    if(this.bold && this.font.indexOf("-Bold") === -1)
    {
      this.font = this.font + "-Bold"
    }
    else if(!this.bold && this.font.indexOf("-Bold") > 0)
    {
      this.font = this.font.replace("-Bold", "");
    }
    //TODO - need to add underline, double height, double width, doublestrike, justification, color, leftmargin, barcode, image formatting to pdf
    pdfdoc.font(this.font);
    pdfdoc.text(textValue);
  }
  else {
    var formatingList = this.getFormatingList();
    //TODO - maybe replace with https://www.npmjs.com/package/html-entities
    textValue = textValue.replace(/ /g, "&nbsp;");
    textValue = textValue.split("\n").join("<br />");

    if(this.getLeftmargin())
    {
      //This calculation works for my printer EPSON TM-T20II maybe different for other pritners
      var percent = this.getLeftmargin() * (21/100);
      //TODO - add the style to css class using cheerio
      $('<div style=\"margin-left:'+ percent +'mm\">'+ textValue + '</div>').addClass(formatingList).appendTo($( ".receipt" ));
    }
    else
    {
      $('<div>'+ textValue + '</div>').addClass(formatingList).appendTo($( ".receipt" ));
    }

  }

};


Formating.prototype.finish = function() {

  if(this.docType === this.DOC_TYPE_PDF)
  {
    pdfdoc.end();
  }
  else
  {
    //TODO - Check if the __dirname is ok or should the path be different
    fs.writeFile(__dirname + "/../../examples/output/JsBarcode.all.js", jsbarcode, function(err) {
      if(err) {
        return console.log(err);
      }
    });

    fs.writeFile(__dirname + "/../../examples/output/styles.css", styles, function(err) {
      if(err) {
        return console.log(err);
      }
    });
    //TODO - Check if the __dirname is ok or should the path be different
    fs.writeFile(__dirname + "/../../examples/output/receipt.html", $.html(), function(err) {
      if(err) {
        return console.log(err);
      }
    });

  }

};


//TODO - Check constant declaration
/**
 * Use Font A, when used with Printer::selectPrintMode
 */
Formating.prototype.MODE_FONT_A = 0;
//const MODE_FONT_A = 0;
/**
 * Use Font B, when used with Printer::selectPrintMode
 */
Formating.prototype.MODE_FONT_B = 1;
//const MODE_FONT_B = 1;
/**
 * Use text emphasis, when used with Printer::selectPrintMode
 */
Formating.prototype.MODE_EMPHASIZED = 8;
//const MODE_EMPHASIZED = 8;
/**
 * Use double height text, when used with Printer::selectPrintMode
 */
Formating.prototype.MODE_DOUBLE_HEIGHT = 16;
//const MODE_DOUBLE_HEIGHT = 16;
/**
 * Use double width text, when used with Printer::selectPrintMode
 */
Formating.prototype.MODE_DOUBLE_WIDTH = 32;
//const MODE_DOUBLE_WIDTH = 32;
/**
 * Underline text, when used with Printer::selectPrintMode
 */
Formating.prototype.MODE_UNDERLINE = 128;
//const MODE_UNDERLINE = 128;


Formating.prototype.FONT_A = 0;
Formating.prototype.FONT_B = 1;
Formating.prototype.FONT_C = 2;

//Examples of monospaced fonts include Courier, Courier New, Lucida Console, Monaco, and Consolas. - https://en.wikipedia.org/wiki/Monospaced_font
//Update css if you update bellow
Formating.prototype.FONT_A_TYPE = "Courier";
Formating.prototype.FONT_B_TYPE = "Monaco";
Formating.prototype.FONT_C_TYPE = "Andale Mono";

Formating.prototype.DOC_TYPE_HTML = "HTML";
Formating.prototype.DOC_TYPE_PDF = "PDF";

Formating.prototype.JUSTIFY_LEFT = 0;
Formating.prototype.JUSTIFY_CENTER = 1;
Formating.prototype.JUSTIFY_RIGHT = 2;

Formating.prototype.JUSTIFY_LEFT_VALUE = "JUSTIFY_LEFT";
Formating.prototype.JUSTIFY_CENTER_VALUE = "JUSTIFY_CENTER";
Formating.prototype.JUSTIFY_RIGHT_VALUE = "JUSTIFY_RIGHT";

Formating.prototype.COLOR_1 = 1;
Formating.prototype.COLOR_2 = 2;

Formating.prototype.COLOR_1_VALUE = "BLACK";
Formating.prototype.COLOR_2_VALUE = "RED";

Formating.prototype.BARCOD_POSITION_0 = 0;
Formating.prototype.BARCOD_POSITION_1 = 1;
Formating.prototype.BARCOD_POSITION_2 = 2;
Formating.prototype.BARCOD_POSITION_3 = 3;

Formating.prototype.BARCOD_POSITION_1_TYPE = "top";
Formating.prototype.BARCOD_POSITION_0_TYPE = "none";
Formating.prototype.BARCOD_POSITION_2_TYPE = "bottom";
Formating.prototype.BARCOD_POSITION_3_TYPE = "both"; //TODO not supported by jsbarcode


Formating.prototype.BARCODE_TYPE_CODE39 = "CODE39";
Formating.prototype.BARCODE_TYPE_EAN13 = "EAN13";
Formating.prototype.BARCODE_TYPE_UPC = "UPC";
Formating.prototype.BARCODE_TYPE_EAN8 = "EAN8";
Formating.prototype.BARCODE_TYPE_ITF = "ITF";
Formating.prototype.BARCODE_TYPE_CODABAR = "CODABAR";
Formating.prototype.BARCODE_TYPE_CODE93 = "CODE93";
Formating.prototype.BARCODE_TYPE_CODE128 = "CODE128";

// export the class
module.exports = Formating;
