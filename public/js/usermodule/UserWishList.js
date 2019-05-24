window.addEventListener('load', function () {

    let user;
    let userId;
    getUserDetails().then(function (data) {
        user = data;
        updateCartCount();
        getWishList();
    });

    //getting the user details
    function getUserDetails() {
        let cookieArray = document.cookie.split('=');
        cookieArray.forEach(function (item, index) {
            if (item.includes('userId')) {
                userId = cookieArray[index + 1].toString();
                userId = userId.split(';')[0];
            }
        });
        return fetch(`/userapi/getuser?userId=${userId}`)
            .then((response) => {
                return response.json();
            })
    };

    //update the cart count
    function updateCartCount() {
        document.querySelector('.cart-count').textContent = getCartCount();
        check();
    }

    //check for empty wishlist
    function check(){
        console.log(Array.from(user.wishlist).length);
        if(!Array.from(user.wishlist).length>0){
            $('.book-items-headings').css('display','none');
            $('.empty-wishlist').css('display','block');
        }else{
            $('.book-items-headings').css('display','block');
            $('.empty-wishlist').css('display','none');
        }
    }

    //getting the cart count
    function getCartCount() {
        let count = 0;
        user.cart.forEach(function (item) {
            count += item.numberOfBooks;
        });
        return count;
    }


    //making wishlist -- getting wishlist items
    function getWishList() {
        fetch(`/userapi/getwishlist?userId=${userId}`)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                getWishlistItemDetails(data);
            })
    }

    //getting wishlist item details called by getWish
    function getWishlistItemDetails(data) {
        Array.from(data).forEach(function (item) {
            fetch(`/bookapi/getbook/${item.bookId}`)
                .then(function (response) {
                    return response.json();
                })
                .then(function (data2) {
                    makeWishlistItemAndAppend(data2,item);
                })
        })
    }
    //make wishlist item and append to the parent
    function makeWishlistItemAndAppend(data,item) {
        let itemRow = document.createElement('div');
        $(itemRow).addClass('row wishlist-book-row').attr('_id', item._id).attr('_bookId', data._id);

        let imgContainer = document.createElement('div');
        $(imgContainer).addClass('col-sm-2 book-image-container');
        let img = document.createElement('img');
        $(img).addClass('book-image').attr('src', data.thumbnailUrl);
        imgContainer.append(img);

        let titleContainer = document.createElement('div');
        $(titleContainer).addClass('col-sm-4 book-title-container');
        let title = document.createElement('h2');
        $(title).addClass('book-title').text(data.title);
        titleContainer.append(title);

        let priceContainer = document.createElement('div');
        $(priceContainer).addClass('col-sm-1 book-price-container');
        let price = document.createElement('h2');
        $(price).addClass('book-price').text(data.buyPrice);
        priceContainer.append(price);

        let availContainer = document.createElement('div');
        $(availContainer).addClass('col-sm-1 book-avail-container');
        let avail = document.createElement('h2');
        if (data.numberOfBooks > 0)
            $(avail).addClass('book-avail').text("Yes");
        else
            $(avail).addClass('book-avail').text("No");
        availContainer.append(avail);

        let buttonParent = document.createElement('div');
        $(buttonParent).addClass('col-sm-4 buttons-parent');
        let buttonRow = document.createElement('div');
        $(buttonRow).addClass('row');

        let addToCartButtonContainer = document.createElement('div');
        $(addToCartButtonContainer).addClass('col-sm-6 addtocart-button-container');
        let addToCartButton = document.createElement('button');
        $(addToCartButton).addClass('btn btn-primary addtocart-button').text("Add To Cart");
        addToCartButton.addEventListener('click',addBookToCart);
        addToCartButtonContainer.append(addToCartButton);

        let removeFromWishlistButtonContainer = document.createElement('div');
        $(removeFromWishlistButtonContainer).addClass('col-sm-6 removefromwishlist-button-container');
        let removeFromWishlistButton = document.createElement('button');
        $(removeFromWishlistButton).addClass('btn btn-danger removefromwishlist-button').text("Remove");
        removeFromWishlistButton.addEventListener('click',removeBook);
        removeFromWishlistButtonContainer.append(removeFromWishlistButton);

        buttonRow.append(addToCartButtonContainer);
        buttonRow.append(removeFromWishlistButtonContainer);
        buttonParent.append(buttonRow);

        itemRow.append(imgContainer);
        itemRow.append(titleContainer);
        itemRow.append(priceContainer);
        itemRow.append(availContainer);
        itemRow.append(buttonParent);
        $('.wishlist-items').append(itemRow);
    }

    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/user/home#${event.target.textContent}`;
        }
    });

    //adding remove book from wishlist functionality
    function removeBook(event) {
        console.log(event);
        let item = event.target.parentNode.parentNode.parentNode.parentNode;
        let wishlistItemId = item.getAttribute('_id');
        item.style.display = "none";
        fetch(`/userapi/removebookfromwishlist?userId=${user._id}&wishlistItemId=${wishlistItemId}`)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
                getUserDetails().then(function (data) {
                    user = data;
                    updateCartCount();
                })
            })
    }

    //adding add to cart functionality listener.
    function addBookToCart(event){
        let item = event.target.parentNode.parentNode.parentNode.parentNode;
        let wishlistItemId = item.getAttribute('_id');
        let wishlistBookId = item.getAttribute('_bookId');
        item.style.display = "none";
        var obj = {
            bookId: wishlistBookId,
        };
        fetch(`/userapi/removebookfromwishlist?userId=${user._id}&wishlistItemId=${wishlistItemId}`)
            .then(function (response) {
                return response.json();
            }).then(function (data) {
            })
        fetch(`/userapi/addbooktocart?userId=${user._id}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': "Application/json"
            }
        }).then(function (response) {
            return response.json();
        }).then(function () {
            getUserDetails().then(function (data) {
                user = data;
                updateCartCount();
                $('.cart-icon').click();
            })
        });
    }       

});