'use strict';
/* eslint-env mocha */
const Totp = require('../../lib/totp.js');
const chai = require('chai');
const assert = chai.assert;
const expect = chai.expect;

describe('HOTP use case', () => {

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

});