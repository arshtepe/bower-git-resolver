var Resolver = require ( "./resolvers/GitRemoteResolver" );
var Logger = require('bower-logger');
var cmd = require('./util/cmd');
var Q = require('q');
var mout = require('mout');

module.exports = function (bower) {

    return {

        releases: function (source) {

          return this.tags( source );
        },

        match: function (source) {
            return /git\:\/\//g.test( source.trim() );
        },

        fetch: function (endpoint, cached) {
            if (cached.version) return;

             var resolver = new Resolver ( endpoint, bower.config, new Logger() );

             return resolver.resolve().then( function () {
               return {
                 tempPath: resolver.getTempDir(),
                 removeIgnores: true
               };
             } );
        },

        refs: function (source) {

            var value = cmd('git', ['ls-remote', '--tags', '--heads', source])
            .spread(function (stdout) {
                var refs;

                refs = stdout.toString()
                .trim()                         // Trim trailing and leading spaces
                .replace(/[\t ]+/g, ' ')        // Standardize spaces (some git versions make tabs, other spaces)
                .split(/[\r\n]+/);              // Split lines into an array

                return refs;
            }.bind(this));


            return value;
        },

        tags: function (source) {

          var value = this.refs(source)
            .then(function (refs) {
                var tags = [];

                // For each line in the refs, match only the tags
                refs.forEach(function (line) {
                    var match = line.match(/^([a-f0-9]{40})\s+refs\/tags\/(\S+)/);

                    if (match && !mout.string.endsWith(match[2], '^{}')) {
                        // tags[match[2]] = match[1];
                        tags.push( {
                            version: match[2],
                            target: match[2]
                        } );
                    }
                });

                  console.log( tags );
                return tags;
            }.bind(this));

            return value;
        }

    };
};
