// PIVAS v1.8 Agent Workbench
// UI state model for AI card generation, review and publishing
(function(root){
 const steps=[
  {id:'upload',label:'上传说明书',status:'pending'},
  {id:'parse',label:'文档解析',status:'pending'},
  {id:'extract',label:'字段提取',status:'pending'},
  {id:'evidence',label:'证据绑定',status:'pending'},
  {id:'generate',label:'生成药品卡',status:'pending'},
  {id:'review',label:'药师审核',status:'pending'},
  {id:'publish',label:'发布知识库',status:'pending'}
 ];
 function createTask(name){return {drug:name||'',steps:JSON.parse(JSON.stringify(steps)),draft:null,canPublish:false};}
 function updateStep(task,id,status){const s=task.steps.find(x=>x.id===id);if(s)s.status=status;return task;}
 function reviewGate(draft){return !!draft&&draft.pharmacistApproved===true&&draft.evidenceComplete===true&&draft.hasConflict!==true;}
 root.PivasAgentWorkbench={createTask,updateStep,reviewGate};
})(this);
