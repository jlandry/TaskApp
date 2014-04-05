var mongoose	= require('mongoose');

// connects to MongoDB //
mongoose.connect( 'mongodb://localhost/zombs');

// User account information //
var User = mongoose.Schema({

	user		: String,
	email		: String,
	password	: String,
	createdAt	: {

		type	: Date,
		default	: Date.now

	}

});

// User meal input //
var Meal = mongoose.Schema({
	food	: String,
	date	: {

		type	: Date,
		default	: Date.now

	}

});


// dbs: user & meal //
var Users	= mongoose.model( 'user', User );
var Meals	= mongoose.model( 'meal', Meal );


/* Checks Sessions */
var auth = null;




/**************************************
			* signUp.jade
 *************************************/

// apt.get( '/signUp' ) //
exports.signUp = function( req, res ) {
	res.render( 'signUp' );
};

// apt.post( '/signUp' ) //
exports.newUser = function ( req, res ) {

	// New Users Account Information
	var newUser				= req.body.username;
	var newUserEmail		= req.body.email;
	var newUserPassword		= req.body.password;
	var newUserPasswordConf	= req.body.password_conf;
	var errors				= [];

	// Validates email input for "@", ".com" //
	function validateEmail( email ) {

		var regex = /\S+@\S+\.\S+/;
		return regex.test( email );

	}

	// Validations //
	if ( newUser === '' ) {
		errors.push( 'Please choose a User Name' );
	}
	if ( newUserEmail === '' ) {
		errors.push( 'Please input your Email' );
	}
	if ( newUserPassword === '' ) {
		errors.push( 'Please choose a Password' );
	}
	if ( newUserPasswordConf === '' ) {
		errors.push( 'Please confirm your Password' );
	}
	if ( errors.length === 0 ) {
	
		// Verify Username is Available
		User.findOne({
			username : newUser
		},
		function( err, user) {

			if ( err ) console.log( 'Error '+err );

			// Validates if User Name against DB !taken //
			if ( user !== null && newUser === user.username ) {
				errors.push( 'That User Name is already taken...' );
			}
			// Validates Email is right form //
			if ( !validateEmail( newUserEmail )) {
				errors.push( 'Email is not valid, Missing "@" or ".com"' );
			}
			// Validates that both passwords match //
			if ( newUserPassword !== newUserPasswordConf ) {
				errors.push( 'Passwords do not match' );
			}
			// Sends the error messages //
			if ( errors.length > 0 ) {
				res.send( errors.join('<br/>') );
			} else {
				User.findOne({ email : newUserEmail },
					function( err, user ) {

						if ( err ) console.log( 'Error ' + err );

						if ( user !== null && newUserEmail === user.email ) {
							errors.push( 'That email already exists' );
						}
						if ( errors.length === 0 ) {

							// Everything is good, SAVE //

							// Saves new user to DB //
							var newRegisteredUser = new User({

								username		: newUser,
								email			: newUserEmail,
								password		: newUserPassword,
								createdAt		: {
									type	: Date,
									default	: Date.now()
								
								}

							});// newUser

							// Saves new registered user to DB //
							newRegisteredUser.save( function( err ) {

								if ( err ) console.log( 'Error ' + err );
								res.send({ redirect : '/login' });

							});// newRegisteredUser.save

						} else {

							res.send( errors.join( '<br/> ' ) );
						}

					});
				}

			});

		} else {

		res.send( errors.join( '<br/>' ) );
	}

};//exports.newUser



/********************************
			* login.jade
 ********************************/

// apt.get( '/login' ) //
exports.login = function ( req, res ) {
	res.render( 'login' );
};

// apt.post( '/login' ) //
exports.verifyLogin = function ( req, res ) {

	var user		= req.body.username;
	var password	= req.body.password;

	if ( user === "kingtak" ) {

		if ( password === "kingtak" ) {

			req.session.name	= user;
			req.send({ redirect : '/dashboard' });
			return;

		} else {

			res.send( 'wrong Password' );
			return;

		}
	
	} else {

		res.send( "Wrong User Name" );
		return;

	}

};// exports.verifyLogin





/********************************
			* logout
 ********************************/

// apt.get( '')
exports.logout = function ( req, res ) {
	req.session.destroy();
	res.redirect( '/login' );
};


















