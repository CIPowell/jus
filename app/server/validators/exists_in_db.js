module.exports = function(value, record)
{
    var fields = {};

    fields[this.params.field] = {};

    var stmt = this.db.prepare_select(this.params.table, fields, this.params.conditions),
        valid = this.valid,
        invalid = this.invalid,
        field = this.params.field,

        cb = function(err, recordset){
            if(err) { invalid('exists_in_db', err); }

            for( var r = recordset.length; r--; )
            {
                if( recordset[r][field] == value )
                {
                    valid('exists_is_db');
                    return;
                }
            }

            invalid('exists_in_db', value + ' not found in the database');

        };


    this.db.select(stmt, record, cb);
}
