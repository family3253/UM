/* PIVAS v2.2 Workbench UI layer
   Demo focus: tablet workflow, scan entry, voice entry, AI card entry.
*/
(function(root){
 const PIVASWorkbench={
  mode(){
   const w=window.innerWidth;
   return w>900?'pad-landscape':w>600?'tablet':'mobile';
  },
  actions:[
   {id:'scan',icon:'📷',title:'自动识别药品',desc:'摄像头 / 条码 / OCR / 模糊匹配'},
   {id:'voice',icon:'🎤',title:'语音搜索',desc:'说出药名快速打开药品卡'},
   {id:'agent',icon:'🧠',title:'AI生成药品卡',desc:'说明书解析与药师审核'},
   {id:'knowledge',icon:'📚',title:'知识库管理',desc:'版本、来源、更新记录'}
  ],
  render(container){
   if(!container)return;
   container.innerHTML=`<section class="pivas-workbench"><h2>PIVAS 智能用药助手</h2><div class="pivas-actions">${this.actions.map(a=>`<button data-action="${a.id}"><b>${a.icon} ${a.title}</b><span>${a.desc}</span></button>`).join('')}</div></section>`;
  }
 };
 root.PIVASWorkbench=PIVASWorkbench;
})(window);
