/**
 * Created by xfeng on 2015/12/1.
 */

module.exports = function (grunt) {

    var proxySnippet = require('grunt-connect-proxy/lib/utils').proxyRequest;

    grunt.initConfig({
        pkg    : grunt.file.readJSON('package.json'),
        connect: {
            server: {
                options: {
                    hostname  : 'localhost',
                    port      : 9090,
                    //keepalive : true,
                    open      : true,
                    base      : '.',
                    middleware: function (connect, options) {

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        var middlewares = [proxySnippet];

                        options.base.forEach(function (base) {
                            middlewares.push(connect.static(base));
                        });

                        var directory = options.directory || options.base[options.base.length - 1];
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                },
                proxies: [{
                    context: '/reactjs-study/services',
                    host   : 'localhost',
                    port   : 8080
                }]
            }
        },
        babel: {
            options: {
                //sourceMap: true,
                presets: ['es2015','react']
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: 'src/',
                    src: ['*.js'],
                    dest: 'build/'
                }]
            }
        },
        //清除目录
        clean  : {
            all: ['target/**', 'build/**']
        },
        copy   : {
            main: {
                files: [
                    {src: ['lib/cryptojs/*'], dest: 'target/reactjs-study/'},
                    {src: ['lib/*.min.js', 'lib/*.min.css'], dest: 'target/reactjs-study/'},
                    {src: ['fonts/*'], dest: 'target/reactjs-study/'},
                    {src: ['img/*'], dest: 'target/reactjs-study/'},
                    {src: ['templates/**'], dest: 'target/reactjs-study/'},
                    {src: ['*.html'], dest: 'target/reactjs-study/'}
                ]
            }
        },
        concat : {
            options: {
                separator: '\n /* ----- separator ----- */\n',
                banner   : '\n /* ----- banner ----- */\n',
                footer   : '\n /* ----- footer ----- */\n'
            },
            webapp : {
                src : ['js/*.js', 'js/**/*.js'],
                dest: 'target/reactjs-study/js/<%= pkg.name %>.js'
            }
        },
        uglify : {
            options: {
                mangle: false,
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build  : {
                src : 'target/reactjs-study/js/<%= pkg.name %>.js',
                dest: 'target/reactjs-study/js/<%= pkg.name %>.js'
            }
        },
        //压缩CSS
        cssmin : {
            options: {
                shorthandCompacting: false,
                roundingPrecision  : -1
            },
            target : {
                files: {
                    'target/reactjs-study/css/webapp.css': ['css/*.css']
                }
            }
        },
        usemin : {
            html: ['target/reactjs-study/index.html']
        },
        watch  : {
            babel: {
                files: 'src/*.js',
                tasks: ['babel:dist']
            }
        }
    });

    grunt.loadNpmTasks('grunt-connect-proxy');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-usemin');

    grunt.loadNpmTasks('grunt-babel');

    grunt.registerTask('default', [
        'babel',
        'configureProxies:server',
        'connect:server',
        'watch:babel'
    ]);

    grunt.registerTask('bb', [
        'watch'
    ]);

    grunt.registerTask('build', [
        'clean',
        'copy',
        'concat',
        'uglify',
        'cssmin',
        'usemin'
    ]);

};