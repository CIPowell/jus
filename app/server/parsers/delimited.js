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
    this.reader = csv().from.path(filename,{ delimiter : ',', escape : '"' });

    this.filename = filename;

    this.reader.on('record', this.line_callback.bind(this));
    this.reader.on('end', this.open_callback.bind(this));
}

Parser.prototype.read_stream = function (filename, stream, max_rows)
{
    this.max_rows = max_rows;

    this.filename = filename;

    this.reader = csv().from.stream(stream, { delimiter : ',', escape : '"' });

    this.reader.on('record', this.line_callback.bind(this));
    this.reader.on('end', this.open_callback.bind(this));
}

/**
 * Callback that fires when each line is parsed
 */
Parser.prototype.line_callback = function(data, ridx)
{
    if(this.data.length == 0) this.data[0] = {};
    if(this.headers.length == 0)
    {
        //Add headers
        this.headers = data;
    }
    else
    {
        idx = ridx - 1 // account for being one row ahead due to headers
        //emit record as a dictionary
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
        this.emit('record', { n: idx, data: this.data[idx] });
    }
}

Parser.prototype.open_callback = function(data)
{
    this.emit('completed_p',  {sheets : [{ name: "flatfile", rows : this.data }]});
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
