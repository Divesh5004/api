const express = require('express');
const app = express();
app.use(express.json());


// Endpoint for the buy transaction
app.post('/buy', async (req, res) => {
  try {
    // Bring key classes into scope
    const fs = require('fs');
    const yaml = require('js-yaml');
    const { Wallets, Gateway } = require('fabric-network');
    const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');

    // A wallet stores a collection of identities for use
    const wallet = await Wallets.newFileSystemWallet('../identity/user/Divesh/wallet');

    // Specify userName for network access
    const userName = 'Divesh';

    // Load connection profile; will be used to locate a gateway
    let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

    // Set connection options; identity and wallet
    let connectionOptions = {
      identity: userName,
      wallet: wallet,
      discovery: { enabled: true, asLocalhost: true }
    };

    // Connect to gateway using application specified parameters
    console.log('Connect to Fabric gateway.');
    const gateway = new Gateway();
    await gateway.connect(connectionProfile, connectionOptions);

    // Access PaperNet network
    console.log('Use network channel: mychannel.');
    const network = await gateway.getNetwork('mychannel');

    // Get addressability to commercial paper contract
    console.log('Use org.papernet.commercialpaper smart contract.');
    const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

    // Extract parameters from the request body
    const { issuer, paperNumber, buyer, seller, price, purchaseDate } = req.body;

    // Validate required parameters
    if (!issuer || !paperNumber || !buyer || !seller || !price || !purchaseDate) {
      throw new Error('Missing required parameters. Please provide issuer, paperNumber, buyer, seller, price, and purchaseDate.');
    }

    // Buy commercial paper
    console.log('Submit commercial paper buy transaction.');
    const buyResponse = await contract.submitTransaction('buy', issuer, paperNumber, buyer, seller, price, purchaseDate);

    // Process response
    console.log('Process buy transaction response.');
    let paper = CommercialPaper.fromBuffer(buyResponse);
    console.log(`${paper.issuer} commercial paper: ${paper.paperNumber} successfully purchased by ${paper.owner}`);
    console.log('Transaction complete.');

    // Send the response
    res.status(200).json({
      message: 'Buy transaction completed successfully.',
      data: {
        issuer: paper.issuer,
        paperNumber: paper.paperNumber,
        owner: paper.owner
      }
    });

    // Disconnect from the gateway
    console.log('Disconnect from Fabric gateway.');
    await gateway.disconnect();
  } catch (error) {
    console.log(`Error processing transaction. ${error}`);
    console.log(error.stack);
    res.status(500).json({ error: 'An error occurred while processing the request' });
  }
});

// Start the server
const port = 3000;
app.listen(port, () => {
  console.log(`API server is running on port ${port}`);
});
























// const express = require('express');
// const app = express();

// // Endpoint for the buy transaction
// app.post('/buy', async (req, res) => {
//   try {
//     // Bring key classes into scope
//     const fs = require('fs');
//     const yaml = require('js-yaml');
//     const { Wallets, Gateway } = require('fabric-network');
//     const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');

//     // A wallet stores a collection of identities for use
//     const wallet = await Wallets.newFileSystemWallet('../identity/user/Divesh/wallet');

//     // Specify userName for network access
//     const userName = 'Divesh';

//     // Load connection profile; will be used to locate a gateway
//     let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

//     // Set connection options; identity and wallet
//     let connectionOptions = {
//       identity: userName,
//       wallet: wallet,
//       discovery: { enabled: true, asLocalhost: true }
//     };

//     // Connect to gateway using application specified parameters
//     console.log('Connect to Fabric gateway.');
//     const gateway = new Gateway();
//     await gateway.connect(connectionProfile, connectionOptions);

//     // Access PaperNet network
//     console.log('Use network channel: mychannel.');
//     const network = await gateway.getNetwork('mychannel');

//     // Get addressability to commercial paper contract
//     console.log('Use org.papernet.commercialpaper smart contract.');
//     const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

//     // Extract parameters from the request body
//     const { issuer, paperNumber, buyer, seller, price, purchaseDate } = req.body;

//     // Buy commercial paper
//     console.log('Submit commercial paper buy transaction.');
//     const buyResponse = await contract.submitTransaction('buy', issuer, paperNumber, buyer, seller, price, purchaseDate);

//     // Process response
//     console.log('Process buy transaction response.');
//     let paper = CommercialPaper.fromBuffer(buyResponse);
//     console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
//     console.log('Transaction complete.');

//     // Send the response
//     res.status(200).json({
//       message: 'Buy transaction completed successfully.',
//       data: {
//         issuer: paper.issuer,
//         paperNumber: paper.paperNumber,
//         owner: paper.owner
//       }
//     });

//     // Disconnect from the gateway
//     console.log('Disconnect from Fabric gateway.');
//     await gateway.disconnect();
//   } catch (error) {
//     console.log(`Error processing transaction. ${error}`);
//     console.log(error.stack);
//     res.status(500).json({ error: 'An error occurred while processing the request' });
//   }
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`API server is running on port ${port}`);
// });























// const express = require('express');
// const app = express();

