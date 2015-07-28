//modules
let request = require('request');

//init data
let initData = {
    title: 'New JavaScript in 2015 !!',
    url: 'https://www.google.com.tw',
    author: 'AndrewChen',
    from: 'FaceBook',
    describe: 'this is the world future...',
    info: ["200 comments", "999 likes"]
};

//tmp variable
let lastestTime = null;
let tmpAidForLike = null;

//config
let config = require('../config.js');

//models
let Article = require('../models/article.js');

describe('[ DB data check - crawl ]', function() {

    before( () => {

        return Article.remove({ author: 'AndrewChen' }, (err, result) => {

            //init data
            var article = new Article(initData);
            article.save((err, result) => {
                lastestTime = result.lastestTime;
            });
        });
    });

    describe('正常操作測試', () => {

        it('[Crawl] 爬蟲資料庫資料充足', ( done ) => {

             //db operation
             Article.find()
                    .execAsync()
                    .then( (result) => {
                        should.exist(result);
                        result.should.with.lengthOf(20);
                    })
                    .catch( (err) => {
                        //should.not.exist(err);
                    });

                    return done();
        });

        it('[Crawl] 爬蟲資料庫資料充足 - github10', ( done ) => {

             //db operation
             Article.find()
                    .where('from').equals(config.crawlName.github10)
                    .execAsync()
                    .then( (result) => {
                        should.exist(result);
                        result.should.with.lengthOf(5);
                    })
                    .catch( (err) => {
                        //should.not.exist(err);
                    });

                    return done();
        });

        it('[Crawl] 無異質資料-from', ( done ) => {

            let source = [];

            Object.keys(config.crawlName).map( (value) => {
                source.push(value);
            });

             //db operation
             Article.find({ from: { $nin: source } })
                    .execAsync()
                    .then( (result) => {
                        should.exist(result);
                        result.should.with.lengthOf(0);
                    })
                    .catch( (err) => {
                        //should.not.exist(err);
                    });

                    return done();
        });

        it('[Crawl] 無異質資料-title', ( done ) => {

             //db operation
             Article.find()
                    .where('title').equals('')
                    .execAsync()
                    .then( (result) => {
                        should.exist(result);
                        result.should.with.lengthOf(0);
                    })
                    .catch( (err) => {
                        //should.not.exist(err);
                    });

                    return done();
        });

        it('[Crawl] 無異質資料-time', ( done ) => {

             //db operation
             Article.find()
                    .where('time').equals('')
                    .execAsync()
                    .then( (result) => {
                        should.exist(result);
                        result.should.with.lengthOf(0);
                    })
                    .catch( (err) => {
                        //should.not.exist(err);
                    });

                    return done();
        });
    });

    after( (done) => {
        return done();
    });
});
