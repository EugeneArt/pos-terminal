$(document).ready(function(){

    scanBarcode();

    $(".item").click(function () {
        var name = $(this).find(".item_title").text();
        var price = $(this).find(".item_price").text();
        var img = $(this).find("img").attr("src");

        addToItemPopup(name,price, img);
    });

    //add to popup
    $(".calc-btn").click(function () {
        calculate();
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


    // item-popup
    $("#count_min").click(function () {
        var val = $("#count").val();
        var intVal = parseInt(val);
        if(intVal > 1) {
            var dec = intVal - 1;
        } else {
            var dec = 1;
        }
        $("#count").val(dec);
    });

    $("#count_max").click(function () {
        var val = $("#count").val();
        var inc = parseInt(val) + 1;
        $("#count").val(inc);
    });

    $(".item-popup_btn").click(function () {
        $(".item-popup").hide();
    });
    $(".item-popup_btn-cancel").click(function () {
        clearPopup();
    });
    $(".item-popup_btn-accept").click(function () {
        takePopupItem();
    });


    var click = 0;
    $(".clock").click(function () {
        if (click > 10) {
            var boobs = $('<div/>').addClass("boobs");
            var img = $('<img/>').attr("src", "images/easter-egg/boobs.jpg");
            boobs.append(img);
            $("body").append(boobs);
            setInterval( function () {
                boobs.remove();
            }, 2000);
            click = 0;

        } else {
            click += 1;
        }
    });

});

function scanBarcode() {
    var names = ['Бублик','Салат оливье', 'Франзуская булочка', 'Творожный десерт'];
    var prices = ['2.11 руб','0.70 руб','2.22 руб','1.55 руб'];

    var goods = [];
    var str = '';
    $(document).keydown(function(event){
        event.preventDefault();
        var key = event.key;
        if(key != 'Enter' && key != 'j' && key != 'Control') {
            str += key;
        } else {
            if (str.length == 13 ){

                var item = Math.floor(Math.random()*names.length);
                var currentName = names[item];
                var currentPrice = prices[item];

                //to add recognize good for future
                good = {};
                good.barcode =  str;
                good.name = currentName;
                good.price = currentPrice;
                goods.push(good);

                addTextToList(currentName,currentPrice, $(".list"));
                addTextToList(currentName,currentPrice, $(".popup-list"));
                scrollToBottom();
            }
            str = '';
        }
    });
}

function addToItemPopup(name,price, img) {
    $(".item-popup_title").text(name);
    $(".item-popup_price").text(price);
    $(".item-popup img").attr("src", img);
    $(".item-popup").show();
}
function calculate() {
    $(".popup").show();
    $(".accept").show();

    var sum = 0;
    $('.list li span').each(function()
    {
        var str = $(this).text();
        if(str.length) {
            var string = $(this).text().slice(0,-4);
            var int = parseFloat(string);
            sum += int;
        }

    });

    if(sum == 0) {
        $(".accept").hide();
        $(".popup h1").text("Вы ничего не заказали!");
    }else {
        $(".popup h1").text("Сумма заказа: " + sum.toFixed(2) + " руб.");
    }
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

function takePopupItem() {
    var name = $(".item-popup_title").text();
    var price = $(".item-popup_price").text().slice(0,-4);
    var quantity = $("#count").val();

    var intPrice = parseFloat(price);
    var fullprice = quantity*intPrice;

    addTextToList(name + " (" + quantity + " шт.)   ",fullprice.toFixed(2) + " руб.", $(".list"));
    addTextToList(name + " (" + quantity + " шт.)   ",fullprice.toFixed(2) + " руб.", $(".popup-list"));
    scrollToBottom();
    clearPopup();
}

function clearPopup() {
    $(".item-popup_title").text("");
    $(".item-popup_price").text("");
    $(".item-popup img").attr("src", " ");
    $("#count").val(1);
}