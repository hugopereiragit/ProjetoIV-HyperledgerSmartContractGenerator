
![image](https://user-images.githubusercontent.com/61696448/125817362-f7c10c06-07fb-46b5-abc5-8d798ef76a9d.png)


# HyperledgerSmartContractGenerator
 
This project was developed associated with the curricular unit of Project IV of the 3rd year of the Graduation Degree in Informatics’ Engineering (Computer Science) at the School of Technology and Management of the Polytechnic institute of Viana do Castelo

The main objective of this project is the development a platform that allows users to insert their bpmn files and convert them into a smart contract ready to be deployed to the blockchain.

The conversion part is finished however the tasks smartcontract file is not completed


# Conversion methodology

Besides getting the id and name from the datastores,participant,tasks themselfs we also need to get the source and target from the connections so we can see where the lines are connecting the diffrent parts of the smart contract and who is reading or writing

      Data queried    
                    - datastore - id - name
                    - Assosiation - idsource - idtarget (between datastore and task)
                    - task - id - name
                    - Sequenceflow - idsource - idtarget (between tasks)
                    - messageflow - idsource - idtarget (between participant e task)
                    - participant - id - name   


# How to install the generator
- Go into the repository
 
      $ cd ProjetoIV-HyperledgerSmartContractGenerator
      $ cd modeler
	
- Install dependencies

      $ npm install && cd smartcontract && npm install && cd ..

- Run the app 

      $ npm start



# Using the generator

- Drop a .bpmn file in the loader
- Click process bpmn
- Press the ok button incase your bpmn has missing information
- Make desired alterations
- Press the Download button

![image](https://user-images.githubusercontent.com/61696448/125817845-144cb25b-ed1b-4d5d-be1c-5e76e1d040d9.png)
![image](https://user-images.githubusercontent.com/61696448/125817907-2e260127-fd1c-43cf-a21f-857a2d92b98f.png)



# Smart contract install and deployment

To deploy the smart contracts you must install all hyperledger fabric required components such as docker, windows build tools , samples, binaries , etc.
These can be found here https://hyperledger-fabric.readthedocs.io/en/release-1.4/install.html

   Note that the following code used the chaincode present in fabric-samples/asset-transfer-basic/chaincode-javascript/AssetTrasnfer if you wish to something diffrent it will require changes.
   
   The following code allows for the deployment to a blockchain of the assets and utilized the getallassets function to show them on the screen: 
   
    cd fabric-samples/test-network
    ./network.sh down
    ./network.sh up -c createChannel
    cd fabric-samples/asset-transfer-basic/chaincode-javascript //skip this one if you did it previously
    cd ../../test-network  //skip this one if you did it previously

    //Passos para por o peer a dar
    export PATH=${PWD}/../bin:$PATH
    export FABRIC_CFG_PATH=$PWD/../config/ 
    peer version


    //chaincode
    peer lifecycle chaincode package basic.tar.gz --path ../asset-transfer-basic/chaincode-javascript/ --lang node --label basic_1.0


    export CORE_PEER_TLS_ENABLED=true
    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_ADDRESS=localhost:7051

    peer lifecycle chaincode install basic.tar.gz

    export CORE_PEER_LOCALMSPID="Org2MSP"
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org2.example.com/users/Admin@org2.example.com/msp
    export CORE_PEER_ADDRESS=localhost:9051

    peer lifecycle chaincode install basic.tar.gz

    peer lifecycle chaincode queryinstalled

    export CC_PACKAGE_ID=basic_1.0:84abaabe6133f2cd172c457c751a7a2f4da631d4224f36c605760e677ba938fa

    ./network.sh up createChannel

    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"


    export CORE_PEER_LOCALMSPID="Org1MSP"
    export CORE_PEER_MSPCONFIGPATH=${PWD}/organizations/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp
    export CORE_PEER_TLS_ROOTCERT_FILE=${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt
    export CORE_PEER_ADDRESS=localhost:7051

    peer lifecycle chaincode approveformyorg -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --package-id $CC_PACKAGE_ID --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

    peer lifecycle chaincode checkcommitreadiness --channelID mychannel --name basic --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --output json

    peer lifecycle chaincode commit -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --channelID mychannel --name basic --version 1.0 --sequence 1 --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt"

    peer lifecycle chaincode querycommitted --channelID mychannel --name basic --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem"

    peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C mychannel -n basic --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'

    peer chaincode query -C mychannel -n basic -c '{"Args":["GetAllAssets"]}'
    


This should be your result: 

![image](https://user-images.githubusercontent.com/61696448/125814898-5ad58b8d-23f7-4fc4-b673-33b100ef08e1.png)




# TODO

As of now the smart contracts are imported inline rather than gotten from the file as shows here: 

![image](https://user-images.githubusercontent.com/61696448/125815188-24fcbe3b-8e4c-47eb-bcd5-21c35e5a5fb2.png)

The reason for so is that when deploying to the chaincode using the commented code the following error is displayed:

![image](https://user-images.githubusercontent.com/61696448/125815273-7410e9a1-456e-406e-bdc2-bddd20510691.png)

The solution might be to use json 

Furthermore - Finalize the tasks.js, etc


