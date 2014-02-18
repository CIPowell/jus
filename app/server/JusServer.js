var events = require('events');



function Uploader (upload_dir){

    events.EventEmitter.call(this);

    var path = require('path'),
        fs = require('fs');

    this.directory =  './app/uploads/';
};

Uploader.super_ = events.EventEmitter;
Uploader.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Uploader,
        enumerable: false
    },
    handle_err : function(err)
    {
        this.emit('complete', { error : err, success : !err });
    },
    upload_file : function(req, res)
    {
        for(file in req.files)
        {
            var tmp_path = req.files[file].path,
                target_path = path.resolve(this.directory + req.files[file].name);
            this.res = res;
            fs.rename(tmp_path, target_path, this.handle_err.bind(this));

        }
    }
});

/**
 * Parse a spreadsheet file and return an list of JSON dictionaries
 */
var Parser = function(filename)
{
    var excel = require('excel');
    //TODO : Determine libraries for spreadsheet types (XLS, XLSX, CSV, TSV and Other delimited formats
}

/**
 * Validate objects against the validators provided
 */
var Validator = function (validators)
{
    // TODO: Example validators,
    this.validators = validators;
}

var Translator = function(fieldlist)
{
  //TODO: Translator
}


module.exports = { Uploader : Uploader, Validator: Validator, Translator: Translator };
