var util = require('util'),
    sqlite3 = require('sqlite3');


var SQLiteAdpater = function(params)
{
    this.filename = params.filename;

    this.db = new sqlite3.Database(this.filename);
};

SQLiteAdpater.prototype.insert = function(record, callback)
{
    if(!this.insert_query) throw 'no insert query prepared';

    var args = {};

    for ( var fld in record )
    {
        args['$' + fld] = record[fld].value;
    }

    return this.insert_query.run(args, function(err){
        callback(record);
    });
}

SQLiteAdpater.prototype.get_insert_string = function(table, field_list)
{
    var tpl_query = "INSERT INTO %s (%s) VALUES (%s);",
        query,
        qmarks = [];

        for( var i = field_list.length; i--; )
        {
            qmarks.push('$' + field_list[i]);
        }

        query = util.format(tpl_query, table, field_list.join(', '), qmarks.reverse().join(', '))

        return query;
}

SQLiteAdpater.prototype.prepare_insert = function(table, fielddefs)
{
    this.fielddefs = fielddefs;

    var field_list = Object.keys(fielddefs),
        query= this.get_insert_string(table,field_list);

    this.insert_query = this.db.prepare(query);
}


module.exports = SQLiteAdpater;
