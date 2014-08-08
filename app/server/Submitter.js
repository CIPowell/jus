var Submitter = function(db_type, con_params, tablename, fieldlist)
{
    this.adapter = require('../../app/server/databases/' + db_type);
    this.connection = new this.adapter(con_params)

    this.table = tablename;
    this.fielddefs = fieldlist;

}

Submitter.prototype.transform = function(record)
{
    var results = {};

    for( var fld in record )
    {
        this.transform_field(fld, record[fld], results);
    }
}

Submitter.prototype.transform_callback = function(field_name, record)
{
       
}

// A field can

Submitter.prototype.transform_field = function(field_name, value, results_object, idx)
{
    var obj = { field_name : field_name, value : value };
    
    if(this.fielddefs[field_name])
    {
        var transformers = this.fielddefs[field_name].transforms;
        
     
        var t_params = transformers[t];

        t_params.db = this.connection;
        t_params.idx = idx;
        t_params.callback =  this.transform_field_callback.bind(this);
        
        var t_f = require('../../app/server/transforms/' + transformers[t].name + '.js').bind(t_params);
        t_f(obj);   
    }
    
}

Submitter.prototype.transform_field_callback = function(obj, idx, results_object, final)
{
    if( obj.field_name && idx < this.fielddefs[obj.field_name].transforms.length && !final) // basically to handle "blackhole"
    {
        this.transform_field(obj.field_name, obj.value, results_object, ++idx);
    }
    else
    {
        this.transform_callback(obj.field_name, results_object);
    }
}

Submitter.prototype.insert_into_db = function(record)
{
    this.connection.prepare_insert(this.table, record);

    this.connection.insert(record, this.db_callback.bind(this));

}

Submitter.prototype.db_callback = function(evt)
{
    this.callback(evt);
}

Submitter.prototype.submit = function(record, callback)
{
    this.callback = callback;

    var db_record = this.transform(record);

    this.insert_into_db(db_record);
}

module.exports = Submitter;
