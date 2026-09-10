const test=require('node:test');const assert=require('node:assert/strict');const w=require('./v17-ai-card-workflow.js');
test('create AI card task',()=>{const t=w.createTask({name:'drug.pdf'});assert.equal(t.status,'UPLOADED');assert.equal(t.steps.length,5)});
test('cannot publish without pharmacist approval',()=>{assert.equal(w.canPublish({pharmacistApproved:false,fields:[]}),false)});
test('cannot publish evidence missing field',()=>{assert.equal(w.canPublish({pharmacistApproved:true,conflicts:[],fields:[{text:'NS',evidence:[]}]}),false)});
test('build constrained prompt',()=>{assert.match(w.buildPrompt('abc'),'禁止推测')});