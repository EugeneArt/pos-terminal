$(document).ready(function(){

    scanBarcode();

    $(".item").click(function () {
        var name = $(this).find(".item_title").text();
        var price = $(this).find(".item_price").text();
        var img = $(this).find("img").attr("src");

        addToItemPopup(name,price, img);
    });

    $(".calc-btn").click(function () {
        calculate();
        createPopupList();
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

    var str = '';
    $(document).keydown(function(event){
        event.preventDefault();
        var key = event.key;
        if(key != 'Enter') {
            str += key;
        } else {
            if (str.length == 13 ){
                var barcode = str;
                var product = generateProduct(barcode);
                if ($.isEmptyObject(product)) {
                    product = randomGenereateProduct();
                }

                var equalProduct = getEqualProduct(product.name,1, product.price.slice(0,-4));

                if ($.isEmptyObject(equalProduct)) {
                    addTextToList(product.name + " (1 шт.)   ", product.price, $(".list"));
                } else {
                    addTextToList(equalProduct.name + " (" + equalProduct.fullQuantity + " шт.)   ",equalProduct.fullPrice.toFixed(2) + " руб.", $(".list"));
                }

                scrollToBottom();
            }
            str = '';
        }
    });
}

function generateProduct(barcode) {
    products = [
        {
            barcode: "1234567890128",
            name: "Творожный десерт",
            price: "2.11 руб."
        },
        {
            barcode: "1234567290133",
            name: "Французская булочка",
            price: "1.20 руб."
        },
        {
            barcode:"2233567290111",
            name: "Салат Оливье",
            price: "3.05 руб."
        },
        {
            barcode:"1222337290551",
            name: "Суп Свекольник",
            price: "1.65 руб."
        },
        {
            barcode:"4224537296514",
            name: "Драники",
            price: "2.48 руб."
        }

    ];
    var product = {};
    products.forEach(function (item) {
        if(item.barcode == barcode) {
            product.name = item.name;
            product.price = item.price;
        }
    });
    return product;

}

function randomGenereateProduct() {
    var product= {};
    var names = ['Бублик','Спаржа', 'Курица гриль', 'Мясная нарезка'];
    var prices = ['2.11 руб.','0.70 руб.','2.22 руб.','1.55 руб.'];
    var item = Math.floor(Math.random()*names.length);

    product.name = names[item];
    product.price = prices[item];

    return product;
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

function createPopupList() {
    $('.list li').each(function () {
        $(".popup-list").append($(this));
    })
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

    var product = getEqualProduct(name,quantity, fullprice);

    if ($.isEmptyObject(product)) {
        addTextToList(name + " (" + quantity + " шт.)   ", fullprice.toFixed(2) + " руб.", $(".list"));
    } else {
        addTextToList(product.name + " (" + product.fullQuantity + " шт.)   ",product.fullPrice.toFixed(2) + " руб.", $(".list"));
    }

    scrollToBottom();
    clearPopup();
}

function getEqualProduct(name, quantity, price) {
    var list = $(".list li");
    product = {};
    list.each(function () {
        var str = $(this).text();
        var listName = str.split("  ")[0].split(" ").slice(0,-2).join(" ");
        var listQuantity = str.split("  ")[0].split(" ").slice(-2)[0].substring(1, str.length);
        var listPrice = $(this).find("span").text();
        if (listName == name) {
            $(this).remove();
            product.name = name;
            product.fullQuantity = parseInt(listQuantity) + parseInt(quantity);
            product.fullPrice = parseFloat(listPrice) + parseFloat(price);
        }
    });

    return product;
}

function clearPopup() {
    $(".item-popup_title").text("");
    $(".item-popup_price").text("");
    $(".item-popup img").attr("src", " ");
    $("#count").val(1);
}
