/* PIVAS v1.5 agent workflow */
(function(root){
 function run(input){
  return [
   {step:'DOCUMENT_PARSE',status:input.file?'done':'waiting'},
   {step:'EVIDENCE_BINDING',status:'running'},
   {step:'MISSING_FIELD_CHECK',status:'pending'},
   {step:'CARD_GENERATION',status:'pending'},
   {step:'PHARMACIST_REVIEW',status:'pending'}
  ];
 }
 root.PivasAgentDemoFlow={run};
})(this);
