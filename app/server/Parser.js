/**
 * Parse a spreadsheet file and return an list of JSON dictionaries
 * @filename - the name of the file to parse
 * @parser_name - the name of the parse to use
 */
var Parser = function(filename, parser_name, config)
{
    this.parser_class = require(parser_name).Parser(config);


    //TODO : Determine libraries for spreadsheet types (XLS, XLSX, CSV, TSV and Other delimited formats


}

Parser.super_ = events.EventEmitter;

Parser.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Parser,
        enumerable: false
    }
});

Parser.prototype.get_sheets = function()
{
    return this.parser.get_sheets();
}

Parser.prototype.get_rows(sheet, n)
{
    return this.parser.get_rows(sheet, n);
}

module.exports = Parser;
