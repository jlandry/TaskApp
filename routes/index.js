
/****************************
		* index.jade
 *****************************/


// apt.get( '/' ) //
exports.index = function ( req, res ){
  res.render('index');
};


// Angular-seed partials //
exports.partials = function ( req, res ) {
  var name = req.params.name;
  res.render('partials/' + name);
};



/****************************
		* dashboard.jade
 *****************************/

// apt.get( '/dashboard' )  //
exports.dashboard = function ( req, res ) {

	if ( req.session.name ) {

		auth = true;

		res.render( 'dashboard' );
	
	} else {

		res.redirect( '/login' );
	}

};