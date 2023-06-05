

It is advised to have 3 terminal windows (consoles) open; 

* one to monitor the infrastructure
* one for MagnetoCorp 
* one for DigiBank. 

Once you've cloned the `fabric-samples` - change to the `commercial-paper` directory in each window. 

```
git clone https://github.com/hyperledger/fabric-samples.git
```

```
cd fabric-samples/commercial-paper
```

## Running the Infrastructure

In one console window, run the network starter script - this will start the two organization `test-network` blockchain network.

```
./network-starter.sh
```

You can re-use this console window if you wish, but it is recommended to run a docker container monitoring script in its own window. This will let you view what Fabric is doing and help diagnose any failures.

```bash
./organization/magnetocorp/configuration/cli/monitordocker.sh fabric_test
```

### Setup the Organizations' environments

The contract code is available as either JavaScript, Java or Go. You can use either one, and the choice of contract language does not affect the choice of client language. With the v2.0 Fabric chaincode lifecycle, this requires operations for both MagnetoCorp and Digibank admin.  Open two windows in the fabric-samples/commercial paper directory, one for each organization.

In your 'MagnetoCorp' window run the following commands, to set the shell environment variables needed to act as that organization. The leading '.' in the command sequence sets in your current environment - if you do not run this, you will not be able to package the chaincode.

```
cd fabric-samples/commercial-paper/organization/magnetocorp
. ./magnetocorp.sh
```

You can either copy and paste them directly into the terminal, or invoke directly in your own command shell. For example if you are using bash or zsh on Linux you can use this command.

```
source <(./magnetocorp.sh)
```

Similarly in your 'DigiBank' window run the following commands as shown:

```
cd fabric-samples/commercial-paper/organization/digibank
. ./digibank.sh
```

