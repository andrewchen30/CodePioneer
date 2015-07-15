var request = require("request");
var Article = require('../models/article.js');

function crawl(){


	this.start = function(){
		// setInterval(function(){
		// 	console.log('tick');
		// }, (1000) ); //5 min
		//
		request("https://www.kimonolabs.com/api/2ydhrtbc?apikey=YTFXE6bo643qztfqtgMJxbTghxkihceB",
		    function(err, res, data) {

                data = JSON.parse(data);

                data.results.collection1.forEach(function( item ){

			        var article = new Article({
				        title: item.title.text,
					    url: item.title.href,
					    author: item.users.text,
                        from: 'Hakcer News',
					    describe: item.comments.href,
					    info: [
					    	item.points
					    ]
				    });

				    //儲存到資料庫
				    article.save(function(err, result) {
				        if (err)
				        	console.log('[TEST] create article FAIL, err ->', err);
				    });
                });


		});
	};
}


module.exports = crawl;
