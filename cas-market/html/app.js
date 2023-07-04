var inventoryPatch = "nui://qb-inventory/html/images"


window.addEventListener("message",function(data){
    let item = data.data
    if (item.action == "market") {
        ShowMarket(item.items)
    }
})


const ShowMarket = function(data) {
    console.log(JSON.stringify(data))
    $("div.back-container").fadeIn(300, function() {
        let values = ""
        $("div.main-container").fadeIn(500)
        if (data.length > 0) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                values = `
                <div class="itemBox" value="${element.type}">
                    <div class="img-box">
                      <img src="${inventoryPatch}/${element.imageSrc}.png">
                    </div>
                    <div class="item-name">${element.label}</div>
                    <div class="button-container">
                        <button class="addToCart" data-name="${element.label}" data-img="${element.imageSrc}" data-price="${element.price}">
                            Add To Cart
                        </button>
                        <div class="priceofItem">$${element.price}</div>
                    </div>
                </div>
                ` + values
            }
            $(".item-body").html(values)
        }
    })
}

$(document).ready(function() {
    $('.action').on('click', function() {
      const target = $(this).data('target');
      
      if (target === 'all') {
        $('.itemBox').show();
      } else {
        $('.itemBox').each(function() {
          const value = $(this).attr('value');
          if (value === target) {
            $(this).show();
          } else {
            $(this).hide();
          }
        });
      }
      $(this).addClass('active').siblings().removeClass('active');
    });
});
  
function displayCart() {
    var cartArray = shoppingCart.listCart();
    var output = "";
    for(var i in cartArray) {
        console.log(cartArray[i].img)
      output += `<div class="shopItem">
                <div class="shopItem-left">
                    <div class="shopItem-img">
                        <img src="${inventoryPatch}/${cartArray[i].img}.png">
                    </div>
                    <div class="shopItem-info">
                        <div class="shopItem-name">${cartArray[i].name}</div>
                        <div class="shopItem-price">${cartArray[i].price}$</div>
                    </div>
                </div>
                <div class="shopItem-right">
                    <button class="countDown act-btn" data-name="${cartArray[i].name}">-</button>
                    <div class="currentCount act-btn" data-name="${cartArray[i].name}">x${cartArray[i].count}</div>
                    <button class="countUp act-btn" data-name="${cartArray[i].name}">+</button>
                </div>
            </div>`
            }
    $('.shopcart').html(output);
    $('.total-price').html(shoppingCart.totalCart()+ "$");
  }


$(document).on("click", ".addToCart",  function() {
    var name = $(this).data('name');
    let itemCheck = shoppingCart.getItemByName(name)
    if (itemCheck) {
        return
    }
    var price = Number($(this).data('price'));
    shoppingCart.addItemToCart(name, price, 1, $(this).data("img"));
    displayCart();
});

$(document).on("click", ".pay", function() {
  console.log("paid");
  var cartArray = shoppingCart.listCart();
  var paymentMethod = $(this).hasClass("paywithcard") ? "bank" : "cash";
  console.log(paymentMethod);
  $.post("https://cas-market/CompleteOrder", JSON.stringify({
      item: cartArray,
      price: shoppingCart.totalCart(),
      method : paymentMethod
  }), function(result) {
      if (result) {
          shoppingCart.clearCart();
          displayCart();
          $(".back-container").hide();
          $(".main-container").hide();
          $.post("https://cas-market/EscapeFromJs");
      }
  });
});


$(document).ready(function() {
    $('.searchBar-input').on('input', function() {
      const query = $(this).val().toLowerCase();
      
      $('.itemBox').each(function() {
        const itemName = $(this).find('.item-name').text().toLowerCase();
    
        if (itemName.includes(query)) {
          $(this).show();
        } else {
          $(this).hide();
        }
      });
    });
});
  

  
  // -1
  $(document).on("click", ".countDown", function(event) {
    var name = $(this).data('name')
    shoppingCart.removeItemFromCart(name);
    displayCart();
  })
  // +1
  $(document).on("click", ".countUp", function(event) {
    var name = $(this).data('name')
    shoppingCart.setCountForItem(name, shoppingCart.getCountByName(name) + 1);
    displayCart();
  })
  
  
  $(document).on("change", ".currentCount", function(event) {
     var name = $(this).data('name');
     var count = Number($(this).val());
    shoppingCart.setCountForItem(name, count);
    displayCart();
  });

var shoppingCart = (function() {
    cart = [];
    
    function Item(name, price, count,img) {
      this.name = name;
      this.price = price;
      this.count = count;
      this.img = img
    }
    
  
    function saveCart() {
      sessionStorage.setItem('shoppingCart', JSON.stringify(cart));
    }
  
    function loadCart() {
      cart = JSON.parse(sessionStorage.getItem('shoppingCart'));
    }
    if (sessionStorage.getItem("shoppingCart") != null) {
      loadCart();
    }
    var obj = {};
    
  
    obj.addItemToCart = function(name, price, count, img) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart[item].count ++;
          saveCart();
          return;
        }
      }
      var item = new Item(name, price, count, img);
      cart.push(item);
      saveCart();
    }
    obj.getImgByName = function(name) {
        for (var item in cart) {
            if (cart[item].name === name){
                return cart[item].img
            }
        }
        return false
    }
    obj.setCountForItem = function(name, count) {
      for(var i in cart) {
        if (cart[i].name === name) {
          cart[i].count = count;
          break;
        }
      }
    };
    obj.removeItemFromCart = function(name) {
        for(var item in cart) {
          if(cart[item].name === name) {
            cart[item].count --;
            if(cart[item].count === 0) {
              cart.splice(item, 1);
            }
            break;
          }
      }
      saveCart();
    }
    obj.getItemByName = function(name) {
        for (var item in cart) {
            if (cart[item].name === name){
                return true
            }
        }
        return false
    }
    obj.getCountByName = function(name) {
        for (var item in cart) {
            if (cart[item].name == name) {
                return cart[item].count
            }
        }
        return 0
    }
  
    obj.removeItemFromCartAll = function(name) {
      for(var item in cart) {
        if(cart[item].name === name) {
          cart.splice(item, 1);
          break;
        }
      }
      saveCart();
    }
  
  
    obj.clearCart = function() {
      cart = [];
      saveCart();
    }
  
  
    obj.totalCount = function() {
      var totalCount = 0;
      for(var item in cart) {
        totalCount += cart[item].count;
      }
      return totalCount;
    }
  
  
    obj.totalCart = function() {
      var totalCart = 0;
      for(var item in cart) {
        totalCart += cart[item].price * cart[item].count;
      }
      return Number(totalCart.toFixed(2));
    }
  
  
    obj.listCart = function() {
      var cartCopy = [];
      for(i in cart) {
        item = cart[i];
        itemCopy = {};
        for(p in item) {
          itemCopy[p] = item[p];
  
        }
        itemCopy.total = Number(item.price * item.count).toFixed(2);
        cartCopy.push(itemCopy)
      }
      return cartCopy;
    }
    return obj;
})();

document.addEventListener("keydown",function(key) {
    if (key.isComposing || key.keyCode === 229) {
      return;
    }
    if (key.keyCode == 27) {
        $(".back-container").hide()
        $(".main-container").hide()
        $.post("https://cas-market/EscapeFromJs")
    }
  })
  