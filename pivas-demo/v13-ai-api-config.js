/* PIVAS v1.3 AI provider config layer
 Supports OpenAI-compatible endpoints, custom models, and local-only mode.
 No keys are stored in published demo.
*/
window.PIVAS_AI_CONFIG = {
 mode:'disabled',
 baseURL:'',
 model:'',
 temperature:0.1,
 timeout:30000,
 maskedKey:'',
};
window.PivasAIProvider={
 setConfig(c){window.PIVAS_AI_CONFIG={...window.PIVAS_AI_CONFIG,...c}},
 getConfig(){return {...window.PIVAS_AI_CONFIG}},
 buildRequest(){return {temperature:window.PIVAS_AI_CONFIG.temperature,model:window.PIVAS_AI_CONFIG.model}}
};
