/* PIVAS v23 Knowledge Manager - draft/review/publish */
(function(global){
  const KEY_DRAFT='pivas_drafts', KEY_HISTORY='pivas_knowledge_history';
  const read=k=>{try{return JSON.parse(localStorage.getItem(k)||'[]')}catch{return []}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  const KnowledgeManager={
    createDraft(drug){
      const drafts=read(KEY_DRAFT);
      const payload=drug&&drug.drug?drug.drug:drug;
      const item={id:(drug&&drug.id)||('draft_'+Date.now()),status:'draft',createdAt:(drug&&drug.createdAt)||new Date().toISOString(),drug:payload||{}};
      drafts.unshift(item); write(KEY_DRAFT,drafts); return item;
    },
    review(id,approved,reviewer='pharmacist'){
      const drafts=read(KEY_DRAFT), item=drafts.find(x=>x.id===id); if(!item)return null;
      item.status=approved?'approved':'rejected'; item.reviewer=reviewer; item.reviewTime=new Date().toISOString(); write(KEY_DRAFT,drafts); return item;
    },
    publish(id){
      const drafts=read(KEY_DRAFT), item=drafts.find(x=>x.id===id); if(!item||item.status!=='approved')return null;
      item.status='published'; item.publishedAt=new Date().toISOString(); write(KEY_DRAFT,drafts);
      const history=read(KEY_HISTORY); history.unshift({...item}); write(KEY_HISTORY,history); return item;
    },
    listDrafts(){return read(KEY_DRAFT)},
    listHistory(){return read(KEY_HISTORY)}
  };
  global.PIVASKnowledgeManager=KnowledgeManager;
})(window);
