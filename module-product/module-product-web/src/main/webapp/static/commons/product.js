var productInfo = {
    spec : null
};

/*
添加到购物车
 */
function addProductToCart(productId, productSpec, okFunction, failFunction) {
    ajaxPost(getContextPaht() + '/product/doAddCart', {
            id: productId,
            spec: productSpec
        },
        okFunction ? okFunction : function () {
            alert('成功添加到购物车。')
        },
        failFunction ? failFunction : function (data) {
            alert('添加到购物车失败：' + data.message)
        })
}

/*
添加商品到收藏夹
 */
function addProductToFavorite(productId, okFunction, failFunction) {
    ajaxPost(getContextPaht() + '/product/doAddFavorite', {
            id: productId
        },
        okFunction ? okFunction : function () {
            alert('成功添加到收藏夹。')
        },
        failFunction ? failFunction : function (data) {
            alert('添加到收藏夹失败：' + data.message)
        })
}



/*
购买产品
 */
function buyPrudct(productId, okFunction, failFunction) {
    ajaxPost(getContextPaht() + '/product/doBuy', {
            id: productId,
            spec: productInfo.spec
        },
        okFunction ? okFunction : function (data) {
            if (data.gotoUrl) {
                location.href = data.gotoUrl;
            }
        },
        failFunction ? failFunction : function () {
            if (data.gotoUrl) {
                location.href = data.gotoUrl;
            } else {
                alert('无法进行购买：' + data.message)
            }
        })
}


function getContextPaht() {
    return typeof jpress != "undefined" && jpress.cpath ? jpress.cpath : "";
}


function ajaxPost(url, data, okFunction, failFunction) {
    $.post(url, data,function (result) {
        if (result.state == 'ok') {
            okFunction(result);
        } else {
            failFunction(result);
        }
    });
}

function setProductSpec(spec){
    console.log("setProductSpec : " + spec)
    productInfo.spec = spec;
}

function initSwiperComponent(){

    var galleryThumbs = new Swiper('.gallery-thumbs', {
        spaceBetween: 10,
        slidesPerView: 5,
        freeMode: true,
        watchSlidesVisibility: true,
        watchSlidesProgress: true,

    });

    var galleryTop = new Swiper('.gallery-top', {
        spaceBetween: 10,
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
        thumbs: {
            swiper: galleryThumbs
        }
    });
}

function initCommentComponent() {
    $('#jpress-comment-form').on('submit', function () {
        $(this).ajaxSubmit({
            type: "post",
            success: function (data) {
                if (data.state == "ok") {
                    location.href = location.href.indexOf("#allComment") > 0 ?
                        location.href :
                        location.href+"#allComment";
                    location.reload()
                } else {
                    alert('评论失败：' + data.message);
                    if (data.errorCode == 9) {
                        location.href = '#(CPATH)/user/login';
                    }
                }
                $('#content').val('');
            },
            error: function () {
                alert("网络错误，请稍后重试");
            }
        });
        return false;
    });
}


$(document).ready(function(){

    $(".product-specs li").click(function(){
        setProductSpec($(this).text());
        $(this).addClass("active");
        $(this).siblings().removeClass("active");
    });

    $(".product-specs li:first").addClass("active");
    setProductSpec($(".product-specs li:first").text());

    initSwiperComponent();
    initCommentComponent();

});