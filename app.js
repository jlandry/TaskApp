
/****************************
	* Module dependencies
 *****************************/

var express	= require( 'express' ),
	routes	= require( './routes/index' ),
	users	= require( './routes/users' ),
	api		= require( './routes/api' ),
	http	= require( 'http' ),
	path	= require( 'path' );

var app			= module.exports = express();
var mongoose	= require( 'mongoose' );


/****************************
		* Configuration
 *****************************/

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);


// development only
if (app.get('env') === 'development') {
  app.use(express.errorHandler());
}

// production only
if (app.get('env') === 'production') {
  // TODO
}



/****************************
	* Sessions Handler
 *****************************/
app.use( express.cookieParser() );
app.use( express.session( { secret : 'kingtak' } ));



/**************************************************
					* Route Handler
 **************************************************/


/**************************
		* index.js
 **************************/

app.get( '/', routes.index );
// app.get( '/dashboard', routes.dashboard );


/**************************
		* users.js
 **************************/

// app.get( '/signUp', users.signUp );
// app.get( '/login', users.login );
// app.get( '/logout', users.logout );

app.post( '/signUp', users.newUser );
app.post( '/login', users.verifyLogin );

/**************************
		* api.js
 **************************/

// app.get('/api/name', api.name);








// redirect all others to the index (HTML5 history)
// app.get('*', routes.index);



/****************************
	* Start Server
 *****************************/

http.createServer(app).listen(app.get('port'), function () {
  console.log('Express server listening on port ' + app.get('port'));
});
