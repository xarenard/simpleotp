# Simple OTP
Time-based and HMAC-based One-Time Password libraryfor node.js

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
    - [HOTP](#hotp)
        - Generate a token
        - Validate a token
    - [TOTP](#totp)
        - Generate a token
        - Validate a token
- [Test](#test)
- [References](#references)
- [License](#license)
<a name="about"></a>
## About

simpleotp is a simple :-) OTP library for node.js.

It provides an implementation of both rfc 4226 (HOTP) and rfc 6238 (TOTP).
<a name="installation"></a>
## Installation
```
npm install --save simpleotp
```
<a name="usage"></a>
## Usage
<a name="hotp"></a>
### HOTP


#### Example
```js
const otp = require('simpleotp');
const hotp = new otp.Hotp();

// generate a token
const token = hotp.createToken({secret:'12345678901234567890',counter:7});

// validate the token
const data = {token: token, secret:'12345678901234567890',counter: 7}
const valid = hotp.validate(data) //true
```
### TOTP

#### Example
```js
const otp = require('simpleotp');
const totp = new otp.Totp();

// generate the token
const token = totp.createToken({secret:'12345678901234567890',seconds :Date.now()/1000});

// validate the token
const data = {token: token, secret:'12345678901234567890',seconds :Date.now()/1000}
const valid = totp.validate(data)
console.log(valid); // true
```

<a name="tests"></a>
## Tests
```
npm test
```
<a name="references"></a>
## References
<a name="license"></a>
## License
`simpleotp` is [MIT licensed](./LICENSE)
