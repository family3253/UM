const assert=require('node:assert/strict');
const wb=require('./v18-agent-ui-workbench.js');
const t=wb.createTask('维布妥昔单抗');
assert.equal(t.steps.length,7);
wb.updateStep(t,'parse','done');
assert.equal(t.steps[1].status,'done');
assert.equal(wb.reviewGate({pharmacistApproved:true,evidenceComplete:true,hasConflict:false}),true);
assert.equal(wb.reviewGate({pharmacistApproved:false,evidenceComplete:true}),false);
console.log('v1.8 workflow tests passed');
