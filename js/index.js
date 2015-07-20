var postsOffset = 0,
    selectedRss = 0;

NProgress.start();

document.addEventListener('DOMContentLoaded', function () {
    console.log('domready in ' + ((new Date().getTime()) - (a.getTime()))+ "ms");

    getNews(rss[Object.keys(rss)[selectedRss]]);
    getPosts(postsOffset);

    $(window).resize(function(){
        $('.news').height($(window).height()-90);
    });

    $('.loading').css('top', ($(window).height()-350)/2);

    $(window).on("scrollstart", function(){ $('body').addClass('disable-hover');});
    $(window).on("scrollstop", scrollHandler);



    $('.header-icon').click(function(){
        selectedRss += 1;
        if(selectedRss == 4){
            selectedRss = 0;
        }
        getNews(rss[Object.keys(rss)[selectedRss]]);
    })

});


var
    serverUrl = "http://velopedia.meteor.com/getposts",
    //serverUrl = "http://localhost:3000/getposts",

    getPostTriggered = true,
    smallestColumnOffset,
    postItemCount = 20,
    a = new Date(),
    postIds = [],

    appendedItems = [],

    DELAYVALUE = 0.05;

    rss = {
        cyclingtips: {
            url: 'http://feeds.feedburner.com/cyclingtipsblog/TJog?format=xml',
            title: 'Cycling Tips',
            img: '../assets/img/cyclingtips.jpg'
        },
        cyclingnews: {
            url: 'http://feeds.feedburner.com/cyclingnews/news?format=xml',
            title: 'Cycling News',
            img: '../assets/img/cyclingnews.jpg'
        },
        velodaily: {
            url: 'http://www.velodaily.com/feed/',
            title: 'Velo Daily',
            img: '../assets/img/velodaily.jpg'
        },
        roadcc: {
            url: 'http://road.cc/all/feed',
            title: 'Road.cc',
            img: '../assets/img/roadcc.png'
        }

    };

NProgress.inc();
function getNews(obj){

    var feedUrl = obj.url;
        spinner = $('.header > .spinner');

    $('.header > img, .header > .txt').fadeOut(100);

    $('.news').fadeOut(100);

    spinner.fadeIn(100);


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

            var newsCont = $('.news').empty().show();

            for(var i=0; i < res.length; i++){
                var fragment = $('<div class="cont">\
                <div class="holder">\
                    <div class="image">\
                        <img class="site" src="../assets/img/' + res[i].site + '.jpg"/>\
                    </div>\
                    <div class="links">\
                                    <a class="title" href="'+ res[i].link +'">'+ res[i].title +'</a>\
                                    <div>\
                                    <a class="url" href="'+ res[i].link +'">' + res[i].shortSiteName + '</a> \
                                    <span class="time">' + res[i].diff + ' ago</span>\
                                    </div>\
                                    </div>\
                    </div>\
                </div>');

                var trd = i*0.1 + 's';
                newsCont.append(fragment.css({'transition-delay': trd}));
                //debugger;


            }

            spinner.fadeOut(100);

            $('.header > img').attr('src', obj.img).fadeIn(300);
            $('.header > .txt').html(obj.title).fadeIn(300);

            setTimeout(function(){
                newsCont.find('.cont').css({ 'opacity': '1',
                    '-webkit-transform': 'translate3d(0,0,0)',
                    'transform': 'translate3d(0,0,0)' });
            }, 200);

            NProgress.inc();
            console.log("news append ready in " + ((new Date().getTime()) - (a.getTime()))+ "ms");
        })
}

function getPosts(o){
    var postTime = new Date();

    $.get( serverUrl, {offset: o})
        .fail(function(err){
            console.log(error);
        })
        .done(function( results ) {
            console.log(results);
            console.log(results.length + ' image with offset: ' + o + ' in ' + ((new Date().getTime()) - (postTime.getTime())) + ' ms');

            if(o == 0){
                salvattore.register_grid($('.tumblr')[0]);
            }

            var counter = 0;

            appendedItems = [];

            var loaded = 0;

            for(var i=0; i < results.length; i++){
                postIds.push(results[i].id);
                if(_.where(results[i].photos[0].alt_sizes, {width: 400}).length>0){
                    var url = _.where(results[i].photos[0].alt_sizes, {width: 400})[0].url;
                } else if(_.where(results[i].photos[0].alt_sizes, {width: 399}).length>0){
                    var url = _.where(results[i].photos[0].alt_sizes, {width: 399})[0].url;
                } else {
                    console.log("Image doesn't have 400 or 399 width ", results[i]);
                    continue;
                }

                var item = $('<div class="box item">\
                                <div class="overlay">\
                                <div class="lay"></div>\
                                <i class="flaticon-logotype1 nameicon"></i> <span class="blogname">' + results[i].blog_name  + '</span> \
                                </div>\
                                <img src="' + url + '" alt=""/> \
                                </div>');

                item.imagesLoaded()
                    .done(function(c,b){

                        console.log(loaded++);
                        console.log($(c.elements[0]).find('img').attr('src'));
                        salvattore.append_elements($('.tumblr')[0], [c.elements[0]]);

                        var delay = DELAYVALUE * counter;

                        $(c.elements[0]).css({"transition-delay": delay + "s","-webkit-transition-delay": delay + "s"})

                        appendedItems.push($(c.elements[0]));

                        counter++;
                        NProgress.inc();
                        if(counter == postItemCount){
                            onFinish();
                        }
                    })
                    .fail (function( instance ) {
                        console.log('imagesLoaded failed for ', instance);
                    });

            };

            function onFinish(){
                $('.loading').remove();

                var c = _.sortBy(postIds);
                for(var i = 0; i < c.length; i ++){
                   if([i] == c[i++]){
                       console.log('IDENTITITI');
                   }
                }

                for(var i =0; i < appendedItems.length; i++){
                    appendedItems[i].css({"-webkit-transform": "translateY(0)","-moz-transform": "translateY(0)","-ms-transform": "translateY(0)","-o-transform": "translateY(0)",transform: "translateY(0)",opacity: 1});
                }

                $(window).on("scrollstop", scrollHandler);getPostTriggered = true;

                console.log("images loaded and appended, in " + ((new Date().getTime()) - (postTime.getTime()))+ "ms");
                NProgress.done();

                getPostTriggered = true;
                postsOffset += postItemCount;

                setColumnHeights();
            };
        });



}

function scrollHandler() {
    $('body').removeClass('disable-hover');

    var b = $(window).scrollTop() + $(window).height();
    if (b >= (smallestColumnOffset - ($(document).height()/5)) || b >= $(document).height() ) {
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




