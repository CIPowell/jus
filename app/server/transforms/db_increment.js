module.exports = function(value)
{
    var qry = this.db.prepare_select(this.params.table, { func: 'max', name : this.params.column, as : 'inc_value' }, this.params.conditions),
        this.db.select(qry, function(err, recordset){
           this.callback( recordset[0].inc_value + 1 );
        }.bind(this);
}