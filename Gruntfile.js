'use strict';

/*jslint nomen: true*/
//jscs:disable disallowDanglingUnderscores
/*eslint-disable no-underscore-dangle*/

module.exports = function (grunt) {
    var commons = require('js-project-commons');

    commons.grunt.config.initConfig(grunt, {
        buildConfig: {
            projectRoot: __dirname,
            nodeProject: true
        }
    }, function projectConfig() {
        grunt.registerTask('modify-readme', function runTask() {
            var path = require('path');
            var readmeFile = path.join(global.build.options.buildConfig.projectRoot, 'README.md');
            var readme = grunt.file.read(readmeFile, {
                encoding: 'utf8'
            });

            readme = readme.split('### \'EnhancedEventEmitter.').join('### \'emitter.').split('emitter.addFilter(').join('emitter.filter(').split('emitAsync(event, [params]').join('emitAsync(event, [...params]');

            grunt.file.write(readmeFile, readme, {
                encoding: 'utf8'
            });
        });

        grunt.registerTask('project-docs', ['apidoc2readme:readme', 'modify-readme']);

        return {
            tasks: {
                apidoc2readme: {
                    readme: {
                        options: {
                            tags: {
                                'usage-else': 'EnhancedEventEmitter+else',
                                'usage-suspend': 'EnhancedEventEmitter+suspend',
                                'usage-else-error': 'EnhancedEventEmitter+elseError',
                                'usage-emit-async': 'EnhancedEventEmitter+emitAsync',
                                'usage-on-async': 'EnhancedEventEmitter+onAsync',
                                'usage-on-any': 'EnhancedEventEmitter+onAny',
                                'usage-filter': 'EnhancedEventEmitter+addFilter'
                            }
                        }
                    }
                }
            }
        };
    });
};
