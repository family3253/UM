/* PIVAS v2.3 Agent Router - v0.8 compatibility */
(function(global){
  const AgentRouter = {
    currentDrug: null,
    setDrug(drug){ this.currentDrug = drug || null; return this.currentDrug; },
    ask(question){
      const q = (question || '').trim();
      if(!q) return '请输入问题';
      const drug = this.currentDrug;
      if(!drug) return '请先选择药品';
      const pick=(...keys)=>{for(const k of keys){const v=drug[k];if(v!==undefined&&v!==null&&v!=='')return Array.isArray(v)?v.join('；'):String(v)}return ''};
      if(['怎么配','配置','复溶','稀释','溶媒'].some(k=>q.includes(k))){const v=pick('preparation','prep');if(v)return v;}
      if(['稳定','保存','放多久','贮存','冷藏'].some(k=>q.includes(k))){const v=pick('stability','storage');if(v)return v;}
      if(['输注','输液器','滤器','分钟'].some(k=>q.includes(k))){const v=pick('infusion');if(v)return v;}
      if(['注意','警示','禁忌','振摇','冷冻'].some(k=>q.includes(k))){const v=pick('warnings');if(v)return v;}
      return '当前药品知识库暂无直接答案，可进一步调用外部AI模型辅助分析。';
    }
  };
  global.PIVASAgentRouter = AgentRouter;
})(window);
