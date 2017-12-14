'use strict';
/* eslint-env mocha */
/*
 *  See rfc 4996 test case: https://tools.ietf.org/html/rfc4226
 *
 *  The following test data uses the ASCII string
 * '12345678901234567890' for the secret:
 *
 Secret = 0x3132333435363738393031323334353637383930

 Table 1 details for each count, the intermediate HMAC value.

 Count    Hexadecimal HMAC-SHA-1(secret, count)
 0        cc93cf18508d94934c64b65d8ba7667fb7cde4b0
 1        75a48a19d4cbe100644e8ac1397eea747a2d33ab
 2        0bacb7fa082fef30782211938bc1c5e70416ff44
 3        66c28227d03a2d5529262ff016a1e6ef76557ece
 4        a904c900a64b35909874b33e61c5938a8e15ed1c
 5        a37e783d7b7233c083d4f62926c7a25f238d0316
 6        bc9cd28561042c83f219324d3c607256c03272ae
 7        a4fb960c0bc06e1eabb804e5b397cdc4b45596fa
 8        1b3c89f65e6c9e883012052823443f048b4332db
 9        1637409809a679dc698207310c8c7fc07290d9e5

 Table 2 details for each count the truncated values (both in
 hexadecimal and decimal) and then the HOTP value.

 Truncated
 Count    Hexadecimal    Decimal        HOTP
 0        4c93cf18       1284755224     755224
 1        41397eea       1094287082     287082
 2         82fef30        137359152     359152
 3        66ef7655       1726969429     969429
 4        61c5938a       1640338314     338314
 5        33c083d4        868254676     254676
 6        7256c032       1918287922     287922
 7         4e5b397         82162583     162583
 8        2823443f        673399871     399871
 9        2679dc69        645520489     520489
 *
 */

const Hotp = require('../../lib/hotp.js');
const chai = require('chai');
const assert = chai.assert;

const asciiSecret = '12345678901234567890';
const hexSecret = '3132333435363738393031323334353637383930';

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

describe('RFC 4996 - HOTP use cases', function () {

	describe('HOTP token with ascii secret: ' + asciiSecret, function () {
		const hotp = new Hotp();
		expectedTokens.forEach(function (expectedToken, counter) {
			let expectedTokenTruncated = expectedToken[1].toString().slice(-6);
			it('Should be equal to ' + expectedTokenTruncated + ' with counter ' + counter, function () {
				const data  = { counter: counter, secret: asciiSecret};
				let token = hotp.createToken(data);
				assert.equal(token, expectedTokenTruncated);
			});
		});
	});

	describe('HOTP token with hexadecimal secret: ' + hexSecret, function () {
		const hotp = new Hotp();
		const num_digits = hotp.getOptions().num_digits;
		expectedTokens.forEach(function (expectedToken, counter) {
			let expectedTokenTruncated = expectedToken[1].toString().slice(-num_digits);
			it('Should be equal to ' + expectedTokenTruncated + ' with counter ' + counter, function () {
				const data  = { counter: counter,secret: hexSecret,encoding: 'hex'};
				let token = hotp.createToken(data);
				assert.equal(token, expectedTokenTruncated);

			});
		});
	});

	describe('Token Validation with ascii secret:' + asciiSecret, function () {
		expectedTokens.forEach(function(expectedToken, counter){
			let hotp = new Hotp();
			let token = hotp.createToken({counter: counter,secret: asciiSecret});

			it('And token '+ expectedToken[1].toString().slice(-6) +' with counter '+ counter +' should be valid', function () {

				const isValid = hotp.validate({token:token, counter:counter, secret:asciiSecret, window: 0});
				assert.isTrue(isValid);
			});
		});
	});
/*
	describe('Token Validation with hex secret:' + hexSecret, function () {
		expectedTokens.forEach(function(expectedToken, counter){
			const hotp = new Hotp({secret: hexSecret,encoding: 'hex'});
			let token = hotp.createToken({counter:counter, secret: hexSecret,encoding: 'hex'});
			it('And token '+ expectedToken[1].toString().slice(-6) +' with counter '+ counter +' should be valid', function () {
				const isValid = hotp.validateToken(token, counter, hexSecret, 0);
				assert.isTrue(isValid);
			});
		});
	});
*/
});