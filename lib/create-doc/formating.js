var fs = require('fs')
var PDF = require('pdfkit');
var cheerio = require('cheerio')

//TODO - Check if the __dirname is ok or should the path different
htmldoc = fs.readFileSync(__dirname + '/template.html', 'utf8');
styles = fs.readFileSync(__dirname + '/styles.css', 'utf8');
$ = cheerio.load(htmldoc);


//TODO - Update the size and margin for actual thermal printer (need to make the height dynamic)
pdfdoc = new PDF({
  margin: 20,
  size: [500, 500]
});
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

  this.resetDefaultSettings();
}

Formating.prototype.resetDefaultSettings = function() {

  this.bold = false;
  this.underline = false;
  this.font = this.FONT_A_TYPE;
  this.doubleHeight = false;
  this.doubleWidth = false;
  this.doubleStrike = false;
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
  formatingList += "font_" + this.font.toLowerCase() + " ";

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
    //TODO - need to add underline, double height, double width, doublestrike formatting to pdf
    pdfdoc.font(this.font);
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
//Update css if you update bellow
Formating.prototype.FONT_A_TYPE = "Courier";
Formating.prototype.FONT_B_TYPE = "Monaco";
Formating.prototype.FONT_C_TYPE = "Consolas";

Formating.prototype.DOC_TYPE_HTML = "HTML";
Formating.prototype.DOC_TYPE_PDF = "PDF";

// export the class
module.exports = Formating;
