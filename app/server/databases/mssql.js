var util = require('util'),
    mssql = require('mssql');


var MSSQL = function(params)
{
    this.db = mssql.Connection(params);
};

SQLiteAdpater.prototype.insert = function(record, callback)
{
    if(!this.insert_query) throw 'no insert query prepared';

    for ( var fld in record )
    {
        this.insert_query.replace('$' + fld, record[fld]);
    }

    var request = new mssql.Request(this.db);

    return requrest.query(this.insert_query, function(err){
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
        query= this.get_insert_string(table ,field_list);

    this.insert_query = query;
}


module.exports = MSSQL;
