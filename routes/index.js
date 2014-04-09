// Setting Sessions //
var auth = null;


/****************************
		* index.jade
 *****************************/


// apt.get( '/' ) //
exports.index = function ( req, res ){
  res.render('index');
};


// Angular-seed partials //
// exports.partials = function ( req, res ) {
//   var name = req.params.name;
//   res.render('partials/' + name);
// };