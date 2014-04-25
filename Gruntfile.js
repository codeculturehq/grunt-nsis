/*
 * grunt-nsis
 * https://github.com/codeculture-de/grunt-nsis
 *
 * Copyright (c) 2014 codeculture
 * Licensed under the gplv2 license.
 */

'use strict';

module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp'],
        },
        // Configuration to be run (and then tested).
        nodewebkit: {
            options: {
                mac: true,
                build_dir: './example/build',
                credits: './example/public/Credits.html',
                mac_icns: './example/icon.icns'
            },
            src: './example/public/**/*'
        },

        // Unit tests.

        nsisbuild: {
            options: {
                nsisPath: './example/nsis',
                installerScriptPath: './example/script.nsi'
            }
        }

    });

    // Actually load this plugin's task(s)1

    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);


};