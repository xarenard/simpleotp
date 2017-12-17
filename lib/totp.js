'use strict';
const OTP = require('./otp.js');
const intToHex = require('./utils').intToHex;

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

	const counterTime = data.seconds &&  Number.isInteger(data.seconds)? new Date(data.seconds) *1000 :Date.now();
	const step = (Number.isInteger(data.step) &&  data.step !== 0)?data.step:this.options.step;
	let counter = new String(intToHex(Math.floor(counterTime /step/1000)));
	if(counter.length < 16){
		for(var i = counter.length;i<16;i++){
			counter = '0'+ counter;
		}
	}
	let  counterBuffer = Buffer.from(counter,'hex');
	return OTP.prototype.tokenize.call(this,{counter: counterBuffer,secret: data.secret,num_digits: data.num_digits,algorithm: data.algorithm,step: data.step});
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
