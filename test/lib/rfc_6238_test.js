/* eslint-env mocha */
/*

Appendix B.  Test Vectors

   This section provides test values that can be used for the HOTP time-
   based variant algorithm interoperability test.
The test token shared secret uses the ASCII string value
   "12345678901234567890".  With Time Step X = 30, and the Unix epoch as
   the initial value to count time steps, where T0 = 0, the TOTP
   algorithm will display the following values for specified modes and
   timestamps.

  +-------------+--------------+---------- --------+----------+--------+
  |  Time (sec) |   UTC Time   | Value of T (hex) |   TOTP   |  Mode  |
  +-------------+--------------+------------------+----------+--------+
  |      59     |  1970-01-01  | 0000000000000001 | 94287082 |  SHA1  |
  |             |   00:00:59   |                  |          |        |
  |      59     |  1970-01-01  | 0000000000000001 | 46119246 | SHA256 |
  |             |   00:00:59   |                  |          |        |
  |      59     |  1970-01-01  | 0000000000000001 | 90693936 | SHA512 |
  |             |   00:00:59   |                  |          |        |
  |  1111111109 |  2005-03-18  | 00000000023523EC | 07081804 |  SHA1  |
  |             |   01:58:29   |                  |          |        |
  |  1111111109 |  2005-03-18  | 00000000023523EC | 68084774 | SHA256 |
  |             |   01:58:29   |                  |          |        |
  |  1111111109 |  2005-03-18  | 00000000023523EC | 25091201 | SHA512 |
  |             |   01:58:29   |                  |          |        |
  |  1111111111 |  2005-03-18  | 00000000023523ED | 14050471 |  SHA1  |
  |             |   01:58:31   |                  |          |        |
  |  1111111111 |  2005-03-18  | 00000000023523ED | 67062674 | SHA256 |
  |             |   01:58:31   |                  |          |        |
  |  1111111111 |  2005-03-18  | 00000000023523ED | 99943326 | SHA512 |
  |             |   01:58:31   |                  |          |        |
  |  1234567890 |  2009-02-13  | 000000000273EF07 | 89005924 |  SHA1  |
  |             |   23:31:30   |                  |          |        |
  |  1234567890 |  2009-02-13  | 000000000273EF07 | 91819424 | SHA256 |
  |             |   23:31:30   |                  |          |        |
  |  1234567890 |  2009-02-13  | 000000000273EF07 | 93441116 | SHA512 |
  |             |   23:31:30   |                  |          |        |
  |  2000000000 |  2033-05-18  | 0000000003F940AA | 69279037 |  SHA1  |
  |             |   03:33:20   |                  |          |        |
  |  2000000000 |  2033-05-18  | 0000000003F940AA | 90698825 | SHA256 |
  |             |   03:33:20   |                  |          |        |
  |  2000000000 |  2033-05-18  | 0000000003F940AA | 38618901 | SHA512 |
  |             |   03:33:20   |                  |          |        |
  | 20000000000 |  2603-10-11  | 0000000027BC86AA | 65353130 |  SHA1  |
  |             |   11:33:20   |                  |          |        |
  | 20000000000 |  2603-10-11  | 0000000027BC86AA | 77737706 | SHA256 |
  |             |   11:33:20   |                  |          |        |
  | 20000000000 |  2603-10-11  | 0000000027BC86AA | 47863826 | SHA512 |
  |             |   11:33:20   |                  |          |        |
  +-------------+--------------+------------------+----------+--------+

                            Table 1: TOTP Table
 */

const Totp = require('../../lib/totp.js');

const chai = require('chai');
const assert = chai.assert;

const secret = '12345678901234567890';

const testDatas = [
	{seconds: 59, algorithm: 'sha1', expected_token: '94287082'},
	{seconds: 59, algorithm: 'sha256', expected_token: 46119246},
	{seconds: 59, algorithm: 'sha512', expected_token: 90693936},
	{seconds: 1111111109, algorithm: 'sha1', expected_token: '07081804'},
	{seconds: 1111111109, algorithm: 'sha256', expected_token: 68084774},
	{seconds: 1111111109, algorithm: 'sha512', expected_token: 25091201},
	{seconds: 1111111111, algorithm: 'sha1', expected_token: '14050471'},
	{seconds: 1111111111, algorithm: 'sha256', expected_token: 67062674},
	{seconds: 1111111111, algorithm: 'sha512', expected_token: 99943326},
	{seconds: 1234567890, algorithm: 'sha1', expected_token: '89005924'},
	{seconds: 1234567890, algorithm: 'sha256', expected_token: 91819424},
	{seconds: 1234567890, algorithm: 'sha512', expected_token: 93441116},
	{seconds: 2000000000, algorithm: 'sha1', expected_token: '69279037'},
	{seconds: 2000000000, algorithm: 'sha256', expected_token: 90698825},
	{seconds: 2000000000, algorithm: 'sha512', expected_token: 38618901},
	{seconds: 20000000000, algorithm: 'sha1', expected_token: '65353130'},
	{seconds: 20000000000, algorithm: 'sha256', expected_token: 77737706},
	{seconds: 20000000000, algorithm: 'sha512', expected_token: 47863826},

];

describe('RFC 6328 - TOTP use case', () => {
	describe('Generating token', () => {
		//var totp = new Totp();
		testDatas.forEach((data) => {
			it('Ascii secret ' + secret + ' and ' + data.seconds + ' second should give token ' + data.expected_token, () => {
				const totp = new Totp({num_digits: 8, algorithm: data.algorithm});
				const token = totp.createToken({seconds: data.seconds, secret: secret});
				assert.equal(token, data.expected_token);
			});
		});
	});

	describe('Validate token', () => {
		//var totp = new Totp();
		testDatas.forEach((data) => {
			it('Ascii secret ' + secret + ' and ' + data.seconds + ' second should give token ' + data.expected_token, () => {
				const totp = new Totp({num_digits: 8});
				const token = totp.createToken({seconds: data.seconds, secret: secret,algorithm: data.algorithm});
				totp.validate({token: token, seconds: data.seconds,secret: secret,algorithm:data.algorithm});
				assert.equal(token, data.expected_token);
			});
		});
	});
});