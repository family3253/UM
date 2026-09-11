import assert from'node:assert/strict';import{Router}from'../js/core/router.js';
const views=[{dataset:{view:'home'},hidden:false},{dataset:{view:'drug'},hidden:true}];
const root={querySelectorAll(sel){assert.equal(sel,'[data-view]');return views}};
global.document={body:{dataset:{}}};global.window={scrollTo(){}};
const r=new Router(root);r.go('drug');
assert.equal(r.current,'drug');assert.equal(document.body.dataset.route,'drug');assert.equal(views[0].hidden,true);assert.equal(views[1].hidden,false);
console.log('router route sync tests passed');
