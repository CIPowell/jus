module.exports = function(value, record)
{

    var fields = {};

    fields[this.params.field] = {};

    var stmt = this.db.prepare_select(this.params.table, fields, this.params.conditions),
        valid = this.valid,
        invalid = this.invalid,
        field = this.params.field,
        message = this.message,
        cb = function(err, recordset){
            if(err) {
                invalid('exists_in_db', err.message);
            } else {
                var _valid = false;

                for( var r = recordset.length; r--; )
                {

                    if( recordset[r][field] == value )
                    {
                        valid('exists_in_db');
                        _valid = true;
                        break;
                    }
                }

                if( !_valid) { invalid('exists_in_db', (message ? message :  'not found in the database')); }
            }
        };


    this.db.select(stmt, record, cb);
}
