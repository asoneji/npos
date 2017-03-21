var fs = require('fs')
var PDF = require('pdfkit');
var cheerio = require('cheerio')

//TODO - Check if the __dirname is ok or should the path different
htmldoc = fs.readFileSync(__dirname + '/template.html', 'utf8');
styles = fs.readFileSync(__dirname + '/styles.css', 'utf8');
$ = cheerio.load(htmldoc);


pdfdoc = new PDF();
// pipe to pdf file
//TODO - Check if the __dirname is ok or should the path different
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
      //TODO - Check if the __dirname is ok or should the path different
      //this.pdfdoc.pipe(fs.createWriteStream(__dirname + '/../../examples/output/receipt.pdf'));


      this.docType = docTypeValue;
      break;
    default:
      this.docType = this.DOC_TYPE_HTML;
  }

  // default values
  this.bold = false;
  this.underline = false;
  this.font = this.FONT_A_TYPE;
}


// class methods
Formating.prototype.getBold = function() {
  return this.bold;
};

Formating.prototype.setBold = function(setBoldValue) {
  this.bold = setBoldValue;
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
  switch(setPrintmodeValue) {

    case this.MODE_FONT_A:
      console.log("!!!!!!!!!!!!!!!!! MODE_FONT_A");
      break;
    case this.MODE_FONT_B:
      console.log("!!!!!!!!!!!!!!!!! MODE_FONT_B");
      break;
    case this.MODE_EMPHASIZED:
      console.log("!!!!!!!!!!!!!!!!! MODE_EMPHASIZED");
      break;
    case this.MODE_DOUBLE_HEIGHT:
      console.log("!!!!!!!!!!!!!!!!! MODE_DOUBLE_HEIGHT");
      break;
    case this.MODE_DOUBLE_WIDTH:
      console.log("!!!!!!!!!!!!!!!!! MODE_DOUBLE_WIDTH");
      break;
    case this.MODE_UNDERLINE:
      console.log("!!!!!!!!!!!!!!!!! MODE_UNDERLINE");
      break;
    default:
      console.log("!!!!!!!!!!!!!!!!! MODE_FONT_A");
  }

  console.log("printe mode is: " + setPrintmodeValue)
};

Formating.prototype.getFormatingList = function() {

  var formatingList = "";

  if(this.getBold())
  {
    formatingList += "bold "
  }

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

    pdfdoc.text(textValue);
  }
  else {
    var formatingList = this.getFormatingList();
    textValue = textValue.split("\n").join("<br />");
    $('<div>'+ textValue + '</div>').addClass(formatingList).appendTo($( ".receipt" ));
  }

};


Formating.prototype.finish = function() {

  if(this.docType === this.DOC_TYPE_PDF)
  {
    pdfdoc.end();
  }
  else
  {
    //TODO - Check if the __dirname is ok or should the path different
    fs.writeFile(__dirname + "/../../examples/output/styles.css", styles, function(err) {
      if(err) {
        return console.log(err);
      }
    });


    //TODO - Check if the __dirname is ok or should the path different
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
Formating.prototype.FONT_A_TYPE = "Courier";
Formating.prototype.FONT_B_TYPE = "Monaco";
Formating.prototype.FONT_C_TYPE = "Consolas";

Formating.prototype.DOC_TYPE_HTML = "HTML";
Formating.prototype.DOC_TYPE_PDF = "PDF";

// export the class
module.exports = Formating;
