/* PIVAS v1.1 Document Agent
 * Pipeline:
 * upload -> extract -> OCR fallback -> section locate -> field extraction -> evidence binding
 */
(function(root){
 const sections=['配制方法','稀释液','稳定性','贮藏','输注要求','注意事项'];
 function createTask(file){return {file:file?.name||'',stage:'UPLOADED',sections,fields:{},evidence:[]}}
 function advance(task,next){return {...task,stage:next}}
 root.PivasDocumentAgent={createTask,advance,sections}
})(window);
