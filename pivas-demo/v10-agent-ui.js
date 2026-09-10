(function(){
window.openPivasAgent=function(){
 const old=document.getElementById('agent-panel'); if(old){old.remove();return;}
 const panel=document.createElement('div');panel.id='agent-panel';panel.style.cssText='position:fixed;right:20px;bottom:20px;width:380px;max-height:70vh;overflow:auto;background:white;border:2px solid #167fe8;border-radius:18px;padding:18px;box-shadow:0 10px 35px #0003;z-index:9999;font-family:sans-serif';
 panel.innerHTML='<h2 style="margin:0;color:#126fc8">🧠 PIVAS知识维护智能体</h2><p><b>当前任务：</b>生成药品速览卡</p><div>✓ 已读取上传资料</div><div>✓ 已提取配置字段</div><div>✓ 已检查稳定性信息</div><div>⚠ 外部补充证据仅作为参考</div><div>⏳ 等待药师审核</div><hr><b>安全规则</b><ul><li>无来源字段禁止发布</li><li>外部证据不可单独发布</li><li>冲突字段需人工确认</li></ul><button onclick="this.parentElement.remove()">关闭</button>';
 document.body.appendChild(panel);
}
})();