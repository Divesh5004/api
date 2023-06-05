chmod -R 0755 ./crypto-config
# Delete existing artifacts
rm -rf ./crypto-config
rm genesis.block mychannel.tx
rm -rf ../../channel-artifacts/*

#Generate Crypto artifactes for organizations
cryptogen generate --config=./crypto-config.yaml --output=./crypto-config/

# System channel
SYS_CHANNEL="sys-channel"

# channel name defaults to "mychannel"
CHANNEL_NAME="mychannel"

echo $CHANNEL_NAME

# Generate System Genesis block
configtxgen -profile OrdererGenesis -configPath . -channelID $SYS_CHANNEL  -outputBlock ./genesis.block

# Generate channel configuration block
configtxgen -profile BasicChannel -configPath . -outputCreateChannelTx ./mychannel.tx -channelID $CHANNEL_NAME

echo "#######    Generating anchor peer update for MagentoCorpMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./MagentoCorpMSPanchors.tx -channelID $CHANNEL_NAME -asOrg MagentoCorpMSP

echo "#######    Generating anchor peer update for DigiBankMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./DigiBankMSPanchors.tx -channelID $CHANNEL_NAME -asOrg DigiBankMSP

echo "#######    Generating anchor peer update for BigFundMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./BigFundMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BigFundMSP

echo "#######    Generating anchor peer update for BrokerHouseMSP ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./BrokerHouseMSPanchors.tx -channelID $CHANNEL_NAME -asOrg BrokerHouseMSP

echo "#######    Generating anchor peer update for HedgeMaticMSP ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./HedgeMaticMSPanchors.tx -channelID $CHANNEL_NAME -asOrg HedgeMaticMSP

echo "#######    Generating anchor peer update for RateMMSP  ##########"
configtxgen -profile BasicChannel -configPath . -outputAnchorPeersUpdate ./RateMMSPanchors.tx -channelID $CHANNEL_NAME -asOrg RateMMSP