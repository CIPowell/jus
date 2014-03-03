module.exports = function(grunt)
{
    require('time-grunt')(grunt);
    
    require('load-grunt-config')(grunt);   

    grunt.registerTask('node_server', 'Start a custom web server', function() {
        require('./app/server/server.js').listen(3000);
    });

    grunt.event.on('watch', function(action, filepath, target) {
        grunt.log.writeln(target + ': ' + filepath + ' has ' + action);
    });
}
