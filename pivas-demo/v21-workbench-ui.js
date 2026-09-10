// PIVAS v2.1 Workbench UI layer
(function(root){
  const Workbench={
    state:{mode:'pad-landscape',page:'home'},
    detect(){
      const w=window.innerWidth;
      this.state.mode=w<600?'mobile':w<900?'tablet':'pad-landscape';
      return this.state.mode;
    },
    modules:[
      {id:'scan',icon:'📷',title:'自动识别药品',desc:'摄像头 + OCR + 模糊匹配'},
      {id:'voice',icon:'🎤',title:'语音搜索',desc:'说出药名快速打开药品卡'},
      {id:'agent',icon:'🧠',title:'AI生成药品卡',desc:'说明书解析与药师审核'},
      {id:'kb',icon:'📚',title:'知识库',desc:'本地药品卡管理'}
    ],
    open(module){
      this.state.page=module;
      window.dispatchEvent(new CustomEvent('pivas-workbench-open',{detail:module}));
    }
  };
  root.PivasWorkbench=Workbench;
})(window);
