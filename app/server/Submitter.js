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
        this.transformfield(fld, record[fld], results);
    }

    return results;
}

// A field can

Submitter.prototype.transform_field = function(field_name, value, results_object)
{
    var transformers = this.fielddefs[field_name].transformers,
        obj = { field_name : field_name, value : value }

    for( var t in transformers )
    {
        t(obj);
    }

    results_object[obj.field_name] = obj.value;
}

Submitter.prototype.insert_into_db = function(record)
{
    this.connection.prepate_insert(this.table, record);
    this.connection.insert(record);
}

Submitter.prototype.submit = function(record)
{
    var db_record = this.transform(record);
    this.insert_into_db(db_record);
}

module.exports = Submitter;
