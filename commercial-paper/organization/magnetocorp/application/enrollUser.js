const express = require('express');
const { Wallets } = require('fabric-network');
const FabricCAServices = require('fabric-ca-client');
const fs = require('fs');
const yaml = require('js-yaml');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

app.post('/enrollUser', async (req, res) => {
  try {
    // Load the network configuration
    const connectionProfilePath = '../gateway/connection-org2.yaml';
    const connectionProfile = yaml.safeLoad(fs.readFileSync(connectionProfilePath, 'utf8'));

    // // Create a new CA client for interacting with the CA
    // const caInfo = connectionProfile.certificateAuthorities['ca.org2.example.com'];
    // const caTLSCACerts = caInfo.tlsCACerts.pem;
    // const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

        // Create a new CA client for interacting with the CA.
        const caInfo = connectionProfile.certificateAuthorities['ca.org2.example.com'];
        const caTLSCACerts = caInfo.tlsCACerts.pem;
        const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);


    // Create a new file system-based wallet for managing identities
    const walletPath = path.join(__dirname, '../identity/user', req.body.userId, 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);
    console.log(`Wallet path: ${walletPath}`);

    // Check if the user already exists in the wallet
    const userExists = await wallet.get(req.body.userId);
    if (userExists) {
      console.log(`An identity for the client user "${req.body.userId}" already exists in the wallet`);
      return res.status(400).json({ error: `Identity for "${req.body.userId}" already exists` });
    }

    // Enroll the user and import the new identity into the wallet
    const enrollment = await ca.enroll({ enrollmentID: req.body.userId, enrollmentSecret: req.body.enrollmentSecret });
    const x509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: 'Org2MSP',
      type: 'X.509',
    };
    await wallet.put(req.body.userId, x509Identity);
    console.log(`Successfully enrolled client user "${req.body.userId}" and imported it into the wallet`);

    res.status(200).json({ message: `Enrolled client user "${req.body.userId}" successfully` });
  } catch (error) {
    console.error(`Failed to enroll client user "${req.body.userId}": ${error}`);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});

































// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  * SPDX-License-Identifier: Apache-2.0
//  */

// 'use strict';

// const FabricCAServices = require('fabric-ca-client');
// const { Wallets } = require('fabric-network');
// const fs = require('fs');
// const yaml = require('js-yaml');
// const path = require('path');

// async function main() {
//     try {
//         // load the network configuration
//         let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

//         // Create a new CA client for interacting with the CA.
//         const caInfo = connectionProfile.certificateAuthorities['ca.org2.example.com'];
//         const caTLSCACerts = caInfo.tlsCACerts.pem;
//         const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: false }, caInfo.caName);

//         // Create a new file system based wallet for managing identities.
//         const walletPath = path.join(process.cwd(), '../identity/user/isabella/wallet');
//         const wallet = await Wallets.newFileSystemWallet(walletPath);
//         console.log(`Wallet path: ${walletPath}`);

//         // Check to see if we've already enrolled the admin user.
//         const userExists = await wallet.get('isabella');
//         if (userExists) {
//             console.log('An identity for the client user "user1" already exists in the wallet');
//             return;
//         }

//         // Enroll the admin user, and import the new identity into the wallet.
//         const enrollment = await ca.enroll({ enrollmentID: 'user1', enrollmentSecret: 'user1pw' });
//         const x509Identity = {
//             credentials: {
//                 certificate: enrollment.certificate,
//                 privateKey: enrollment.key.toBytes(),
//             },
//             mspId: 'Org2MSP',
//             type: 'X.509',
//         };
//         await wallet.put('isabella', x509Identity);
//         console.log('Successfully enrolled client user "isabella" and imported it into the wallet');

//     } catch (error) {
//         console.error(`Failed to enroll client user "isabella": ${error}`);
//         process.exit(1);
//     }
// }

// main();
