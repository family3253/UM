import assert from'node:assert/strict';import fs from'node:fs';
const css=fs.readFileSync(new URL('../v31-overrides.css',import.meta.url),'utf8');
assert.match(css,/@media\(orientation:landscape\) and \(max-height:500px\)/);
for(const token of ['100dvh','--compact-scale','\.app-topbar\{height:50px','\.app-main\{padding:58px 10px 10px!important','\.hero\{min-height:112px','\.hero h1\{font-size:clamp\(22px,6\.2vh,30px\)','\.home-dashboard\{display:none','\.tile\.primary-tile\{min-height:82px!important','\.tile\.secondary-tile\{min-height:70px!important'])assert.match(css,new RegExp(token));
console.log('landscape fit tests passed');
