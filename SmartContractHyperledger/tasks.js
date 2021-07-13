/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

'use strict';

const { Contract } = require('fabric-contract-api');

class Task extends Contract {

    async InitLedger(ctx) {
    var fs = require('fs');
    const tasks = [{"id":"Id_0309b33c-4c78-4503-be83-d63b17c5235a","name":"Ler do DT","datastores":"Id_4fe18bb1-9549-4d2d-a435-16faceb6401c","typedatastore":"Ler","participant":"Id_eb614396-8b35-428a-8ac9-6ec8f89d8ec1","typeparticipant":"Envia","istrasnfer":false},{"id":"Id_c2e398b9-35ed-4d72-ad37-9a5094a876d4","name":"Escrever no DT","datastores":"Id_419152e3-dfed-4067-9a28-15cd3728a20f","typedatastore":"Escrever","participant":"Id_3ff66a03-852a-4bcd-8d05-dc5dc6e0e75f","typeparticipant":"Recebe","istrasnfer":false}];

        for (const task of tasks) {
            task.docType = 'task';
            await ctx.stub.putState(task.id, Buffer.from(JSON.stringify(task)));
            console.info(`Task ${task.id} initialized`);
        }


        
    }
    
        async GetAllTasks(ctx) {
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

module.exports = Task;
