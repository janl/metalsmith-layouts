
var consolidate = require('consolidate');
var each = require('async').each;

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin to run files through any template in a template `dir`.
 *
 * @param {String} dir
 * @return {Function}
 */

function plugin(opts){
  opts = opts || {};
  opts.dir = opts.dir || 'templates';
  if (!opts.engine) throw new Error('"engine" option required');

  return function(files, metalsmith, done){
    each(Object.keys(files), convert, done);

    function convert(file, done){
      var data = files[file];
      var template = data.template;
      if (!template) return done();
      var tmpl = metalsmith.join(opts.dir, template);
      consolidate[opts.engine](tmpl, data, function(err, str){
        if (err) return done(err);
        data.body = str;
        done();
      });
    }
  };
}