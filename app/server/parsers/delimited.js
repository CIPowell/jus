var csv = require('csv'),
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

Parser.prototype.open = function (filename)
{
    var reader = csv().from.path(filename,{ delimiter : ',', escape : '"' });

    reader.on('record', this.line_callback.bind(this));
    reader.on('end', this.open_callback.bind(this));
}

Parser.prototype.read_stream = function (stream)
{
    var reader = csv().from.stream(stream,{ delimiter : ',', escape : '"' });

    reader.on('record', this.line_callback.bind(this));
    reader.on('end', this.open_callback.bind(this));
}

Parser.prototype.line_callback = function(data, idx)
{
    if(this.data.length == 0) this.data[0] = [];
    if(this.headers.length == 0)
    {
        this.headers = data;
    }
    else
    {
        this.data[idx] = {} ;
        for( var i = 0; i < data.length; i++ )
        {
            if( i < this.headers.length )
            {
                this.data[idx][this.headers[i]] = data[i];
            }
            else
            {
                this.data[idx][i] = data[i];
            }
        }
    }

    this.emit('record', { n: idx, data: this.data[idx] });
}

Parser.prototype.open_callback = function(data)
{
    this.emit('completed', {})
}


Parser.prototype.get_sheets = function ()
{
    return ["Flatfile"];
}

Parser.prototype.get_rows = function(sheet, n)
{
    if(n == undefined)
    {
        return this.data;
    }

    return this.data.slice(0, n);
}

module.exports = { Parser : Parser };
