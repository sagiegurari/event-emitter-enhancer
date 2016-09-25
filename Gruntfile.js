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
        },
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
                    },
                    modifySignature: function (line) {
                        return line.split('### \'EnhancedEventEmitter.').join('### \'emitter.').split('emitter.addFilter(').join('emitter.filter(').split('emitAsync(event, [params]').join('emitAsync(event, [...params]');
                    }
                }
            }
        }
    });
};
