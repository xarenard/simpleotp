const OTP = require('./otp');
/**
 * HOTP class
 * @param {object} options
 * @param {String} options.algorithm algorithm to use (sha1, sha256, sha512) - default sha1
 * @param {Integer} options.num_digits number of digits to output for the token - default 6
 * @param {String} options.encoding encoding of the secret - default ascii
 *
 * @constructor
 */
const Hotp = function (opts) {
	let _options = (typeof opts === 'undefined' || opts === null) ? {} : opts;
	_options.algorithm = _options.algorithm || 'sha1';
	_options.num_digits = _options.num_digits || 6;
	_options.encoding = _options.encoding || 'ascii';
	OTP.call(this, _options);
};

Hotp.prototype = Object.create(OTP.prototype);
Hotp.prototype.constructor = Hotp;

/**
 *  Generate the token
 * @param {object} data
 * @param {String} data.counter the counter use to compute the hotp
 * @param {String} data.secret to use in order to compute the hotp
 * @param {encoding} data.encoding secret encoding
 * @param {encoding} data.algorithm digest
 * @param  {num-digits} data.num_digits length of the token
 * @returns {String} generated token
 */
Hotp.prototype.createToken = function (data) {
	let counter = data.counter;
	const secret = data.secret;

	const buf = new Buffer(8);
	for (let i = buf.length - 1; i >= 0; i--) {
		buf[i] = counter & 0xff;
		counter >>= 8;
	}
	return OTP.prototype.tokenize.call(this,{counter: buf, secret: secret,encoding: data.encoding,algorithm: data.algorithm,num_digits: data.num_digits});
};

/**
 * Validate the token
 * @param {String} data.token the token intially generated
 * @param {String} data.counter the counter
 * @param {String} data.secret the secret
 * @param {Integer} data.window windows
 * @param {String} data.algorithm digest
 * @param  {Integer} data.num_digits length of the token
 *
 * @returns {boolean} true if token is valid, false otherwise
 */

Hotp.prototype.validate = function (data) {
	const expectedToken = data.token;
	const counter = data.counter;
	const secret = data.secret;
	const window = data.window;
	const num_digits = this.options.num_digits;
	const algorithm = data.algorithm;

	let isValid = false;
	let window_frame = counter + (window || 0);

	let i = counter;
	while(i <= window_frame && !isValid){
		let token = this.createToken({num_digits: num_digits,counter:i,secret: secret,encoding: data.encoding, algorithm: algorithm});
		if (token.toString() === expectedToken) {
			isValid = true;
		}
		i++;
	}
	return isValid;
};

module.exports = Hotp;
