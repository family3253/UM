/*
 PIVAS v23 Agent Router
 Restore v0.8 style drug-context Q&A into v2 architecture.
 Local knowledge has priority; remote model can be attached later.
*/
(function(global){
  const AgentRouter = {
    currentDrug: null,

    setDrug(drug){
      this.currentDrug = drug || null;
    },

    ask(question){
      const q = (question || '').trim();
      if(!q) return '请输入问题';

      const drug = this.currentDrug;
      if(!drug) return '请先选择药品';

      const text = JSON.stringify(drug);
      const rules = [
        {keys:['怎么配','配置','复溶'], field:'preparation'},
        {keys:['稳定','保存','放多久'], field:'stability'},
        {keys:['注意','警示','禁忌'], field:'warnings'}
      ];

      for(const rule of rules){
        if(rule.keys.some(k=>q.includes(k)) && drug[rule.field]){
          return drug[rule.field];
        }
      }

      return '当前药品知识库暂无直接答案，可进一步调用外部AI模型辅助分析。';
    }
  };

  global.PIVASAgentRouter = AgentRouter;
})(window);
