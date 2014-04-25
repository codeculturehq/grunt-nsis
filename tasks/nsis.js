'use strict';

var Q = require('q'),
    path = require('path'),
    fs = require('fs'),
    _ = require('lodash'),
    sys = require('sys'),
    spawn = require('child_process').spawn;

module.exports = function (grunt) {
    // ***************************************************************************
    // Configure the task:
    grunt.registerTask(
        'nsisbuild',
        'Creating NSIS installer',
        function () {
        //Functions
            var isWineInstalled = function () {
                var child = spawn('wine', ['--version']);
                var result = '';
                var defer = Q.defer();
                child.stdout.on('data', function (data) {
                    result += data;
                });
                child.stdout.on('end', function () {
                    defer.resolve(!!result.match(/wine-\d\.\d/));
                });
                return defer.promise;
            };

            var createNsisInstaller = function (useWine, nsisExe, params) {
                try {
                    var defer = Q.defer();
                    nsisExe = path.resolve(nsisExe);
                    var cmd = useWine ? 'wine' : nsisExe.replace(/ /g, '\\ ');
                    params = useWine ? [nsisExe.replace(/ /g, '\\ ')].concat(params) : params;

                    if (fs.existsSync(nsisExe)) {
                        // Debugging: console.log('executing: <'+cmd + ' ' + params.join(' ')+'>');
                        console.log('executing: <'+cmd + ' ' + params.join(' ')+'>');
                        require('child_process').exec(cmd + ' ' + params.join(' '), function(err, stdout, stderr) {
                            if (!err) {
                                defer.resolve(true, stdout, stderr);
                            } else {
                                defer.reject(err, stdout, stderr);
                            }
                        });
                    } else {
                        defer.reject('NSIS could not be found at "'+nsisExe+'"!');
                        grunt.log.error('NSIS could not be found at "'+nsisExe+'"!');
                        done();
                    }
                } catch(error) {
                    grunt.log.error(error);
                }
            };

            //Do Work
            //-----------------
            var options = this.options({
                nsisPath: '',
                installerScriptPath: ''
            }),
                done = this.async();

            // Check the target plattforms
            if (!_.any(_.pick(options,"nsisPath","installerScriptPath"))) {
                grunt.log.warn("Undefined nsisPath or installerScriptPath!");
                return done();
            }

            var cmd = options.nsisPath + '/makensis.exe';
            var params = [options.installerScriptPath];

            //Init Deferer
            var defer = Q.defer();
            //Check if we are on windows or need wine
            var isWin = !!process.platform.match(/^win/);

            //If we are not on windows, check for wine, only continue if wine is installed
            if (!isWin) {
                isWineInstalled().then(function(hasWine) {
                    if (hasWine) {
                        createNsisInstaller(true, cmd, params);
                    } else {
                        defer.reject('Wine is not installed!');
                        grunt.log.error('Wine is not installed!');
                        done();
                    }
                });
            } else {
                createNsisInstaller(false, path, params);
            }
            grunt.log.writeln("test");

        });
};
