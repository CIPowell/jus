var Submitter = function(db_type, con_params, tablename, fieldlist)
{
  //TODO: Translator
    this.adapter = require('../../app/server/databases/' + db_type);
    this.connection = new this.adapter(con_params)

    this.table = tablename;
    this.fielddefs = fieldlist;

}

Submitter.prototype.transform = function(record)
{
    var results = {};

    for( var fld in this.fielddefs )
    {
        results = this.transform_field(fld, record[fld], results);
    }

    return results;
}

// A field can

Submitter.prototype.transform_field = function(field_name, value, results_object)
{
    var transformers = this.fielddefs[field_name].transforms,
        obj = { field_name : field_name, value : value }

    for( var t in transformers )
    {
        var t_f = require('../../app/server/transforms/' + transformers[t].name + '.js').bind(transformers[t]);
        t_f(obj);

    }

    results_object[obj.field_name] = obj.value;
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
