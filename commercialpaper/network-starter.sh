#!/bin/bash
#
# SPDX-License-Identifier: Apache-2.0

function _exit(){
    printf "Exiting:%s\n" "$1"
    exit -1
}

# Exit on first error, print all commands.
set -ev
set -o pipefail

# Where am I?
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

export FABRIC_CFG_PATH="${DIR}/../config"

cd "${DIR}/../PaperNet/"

# docker kill cliDigiBank cliMagnetoCorp logspout || true
# ./network.sh down
# ./network.sh up createChannel -ca -s couchdb

# Copy the connection profiles so they are in the correct organizations.




# cp "${DIR}/../test-network/organizations/peerOrganizations/org1.example.com/connection-org1.yaml" "${DIR}/organization/digibank/gateway/"
# cp "${DIR}/../test-network/organizations/peerOrganizations/org2.example.com/connection-org2.yaml" "${DIR}/organization/magnetocorp/gateway/"





cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/MagentoCorp.example.com/users/User1@MagentoCorp.example.com/msp/signcerts/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/MagentoCorp.example.com/users/User1@MagentoCorp.example.com/msp/signcerts/User1@MagentoCorp.example.com-cert.pem
cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/MagentoCorp.example.com/users/User1@MagentoCorp.example.com/msp/keystore/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/MagentoCorp.example.com/users/User1@MagentoCorp.example.com/msp/keystore/priv_sk

cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/DigiBank.example.com/users/User1@DigiBank.example.com/msp/signcerts/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/DigiBank.example.com/users/User1@DigiBank.example.com/msp/signcerts/User1@DigiBank.example.com-cert.pem
cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/DigiBank.example.com/users/User1@DigiBank.example.com/msp/keystore/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/DigiBank.example.com/users/User1@DigiBank.example.com/msp/keystore/priv_sk

cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BigFund.example.com/users/User1@BigFund.example.com/msp/signcerts/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BigFund.example.com/users/User1@BigFund.example.com/msp/signcerts/User1@BigFund.example.com-cert.pem
cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BigFund.example.com/users/User1@BigFund.example.com/msp/keystore/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BigFund.example.com/users/User1@BigFund.example.com/msp/keystore/priv_sk

cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BrokerHouse.example.com/users/User1@BrokerHouse.example.com/msp/signcerts/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BrokerHouse.example.com/users/User1@BrokerHouse.example.com/msp/signcerts/User1@BrokerHouse.example.com-cert.pem
cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BrokerHouse.example.com/users/User1@BrokerHouse.example.com/msp/keystore/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/BrokerHouse.example.com/users/User1@BrokerHouse.example.com/msp/keystore/priv_sk

cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/HedgeMatic.example.com/users/User1@HedgeMatic.example.com/msp/signcerts/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/HedgeMatic.example.com/users/User1@HedgeMatic.example.com/msp/signcerts/User1@HedgeMatic.example.com-cert.pem
cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/HedgeMatic.example.com/users/User1@HedgeMatic.example.com/msp/keystore/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/HedgeMatic.example.com/users/User1@HedgeMatic.example.com/msp/keystore/priv_sk

cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/RateM.example.com/users/User1@RateM.example.com/msp/signcerts/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/RateM.example.com/users/User1@RateM.example.com/msp/signcerts/User1@RateM.example.com-cert.pem
cp ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/RateM.example.com/users/User1@RateM.example.com/msp/keystore/* ${DIR}/../PaperNet/artifacts/channel/crypto-config/peerOrganizations/RateM.example.com/users/User1@RateM.example.com/msp/keystore/priv_sk



echo Suggest that you monitor the docker containers by running
echo "./organization/magnetocorp/configuration/cli/monitordocker.sh artifacts_test"
