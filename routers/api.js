const router=require('koa-router')({prefix:'/api'});
const jwt=require('jsonwebtoken');
const jwtAuth=require('koa-jwt');

const secret="koa-secret";

/**
 * 获取token
 */
router.get('/auth',async ctx=>{
    const {uName,pwd}=ctx.request.query;

    const token=jwt.sign({
        data:uName,
        exp:Math.floor(Date.now()/1000)+60*60 //1h
    },secret);
    ctx.body={status:0,code:200,msg:'获取token成功',data:token};
});

/**
 * 测试api /values
 */
router.get('/values',jwtAuth({secret}),async ctx=>{
    
    ctx.body={status:0,code:200,data:'values'};
});

module.exports=router;

