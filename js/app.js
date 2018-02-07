function loadData() {

    var $body = $("body");
    var $wikiElem = $("#wikipedia-links");
    var $nytHeaderElem = $("#nytimes-header");
    var $nytElem = $("#nytimes-articles");
    var $greeting = $("#greeting");

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

// Google streetview
// https://developers.google.com/maps/documentation/streetview/

    const googleMapUrl = "https://maps.googleapis.com/maps/api/streetview?size=600x300&location=";

    var street = $("#street").val();
    var city = $("#city").val();

    $greeting.text("This is what it's going on in: " + city);

    let imgSrc = googleMapUrl + street + ", " + city + "&key=" + googleApiKey;
    $body.append('<img class="bgimg" src="'+imgSrc+'">');


// The New York Times Developer Network - [ http://developer.nytimes.com ]

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
        url += '?' + $.param({
        'api-key': nyTimesApyKey,
        'q': city,
        'begin_date': "20180201"
    });

    $.getJSON(url, function(data) {

        $.each(data.response.docs, function(key, val) {

            $nytElem.append(
                '<li class="article">' +
                    '<a href="' + val.web_url + '">' + val.headline.main + '</a>' +
                    '<p>' + val.snippet + '</p>' +
                '</li>'
            );

        });

    }).fail(function() {
        $nytHeaderElem.text("New York Times Articles could not be loaded.");
    });

// Wikipedia - [https://www.mediawiki.org/wiki/API:Main_page]

    let wikiUrl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + city + "&format=json&callback=wikiCallback";

    $.ajax({
        url: wikiUrl,
        dataType: "jsonp",
        //jsonp: "callback",
    }).done(function(data) {

        $.each(data[1], function(key, val) {
            $wikiElem.append('<li><a href="http://en.wikipedia.org/wiki/'+ val + '">' + val + '</a></li>');
        });

    }).fail(function(err) {
        $wikiElem.text("failed to get wikipedia resources");
        console.log(err);
        // throw err;
    });

// --

return false;

};

$('#form-container').submit(loadData);
