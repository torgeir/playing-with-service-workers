const koaStatic = require('koa-static');
const koa = require('koa');
const app = new koa();

app.use(koaStatic('public/'));

const port = 3001;
app.listen(port);
console.log('listening on port', port);

