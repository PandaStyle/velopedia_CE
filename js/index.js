
var a = new Date();
// Run our kitten generation script as soon as the document's DOM is ready.
document.addEventListener('DOMContentLoaded', function () {
    console.log('domready');

    getPosts(0);

    $(window).resize(function(){
        $('.news').height($(window).height()-90);
        $('.loading').width($(window).width()-400);
    });

    $(window).on("scrollstop", scrollHandler);

});


var getPostTriggered = true,

    postsOffset,

    smallestColumnOffset,

    postItemCount = 40;


function getPosts(o){
    $('.loading').show();

    $.get( "http://velopedia.meteor.com/getposts", {offset: o})
        .fail(function(err){
            console.log(error);
        })
        .done(function( results ) {
            $('.time').text(new Date() - a);
            console.log(results.length + 'items recieved with offset: ' + o );
            console.log(results);

            if(o == 0){
                salvattore.register_grid($('.tumblr')[0]);
            }

            var arr = [];
            var fragment = $('<div />');
            for(var i=0; i < results.length; i++){

                if(_.where(results[i].photos[0].alt_sizes, {width: 400}).length>0){
                    var url = _.where(results[i].photos[0].alt_sizes, {width: 400})[0].url;
                } else {
                    continue;
                }

                var item = $(' <div class="box item">\
                                <img src="' + url + '" alt=""/>\
                                </div>');

                fragment.append(item);
                arr.push(item[0]);

            };

            fragment.imagesLoaded().done(function(a, b){
                /*  for(var i=0; i < arr.length; i++){
                 salvattore.append_elements($('.tumblr')[0], [arr[i]]);
                 }*/


                salvattore.append_elements($('.tumblr')[0], arr);


                getColumnHeights();

                $(window).on("scrollstop", scrollHandler);getPostTriggered = true;
                $('.loading').hide();

                getPostTriggered = true;
                postsOffset += 40;
            });
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

function getColumnHeights() {
    for (var b = $(".column"), c = null, d = 0, e = b.length; e > d; d++) {
        var f = $(b[d]);
    }
}