// // Endpoint for the buy transaction
// app.post('/buy', async (req, res) => {
//   try {
//     // Bring key classes into scope
//     const fs = require('fs');
//     const yaml = require('js-yaml');
//     const { Wallets, Gateway } = require('fabric-network');
//     const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');

//     // A wallet stores a collection of identities for use
//     const wallet = await Wallets.newFileSystemWallet('../identity/user/abhi/wallet');

//     // A gateway defines the peers used to access Fabric networks
//     const gateway = new Gateway();

//     // Specify userName for network access
//     const userName = 'abhi';

//     // Load connection profile; will be used to locate a gateway
//     let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

//     // Set connection options; identity and wallet
//     let connectionOptions = {
//       identity: userName,
//       wallet: wallet,
//       discovery: { enabled: true, asLocalhost: true }
//     };

//     // Connect to gateway using application specified parameters
//     console.log('Connect to Fabric gateway.');
//     await gateway.connect(connectionProfile, connectionOptions);

//     // Access PaperNet network
//     console.log('Use network channel: mychannel.');
//     const network = await gateway.getNetwork('mychannel');

//     // Get addressability to commercial paper contract
//     console.log('Use org.papernet.commercialpaper smart contract.');
//     const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

//     // Extract parameters from the request body
//     const { issuer, paperNumber, buyer, seller, price, purchaseDate } = req.body;

//     // Buy commercial paper
//     console.log('Submit commercial paper buy transaction.');
//     const buyResponse = await contract.submitTransaction('buy', issuer, paperNumber, buyer, seller, price, purchaseDate);

//     // Process response
//     console.log('Process buy transaction response.');
//     let paper = CommercialPaper.fromBuffer(buyResponse);
//     console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
//     console.log('Transaction complete.');

//     // Send the response
//     res.status(200).json({
//       message: 'Buy transaction completed successfully.',
//       data: {
//         issuer: paper.issuer,
//         paperNumber: paper.paperNumber,
//         owner: paper.owner
//       }
//     });
//   } catch (error) {
//     console.log(`Error processing transaction. ${error}`);
//     console.log(error.stack);
//     res.status(500).json({ error: 'An error occurred while processing the request' });
//   } finally {
//     // Disconnect from the gateway
//     console.log('Disconnect from Fabric gateway.');
//     gateway.disconnect();
//   }
// });

// // Start the server
// const port = 3000;
// app.listen(port, () => {
//   console.log(`API server is running on port ${port}`);
// });


























// /*
//  * Copyright IBM Corp. All Rights Reserved.
//  *
//  * SPDX-License-Identifier: Apache-2.0
// */

// /*
//  * This application has 6 basic steps:
//  * 1. Select an identity from a wallet
//  * 2. Connect to network gateway
//  * 3. Access PaperNet network
//  * 4. Construct request to buy commercial paper
//  * 5. Submit transaction
//  * 6. Process response
//  */

// 'use strict';

// // Bring key classes into scope, most importantly Fabric SDK network class
// const fs = require('fs');
// const yaml = require('js-yaml');
// const { Wallets, Gateway } = require('fabric-network');
// const CommercialPaper = require('../../magnetocorp/contract/lib/paper.js');


// // Main program function
// async function main () {

//     // A wallet stores a collection of identities for use
//     const wallet = await Wallets.newFileSystemWallet('../identity/user/balaji/wallet');


//     // A gateway defines the peers used to access Fabric networks
//     const gateway = new Gateway();

//     // Main try/catch block
//     try {

//         // Specify userName for network access
//         const userName = 'balaji';

//         // Load connection profile; will be used to locate a gateway
//         let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org1.yaml', 'utf8'));

//         // Set connection options; identity and wallet
//         let connectionOptions = {
//             identity: userName,
//             wallet: wallet,
//             discovery: { enabled: true, asLocalhost: true }

//         };

//         // Connect to gateway using application specified parameters
//         console.log('Connect to Fabric gateway.');

//         await gateway.connect(connectionProfile, connectionOptions);

//         // Access PaperNet network
//         console.log('Use network channel: mychannel.');

//         const network = await gateway.getNetwork('mychannel');

//         // Get addressability to commercial paper contract
//         console.log('Use org.papernet.commercialpaper smart contract.');

//         const contract = await network.getContract('papercontract', 'org.papernet.commercialpaper');

//         // buy commercial paper
//         console.log('Submit commercial paper buy transaction.');

//         const buyResponse = await contract.submitTransaction('buy', 'MagnetoCorp', '00001', 'MagnetoCorp', 'DigiBank', '4900000', '2020-05-31');

//         // process response
//         console.log('Process buy transaction response.');

//         let paper = CommercialPaper.fromBuffer(buyResponse);

//         console.log(`${paper.issuer} commercial paper : ${paper.paperNumber} successfully purchased by ${paper.owner}`);
//         console.log('Transaction complete.');

//     } catch (error) {

//         console.log(`Error processing transaction. ${error}`);
//         console.log(error.stack);

//     } finally {

//         // Disconnect from the gateway
//         console.log('Disconnect from Fabric gateway.');
//         gateway.disconnect();

//     }
// }
// main().then(() => {

//     console.log('Buy program complete.');

// }).catch((e) => {

//     console.log('Buy program exception.');
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);

// });
