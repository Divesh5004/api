

const { Gateway, Wallets, TxEventHandler, GatewayOptions, DefaultEventHandlerStrategies, TxEventHandlerFactory } = require('fabric-network');
const fs = require('fs');
const path = require("path")
const log4js = require('log4js');
const logger = log4js.getLogger('BasicNetwork');
const util = require('util')

const helper = require('./helper');
const { Agent } = require('http');

const invokeTransaction = async (channelName, chaincodeName, fcn, args, username, org_name) => {
    try {
        logger.debug(util.format('\n============ invoke transaction on channel %s ============\n', channelName));

        // load the network configuration
        // const ccpPath =path.resolve(__dirname, '..', 'config', 'connection-org1.json');
        // const ccpJSON = fs.readFileSync(ccpPath, 'utf8')
        const ccp = await helper.getCCP(org_name) //JSON.parse(ccpJSON);

        // Create a new file system based wallet for managing identities.
        const walletPath = await helper.getWalletPath(org_name) //path.join(process.cwd(), 'wallet');
        const wallet = await Wallets.newFileSystemWallet(walletPath);
        console.log(`Wallet path: ${walletPath}`);

        // Check to see if we've already enrolled the user.
        let identity = await wallet.get(username);
        if (!identity) {
            console.log(`An identity for the user ${username} does not exist in the wallet, so registering user`);
            await helper.getRegisteredUser(username, org_name, true)
            identity = await wallet.get(username);
            console.log('Run the registerUser.js application before retrying');
            return;
        }

        const connectOptions = {
            wallet, identity: username, discovery: { enabled: true, asLocalhost: true },
            eventHandlerOptions: {
                commitTimeout: 100,
                strategy: DefaultEventHandlerStrategies.NETWORK_SCOPE_ALLFORTX
            }
            // transaction: {
            //     strategy: createTransactionEventhandler()
            // }
        }

        // Create a new gateway for connecting to our peer node.
        const gateway = new Gateway();
        await gateway.connect(ccp, connectOptions);

        // Get the network (channel) our contract is deployed to.
        const network = await gateway.getNetwork(channelName);

        const contract = network.getContract(chaincodeName);

        let result
        let message;

// CreateAsset ========Working================

        if (fcn === "CreateAsset" || fcn === "CreateAsset"
            || fcn == "CreateAsset") {
            result = await contract.submitTransaction(fcn, args[0],args[1],args[2],args[3],args[4]);
            message = `Successfully CreateAsset}`

        } 

       // UpdateAsset ========Working================

    if (fcn === "UpdateAsset" || fcn === "UpdateAsset"
        || fcn == "UpdateAsset") {
        result = await contract.submitTransaction(fcn, args[0],args[1],args[2],args[3],args[4]);
        message = `Successfully UpdateAsset}`

    } 

        // DeleteAsset ========Working================

    if (fcn === "DeleteAsset" || fcn === "DeleteAsset"
        || fcn == "DeleteAsset") {
        result = await contract.submitTransaction(fcn, args[0]);
        message = `Successfully DeleteAsset is ${args[0]}`

        } 

        // TransferAsset(ctx, id, newOwner)

 if (fcn === "TransferAsset" || fcn === "TransferAsset"
            || fcn == "TransferAsset") {
            result = await contract.submitTransaction(fcn, args[0],args[1]);
            message = `Successfully TransferAsset ${args[0]}`

        } 

// InitLedger

 if (fcn === "InitLedger" || fcn === "InitLedger"
            || fcn == "InitLedger") {
            result = await contract.submitTransaction(fcn);
            message = `Successfully Transfer money ${args[0]}`

        } 

 
// GetAllAssets==================Working================

            if (fcn === "GetAllAssets" || fcn === "GetAllAssets"
                   || fcn == "GetAllAssets") {
            result = await contract.submitTransaction(fcn, args[0]);
            message = `Successfully TransferFrom ${args[0]}`

            }
            
//ReadAsset=========Working================


        if (fcn === "ReadAsset" || fcn === "ReadAsset"
                   || fcn == "ReadAsset") {
        result = await contract.submitTransaction(fcn, args[0]);
        message = `Successfully ReadAsset money ${args[0]}`

        } 


       await gateway.disconnect();

        result = JSON.parse(result.toString());

        let response = {
            message: message,
            result
        }

        return response;


    } catch (error) {

        console.log(`Getting error: ${error}`)
        return error.message

    }
}



exports.invokeTransaction = invokeTransaction;