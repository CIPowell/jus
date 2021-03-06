/*global describe, it, require */

(function () {
    'use strict';

    var assert = require('chai').assert;

    describe('Assert Tests', function () {

        it('should pass', function () {
            assert.ok(true);
        });



    });

    describe('Validator Tests', function(){
        it('regex tests', function(){
            var rex = require('../../app/server/validators/regex.js');

            rex.call({
                params : {
                    exp : /^[0-9]+$/
                },
                valid : function(){
                    assert.ok(true);
                },
                invalid : function(){
                    assert.ok(false)
                }},'012');

            rex.call({
                params : {
                    exp : /^[0-9]+$/
                },
                valid : function(){
                    assert.ok(false);
                },
                invalid : function(){
                    assert.ok(true)
                }},'01aa2');
        });

        it('number validators', function(){
            var number = require('../../app/server/validators/number.js');

            number.call({ params : {}, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}, 0);
            number.call({ params : {}, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}, 10);
            number.call({ params : {}, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}, 10.2);
            number.call({ params : {}, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}}, 'bah');

            var num_max_10_pass = number.bind({ params : { max : 10 }, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}),
                num_max_10_fail = number.bind({ params : { max : 10 }, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}});

            num_max_10_pass(0);
            num_max_10_pass(10);
            num_max_10_pass(-1000);
            num_max_10_fail(11);
            num_max_10_fail(10.1);
            num_max_10_fail(10000);

            var num_min_10_pass = number.bind({ params : { min : 10 }, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}),
                num_min_10_fail = number.bind({ params : { min : 10 }, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}});

            num_min_10_pass(10);
            num_min_10_pass(11);
            num_min_10_pass(1000);
            num_min_10_fail(9);
            num_min_10_fail(9.9);
            num_min_10_fail(-10);
        });

        it('int validator', function(){
            var int = require('../../app/server/validators/int.js');

            var int_pass = int.bind({ params : {}, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}),
                int_fail = int.bind({ params : {}, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}});

            int_pass(1);
            int_pass(-1000);
            int_pass('2014');

            int_fail('bah');
            int_fail(1.201201);
            int_fail('1122.2121');

            var int_max_10_pass = int.bind({ params : { max : 10 }, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}),
                int_max_10_fail = int.bind({ params : { max : 10 }, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}});

            int_max_10_pass(0);
            int_max_10_pass(10);
            int_max_10_pass(-1000);
            int_max_10_fail(11);
            int_max_10_fail(10.1);
            int_max_10_fail(10000);

            var int_min_10_pass = int.bind({ params : { min : 10 }, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}),
                int_min_10_fail = int.bind({ params : { min : 10 }, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}});

            int_min_10_pass(10);
            int_min_10_pass(11);
            int_min_10_pass(1000);
            int_min_10_fail(9);
            int_min_10_fail(9.9);
            int_min_10_fail(-10);
            int_min_10_fail(0);

        });

        it('Before Current Year Validator', function(){
           var f =  require('../../app/server/validators/year_to_current.js'),
               year_pass = f.bind({ params : {}, valid : function(){assert.ok(true);}, invalid : function(){assert.ok(false);}}),
                year_fail = f.bind({ params : {}, valid : function(){assert.ok(false);}, invalid : function(){assert.ok(true);}});

            year_pass(2014);
            year_pass('2012', {});
            year_pass('-1000');
            year_pass(0);
            year_fail('false');

            year_fail(new Date().getFullYear() + 1);
            year_fail(10000);
            year_fail('Ten thousand');

        });
    });

    describe('db-dependent-validator tests', function(){
        beforeEach(function(){
            var indb = require('../../app/server/validators/exists_in_db.js'),
               conn = require('../../app/server/databases/mssql.js'),
               conf = require('../../app/conf.js');

            this.db = new conn(conf.db, function(err){})
            this.indb = indb;
        });

        it('is in db', function(done)
           {
               var params = {
                    table: 'sts',
                    field : 'aroe',
                    conditions : { aroe : 1 }
               };
               var v = this.indb.bind({ db: this.db, params : params, valid: function(){done()}, invalid : function(name,msg){done(new Error(msg));}});
               v(1, {'aroe' : 1});
           });

        it('is in db2', function(done)
           {
               var params = {
                    table: 'sts',
                    field : 'aroe',
                    conditions : { gdh_ : 1 }
               };
               var v = this.indb.bind({ db: this.db, params : params, valid: function(){done()}, invalid : function(name,msg){done(new Error(msg));}});
               v(1, {'gdh_' : 1});
           });

        it('is in db_multi', function(done)
           {
               var params = {
                    table: 'sts',
                    field : 'ref',
                    conditions : { aroe : 1, gdh_ : 1, gki_ : 1, recP : 1, spi_ : 1, xpt_ : 1, ddl_ : 1 }
               };

               var v = this.indb.bind({ db: this.db, params : params, valid: function(){done()}, invalid : function(name,msg){done(new Error(msg));}});

               v(1, { aroe : 1, gdh_ : 1, gki_ : 1, recP : 1, spi_ : 1, xpt_ : 1, ddl_ : 1 });
           });

        it('is in db_multi_with extras in record', function(done)
           {
               var params = {
                    table: 'sts',
                    field : 'ref',
                    conditions : { aroe : 1, gdh_ : 1, gki_ : 1, recP : 1, spi_ : 1, xpt_ : 1, ddl_ : 1 }
               };

               var v = this.indb.bind({ db: this.db, params : params, valid: function(){done()}, invalid : function(name,msg){done(new Error(msg));}});

               v(1, { aroe : 1, gdh_ : 1, gki_ : 1, recP : 1, spi_ : 1, xpt_ : 1, ddl_ : 1, foo: 'bar' });
           });

    });
    
    describe('Submitter tests', function(){
       it('Should use conf to change the field', function(){
           var Submitter = require('../../app/server/Submitter.js');
                                
           
           var sub = new Submitter('null', {},'null',{
                'foo' : {
                    transforms: [
                        { name:'blackhole' }
                    ]
                }
           });
           
           var record = { 'foo' : 'bar', 'one' : 'two' },
               new_record = sub.transform(record);
           
           assert.deepEqual(new_record, { 'one' : 'two' }); 
       });
        
   it('Should use conf to change the field 2', function(){        
            var Submitter = require('../../app/server/Submitter.js');
                                
           
           var sub = new Submitter('null', {},'null',{
                'foo' : {
                    transforms: [
                        { name:'blackhole' }
                    ]
                },
               'one' :{
                    transforms :[
                        {
                            name: 'rename',
                            params : {
                                name : 'new'
                            }
                        }
                    ]
               }
           });
           
           
           var record2 = { 'foo' : 'bar', 'one': 'two' },
               new_record2 = sub.transform(record2);
           
           assert.deepEqual(new_record2, { 'new': 'two' });
           
           
       });
    });
})();
