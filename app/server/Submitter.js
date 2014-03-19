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
        results = this.transform_field(fld, record[fld], results);
    }

    return results;
}

// A field can

Submitter.prototype.transform_field = function(field_name, value, results_object)
{
    var obj = { field_name : field_name, value : value };
    
    if(this.fielddefs[field_name])
    {
        var transformers = this.fielddefs[field_name].transforms;
        
        for( var t in transformers )
        {
            var t_params = transformers[t];

            t_params.db = this.connection;

            var t_f = require('../../app/server/transforms/' + transformers[t].name + '.js').bind(t_params);
            t_f(obj);

        }
    }
    if( obj.field_name ) // basically to handle "blackhole"
    {
        results_object[obj.field_name] = obj.value;
    }
    return results_object;
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
