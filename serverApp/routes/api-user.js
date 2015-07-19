//express
let express = require('express');
let router = express.Router();

//debug
let debug = require('debug')('API:user');

//model
let User = require('../models/user.js');

//feature
let postMan = require('../feature/mail.js');
let checkPorperty = require('../feature/checkPorperty.js');
let check = checkPorperty.check;

//=======================================================

/*
 * [POST] 新增使用者
 * request : body.name, body.email, body.pwd
 * respone : db result
 */
router.post('/', (req, res, next) => {

    debug('[POST] 新增使用者 req.body ->', req.body );

    let miss = check( req.body, ['name', 'email', 'pwd'] );
    if(!miss.check){
        debug('[POST] 新增使用者 miss data ->', miss.missData);
        return next(err);
    }

    let user = new User({
        name: req.body.name,
        email: req.body.email,
        pwd: req.body.pwd,
        likeArticle: [],
        whoLikeMe: []
    });

    user.saveAsync()
        .spread( (result) => {
            debug('[POST] 新增使用者 success ->', result);
            res.json(result);
        })
        .catch( (err) => {
            debug('[POST] 新增使用者 fail ->', err);
            next(err);
        });
});

/*
 * [GET] 查詢使用者
 * request : body.uid
 * respone : name, email, pwd
 */
router.get('/', (req, res, next) => {

    debug('[GET] 查詢使用者 req.body ->', req.body );

    let miss = check( req.body, ['uid'] );
    if(!miss.check){
        debug('[POST] 新增使用者 miss data ->', miss.missData);
        return next(err);
    }

    User.findOne()
        .where('_id').equals( req.body.uid )
        .execAsync()
        .then( (result) => {
            debug('[GET] 查詢使用者 success ->', result);
            res.json(result);
        })
        .catch( (err) => {
            debug('[GET] 查詢使用者 fail ->', err);
            next(err);
    })
});

/*
 * [PUT] 修改使用者
 * request : body.uid, body.name, body.email, body.pwd
 * respone : db result
 */
router.put('/',  (req, res, next) => {

    debug('[PUT] 修改使用者 req.body ->', req.body );

    let miss = check( req.body, ['uid', 'name', 'email', 'pwd'] );
    if(!miss.check){
        debug('[PUT] 修改使用者 miss data ->', miss.missData);
        return next(err);
    }

    let info = {
        name: req.body.name,
        email: req.body.email,
        pwd: req.body.pwd
    }

    User.findOneAndUpdate( { _id: req.body.uid }, info)
        .updateAsync()
        .then( (result) => {
            debug('[PUT] 修改使用者 success ->', result);
            res.json(result);
        })
        .catch( (err) => {
            debug('[PUT] 修改使用者 fail ->', err);
            next(err);
        });
});

/*
 * [DELETE] 刪除使用者
 * request : body.uid
 * respone : db result
 */
router.delete('/', (req, res, next) => {

    debug('[DELETE] 刪除使用者 req.body ->', req.body );

    let miss = check( req.body, ['uid'] );
    if(!miss.check){
        debug('[DELETE] 刪除使用者 miss data ->', miss.missData);
        return next(err);
    }

    User.findOneAndRemove( {_id: req.body.uid } )
        .remove()
        .then( (result) => {
            debug('[DELETE] 刪除使用者 success ->', result);
            res.json(result);
        })
        .catch( (err) => {
            debug('[DELETE] 刪除使用者 fail ->', err);
            next(err)
        });
});

/*
 * [POST] 登入檢查
 * request : body.email, body.pwd
 * respone : login : true || false, _id : _id
 */
router.post('/login', (req, res, next) => {

    debug('[POST] 登入檢查', 'req.body->', req.body );

    let miss = check( req.body, ['email', 'pwd'] );
    if(!miss.check){
        debug('[DELETE] 刪除使用者 miss data ->', miss.missData);
        return next(err);
    }

    User.findOne()
        .where('email').equals( req.body.email )
        .where('pwd').equals( req.body.pwd )
        .execAsync()
        .then( (result) => {

            if(result){
                debug('[POST] 登入檢查 success', result);
                res.json({
                    login : true,
                    _id : result._id
                });
            }else{
                debug('[POST] 登入檢查 fail', result);
                res.json({ login : false });
            }
        })
        .catch( (err) => {
            debug('[POST] 登入檢查 fail', err);
            res.json({ login : false });
        });
});


/*
 * [GET] 取回密碼
 * request : body.email
 * respone : sendMail : true || false
 */
router.get('/pwd', function(req, res, next){

    debug('[GET] 取回密碼 req.body ->', req.body );

    let miss = check( req.body, ['email'] );
    if(!miss.check){
        debug('[DELETE] 刪除使用者 miss data ->', miss.missData);
        return next(err);
    }

    User.findOne()
        .where('email').equals( req.query.email )
        .execAsync()
        .then( (result) => {

            if(result){
                //send mail
                let mailer = new postMan();
                mailer.sendTo( result.email, result.pwd );

                debug('[GET] 查詢使用者 success ->', result);
                res.json({ sendMail : true });

            }else{
                res.json({ sendMail : false });
            }
        })
        .catch( (err) => {
            debug('[GET] 查詢使用者 fail ->', err);
            res.json({ sendMail : false });
        });
});

module.exports = router;
