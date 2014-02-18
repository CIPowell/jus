/**
 * HTTPS Server file: handle routing, configuration and http/websocket server related tasks
 */

var express = require('express'),
    JusServer = require('./Uploader.js'),
    app = express(),
    swig = require('swig');

app.engine('html', swig.renderFile);

app.set('view engine', 'html');
app.set('views', __dirname + '/../templates');

app.use(express.bodyParser({uploadDir:'/tmp'}));

app.post('/upload', function(request, response){
    var uploader = new JusServer.Uploader();

    uploader.on('complete', function(evt){
        response.render('sheet_preview.html', evt);
    });


    uploader.upload(request, response);
});

app.get('/get_rows/:file' , function(request, response){
    //TODO : return rows from a spreadsheet
});

app.listen(9000);
