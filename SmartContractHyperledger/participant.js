/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class ParticipantTransfer extends Contract {

    async InitLedger(ctx) {
    var fs = require('fs');
    const participants = [{"id":"Id_6dc1e3dd-ea0b-4c51-9788-607bbbd6ad65","name":"Main Process"},{"id":"Id_b3800d1f-2702-4614-a45c-985a7326fb13","name":"Process 1"},{"id":"Id_eb614396-8b35-428a-8ac9-6ec8f89d8ec1","name":"Participante externo envia"},{"id":"Id_3ff66a03-852a-4bcd-8d05-dc5dc6e0e75f","name":"Participante Externo Recebe"},{"id":"Id_01","name":"TestExa"}];
   

        for (const participant of participants) {
            participant.docType = 'participant';
            await ctx.stub.putState(participant.id, Buffer.from(JSON.stringify(participant)));
            console.info(`Participant ${participant.id} initialized`);
        }


        
    }
    

        async GetAllPariticants(ctx) {
            const allResults = [];
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

module.exports = ParticipantTransfer;
