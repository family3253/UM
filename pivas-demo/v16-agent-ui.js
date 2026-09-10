// PIVAS v1.6 Agent UI flow
window.PIVAS_AGENT_UI={
  steps:[
    {id:'upload',title:'上传说明书'},
    {id:'parse',title:'解析PDF/OCR'},
    {id:'extract',title:'提取配置字段'},
    {id:'evidence',title:'绑定证据来源'},
    {id:'generate',title:'生成一页药品卡'},
    {id:'review',title:'药师审核'},
    {id:'publish',title:'发布知识库'}
  ],
  canPublish:function(card){
    return !!card.pharmacistApproved && !card.hasConflict && card.missingEvidence===0;
  }
};
