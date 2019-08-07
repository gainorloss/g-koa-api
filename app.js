const Koa = require('koa');

const cors = require('koa-cors');

const app = new Koa();

/**
 * 请求响应耗时记录
 */
app.use(async (ctx, next) => {
    const start = Date.now();
    await next();
    const responseTime = Date.now() - start;
    console.log(`${ctx.method} ${ctx.url} - ${responseTime}ms`);
});

/**
 * 区分请求
 */
app.use(async (ctx, next) => {
    ctx.request.query['r'] = Date.now();
    await next();
});

/**
 * 全局异常处理
 */
app.use(async (ctx, next) => {
    try {
        await next();
    } catch (error) {
        ctx.app.emit('error', error);

        const code = ctx.statusCode || ctx.status || 500;
        ctx.status = code;
        ctx.body = { status: 1, code, msg: `服务器内部异常，请联系管理员处理：${error.message}` };
    }
});
app.use(cors());

const api = require('./routers/api');
app.use(api.routes());

/**
 * 异常处理个性化订阅
 */
app.on('error', error => {
    console.log(error.message);
})

app.listen(3000);