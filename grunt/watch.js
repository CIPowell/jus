module.exports = {
    css: {
        files: '**/*.less',
        tasks: ['less', 'autoprefixer'],
        options: {
          livereload: true,
        }
    },
    html: {
        files: '**/*.html',
        options : {
            livereload: true
        }
    },
    livereload: {
        options: {
            livereload: 3579
        },
        files: [
            'app/index.html',
            '**/*.less'
        ]
    }
}
