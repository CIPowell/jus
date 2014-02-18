/**
 * HTTPS Server file: handle routing, configuration and http/websocket server related tasks
 */

var express = require('express'),
    JusServer = require('./JusServer.js'),
    app = express();



app.use(express.bodyParser({uploadDir:'/tmp'}));

app.post('/upload', function(request, response){
    var uploader = new JusServer.Uploader();

    uploader.on('complete', function(evt){
        if(evt.success)
        {
            response.send('done');
        }
        else
        {
            response.send(event.error);
        }
    });

    uploader.upload_file(request, response);

});

app.listen(9000);
