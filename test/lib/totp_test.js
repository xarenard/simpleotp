'use strict';
/* eslint-env mocha */
const Totp = require('../../lib/totp.js');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

const secret = '12345678901234567890';

const zeroPaddingTestDatas = [
	{ seconds: 3060, algorithm: 'sha1', expected_token: '00629694' },
	{ seconds: 4620, algorithm: 'sha256', expected_token: '00836417' },
	{ seconds: 5100, algorithm: 'sha512', expected_token: '00458766' }
];

describe('TOTP use case', () => {

	let totp = null;

	beforeEach('HOTP instancation', function() {
		totp = new Totp();
	});
	describe('secret not  being defined', function() {
		it('should throw error', () => {
			expect(function() {
				totp.createToken({seconds: 59});
			}).to.throw(Error);
		});
	});

	describe('secret being  null', function() {
		it('should throw error', () => {
			expect(function() {
				totp.createToken({seconds: 59,secret: null});
			}).to.throw(Error);
		});
	});

	describe('seconds is not defined', function() {
		it('current time should be pickup', () => {
			const token = totp.createToken({ secret:'1234'});
			const token2 = totp.createToken({seconds: Date.now() /1000,secret:'1234'});
			assert.equal(token, token2);
			//totp.createTokenFromSeconds({secret: 'abcde'})

		});
	});

	describe('step is undefined', function() {
		it('Default 30 seconds should be picked up', () => {
			const token = totp.createToken({ secret:'1234'});
			const token2 = totp.createToken({seconds: Date.now() /1000,secret:'1234'});
			assert.equal(token, token2);
			//totp.createTokenFromSeconds({secret: 'abcde'})

		});
	});

	describe('step is null', function() {
		it('Default 30 seconds should be picked up', () => {
			const token = totp.createToken({ secret:'1234'});
			const token2 = totp.createToken({seconds: Date.now() /1000,secret:'1234',step: null});
			assert.equal(token, token2);
		});
	});

	describe('step is a string', function() {
		it('Default 30 seconds should be picked up', () => {
			const token = totp.createToken({ secret:'1234'});
			const token2 = totp.createToken({seconds: Date.now() /1000,secret:'1234',step: 'test'});
			assert.equal(token, token2);
		});
	});

	describe('step is float', function() {
		it('Default 30 seconds should be picked up', () => {
			const token = totp.createToken({ secret:'1234'});
			const token2 = totp.createToken({seconds: Date.now() /1000,secret:'1234',step: 3.14 });
			assert.equal(token, token2);
		});
	});

	describe('Double Zero Padding - Generating token', () => {
		//var totp = new Totp();
		zeroPaddingTestDatas.forEach((data) => {
			it('Ascii secret ' + secret + ' and ' + data.seconds + ' second should give token ' + data.expected_token, () => {
				const totp = new Totp({num_digits: 8, algorithm: data.algorithm});
				const token = totp.createToken({seconds: data.seconds, secret: secret});
				assert.equal(token, data.expected_token);
			});
		});
	});

	describe('Double Zero Padding - Validate token', () => {
		//var totp = new Totp();
		zeroPaddingTestDatas.forEach((data) => {
			it('Ascii secret ' + secret + ' and ' + data.seconds + ' second should give token ' + data.expected_token, () => {
				const totp = new Totp({num_digits: 8});
				const token = totp.createToken({seconds: data.seconds, secret: secret,algorithm: data.algorithm});
				totp.validate({token: token, seconds: data.seconds,secret: secret,algorithm:data.algorithm});
				assert.equal(token, data.expected_token);
			});
		});
	});
});