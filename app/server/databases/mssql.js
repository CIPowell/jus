var util = require('util'),
    mssql = require('mssql');


var MSSQL_Adapter = function(params, callback)
{
    this.db = new mssql.Connection(params, callback);
};

MSSQL_Adapter.prototype.insert = function(record, callback)
{
    if(!this.insert_query) throw 'no insert query prepared';

    for ( var fld in record )
    {
        this.insert_query = this.insert_query.replace('$' + fld, record[fld]);
    }

    var request = new mssql.Request(this.db);

    request.query(this.insert_query, function(err){
        callback(err, record);
    });
}

MSSQL_Adapter.prototype.select = function(query, record, callback)
{
    if(!query) throw 'no insert query prepared';

    for ( var fld in record )
    {
        query = query.replace('$' + fld, record[fld]);
    }

    var request = new mssql.Request(this.db);

    request.query(query, callback);
}

MSSQL_Adapter.prototype.get_insert_string = function(table, field_list)
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

MSSQL_Adapter.prototype.get_select_string = function(table, field_list, condition_list)
{
    var tpl_query = "SELECT [%s] FROM [%s] WHERE %s;",
        query,
        qmarks = [];


        for( var i in condition_list )
        {
            if( condition_list[i] )
            {
                qmarks.push('[' + i + '] = ' + '$' + condition_list[i]);
            }
            else
            {
                qmarks.push('[' + i + '] = ' + '$' + i);
            }
        }

        query = util.format(tpl_query, field_list.join('], ['), table,  qmarks.reverse().join(' AND '))

        return query;
}

MSSQL_Adapter.prototype.prepare_insert = function(table, fielddefs)
{
    this.fielddefs = fielddefs;

    var field_list = Object.keys(fielddefs),
        query= this.get_insert_string(table ,field_list);

    this.insert_query = query;
}

MSSQL_Adapter.prototype.prepare_select = function(table, fielddefs, conditions)
{
    this.fielddefs = fielddefs;

    var field_list = Object.keys(fielddefs),
        query= this.get_select_string(table ,field_list, conditions);

    return query;
}


module.exports = MSSQL_Adapter;
