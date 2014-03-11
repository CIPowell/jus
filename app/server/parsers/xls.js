var excel = require('excel-parser'),
    events = require('events');

function Parser()
{
    this.data = [];
    this.headers = [];
}

Parser.super_ = events.EventEmitter;
Parser.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Parser,
        enumerable: false
    }
});


