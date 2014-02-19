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

Uploader.prototype.open_callback = function(evt)
{
    this.readstream.pipe(this.writestream);
}

Uploader.prototype.upload = function(fieldname, filestream, filename, encoding, mime_type, to_disk)
{
    if(to_disk)
    {
        var target_path = path.resolve(this.directory + filename);
        this.readstream = stream;
        this.write_stream = fs.open(target_path, 'w+', this.open_callback.bind(this));
        this.readstream.on('end', function(evt){ // cheeky anonymous functon
            this.emit('saved_to', {name: filename, destination : target_path});
        });
    }
    else
    {
        this.emit('stream_opened', {name : filename, stream : filestream});
    }
//    for(file in req.files)
//    {
//        var tmp_path = req.files[file].path,
//            target_path = path.resolve(this.directory + req.files[file].name);
//
//        this.ctrls[file] = false;
//
//        this.res = res;
//
//        fs.rename(tmp_path, target_path, this.done_callback.bind({ uploader: this, filename : req.files[file].name, path : target_path, ctrl_name : file}));
//    }
};

module.exports = { Uploader : Uploader };
