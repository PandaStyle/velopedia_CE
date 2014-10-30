var postsOffset = 0;


document.addEventListener('DOMContentLoaded', function () {
    console.log('domready in ' + ((new Date().getTime()) - (a.getTime()))+ "ms");

    getNews(roadCCRSS);
    getPosts(postsOffset);

    $(window).resize(function(){
        $('.news').height($(window).height()-90);
        $('.loading').width($(window).width()-400);
    });

    $(window).on("scrollstop", scrollHandler);

    [].slice.call( document.querySelectorAll( 'select.cs-select' ) ).forEach( function(el) {
        new SelectFx(el);
    } );

});


var
    getPostTriggered = true,
    smallestColumnOffset,
    postItemCount = 20,
    a = new Date(),
    postIds = [],

    cyclingNewsRss = 'http://feeds.feedburner.com/cyclingnews/news?format=xml',
    cyclingTipsRss = 'http://feeds.feedburner.com/cyclingtipsblog/TJog?format=xml',
    roadCCRSS = 'http://road.cc/all/feed';

function getNews(feedUrl){
    $.ajax({
        type: "GET",
        url: "http://velopedia.meteor.com/getnews",
        data: {url: feedUrl}
    })
        .fail(function(err){
            console.log(err);
        })
        .done(function( res ) {
            console.log(res.length + "item arrived from " + feedUrl + " in " + ((new Date().getTime()) - (a.getTime()))+ "ms");

            var newsCont = $('.news');

            for(var i=0; i < res.length; i++){
                var fragment = $('<div class="cont">\
                                    <a class="title" href="'+ res[i].link +'">'+ res[i].title +'</a>\
                                  </div>');
                newsCont.append(fragment);
            }

            console.log("news append ready in " + ((new Date().getTime()) - (a.getTime()))+ "ms")

        })
}

function getPosts(o){
    $('.loading').show();

    $.get( "http://velopedia.meteor.com/getposts", {offset: o})
        .fail(function(err){
            console.log(error);
        })
        .done(function( results ) {
            $('.time').text(new Date() - a);
            console.log(results.length + 'items recieved with offset: ' + o );

            if(o == 0){
                salvattore.register_grid($('.tumblr')[0]);
            }

            var counter = 0;


            for(var i=0; i < results.length; i++){
                postIds.push(results[i].id);
                if(_.where(results[i].photos[0].alt_sizes, {width: 400}).length>0){
                    var url = _.where(results[i].photos[0].alt_sizes, {width: 400})[0].url;
                } else {
                    continue;
                }

                var item = $(' <div class="box item">\
                                <img src="' + url + '" alt=""/>\
                                </div>');

                item.imagesLoaded()
                    .done(function(c,b){
                        $('.loading').hide();

                        salvattore.append_elements($('.tumblr')[0], [c.elements[0]]);

                        counter++;

                        if(counter == postItemCount){
                            console.log("last item appended in " + ((new Date().getTime()) - (a.getTime()))+ "ms");
                            onFinish();
                        }
                    });



            };

            function onFinish(){
                var c = _.sortBy(postIds);
                for(var i = 0; i < c.length; i ++){
                   if([i] == c[i++]){
                       console.log('IDENTITITI');
                   }
                }

                $(window).on("scrollstop", scrollHandler);getPostTriggered = true;

                console.log("posts append ready in " + ((new Date().getTime()) - (a.getTime()))+ "ms");


                getPostTriggered = true;
                postsOffset += postItemCount;

                setColumnHeights();
            };
        });



}

function scrollHandler() {

    var b = $(window).scrollTop() + $(window).height();
    if (b >= smallestColumnOffset || b >= $(document).height() ) {
        $(window).off("scrollstop");

        if(getPostTriggered){
            getPostTriggered = false;
            getPosts(postsOffset);

        }
    };
}

function setColumnHeights() {
    for (var b = $(".column"), c = null, d = 0, e = b.length; e > d; d++) {
        var f = $(b[d]);
        null == c ? (c = f.height(), smallestColumnOffset = f.children("div").last().offset().top + f.children("div").last().height() / 2) : c > f.height() && (c = f.height(), smallestColumnOffset = f.children("div").last().offset().top + f.children("div").last().height() / 2)
    }
}




