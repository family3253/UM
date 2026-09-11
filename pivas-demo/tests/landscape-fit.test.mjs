import assert from'node:assert/strict';import fs from'node:fs';
const css=fs.readFileSync(new URL('../v31-overrides.css',import.meta.url),'utf8');
assert.match(css,/@media\(orientation:landscape\) and \(max-height:500px\)/);
for(const token of[
'100dvh',
'body\\[data-route="home"\\]\\{overflow:hidden',
'body\\[data-route="home"\\] \\.app-main\\{height:100dvh',
'body\\[data-route="home"\\] \\[data-view="home"\\]\\{height:100%',
'grid-template-rows:58px minmax\\(0,1fr\\)',
'grid-template-columns:repeat\\(4,minmax\\(0,1fr\\)\\)!important',
'grid-template-rows:repeat\\(2,minmax\\(0,1fr\\)\\)',
'\\.primary-tile,body\\[data-route="home"\\] \\.secondary-tile\\{grid-column:auto!important',
'body\\[data-route="home"\\] \\.home-dashboard\\{display:none!important'
])assert.match(css,new RegExp(token));
console.log('landscape one-screen tests passed');
