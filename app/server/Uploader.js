var events = require('events'),
    path = require('path'),
    fs = require('fs');

function Uploader (upload_dir){

    events.EventEmitter.call(this);

    this.directory =  './app/uploads/';
    this.ctrls = {};
};

Uploader.super_ = events.EventEmitter;

Uploader.prototype = Object.create(events.EventEmitter.prototype, {
    constructor: {
        value: Uploader,
        enumerable: false
    }
});

Uploader.prototype.done_callback = function(err)
{
    var complete = true;
    this.uploader.ctrls[this.ctrl_name] = { name : this.filename, path: this.path };

    for (var ctrl in this.uploader.ctrls)
    {
        complete = complete && this.uploader.ctrls;
        if( !complete ) break;
    }

    if(complete) this.uploader.emit('complete', { files : this.uploader.ctrls });
};

Uploader.prototype.upload = function(req, res)
{
    for(file in req.files)
    {
        var tmp_path = req.files[file].path,
            target_path = path.resolve(this.directory + req.files[file].name);

        this.ctrls[file] = false;;

        this.res = res;
        fs.rename(tmp_path, target_path, this.done_callback.bind({ uploader: this, filename : req.files[file].name, path : target_path, ctrl_name : file}));
    }
};

module.exports = { Uploader : Uploader };
