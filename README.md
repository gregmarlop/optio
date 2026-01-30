# Optio

A layered encryption system combining 12 ancestral cipher methods in a unique sequence derived from your secret key. Each key produces one of 479 million possible cipher combinations.

## Features

- 12 historical encryption methods combined in unique sequences
- 479,001,600 possible combinations (12!)
- Symmetric encryption (same key for seal/reveal)
- No servers, no registration, everything happens locally
- No tracking, no data storage
- Open source and auditable
- Works in browser and Node.js

## Cipher Methods

- **Caesar** - Alphabetic shift cipher
- **Atbash** - Alphabet inversion
- **Vigenère** - Polyalphabetic cipher with key
- **Beaufort** - Vigenère variant
- **Porta** - Extended key Vigenère
- **Trithemius** - Progressive shift
- **Substitution** - Full alphabet permutation
- **Alberti** - Dual Caesar with change point
- **Bifurcation** - Dual Caesar on halves
- **Rail Fence** - Zigzag transposition
- **Rotation** - Block rotation
- **Inversion** - Selective block inversion

## Installation

### Browser

Include the script in your HTML:

```html
<script src="optio.js"></script>
```

### Node.js

```javascript
const { encrypt, decrypt } = require('./optio.js');
```

### Web Interface

Simply open `optio.html` in any modern browser.  
No server required, everything runs locally.

## Usage

1. Enter a shared secret key (minimum 2 characters)
2. Type or paste your message
3. Click **SEAL** to encrypt or **REVEAL** to decrypt
4. Share the ciphertext through any channel
5. Recipient uses same key to reveal the message

### Browser API

```javascript
// Encrypt
const sealed = Optio.encrypt('mySecretKey', 'Hello World');

// Decrypt
const revealed = Optio.decrypt('mySecretKey', sealed);
```

### Node.js API

```javascript
const { encrypt, decrypt } = require('./optio.js');

// Encrypt
const sealed = encrypt('mySecretKey', 'Hello World');

// Decrypt
const revealed = decrypt('mySecretKey', sealed);
```

## How It Works

The key determines:
- The order of cipher application (479M permutations)
- Parameters for each cipher method
- Unique sequence for each unique key

Output is Base64 encoded for safe transport.

## Technical Details

- **Type**: Symmetric encryption
- **Layers**: 12 cipher methods
- **Permutations**: 12! = 479,001,600
- **Output**: Base64 encoded
- **Dependencies**: None

## Files

- `optio.html` - Standalone web interface
- `optio.js` - JavaScript library for browser and Node.js
- `README.md` - This file

## Author

Gregori M.

## Version

Current version: 1.0

## License

MIT License  
Copyright (c) 2026 Gregori M.
