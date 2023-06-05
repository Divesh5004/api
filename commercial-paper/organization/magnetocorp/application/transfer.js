const express = require('express');
const fs = require('fs');
const yaml = require('js-yaml');
const { Wallets, Gateway } = require('fabric-network');
const CommercialPaper = require('../contract/lib/paper.js');

const app = express();
const port = 3000;

// Parse JSON request bodies
app.use(express.json());

// Define the API endpoint
app.post('/api/transfer-commercial-paper', async (req, res) => {
    try {
        const {
            userName,
            connectionProfilePath,
            walletPath,
            // identityLabel,
            issuer,
            paperNumber,
            newOwner,
            newOwnerMsp,
            transferDate
        } = req.body;

        // A wallet stores a collection of identities for use
        const wallet = await Wallets.newFileSystemWallet(walletPath);

        // A gateway defines the peers used to access Fabric networks
        const gateway = new Gateway();

        // Load connection profile; will be used to locate a gateway
        let connectionProfile = yaml.safeLoad(fs.readFileSync(connectionProfilePath, 'utf8'));

        // Set connection options; identity and wallet
        let connectionOptions = {
            identity: userName,
            wallet: wallet,
            discovery: { enabled: true, asLocalhost: true }
        };

        // Connect to gateway using application specified parameters
        console.log('Connect to Fabric gateway.');
        await gateway.connect(connectionProfile, connectionOptions);

        // Access PaperNet network
        console.log('Use network channel: mychannel.');
        const network = await gateway.getNetwork('mychannel');

        // Get addressability to commercial paper contract
        console.log('Use org.papernet.commercialpaper smart contract.');
        const contract = await network.getContract('papercontract');

        // Transfer commercial paper
        console.log('Submit commercial paper transfer transaction.');
        const transferResponse = await contract.submitTransaction(
            'transfer',
            issuer,
            paperNumber,
            newOwner,
            newOwnerMsp,
            transferDate
        );

        // Process response
        console.log('Process transfer transaction response.' + transferResponse);
        let paper = CommercialPaper.fromBuffer(transferResponse);

        const response = `Commercial paper issued by ${paper.issuer} : ${paper.paperNumber} was successfully transferred`;
        console.log(response);
        console.log('Transaction complete.');

        // Send the response back to the client
        res.status(200).json({ message: response });
    } catch (error) {
        console.log(`Error processing transaction. ${error}`);
        console.log(error.stack);

        // Send an error response back to the client
        res.status(500).json({ error: 'An error occurred while processing the transaction' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});





































/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
*/

/*
 * This application has 6 basic steps:
 * 1. Select an identity from a wallet
 * 2. Connect to network gateway
 * 3. Access PaperNet network
 * 4. Construct request to transfer commercial paper
 * 5. Submit transaction
 * 6. Process response
 */

'use strict';

// // Bring key classes into scope, most importantly Fabric SDK network class
// const fs = require('fs');
// const yaml = require('js-yaml');
// const { Wallets, Gateway } = require('fabric-network');
// const CommercialPaper = require('../contract/lib/paper.js');

// // Main program function
// async function main() {

//     // A wallet stores a collection of identities for use
//     const wallet = await Wallets.newFileSystemWallet('../identity/user/isabella/wallet');

//     // A gateway defines the peers used to access Fabric networks
//     const gateway = new Gateway();

//     // Main try/catch block
//     try {

//         // Specify userName for network access
//         // const userName = 'isabella.issuer@magnetocorp.com';
//         const userName = 'isabella';

//         // Load connection profile; will be used to locate a gateway
//         let connectionProfile = yaml.safeLoad(fs.readFileSync('../gateway/connection-org2.yaml', 'utf8'));

//         // Set connection options; identity and wallet
//         let connectionOptions = {
//             identity: userName,
//             wallet: wallet,
//             discovery: { enabled:true, asLocalhost: true }
//         };

//         // Connect to gateway using application specified parameters
//         console.log('Connect to Fabric gateway.');

//         await gateway.connect(connectionProfile, connectionOptions);

//         // Access PaperNet network
//         console.log('Use network channel: mychannel.');

//         const network = await gateway.getNetwork('mychannel');

//         // Get addressability to commercial paper contract
//         console.log('Use org.papernet.commercialpaper smart contract.');

//         const contract = await network.getContract('papercontract');

//         // transfer commercial paper
//         console.log('Submit commercial paper transfer transaction.');

//         const transferResponse = await contract.submitTransaction('transfer', 'MagnetoCorp', '00001', 'DigiBank', 'Org1MSP', '2020-06-01');

//         // process response
//         console.log('Process transfer transaction response.'+ transferResponse);

//         let paper = CommercialPaper.fromBuffer(transferResponse);

//         console.log(`commercial paper issued by ${paper.issuer}  : ${paper.paperNumber} was successfully transferred`);
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

//     console.log('Transfer program complete.');

// }).catch((e) => {

//     console.log('Transfer program exception.');
//     console.log(e);
//     console.log(e.stack);
//     process.exit(-1);

// });
