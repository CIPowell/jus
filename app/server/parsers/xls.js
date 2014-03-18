var excel = require('xlrd-parser'),
    events = require('events'),
    fs = require('fs'),
    path = require('path'),
    conf = require('../../conf.js');

function Parser()
{
    this.data = [];
    this.headers = [];
    this.folder = conf.upload_dir
}

Parser.super_ = events.EventEmitter;
Parser.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Parser,
        enumerable: false
    }
});


Parser.prototype.open = function(filename)
{
    excel.parse(filename, function(err, workbook)
    {
        console.log(err, workbook);
        if( !err)
        {
            this.reader = workbook;

            this.reader.sheets.forEach(this.emitsheet.bind(this));

             this.emit('completed_p', {sheets : this.data});
        }
        else
        {
            this.emit('completed_p', {sheets : []});
        }
    }.bind(this));
}

Parser.prototype.read_stream = function( filename, stream, max_rows)
{
    console.dir(filename);
    var fullpath = path.resolve(this.folder + '/' + filename);

    var write_stream = fs.createWriteStream(fullpath, { flag : 'w+' });
    stream.pipe(write_stream);
    stream.on('end', function(){
        write_stream.close();
        this.open(fullpath);
    }.bind(this));

}

Parser.prototype.emitsheet = function(sheet, index)
{
    var headers = [];
    var row_dicts =  []

    sheet.rows.forEach(function(row, rowidx){
        row_dicts.push({});

        row.forEach(function(cell, cellidx){
            if( rowidx === 0 )
            {
                headers.push(cell.value);
            }
            else
            {
                row_dicts[rowidx][headers[cellidx]] = cell.value;
            }
        });

        this.emit('record', {sheet: sheet.name, n : rowidx, data : row_dicts[rowidx] });
    });

    this.data.push({ name : sheet.name, rows: row_dicts });
    this.emit('sheet', this.data[index]);
}

module.exports = Parser;
