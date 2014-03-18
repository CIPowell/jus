(function () {
    'use strict';

    var assert = require('assert'),
        mssql = require('../../app/server/databases/mssql.js'),
        conf =  require('../../app/conf.js')

    describe('mssql tests', function(){

        it('should connect from conf', function(done){
            var db = new mssql(conf.db, done);
        });

        it('should insert --> from conf', function(done){
            var db = new mssql(conf.db, function(err){});

            db.prepare_insert('profiles_test', {
              "id": {}
            });

            db.insert({'id' : '1'}, function(err){  });

            var qry =db.prepare_select ('profiles_test', {'id' : ''}, {'id' : {}});

            db.select(qry, {id : 1}, function(err, recordset)
              {
                  done(err);

                  for(var i = 0; i < recordset.length; i++) {
                        assert(recordset[i].id == 1);
                    }
              });

        });



    });
})();
