(function () {
    'use strict';

    var assert = require('chai').assert;

    describe('rename tests', function(){
        var rename = require('../../app/server/transforms/rename.js');

        it('should change the name', function(){
            var r = rename.bind({ params : { name : 'bar' }});

            var record = { field_name :'foo', value : 'xxx' }

            r(record);

            assert.ok(record.field_name == 'bar');
        });
    });
    
    describe('blackhole tests', function(){
        var b_hole = require('../../app/server/transforms/blackhole.js');

        it('should delete the field', function(){
            var b = b_hole.bind({ });

            var record = { field_name :'foo', value : 'xxx' }

            b(record);

            assert.notOk(record.field_name);
        });
    });
})();
