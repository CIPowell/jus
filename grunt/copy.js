module.exports = {
    css: {
        files : [{
            expand: true, cwd: 'app/styles/', src : ['main-min.css'], dest:'dist/styles'
        }]
    },
    server : {
        files : [{
            expand: true, cwd : 'app/', src : ['server/**/*.js','*.js'], dest:'dist'
        }]
    },
    templates: {
        files : [{
            expand: true, cwd : 'app/templates/', src : ['**/*.html'], dest:'dist/templates'
        }]
    }
}
