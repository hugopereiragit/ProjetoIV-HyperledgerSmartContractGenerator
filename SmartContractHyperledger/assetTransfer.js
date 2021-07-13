/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class AssetTransfer extends Contract {

    async InitLedger(ctx) {
    var fs = require('fs');
    //por algum motivo isto abrir ficheiros não está a funcionar dentro do blockchain
    //const assets = fs. readFileSync("assets.txt", 'utf-8');
    //const assets = fs. readFileSync("./assets.txt", 'utf-8');
    const assets = [{"id":"Id_4fe18bb1-9549-4d2d-a435-16faceb6401c","name":"Dt_ler"},{"id":"Id_419152e3-dfed-4067-9a28-15cd3728a20f","name":"Escrever_dt"}];
   // const participants = [{"id":"Id_6dc1e3dd-ea0b-4c51-9788-607bbbd6ad65","name":"Main Process"},{"id":"Id_b3800d1f-2702-4614-a45c-985a7326fb13","name":"Process 1"},{"id":"Id_eb614396-8b35-428a-8ac9-6ec8f89d8ec1","name":"Participante externo envia"},{"id":"Id_3ff66a03-852a-4bcd-8d05-dc5dc6e0e75f","name":"Participante Externo Recebe"},{"id":"Id_01","name":"TestExa"}];
   // const tasks = [{"id":"Id_0309b33c-4c78-4503-be83-d63b17c5235a","name":"Ler do DT","datastores":"Id_4fe18bb1-9549-4d2d-a435-16faceb6401c","typedatastore":"Ler","participant":"Id_eb614396-8b35-428a-8ac9-6ec8f89d8ec1","typeparticipant":"Envia","istrasnfer":false},{"id":"Id_c2e398b9-35ed-4d72-ad37-9a5094a876d4","name":"Escrever no DT","datastores":"Id_419152e3-dfed-4067-9a28-15cd3728a20f","typedatastore":"Escrever","participant":"Id_3ff66a03-852a-4bcd-8d05-dc5dc6e0e75f","typeparticipant":"Recebe","istrasnfer":false}];


        for (const asset of assets) {
            asset.docType = 'asset';
            await ctx.stub.putState(asset.id, Buffer.from(JSON.stringify(asset)));
            console.info(`Asset ${asset.id} initialized`);
        }


        
    }
    
    
    // ReadAsset returns the asset stored in the world state with given id.
    async ReadAsset(ctx, id) {
        const assetJSON = await ctx.stub.getState(id); // get the asset from chaincode state
        if (!assetJSON || assetJSON.length === 0) {
            throw new Error(`The asset ${id} does not exist`);
        }
        return assetJSON.toString();
      }
    
    
    // AssetExists returns true when asset with given ID exists in world state.
    async AssetExists(ctx, id) {
        const assetJSON = await ctx.stub.getState(id);
        return assetJSON && assetJSON.length > 0;
    }
    
    // UpdateAsset updates an existing asset in the world state with provided parameters.
    async UpdateAsset(ctx, id, name) {
        const exists = await this.AssetExists(ctx, id);
        if (!exists) {
            throw new Error(`The asset ${id} does not exist`);
        }
    
        // overwriting original asset with new asset
        const updatedAsset = {
            id: id,
            name: name
        };
        return ctx.stub.putState(id, Buffer.from(JSON.stringify(updatedAsset)));
    }
    
    
        // GetAllAssets returns all assets found in the world state.
        async GetAllAssets(ctx) {
            const allResults = [];
            // range query with empty string for startKey and endKey does an open-ended query of all assets in the chaincode namespace.
            const iterator = await ctx.stub.getStateByRange('', '');
            let result = await iterator.next();
            while (!result.done) {
                const strValue = Buffer.from(result.value.value.toString()).toString('utf8');
                let record;
                try {
                    record = JSON.parse(strValue);
                } catch (err) {
                    console.log(err);
                    record = strValue;
                }
                allResults.push({ Key: result.value.key, Record: record });
                result = await iterator.next();
            }
            return JSON.stringify(allResults);
        }
    
    }

module.exports = AssetTransfer;
