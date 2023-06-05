const express = require('express');
const { Wallets } = require('fabric-network');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON request bodies
app.use(express.json());

// Route to handle the POST request
app.post('/add-identity-to-wallet', async (req, res) => {
  try {
    // Extract the request body parameters
    const { identityLabel, certificatePath, privateKeyPath, mspId } = req.body;

    // Create a new wallet instance
    const wallet = await Wallets.newFileSystemWallet('../identity/user/Divesh/wallet');

    // Read the certificate and private key files
    const certificate = fs.readFileSync(path.resolve(__dirname, certificatePath)).toString();
    const privateKey = fs.readFileSync(path.resolve(__dirname, privateKeyPath)).toString();

    // Create the identity object
    const identity = {
      credentials: {
        certificate,
        privateKey,
      },
      mspId,
      type: 'X.509',
    };

    // Store the identity in the wallet
    await wallet.put(identityLabel, identity);

    // Return a success response
    res.status(200).json({ message: 'Identity added to wallet successfully' });
  } catch (error) {
    // Handle errors and return an error response
    console.log('Error adding identity to wallet:', error);
    res.status(500).json({ error: 'An error occurred while adding identity to wallet' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});


















// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  *  SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// // Bring key classes into scope, most importantly Fabric SDK network class
// const fs = require('fs');
// const { Wallets } = require('fabric-network');
// const path = require('path');

// const fixtures = path.resolve(__dirname, '../../../../test-network');

// async function main() {

//     // Main try/catch block
//     try {

//         // A wallet stores a collection of identities
//         const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');

//         // Identity to credentials to be stored in the wallet
//         const credPath = path.join(fixtures, '/organizations/peerOrganizations/org1.example.com/users/User1@org1.example.com');
//         const certificate = fs.readFileSync(path.join(credPath, '/msp/signcerts/User1@org1.example.com-cert.pem')).toString();
//         const privateKey = fs.readFileSync(path.join(credPath, '/msp/keystore/priv_sk')).toString();

//         // Load credentials into wallet
//         const identityLabel = 'balaji';

//         const identity = {
//             credentials: {
//                 certificate,
//                 privateKey
//             },
//             mspId: 'Org1MSP',
//             type: 'X.509'
//         }

//         await wallet.put(identityLabel, identity);

//     } catch (error) {
//         console.log(`Error adding to wallet. ${error}`);
//         console.log(error.stack);
//     }
// }

// main().then(() => {
//     console.log('done');
// }).catch((e) => {
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);
// });
