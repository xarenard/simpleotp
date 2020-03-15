const crypto = require('crypto');

/**
 *	Parent class for differents OTP type
 *
 * @param options {object} list of options
 * @constructor
 */
const OTP = function (options) {
	this.options = options;
	this.algorithms = ['sha1', 'sha256','sha512'];
};

/**
 * Return the options for the particular otp
 * @returns {*}
 */
OTP.prototype.getOptions = function () {
	return this.options;
};

/**
 *
 * @param algorithm sha1,sha256,sha512
 * @returns {number} digest size.
 * 		sha1: 20
 * 		sha256: 32
 * 		sha512: 64
 */
OTP.prototype.hashSize = function (algorithm) {
	if(!this.algorithms.includes(algorithm)){
		throw new Error ('Invalid digest');
	}
	// default to sha1
	let hashSize = 20;
	switch (algorithm) {
		case 'sha256':
			hashSize = 32;
			break;
		case 'sha512':
			hashSize = 64;
	}
	return hashSize;
};

OTP.prototype.tokenize = function(options) {

	const algorithm = options.algorithm || this.options.algorithm;

	const num_digits = options.num_digits || this.options.num_digits;
	const secretEncoding = options.encoding || 'ascii';
	const counter = options.counter;
	const secret = options.secret;

	if(!options.secret){
		throw new Error('Secret not defined');
	}
	const secret_buffer_size = this.hashSize(algorithm); // 20,32, 64 bytes for sha1, sha256 and sha512
	const  secretLength = secret.length;

	let secretBuffer = Buffer.from(secret,secretEncoding);//Buffer.isBuffer(secret) ? secret : Buffer.from(secret, options.encoding);

	if(secret_buffer_size && secretLength < secret_buffer_size){
		let newSecret = new Array((secret_buffer_size - secretLength) + 1).join(secretBuffer.toString('hex'));
		secretBuffer =  new Buffer(newSecret, 'hex').slice(0, secret_buffer_size);
	}

	const  hash = crypto.createHmac(algorithm, secretBuffer).update(counter).digest();
	const offset = hash[hash.length - 1] & 0xf;

	const binary = (hash[offset] & 0x7f) << 24
		| (hash[offset + 1] & 0xff) << 16
		| (hash[offset + 2] & 0xff) << 8
		| (hash[offset + 3] & 0xff);
	let token = new String(binary % Math.pow(10, num_digits));
	while (token.length < num_digits) {
		token = '0' + token.toString();
	}

	return token.toString();
};

module.exports = OTP;

