/**
 * HTTPS Server file: handle routing, configuration and http/websocket server related tasks
 */

var http = require('http'),
    Uploader = require('./Uploader.js'),
    Parser = require('./Parser.js'),
    Validator = require('./Validator.js'),
    Submitter = require('./Submitter.js'),
    url = require('url'),
    swig = require('swig'),
    busboy = require('busboy'),
    qs = require('querystring'),
    conf = require('../conf.js'),
    fs = require('fs');
    path = require('path');


function JusApp()
{
    swig.setDefaults({ loader: swig.loaders.fs(__dirname + '/../templates' )});

    this.records = 0;
    this.completed = 0;
    this.errors = 0;
    this.parse_completed = false;

    this.filename = '';
    this.invalid_recs = [];

    this.validator = new Validator.RecordValidator(conf);
    this.submitter = new Submitter('sqlite', { 'filename': 'test.db'}, 'Antibiogram', conf);

    this.upload_folder = 'app/uploads';
}

/**
 * create a unique filename for the uploaded file.
 * @param old_name {string} the original file name
 */
JusApp.prototype.append_name = function(old_name)
{
    return new Date().getTime() + '_' + old_name;
}

JusApp.prototype.validate = function(file, sheet)
{
    this.validator.on('valid', this.validation_success_callback.bind(this) );
    this.validator.on('invalid', this.validation_fail_callback.bind(this) );

    var parser = new Parser('delimited');

    parser.on('record', this.parse_to_validate.bind(this));
    parser.on('complete_d', this.validate_parser_complete.bind(this));

    this.filename = file;
    this.sheet = sheet;
    parser.parse(this.upload_folder + '/' + file);

    this.write_header(false, 'Some records did not pass validation, please correct them and resubmit');
};

JusApp.prototype.validate_parser_complete = function()
{
    this.parse_completed = true;
    this.check_and_finish();
}

JusApp.prototype.validation_success_callback = function(result)
{
    this.completed ++;
    this.submitter.submit(result, this.record_saved.bind(this));
    this.check_and_finish();
};

JusApp.prototype.validation_fail_callback = function(result)
{
    this.completed ++;

    this.invalid_recs.push(result);

    if(! this.row_tpl ) this.row_tpl = swig.compileFile('validation_row.html');

    this.response.write(this.row_tpl({ record: result, row: this.errors++, result : 'invalid', sheet: this.sheet, filename : this.filename }));

    this.check_and_finish();
};

JusApp.prototype.check_and_finish = function()
{
    if( this.parse_completed && (this.records == this.completed) )
    {
        this.write_invalid_records(this.invalid_recs);
        this.finish();
    }
}


JusApp.prototype.parse_to_validate = function(record)
{
    this.records ++;
    this.validator.validate(record.data);
};

JusApp.prototype.complete_handler = function(evt)
{
    this.resp_obj.files.push(evt);

    ///this.files_to_process.splice(this.files_to_process.indexOf(evt.name));

    // wait until all the files have been processed.
    if(this.files_to_process.length == this.resp_obj.files.length)
    {
        //console.dir(this.resp_obj.files[0].data);

        if( this.resp_obj.files.length == 1 && this.resp_obj.files[0].data.sheets.length == 1 )
        {
            //submit the sheet immediately
            this.validate(this.resp_obj.files[0].name, this.resp_obj.files[0].data.sheets[0].name);
        }
        else
        {
            var html = swig.renderFile('sheet_preview.html', this.resp_obj );
            this.response.write(html);
            this.response.end();
        }
    }
}

/**
 * Called for each
 */
JusApp.prototype.fileHandler = function(fieldName, file, filename, encoding, mimetype)
{
    filename = this.append_name(filename);

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

JusApp.prototype.proccess_submission = function()
{
    var post_data = qs.parse(this.request_body);

    this.filename =  post_data.filename;
    this.sheet = post_data.sheet;

    this.validator.on('valid', this.submit_data_single.bind(this));
    this.validator.on('invalid', this.single_validation_fail_callback.bind(this) );

    this.validator.validate(post_data);
}

JusApp.prototype.submit_data = function(data)
{
    this.submitter.submit(data, this.record_saved.bind(this));
};

JusApp.prototype.submit_data_single = function(data)
{
    this.submitter.submit(data, this.single_record_saved.bind(this));
};

JusApp.prototype.on_body_data = function(data)
{
    this.request_body += data;
}

/**
 *  Handler for save records in the initial upload phase
 */
JusApp.prototype.record_saved = function(evt)
{

}

JusApp.prototype.single_validation_fail_callback = function(evt)
{
    var message = 'The record could not be saved, please try again';

    //load JSON file
    var recs = this.get_invalid_records();

    recs[0] = evt;

    this.write_invalid_records(recs);

    this.write_header(false, message);
    this.write_recs(recs);
    this.finish();
}

/**
 *  Handler for save records submitted by POST
 */
JusApp.prototype.single_record_saved = function(evt)
{
    var message = 'Record saved Successfully';

    //load JSON file
    var recs = this.get_invalid_records();

    recs.splice(Number(evt.row),1);

    // replace the JSON in the file
    this.write_invalid_records(recs);

    this.write_header(true, message);
    this.write_recs(recs);
    this.finish();
};

JusApp.prototype.write_header = function(success, message)
{
    this.response.write(swig.renderFile('validation_header.html', { fields : Object.keys(this.validator.validators), success : success, message: message }));
};

JusApp.prototype.finish = function()
{
    this.response.write(swig.renderFile('validation_footer.html', {}));
    this.response.end();
};

JusApp.prototype.write_recs = function(records)
{
    if(! this.row_tpl ) this.row_tpl = swig.compileFile('validation_row.html');

    for( var i = 0; i < records.length; i++ )
    {
        this.response.write(this.row_tpl({ record: records[i], row: i, result : 'invalid', sheet: this.sheet, filename : this.filename }));
    }
};

JusApp.prototype.get_invalid_records = function()
{

    var filename = this.filename + '_' + this.sheet,
        fn = path.resolve(this.upload_folder + '/' + filename + '.invalid.json');

    return JSON.parse(fs.readFileSync(fn));
};

JusApp.prototype.write_invalid_records = function(records)
{
    var filename = this.filename + '_' + this.sheet,
        fn = path.resolve(this.upload_folder + '/' + filename + '.invalid.json');

    fs.writeFile(fn, JSON.stringify(records), function(evt){

    });
};


/**
 * Send the requrest to the right handler
 */
JusApp.prototype.router = function(request, response)
{
    var req_url = url.parse(request.url, true);
    this.resp_obj = { files : [] };
    this.response = response;
    this.files_to_process = [];
    this.filename = '';

    if( req_url.pathname == '/uploader/upload' && request.method == 'POST' )
    {
        var bb = new busboy({ headers : request.headers });

        bb.on('file', this.fileHandler.bind(this));
        bb.on('finish', function(){
            if( !this.files_to_process.length )
            {
                this.response.end('no files');
            }
        }.bind(this));
        request.pipe(bb);
    }
    else if( req_url.pathname == '/uploader/validate' )
    {
        this.validate(req_url.query.file, req_url.query.sheet);
    }
    else if( req_url.pathname == '/uploader/submit' )
    {
        this.request_body = '';
        request.on('data', this.on_body_data.bind(this));
        request.on('end', this.proccess_submission.bind(this));
    }
    else
    {
        this.response.end('404')
    }
}

var app = http.createServer(function(request, response){
    var j_app = new JusApp();
    j_app.router(request, response);
});

module.exports = app;
