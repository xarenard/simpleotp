'use strict';
const OTP = require('./otp.js');

const Totp = function (opts) {
	let _options = (typeof opts === 'undefined' || opts === null) ? {} : opts;
	_options.algorithm = _options.algorithm || 'sha1';
	_options.num_digits = _options.num_digits || 8;
	_options.encoding = _options.encoding || 'ascii';
	_options.step = _options.step || 30;
	OTP.call(this, _options);
};

Totp.prototype = Object.create(OTP.prototype);
Totp.prototype.constructor = Totp;

/**
 * Validate the token
 * @param {String} data.token the token initially generated
 * @param {Integer} data.seconds time in seconds - default to Date.now()
 * @param {String} data.secret the secret
 * @param {String} data.algorithm digest
 * @param  {Integer} data.num_digits length of the token
 *
 * @returns {boolean} true if token is valid, false otherwise
 */

Totp.prototype.createToken = function (data) {

	const counterTime = data.seconds &&  Number.isInteger(parseInt(data.seconds))? new Date(data.seconds) *1000 :Date.now();

	let c = Math.floor(counterTime /30/1000);
	let b1 = Buffer.alloc(8);
	b1.writeInt32BE(c,4);
	/*
	let counter = new String(intToHex(Math.floor(new Date(seconds) *1000/30/1000)));
	if(counter.length < 16){
		for(var i = counter.length;i<16;i++){
			counter = '0'+counter
		}
	}
	let  counterBuffer = Buffer.from(counter,'hex')
    console.log(counterBuffer)
   */
	return OTP.prototype.tokenize.call(this,{counter: b1,secret: data.secret,num_digits: data.num_digits,algorithm: data.algorithm});
};

/**
 * Validate the token
 * @param {String} data.token the token intially generated
 * @param {String} data.seconds time in seconds
 * @param {String} data.secret the secret
 * @param {String} data.algorithm digest
 * @param  {Integer} data.num_digits length of the token
 *
 * @returns {boolean} true if token is valid, false otherwise
 */

Totp.prototype.validate = function(data){
	const expectedToken  = data.token;
	const token = this.createToken({seconds: data.seconds, secret: data.secret,num_digits: data.num_digits, algorithm: data.algorithm});
	return token === expectedToken;
};

module.exports = Totp;
