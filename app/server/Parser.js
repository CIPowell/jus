var events = require('events');

/**
 * Parse a spreadsheet file and return an list of JSON dictionaries
 * @filename - the name of the file to parse
 * @parser_name - the name of the parse to use
 */
function Parser(parser_name, config)
{
    var _Parser = require('./parsers/' + parser_name).Parser;
    this.parser = new _Parser(config);
}

Parser.super_ = events.EventEmitter;

Parser.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Parser,
        enumerable: false
    }
});

Parser.prototype.parse = function(filename, parse_callback, parse_error_callback)
{
    this.parser.on('completed', parse_callback);
    this.parser.on('error', parse_error_callback);

    this.parser.open(filename);
}

Parser.prototype.parse_stream = function(stream, parse_callback, parse_error_callback)
{
    this.parser.on('completed', parse_callback);
    this.parser.on('error', parse_error_callback);

    this.parser.readstream(stream);
}


Parser.prototype.get_sheets = function()
{
    return this.parser.get_sheets();
}

Parser.prototype.get_rows = function (sheet, n)
{
    return this.parser.get_rows(sheet, n);
}

module.exports = Parser;
