/**************************************
			* Set Sessions
**************************************/

var express = require('express');
// var auth = null;

/**************************************
			* mongoose.js
**************************************/


var mongoose	= require('mongoose');


// connects to MongoDB //
mongoose.connect( 'mongodb://localhost/zombs');



// User account information //
var User = mongoose.Schema({

	username		: String,
	email			: String,
	password		: String,
	numMeals		: Number,
	numHours		: Number,
	createdAt		: {

		type	: Date,
		default	: Date.now()

	}

});


// User meal input //
var Meal = mongoose.Schema({

	user_Id		: String,
	food		: String,
	eaten_On	: {

		type	: Date,
		default	: Date.now()

	}

});


// dbs: user & meal //
var Users	= mongoose.model( 'user', User );
var Meals	= mongoose.model( 'meal', Meal );


/**************************************
			* signUp
 *************************************/



// apt.get( '/signUp' ) //
exports.signUp = function ( req, res ) {
	res.render( 'signUp' );
};



// apt.post( '/signUp' ) //
exports.newUser = function ( req, res ) {

	// New Users Account Information
	var newUserName			= req.body.username;
	var newUserEmail		= req.body.email;
	var newUserPassword		= req.body.password;
	var newUserPasswordConf	= req.body.password_conf;
	var newUserNumMeals		= req.body.numMeals;
	var newUserNumHours		= req.body.numHours;
	var errors				= [];

	// Validates email input for "@", ".com" //
	function validateEmail( email ) {

		var regex = /\S+@\S+\.\S+/;
		return regex.test( email );

	}

	// Validations //
	if ( newUserName === '' ) {
		errors.push( 'Please choose a User Name' );
		console.log( 'Please choose a User Name' );
	}
	if ( newUserEmail === '' ) {
		errors.push( 'Please input your Email' );
		console.log( 'Please input your Email' );
	}
	if ( newUserPassword === '' ) {
		errors.push( 'Please choose a Password' );
		console.log( 'Please choose a Password' );
	}
	if ( newUserPasswordConf === '' ) {
		errors.push( 'Please confirm your Password' );
		console.log( 'Please confirm your Password' );
	}
	if ( errors.length === 0 ) {
	
		// Verify Username is Available
		Users.findOne({
			username : newUserName
		},
		function ( err, user) {

			if ( err ) console.log( 'Error '+err );

			// Validates if User Name against DB !taken //
			if ( user !== null && newUserName === user.username ) {
				errors.push( 'That User Name is already taken...' );
				console.log( 'That User Name is already taken...' );
			}
			// Validates Email is right form //
			if ( !validateEmail( newUserEmail )) {
				errors.push( 'Email is not valid, Missing "@" or ".com"' );
				console.log( 'Email is not valid, Missing "@" or ".com"' );
			}
			// Validates that both passwords match //
			if ( newUserPassword !== newUserPasswordConf ) {
				errors.push( 'Passwords do not match' );
				console.log( 'Passwords do not match' );
			}
			// Sends the error messages //
			if ( errors.length > 0 ) {
				res.send( errors.join('<br/>') );
			} else {
				Users.findOne({ email : newUserEmail },
					function ( err, user ) {

						if ( err ) console.log( 'Error ' + err );

						if ( user !== null && newUserEmail === user.email ) {
							errors.push( 'That email already exists' );
							console.log( 'That email already exists' );
						}
						if ( errors.length === 0 ) {

							// If everything is good, SAVE //

							// Saves new user to DB //
							var newRegisteredUser = new Users({

								username		: newUserName,
								email			: newUserEmail,
								password		: newUserPassword,
								numMeals		: newUserNumMeals,
								numHours		: newUserNumHours,
								createdAt		: {
									
									type	: Date,
									default	: Date.now()

								}

							});// newUser

							// Saves new registered user to DB //
							newRegisteredUser.save( function( err ) {

								if ( err ) console.log( 'Error ' + err );
								res.json({ success : true });

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
			* login
 ********************************/


// apt.get( '/login' ) //
exports.login = function ( req, res ) {
	res.render( 'login' );
};


// apt.post( '/login' ) //
exports.verifyLogin = function ( req, res ) {

	var oldUser		= req.body.username;
	var oldPassword	= req.body.password;

	Users.findOne({ username : oldUser },
		function ( err, user ) {

			if ( err ) console.log( 'Error ' + err );

			//console.log( "user = "+user );

			if ( user !== null && oldUser === user.username ) {

				if ( user.password !== null && oldPassword === user.password ) {

					req.session.user = user;
					res.json({ success : true });
					return;

				} else {

					console.log( 'Wrong Password' );
					res.send( 'Wrong Password' );
					
				}

			} else {

				console.log( 'Wrong User Name' );
				res.send( 'Wrong User Name' );

			}

		});

};// exports.verifyLogin


/********************************
			* dashboard
 ********************************/

 // app.get( '/dashboard') //
 exports.userMeals = function ( req, res ) {

	if ( req.session.user ) {
		console.log("req.session.user.id.tostring() is below!");
		console.log(req.session.user._id.toString());
		auth = true;

		Meals.find({ user_Id : req.session.user._id.toString() }).sort({ eaten_On : -1 }).
			exec( function ( err, meals) {

				if ( err ) console.log( 'Error ' + err );
				console.log("meals is below!");
				console.log(meals);
				res.json( meals );

		});

	}

 };


// app.post( '/dashboard' ) //
exports.userDashboard = function ( req, res ) {
	
	console.log("inside user.dashboard = req.session.user/user is =");
	console.log( req.session.user );

	if ( req.session.user ) {

		auth = true;
		var justAte = req.body.meal;
		console.log("below is the user ._id");
		console.log(req.session.user._id);

		var newFood = new Meals({

			user_Id		: req.session.user._id,
			food		: justAte,
			eaten_On	: {

				type	: Date,
				defualt	: Date.now()

			}

		});

		newFood.save( function( err ) {

			if ( err ) res.send( 'Error ' + err );

			res.json({ success : true });

		});

	}

};


/********************************
			* logout
 ********************************/


// apt.get( '/')
exports.logout = function ( req, res ) {
	req.session.destroy();
	res.redirect( '/login' );
};


















