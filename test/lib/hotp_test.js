'use strict';
/* eslint-env mocha */
const Hotp = require('../../lib/hotp.js');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;
const expectedTokens = [
	['4c93cf18', 1284755224],
	['41397eea', 1094287082],
	['82fef30', 137359152],
	['66ef7655', 1726969429],
	['61c5938a', 1640338314],
	['33c083d4', 868254676],
	['7256c032', 1918287922],
	['4e5b397', 82162583],
	['2823443f', 673399871],
	['2679dc69', 645520489]
];

describe('HOTP test case', () => {

	const hmac_token_decimal = 1284755224;
	const counter = 0;
	const asciiSecret = '12345678901234567890';
	const hexSecret = '3132333435363738393031323334353637383930';
	describe('Token generation with default options', () => {

		let expectedToken = hmac_token_decimal.toString().slice(-6);
		let token = null;

		beforeEach('Generate HOTP with ascii secret ' + asciiSecret, () => {
			let hotp = new Hotp();
			token = hotp.createToken({secret: asciiSecret, counter: counter});
		});
		it('Token shouldn\'t be null', () => {
			assert.isNotNull(token);
		});
		it('Token length should be equals to 6', () => {
			assert.equal(token.toString().length, 6);
		});
		it('Token length should be equals to ' + expectedToken, () => {
			assert.equal(token, expectedToken.toString().slice(-6));
		});
	});

	describe('Token Generation with various token output length', () => {
		const token_lengths = [6, 8, 10];
		token_lengths.forEach((token_length) => {
			describe('Token generation with ' + token_length + ' digits output', () => {
				let token = null;
				let expectedToken = hmac_token_decimal.toString().slice(-token_length);

				beforeEach('Generate HOTP with ascii secret ' + asciiSecret, () => {
					let hotp = new Hotp({num_digits: token_length});
					token = hotp.createToken({counter: counter, secret: asciiSecret});
				});
				it('Token shouldn\'t be null', function () {
					assert.isNotNull(token);
				});
				it('Token length should be equals to ' + token_length, () => {
					assert.equal(token.toString().length, token_length);
				});
				it('Token length should be equals to ' + expectedToken, () => {
					assert.equal(token, expectedToken);
				});
			});
		});
	});

	describe('Token Validation', () => {
		describe('With Ascii secret ' + asciiSecret, () => {
			let hotp = null;
			let token = null;
			beforeEach('HOTP instanciation', () => {
				hotp = new Hotp();
				token = hotp.createToken({secret: asciiSecret, counter: counter});
			});

			it('Token ' + token + ' with counter 0 should be valid', () => {
				const isValid = hotp.validate({token:token, counter:0, secret:asciiSecret, window:0});
				assert.isTrue(isValid);
			});

			it('Token ' + token + ' with counter 0 should be valid', () => {
				const isValid = hotp.validate({token: expectedTokens[7][1].toString().slice(-6), counter: 0, secret: asciiSecret, window:8});
				assert.isTrue(isValid);
			});

			it('Token ' + token + ' with counter 0 should be invalid', () => {
				const isValid = hotp.validate({token:expectedTokens[7][1].toString().slice(-6),counter: 0, secret:asciiSecret, window:4});
				assert.isFalse(isValid);
			});

			it('Token with bad digest should be  invalid', () => {
				expect(() => {
					hotp.createToken({secret: asciiSecret, counter: counter, encoding: 'hex', algorithm: 'md5'});
				}).to.throw(Error);
			});
		});

	});

	describe('Token Validation', () => {
		describe('With hexadecimal  secret ' + hexSecret, () => {
			let hotp = null;
			let token = null;

			beforeEach('HOTP instanciation', () => {
				hotp = new Hotp();
				token = hotp.createToken({secret: hexSecret, counter: counter, encoding: 'hex'});
			});

			it('Token ' + token + ' with counter 0 should be valid', () => {
				const isValid = hotp.validate({token:token, counter: 0, secret: hexSecret, window: 0, encoding:'hex'});
				assert.isTrue(isValid);
			});

			it('Token ' + token + ' with counter 0 should be valid', () => {
				const isValid = hotp.validate({token:expectedTokens[7][1].toString().slice(-6), counter:0, secret: asciiSecret, window:8});
				assert.isTrue(isValid);
			});

			it('Token ' + token + ' with counter 0 should be invalid', () => {
				const isValid = hotp.validate({token: expectedTokens[7][1].toString().slice(-6),counter: 0, secret:asciiSecret, window:4});
				assert.isFalse(isValid);
			});

			it('Token with bad digest should be  invalid', () => {
				expect(function() {
					hotp.createToken({secret: hexSecret, counter: counter, encoding: 'hex', algorithm: 'md5'});
				}).to.throw(Error);
			});
		});
	});
});