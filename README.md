# Simple OTP
Time-based and HMAC-based One-Time Password libraryfor node.js

- [About](#about)
- [Installation](#installation)
- [Usage](#usage)
    - [HOTP](#hotp)
        - [Example](#hotp_example)
        - [Configuration](#hotp_example)
    - [TOTP](#totp)
        - [Example](#totp_example)
        - [Configuration](#totp_example)
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

<a name="hotp_example"></a>

#### Example
```js
const otp = require('simpleotp');
const hotp = new otp.Hotp();

// generate a token
const token = hotp.createToken({secret:'12345678901234567890',counter:7});

// validate the token
const data = {token: token, secret:'12345678901234567890',counter: 7};
const valid = hotp.validate(data); //true
```
<a name="totp_configuration"></a>
#### Configuration

##### Constructor options


| Option    |  Value              | Description           |Default Value    |
| ------------ | ---------------------- | ----------------------- | ----------- 
|algorithm   | sha1,sha256,sha512   |  Algorithm to use     | sha1      |
|num_digits  | integer              | token length          |6          |
|encoding    | ascii                | Encoding of the secret| ascii     |


##### Create Token options

| Option    | Mandatory | Value                   | Description                            | Default value         |
|------------|-----------|---------------------------|----------------------------------------|-----------------|
|secret      | y         |string type                | Share secret to use                    | N/A             |
|counter     | y         |integer type               | The counter seed                       | N/A             |
|algorithm   | n         |'sha1','sha256' or 'sha512'| Algorithm to use                       | sha1            |
|num_digits  | n         |integer type               | token length                           | 6               |
|encoding    | n         |'ascii'                    | Encoding of the secret                 | ascii           |

##### Validate token options

| Option     | Mandatory | Value                     | Description                            | Default value          |
|------------|-----------|---------------------------|----------------------------------------|-----------------|
|token       | y         |string type                | The original token                     | N/A             |
|secret      | y         |string type                | Share secret to use                    | N/A             |
|counter     | y         |integer type               | The counter seed                       | N/A             |
|algorithm   | n         |'sha1','sha256' or 'sha512'| Algorithm to use                       | sha1            |
|num_digits  | n         |integer type               | token length                           | 6               |
|encoding    | n         |'ascii'                    | Encoding of the secret                 | ascii           |
       

### TOTP
<a name="totp_example"></a>
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
<a name="totp_example"></a>
#### Configuration

##### Constructor options
| Option     |  Value              | Description                             |Default value          |
|------------|----------------------|-----------------------------------------|-----------------|
|algorithm   | 'sha1','sha256' or 'sha512'   | Algorithm to use                        |sha1            |
|num_digits  | integer              | token length                            |6                |
|encoding    | ascii                | Encoding of the secret                  |ascii           |
|step        | integer              | Number of the second the token is valid |30               |

##### Create Token options
| Option    | Mandatory | Value                    | Description                            | Default value         |
|------------|-----------|---------------------------|----------------------------------------|-----------------|
|secret      | y         | string type                | Share secret to use                    | N/A             |
|seconds     | y         | integer                   | time in seconds as counter              | Date.now()/1000 |
|step        | n         | integer                    | Number of the second the token is valid| 30              |
|algorithm   | n         | 'sha1','sha256' or 'sha512'| Algorithm to use                       | sha1            |
|num_digits  | n         | integer type               | token length                           | 6               |
|encoding    | n         | 'ascii'                    | Encoding of the secret                 | ascii           |

##### Validate token options
| Option     | Mandatory | Value                     | Description                            |Default value          |
|------------|-----------|---------------------------|----------------------------------------|-----------------|
|token       | y         | string type                | The original token                     | N/A             |
|secret      | y         | string type                | Share secret to use                    | N/A             |
|seconds     | Y         | integer                   | time in seconds as counter             | Date.now()/1000 |
|step        | n         | integer                    | Number of the second the token is valid| 30              |
|algorithm   | n         | 'sha1','sha256' or 'sha512'| Algorithm to use                       | sha1            |
|num_digits  | n         | integer type               | token length                           | 8               |
|encoding    | n         | 'ascii'                    | Encoding of the secret                 | ascii           |

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
