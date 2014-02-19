/**
 * HTTPS Server file: handle routing, configuration and http/websocket server related tasks
 */

var http = require('http'),
    JusServer = require('./Uploader.js'),
    Parser = require('./Parser.js'),
    url = require('url'),
    swig = require('swig'),
    busboy = require('busboy');

function parse_callback(evt)
{
    sheets = this.parser.get_sheets();

    this.response.render('sheet_preview.html', { files: { "file_one" :{ name: this.file.name, sheets: sheets } } });
}

function parser_error_callback (err)
{
    this.response.send(err);
}

function uploadCallback(evt)
{
    var files = evt.files;

    var parser = new Parser( 'delimited', {});

    for ( var file in files )
    {
        console.log(file);
        parser.parse(files[file].path, parse_callback.bind({ parser : parser, response:this.response, file: files[file] }), parser_error_callback.bind({ parser : parser,  response:this.response}));
    }
}

function fileHandler(fieldName, file, filename, encoding, mimetype)
{
    if( mimetype == 'text/csv' )
    {
        var parser = new Parser();
        parser.parse_stream(file, 'delimited');
    }
}

function router(request, response)
{
    var req_url = url.parse(request.url);

    if( req_url.pathname == '/upload' )
    {
        if( request.method == 'POST' )
        {
            var bb = new busboy({ headers : request.headers });
            bb.on('file', fileHandler);

        }
    }
}


var app = http.createServer(router);

app.listen(9000);
