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

Parser.prototype.parse = function(filename)
{
    this.parser.on('completed_p', this.completed_callback.bind(this));
    this.parser.on('error', this.error_callback);

    this.filename = filename;

    this.parser.open(filename);
};

Parser.prototype.parse_stream = function(filename, stream, max_rows)
{

    this.parser.on('completed_p', this.completed_callback.bind(this));
    //this.parser.on('error', this.error_callback);

    this.filename = filename;

    this.parser.read_stream(filename, stream, max_rows);
};

Parser.prototype.completed_callback = function(evt)
{
    this.emit("complete_d", {name: this.filename, data : evt});
};

Parser.prototype.error_callback = function(evt)
{
    this.emit("error", evt);
};

Parser.prototype.get_sheets = function()
{
    return this.parser.get_sheets();
};

Parser.prototype.get_rows = function (sheet, n)
{
    return this.parser.get_rows(sheet, n);
};

module.exports = Parser;
