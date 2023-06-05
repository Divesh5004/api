export CORE_PEER_TLS_ENABLED=true
export ORDERER_CA=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
export PEER0_MagentoCorp_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/MagentoCorp.example.com/peers/peer0.MagentoCorp.example.com/tls/ca.crt
export PEER0_DigiBank_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/DigiBank.example.com/peers/peer0.DigiBank.example.com/tls/ca.crt
export PEER0_BigFund_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/BigFund.example.com/peers/peer0.BigFund.example.com/tls/ca.crt
export PEER0_BrokerHouse_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/BrokerHouse.example.com/peers/peer0.BrokerHouse.example.com/tls/ca.crt
export PEER0_HedgeMatic_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/HedgeMatic.example.com/peers/peer0.HedgeMatic.example.com/tls/ca.crt
export PEER0_RateM_CA=${PWD}/artifacts/channel/crypto-config/peerOrganizations/RateM.example.com/peers/peer0.RateM.example.com/tls/ca.crt
export FABRIC_CFG_PATH=${PWD}/artifacts/channel/config/

export CHANNEL_NAME=mychannel

setGlobalsForOrderer(){
    export CORE_PEER_LOCALMSPID="OrdererMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/ordererOrganizations/example.com/users/Admin@example.com/msp
    
}

setGlobalsForPeer0MagentoCorp(){
    export CORE_PEER_LOCALMSPID="MagentoCorpMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_MagentoCorp_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/MagentoCorp.example.com/users/Admin@MagentoCorp.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051
}

setGlobalsForPeer0DigiBank(){
    export CORE_PEER_LOCALMSPID="DigiBankMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_DigiBank_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/DigiBank.example.com/users/Admin@DigiBank.example.com/msp
    export CORE_PEER_ADDRESS=localhost:8051
    
}

setGlobalsForPeer0BigFund(){
    export CORE_PEER_LOCALMSPID="BigFundMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_BigFund_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/BigFund.example.com/users/Admin@BigFund.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051
    
}

setGlobalsForPeer0BrokerHouse(){
    export CORE_PEER_LOCALMSPID="BrokerHouseMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_BrokerHouse_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/BrokerHouse.example.com/users/Admin@BrokerHouse.example.com/msp
    export CORE_PEER_ADDRESS=localhost:10051
    
}

setGlobalsForPeer0HedgeMatic(){
    export CORE_PEER_LOCALMSPID="HedgeMaticMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_HedgeMatic_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/HedgeMatic.example.com/users/Admin@HedgeMatic.example.com/msp
    export CORE_PEER_ADDRESS=localhost:11051
    
}

setGlobalsForPeer0RateM(){
    export CORE_PEER_LOCALMSPID="RateMMSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=$PEER0_RateM_CA
    export CORE_PEER_MSPCONFIGPATH=${PWD}/artifacts/channel/crypto-config/peerOrganizations/RateM.example.com/users/Admin@RateM.example.com/msp
    export CORE_PEER_ADDRESS=localhost:12051
    
}


createChannel(){
    rm -rf ./channel-artifacts/*
    setGlobalsForPeer0MagentoCorp
    setGlobalsForPeer0DigiBank
    setGlobalsForPeer0BigFund
    setGlobalsForPeer0BrokerHouse
    setGlobalsForPeer0HedgeMatic
    setGlobalsForPeer0RateM
    peer channel create -o localhost:7050 -c $CHANNEL_NAME \
    --ordererTLSHostnameOverride orderer.example.com \
    -f ./artifacts/channel/${CHANNEL_NAME}.tx --outputBlock ./channel-artifacts/${CHANNEL_NAME}.block \
    --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
}



joinChannel(){
    setGlobalsForPeer0MagentoCorp
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0DigiBank
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0BigFund
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0BrokerHouse
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block

    setGlobalsForPeer0HedgeMatic
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    setGlobalsForPeer0RateM
    peer channel join -b ./channel-artifacts/$CHANNEL_NAME.block
    
    
}


updateAnchorPeers(){

    setGlobalsForPeer0MagentoCorp
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0DigiBank
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

    setGlobalsForPeer0BigFund
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0BrokerHouse
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

    setGlobalsForPeer0HedgeMatic
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA
    
    setGlobalsForPeer0RateM
    peer channel update -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com -c $CHANNEL_NAME -f ./artifacts/channel/${CORE_PEER_LOCALMSPID}anchors.tx --tls $CORE_PEER_TLS_ENABLED --cafile $ORDERER_CA

    
}


createChannel
# joinChannel
# updateAnchorPeers