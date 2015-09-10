var Resolver = require ( "./resolvers/GitRemoteResolver" );
var Logger = require('bower-logger');

module.exports = function (bower) {

    return {

        releases: function (source) {
          return source;
        },
        match: function (source) {
            // return /git\:\/\//g.test( source.trim() );
            return true;
        },

        fetch: function (endpoint, cached) {
            if (cached.version) return;

             var resolver = new Resolver ( endpoint, bower.config, new Logger() );

             return resolver.resolve().then( function () {
               return {
                 tempPath: resolver.getTempDir(),
                 removeIgnores: false
               };
             } );
        }
    };
};
