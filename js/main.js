$(document).ready(function(){

    var names = ['Бублик','Салат оливье', 'Франзуская булочка', 'Творожный десерт'];
    var prices = ['2.11 руб','0.70 руб','2.22 руб','1.55 руб'];

    scanBarcode(names, prices);

    $(".item").click(function () {
        var name = $(this).find(".item_title").text();
        var price = $(this).find(".item_price").text();
        addTextToList(name,price, $(".list"));
        addTextToList(name,price, $(".popup-list"));
        scrollToBottom()
    });

    $(".calc-btn").click(function () {
        $(".popup").show();
        var sum = 0;
        $('.list li span').each(function()
        {
            var str = $(this).text();
            console.log(str);
            if(str.length > 10) {
                sum += 1;
            } else {
                var string = $(this).text().slice(0,-4);
                var int = parseFloat(string);
                sum += int;
            }

        });

        $(".popup h1").text("Сумма заказа: " + sum.toFixed(2) + " руб.");
    });

    $(".accept").click(function () {
        $(".popup").hide();
        $(".list").empty();
        $(".popup-list").empty();
    });
    $(".cancel").click(function () {
        $(".popup").hide();
        $(".list").empty();
        $(".popup-list").empty();
    });

});


function scanBarcode(names,prices) {
    var goods = [];
    var str = '';
    $(document).keydown(function(event){
        event.preventDefault();
        var key = event.key;
        if(key != 'Enter' && key != 'j' && key != 'Control') {
            str += key;
        } else {
            if (str.length == 13 ){
                // goods.forEach(function (item) {
                //    if(item.barcode == str) {
                //        addTextToList(item.name,item.price, $(".list"));
                //    }
                // });

                var item = Math.floor(Math.random()*names.length);
                var currentName = names[item];
                var currentPrice = prices[item];

                good = {};
                good.barcode =  str;
                good.name = currentName;
                good.price = currentPrice;
                goods.push(good);

                // names.splice(item, 1);
                // prices.splice(item, 1);
                addTextToList(currentName,currentPrice, $(".list"));
                addTextToList(currentName,currentPrice, $(".popup-list"));
                scrollToBottom();
            }
            str = '';

        }
    });
}

function addTextToList(name,price, listName) {
    var li = $('<li/>').text(name);
    li.append($('<span/>').text(price));
    listName.append(li);
}
function scrollToBottom() {
    $(".terminal").animate({
        scrollTop: $(".terminal")[0].scrollHeight
    }, 1);
}
