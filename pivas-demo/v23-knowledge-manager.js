/*
 PIVAS v23 Knowledge Manager
 Restore v0.8 draft/review/publish workflow and adapt to v2 architecture.
*/
(function(global){
  const KEY_DRAFT = 'pivas_drafts';
  const KEY_HISTORY = 'pivas_history';

  function read(key){
    try{return JSON.parse(localStorage.getItem(key)||'[]')}catch(e){return []}
  }

  function write(key,data){
    localStorage.setItem(key, JSON.stringify(data));
  }

  const KnowledgeManager = {
    createDraft(drug){
      const drafts = read(KEY_DRAFT);
      const item = {
        id:'draft_'+Date.now(),
        status:'draft',
        createdAt:new Date().toISOString(),
        drug:drug
      };
      drafts.push(item);
      write(KEY_DRAFT,drafts);
      return item;
    },

    review(id,approved,reviewer='pharmacist'){
      const drafts=read(KEY_DRAFT);
      const item=drafts.find(x=>x.id===id);
      if(!item) return null;
      item.status=approved?'approved':'rejected';
      item.reviewer=reviewer;
      item.reviewTime=new Date().toISOString();
      write(KEY_DRAFT,drafts);
      return item;
    },

    publish(id){
      const drafts=read(KEY_DRAFT);
      const item=drafts.find(x=>x.id===id);
      if(!item) return null;
      item.status='published';
      const history=read(KEY_HISTORY);
      history.push(item);
      write(KEY_HISTORY,history);
      return item;
    },

    listDrafts(){return read(KEY_DRAFT)},
    listHistory(){return read(KEY_HISTORY)}
  };

  global.PIVASKnowledgeManager=KnowledgeManager;
})(window);
