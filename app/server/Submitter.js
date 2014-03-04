var Submitter = function(db_type, con_params, tablename, fieldlist)
{
  //TODO: Translator
    this.adapter = require('databases/' + db_type);
    this.connection = new this.adapter(con_params)

    this.table = tablename;
    this.fielddefs = fieldlist;


}
