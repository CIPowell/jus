/**
 * HTTPS Server file: handle routing, configuration and http/websocket server related tasks
 */

var http = require('http'),
    Uploader = require('./Uploader.js'),
    Parser = require('./Parser.js'),
    url = require('url'),
    swig = require('swig'),
    busboy = require('busboy');

function JusApp()
{
    swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/../templates' )});


    this.complete_handler = function(evt)
    {
        this.resp_obj.files.push(evt);

        this.files_to_process.splice(this.files_to_process.indexOf(evt.name));

        // wait until all the files have been processed.
        if(this.files_to_process.length == 0)
        {
            var html = swig.renderFile('sheet_preview.html', this.resp_obj );
            this.response.write(html);
            this.response.end();
        }
    }

    this.fileHandler = function(fieldName, file, filename, encoding, mimetype)
    {
        this.files_to_process.push(filename);

        if( mimetype == 'text/csv' )
        {
            var uploader = new Uploader();
            var parser = new Parser('delimited');

            uploader.upload(fieldName, file, filename, encoding, mimetype, true);

            parser.on('complete_d', this.complete_handler.bind(this));
            parser.parse_stream(filename, file, 10);

        }
    }

    this.router = function(request, response)
    {
        var req_url = url.parse(request.url);
        this.resp_obj = { files : [] };
        this.response = response;
        this.files_to_process = [];

        if( req_url.pathname == '/uploader/upload' && request.method == 'POST' )
        {
            var bb = new busboy({ headers : request.headers });
            bb.on('file', this.fileHandler.bind(this));
            bb.on('finish', function(){ console.log('finish');  });
            request.pipe(bb);
        }
        else
        {
            this.response.end('hehe')
        }
    }
}


var app = http.createServer(function(request, response){
    var j_app = new JusApp();
    j_app.router(request, response);
});

module.exports = app;