<sup>[_back to top_](#top)</sup>


### Deploy the smart contract to the channel

You need to perform similar operations for _both_ organizations and for your language choice from the instructions below. For the different contract languages, the steps are very similar  - the full set of steps are actually shown in the JavaScript section (see twisty). However, you will perform one or two different initial steps for Java or Go before completing the remaining common steps as instructed in those language sections. 

Note that the commands below make use of the `jq` utility for parsing output - download and install it from [the jq download page](https://stedolan.github.io/jq/download/).



**<details><summary>For a JavaScript Contract</summary>**


Running in MagnetoCorp directory:

```
# MAGNETOCORP

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID              # FYI may look like this:      'cp_0:nnnxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx'
```

```

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                          --channelID mychannel  \
                                          --name papercontract  \
                                          -v 0  \
                                          --package-id $PACKAGE_ID \
                                          --sequence 1  \
                                          --tls  \
                                          --cafile $ORDERER_CA
                                          
peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1
```

Running in Digibank directory:

```

# DIGIBANK

peer lifecycle chaincode package cp.tar.gz --lang node --path ./contract --label cp_0
peer lifecycle chaincode install cp.tar.gz

export PACKAGE_ID=$(peer lifecycle chaincode queryinstalled --output json | jq -r '.installed_chaincodes[0].package_id')
echo $PACKAGE_ID

peer lifecycle chaincode approveformyorg  --orderer localhost:7050 --ordererTLSHostnameOverride orderer.example.com \
                                          --channelID mychannel  \
                                          --name papercontract  \
                                          -v 0  \
                                          --package-id $PACKAGE_ID \
                                          --sequence 1  \
                                          --tls  \
                                          --cafile $ORDERER_CA

peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name papercontract -v 0 --sequence 1

```

Once both organizations have installed, and approved the chaincode, it can be committed.

```
# MAGNETOCORP

peer lifecycle chaincode commit -o localhost:7050 \
                                --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} \
                                --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                --ordererTLSHostnameOverride orderer.example.com \
                                --channelID mychannel --name papercontract -v 0 \
                                --sequence 1 \
                                --tls --cafile $ORDERER_CA --waitForEvent 

```

To test, try sending some simple transactions.

```

peer chaincode invoke -o localhost:7050  --ordererTLSHostnameOverride orderer.example.com \
                                --peerAddresses localhost:7051 --tlsRootCertFiles ${PEER0_ORG1_CA} \
                                --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                --channelID mychannel --name papercontract \
                                -c '{"Args":["org.papernet.commercialpaper:instantiate"]}' ${PEER_ADDRESS_ORG1} ${PEER_ADDRESS_ORG2} \
                                --tls --cafile $ORDERER_CA --waitForEvent

peer chaincode query -o localhost:7050  --ordererTLSHostnameOverride orderer.example.com \
                                        --channelID mychannel \
                                        --name papercontract \
                                        -c '{"Args":["org.hyperledger.fabric:GetMetadata"]}' \
                                        --peerAddresses localhost:9051 --tlsRootCertFiles ${PEER0_ORG2_CA} \
                                        --tls --cafile $ORDERER_CA | jq '.' -C | more
```
</p>
</details>


## Client Applications

Note for JavaScript applications, you will need to install the dependencies first. Use this command in each application directory

```
npm install
```
>  Note that there is NO dependency between the language of any one client application and any contract. Mix and match as you wish!

The docker containers don't contain the node or Java runtimes; so it is best to exit the docker containers - but keep the windows open and run the applications locally.

As mentioned earlier in the Sample introduction section, transaction _inputs_ are recorded on the ledger, as well as any asset _state_ changes. Just *before* you run the _issue_ application script below - you need to launch a block 'listener' application that will show you these _inputs_, as you complete each transaction in the commercial paper lifecycle (eg. Paper Number: 00001, 00002 etc) . 

For the listener, its best to open a *new* terminal for this in the `commercial-paper/organization/magnetocorp/application` directory (javascript). Next, run the `addToWallet` step in the `issue` transaction below, to add Isabella's identity to the wallet - the listener will use this wallet. Once the listener is launched, it will show the inputs for transactions you will perform and which are committed to blocks (ie part of the ledger).  Note: initially, the listener may show a spurious message, and then go into a _listening_ or 'wait' state. As transactions complete below, messages will be displayed by the listener - so keep an eye out. *After* adding Isabella's wallet, you can then launch the listener as follows:

```
node cpListener.js
```

**<details><summary>Issue the commercial paper</summary>**

The paper is issued by *MagnetoCorp* 

You can now run the applications to issue the commercial paper. Change to either the 
`commercial-paper/organization/magnetocorp/application` directory (javascript) or  `commercial-paper/organization/magnetocorp/application-java` directory (java)

*Add the Identity to be used to the wallet*

```
node addToWallet.js

```

*Issue the Commercial Paper*

```
node issue.js

```

Don't forget to check the application listener for messages above!

</p>
</details>


**<details><summary>Buy the commercial paper</summary>**

_Buy_ is performed as *Digibank*; 

You can now run the applications to buy the paper. Change to either the
`commercial-paper/organization/digibank/application` directory 
*Add the Identity to be used*

```
node addToWallet.js

```

*Buy the paper*

```
node buy.js

```

If you have just executed a `buy` transaction above - jump to the `redeem` transaction below - otherwise execute the _buy_/_transfer_ sequence as described earlier.

*Alternative: Request to Buy the paper (buy/transfer)*

```
node buy_request.js
```

Now complete the _request_ by switching to the `MagnetoCorp` application directory (javascript) and execute a `transfer` transaction as MagnetoCorp:

```
cd ../../magnetocorp/application

node transfer.js
```

</p>
</details>

**<details><summary>Redeem the commercial paper</summary>**

_Redeem_ is performed as *Digibank*  - the current owner (buyer) in the lifecycle.

You can now run the applications to redeem the paper. Change to either the
`commercial-paper/organization/digibank/application` directory 

*Redeem*

```
node redeem.js
```

</p>
</details>


**<details><summary>Perform Queries: Ownership, Asset History etc (Node.js sample only) </summary>**
 
 Having completed the full commercial paper lifecycle for one paper (paper number: 00001) some queries below won't show a lot of data - as an optional exercise, you can change the scripts above (paper number: 00002) to create another paper lifecycle and run the `queryapp` application below (change query 1 to the new CP number FYI), with more data available. As indicated, the query transactions mentioned are presently only available in the Node.js sample.
 
 Execute the Node.js application client script, which will run the following 5 queries, in order:
 
  - History of Commercial Paper (Note: the paper state is shown more descriptively eg.  'ISSUED', 'TRADING' and based on currentState values on ledger)
  - Ownership of Commercial Papers
  - Partial Key query, for Commercial papers in org.papernet.papers namespace belonging to MagnetoCorp
  - Named Query: all redeemed papers in a state of 'redeemed' (currentState = 4)
  - Named Query: all commercial papers with a face value > $4m
  
  From the `digibank/application` subdirectory run:
  
  ```
  node queryapp.js 
  ```
  
 </p>
</details>

When you're done with this section, return to the terminal where your Node.js _listener_ application is running, and terminate the process.

## Clean up
When you are finished using the Fabric test network and the commercial paper smart contract and applications, you can use the following command to clean up the network:

```
./network-clean.sh 
```


