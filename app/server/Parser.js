var events = require('events');

/**
 * Parse a spreadsheet file and return an list of JSON dictionaries
 * @param parser_name - the name of the parse to use
 * @param config - additional config parameters for the parser.
 */
function Parser(parser_name, config)
{
    var _Parser = require('./parsers/' + parser_name).Parser;
    this.parser = new _Parser(config);
}

// Inherit the event emitter
Parser.super_ = events.EventEmitter;
Parser.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Parser,
        enumerable: false
    }
});

/**
 *  Parse from a file
 * @param filename - the name of the file to parse
 */
Parser.prototype.parse = function(filename)
{
    this.parser.on('completed_p', this.completed_callback.bind(this));
    this.parser.on('error', this.error_callback);
    this.parser.on('record', this.record_callback);

    this.filename = filename;

    this.parser.open(filename);
};

/**
 * Parse from a stream (e.g. from busboy)
 * @param filename - the original name of the file in the steam
 * @param stream - the readable stream
 */
Parser.prototype.parse_stream = function(filename, stream)
{
    this.parser.on('completed_p', this.completed_callback.bind(this));
    //this.parser.on('error', this.error_callback);

    this.filename = filename;

    this.parser.read_stream(filename, stream);
};

Parser.prototype.completed_callback = function(evt)
{
    this.emit("complete_d", {name: this.filename, data : evt});
};

Parser.prototype.error_callback = function(evt)
{
    this.emit("error", evt);
};

Parser.prototype.record_callback = function(evt)
{
    this.emit("record", evt);
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
