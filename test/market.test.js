const { test, mock } = require('node:test');
const assert = require('node:assert/strict');
const vm = require('node:vm');
const app = require('../index');
const mongoose = require('mongoose');
const Product = require('../models/product');
const Farm = require('../models/farm');
const password = 'test-only-password-24-characters';
const authorization = 'Basic ' + Buffer.from(`owner:${password}`).toString('base64');

async function withServer(fn) {
  const server = app.listen(0, '127.0.0.1');
  await new Promise(resolve => server.once('listening', resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  try { await fn(base); } finally { await new Promise(resolve => server.close(resolve)); mock.restoreAll(); }
}
function render(view, data) {
  return new Promise((resolve, reject) => app.render(view, data, (err, html) => err ? reject(err) : resolve(html)));
}

test('public home, missing page, and static files work without database configuration', async () => {
  delete process.env.MONGODB_URI;
  await withServer(async base => {
    for (const [path, status] of [['/',200],['/missing',404],['/css/index.css',200],['/api/stats',503]]) {
      assert.equal((await fetch(base + path)).status, status);
    }
  });
});
test('anonymous writes and editor forms are blocked; cross-origin writes are denied', async () => {
  process.env.MARKET_ADMIN_PASSWORD = password;
  await withServer(async base => {
    assert.equal((await fetch(base + '/products/new')).status, 401);
    assert.equal((await fetch(base + '/products', {method:'POST'})).status, 401);
    assert.equal((await fetch(base + '/products', {method:'POST',headers:{authorization,origin:'https://other.example'}})).status,403);
    assert.equal((await fetch(base + '/products', {method:'POST',headers:{authorization}})).status,403);
  });
});
test('standalone product form renders and product scripts retain numeric prices and safe names', async () => {
  const html = await render('products/new', {farmId:null});
  assert.match(html, /action="\/products"/);
  const product = {_id:new mongoose.Types.ObjectId(),name:"Farmer's </script><script>alert(1)</script>",price:2.49,category:'fruit',farm:null};
  for (const view of ['products/edit','products/show']) {
    const output = await render(view, {product});
    const script = output.match(/window.productData = .*?;/)[0];
    assert.ok(!script.includes('</script>'));
    const context = {window:{}};
    vm.runInNewContext(script,context);
    assert.equal(context.window.productData.price,2.49);
    assert.equal(context.window.productData.name,product.name);
  }
});
test('nested deletion scopes the query to both farm and product', async () => {
  process.env.MARKET_ADMIN_PASSWORD = password;
  const previous = mongoose.connection.readyState;
  mongoose.connection.readyState = 1;
  let query;
  mock.method(Product,'findOneAndDelete',async filter => {query=filter;return null;});
  try {
    await withServer(async base => {
      const farm='507f1f77bcf86cd799439011', product='507f1f77bcf86cd799439012';
      const result=await fetch(`${base}/farms/${farm}/products/${product}?_method=DELETE`,{method:'POST',headers:{authorization,origin:base}});
      assert.equal(result.status,404);
      assert.deepEqual(query,{_id:product,farm});
    });
  } finally {mongoose.connection.readyState=previous;}
});
test('product update allows catalog fields only and preserves farm ownership', async () => {
  process.env.MARKET_ADMIN_PASSWORD = password;
  const previous=mongoose.connection.readyState;
  mongoose.connection.readyState=1;
  let update;
  mock.method(Product,'findByIdAndUpdate',async (id, data) => {update=data;return {_id:id};});
  try {
    await withServer(async base => {
      const result=await fetch(`${base}/products/507f1f77bcf86cd799439012?_method=PUT`,{
        method:'POST',redirect:'manual',headers:{authorization,origin:base,'content-type':'application/x-www-form-urlencoded'},
        body:'name=Apple&price=2.5&category=fruit&farm=other&%24unset=price'
      });
      assert.equal(result.status,302);
      assert.deepEqual(update,{$set:{name:'Apple',price:'2.5',category:'fruit'}});
    });
  } finally {mongoose.connection.readyState=previous;}
});
test('models reject invalid price and missing category', async () => {
  assert.ok(new Product({name:'Apple',price:-2,category:'fruit'}).validateSync());
  assert.ok(new Product({name:'Apple',price:2}).validateSync());
});
test('all catalog templates render populated and empty states with valid inline scripts', async () => {
  const farm = {_id:new mongoose.Types.ObjectId(),name:"Farmer's Market",type:'Mixed',location:'Napa',email:'test@example.com',products:[]};
  const product = {_id:new mongoose.Types.ObjectId(),name:"Farmer's Apple",price:2.49,category:'fruit',farm};
  for (const populated of [false,true]) {
    farm.products = populated ? [{...product,farm:farm._id}] : [];
    for (const view of ['farms/index','farms/show','farms/products','farms/new','products/index']) {
      const output = await render(view,{farm,farms:populated?[farm]:[],products:populated?[product]:[]});
      for (const [,script] of output.matchAll(/<script>([\s\S]*?)<\/script>/g)) new vm.Script(script);
    }
  }
});
test('seed refuses a populated database before making any writes', async () => {
  process.env.MONGODB_URI='mongodb://unused.example/farm-test';
  mock.method(mongoose,'connect',async()=>{});
  mock.method(mongoose,'disconnect',async()=>{});
  mock.method(Farm,'exists',async()=>({_id:'existing'}));
  const writes=mock.method(Farm,'create',async()=>{throw new Error('Must not write');});
  try {
    await assert.rejects(require('../demo').runDemo(), /already contains/);
    assert.equal(writes.mock.callCount(),0);
  } finally {mock.restoreAll();delete process.env.MONGODB_URI;}
});
