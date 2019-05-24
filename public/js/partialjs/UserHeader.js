window.addEventListener('load', function () {
    let user;
    let userId;

    //init function calling
    getUserDetails().then(function (data) {
        updateUser(data);
        document.querySelector('#welcomeTitleUsername').textContent = user.fullName.split(" ")[0];
    });

    //updating count and user details
    function updateUser(data) {
        user = data;
        updateCartCount();
    }
    //getting user details
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
            });
    };

    //update the cart count
    function updateCartCount() {
        document.querySelector('.cart-count').textContent = getCartCount();
    }

    //getting the cart count
    function getCartCount() {
        let count = 0;
        user.cart.forEach(function (item) {
            count += item.numberOfBooks;
        });
        return count;
    }

    function updateTotalAmount(){
        let cartBookTotalElements = document.getElementsByClassName('cart-book-total');
        let cartBookTotal=0; 
        Array.from(cartBookTotalElements).forEach(function(item){
            cartBookTotal += parseInt(item.textContent.split(' ')[1]);
        });
        $('.cart-total-amount').text(`$ ${cartBookTotal}`);
    }
    //flushing the cart before adding any new item
    function flushCart() {
        let parent = document.querySelector('.book-container');
        while (parent.firstChild) {
            parent.removeChild(parent.firstChild);
        }
    }

    //will add the new items .. it calls populateCart-->addCartItem-->makeCartItem
    function updateCart(data) {
        let count = getCartCount();
        updateCartCount();
        console.log(count);
        if (count === 0) {
            let onItem = document.getElementsByClassName('on-items');
            Array.from(onItem).forEach(function (element) {
                element.style.display = "none";
            });
            document.querySelector('.no-items').style.display = "block";
        } else {
            let onItem = document.getElementsByClassName('on-items');
            Array.from(onItem).forEach(function (element) {
                element.style.display = "block";
            });
            document.querySelector('.no-items').style.display = "none";
        }
        populateCart(data);
    };
    function populateCart(data) {
        data.cart.forEach(function (item) {
            addCartItem(item);
        });
    }
    function addCartItem(item) {
        fetch(`/bookapi/getbook/${item.bookId}`).then(function (response) {
            return response.json();
        }).then(function (book) {
            makeCartItem(book, item);
            updateTotalAmount();
        })
    }
    function makeCartItem(book, item) {
        //parent
        let bookContainerItemsRow = document.createElement('div');
        $(bookContainerItemsRow).addClass('row book-container-items-row').attr('_id', item._id).attr('bookId', book._id);

        //1st col
        let bookContainerItemsImg = document.createElement('div');
        $(bookContainerItemsImg).addClass('col-sm-1 book-container-items book-container-items-img');
        let img = document.createElement('img');
        $(img).addClass('cart-book-img').attr('src', book.thumbnailUrl);
        bookContainerItemsImg.append(img);

        //2nd col
        let bookContainerItemsTitle = document.createElement('div');
        $(bookContainerItemsTitle).addClass('col-sm-4 book-container-items book-container-items-title');
        let cartBookTitle = document.createElement('h2');
        $(cartBookTitle).addClass('cart-book-title').text(book.title);
        bookContainerItemsTitle.append(cartBookTitle);

        //3rd col
        let bookContainerItemsQty = document.createElement('div');
        $(bookContainerItemsQty).addClass('col-sm-1 book-container-items book-container-items-qty');
        let cartBookQty = document.createElement('input');
        $(cartBookQty).addClass('cart-book-qty').attr('max', 3).attr('min', 1).attr('type', 'Number').attr('value', item.numberOfBooks);
        cartBookQty.addEventListener('change', updateCountOfEachItem);
        bookContainerItemsQty.append(cartBookQty);

        //4th col
        let bookContainerItemsPrice = document.createElement('div');
        $(bookContainerItemsPrice).addClass('col-sm-2 book-container-items book-container-items-price center-align');
        let cartBookPrice = document.createElement('h2');
        $(cartBookPrice).addClass('cart-book-price').text(`$ ${book.buyPrice}`);
        bookContainerItemsPrice.append(cartBookPrice);

        //5th col
        let bookContainerItemsTotal = document.createElement('div');
        $(bookContainerItemsTotal).addClass('col-sm-2 book-container-items book-container-items-total center-align')
        let cartBookTotal = document.createElement('h2');
        $(cartBookTotal).addClass('cart-book-total').text(`$ ${book.buyPrice * item.numberOfBooks}`);
        bookContainerItemsTotal.append(cartBookTotal);

        //6th col
        let bookContainerItemsButton = document.createElement('div');
        $(bookContainerItemsTotal).addClass('col-sm-2 book-container-items book-container-items-total center-align');
        let cartBookRemoveButton = document.createElement('button');
        $(cartBookRemoveButton).addClass('btn btn-danger cart-book-remove-button').text('Remove');
        bookContainerItemsButton.append(cartBookRemoveButton);

        //adding final functionality
        bookContainerItemsRow.append(bookContainerItemsImg);
        bookContainerItemsRow.append(bookContainerItemsTitle);
        bookContainerItemsRow.append(bookContainerItemsQty);
        bookContainerItemsRow.append(bookContainerItemsPrice);
        bookContainerItemsRow.append(bookContainerItemsTotal);
        bookContainerItemsRow.append(bookContainerItemsButton);
        document.querySelector('.book-container').append(bookContainerItemsRow);

        
    }

    //update count of books
    function updateCountOfEachItem(event) {
        let childElement = event.target.parentNode.parentNode;
        let cartItemId = childElement.getAttribute('_id');
        cartBookTotal = event.target.parentNode.parentNode.querySelector('.cart-book-total');
        cartBookPrice = parseInt(event.target.parentNode.parentNode.querySelector('.cart-book-price').textContent.split(' ')[1]);
        if (event.target.value <= 3 && event.target.value >= 1) {
            fetch(`/userapi/updatecart?userId=${userId}&cartItemId=${cartItemId}&updatedCount=${event.target.value}`)
            .then(function(response){
                return response.json();
            }).then(function(data){
                console.log(data);
                getUserDetails().then(function (data) {
                    cartBookTotal.textContent=`$ ${event.target.value*cartBookPrice}`;
                    updateTotalAmount();
                    updateUser(data);
                    
                });
            })
        }
    }

    //check cart
    function checkCart() {
        if (!document.querySelector('.book-container').firstChild) {
            let onItem = document.getElementsByClassName('on-items');
            Array.from(onItem).forEach(function (element) {
                element.style.display = "none";
            });
            document.querySelector('.no-items').style.display = "block";
        }
    }
    //cart modal popup functionality
    document.querySelector('.cart-icon').addEventListener('click', function () {
        getUserDetails().then(function (data) {
            updateUser(data);
            flushCart();
            updateCart(data);
        });
        $('#cartModal').modal('show');
    });

    //adding remove button functionality of the modal
    document.querySelector('.book-container').addEventListener('click', function (event) {
        if (Array.from(event.target.classList).includes('cart-book-remove-button')) {
            let parentElement = event.target.parentNode.parentNode.parentNode;
            let childElement = event.target.parentNode.parentNode;
            let cartItemId = childElement.getAttribute('_id');
            parentElement.removeChild(childElement);
            fetch(`/userapi/removebookfromcart?userId=${user._id}&cartItemId=${cartItemId}`)
                .then(function (response) {
                    return response.json();
                }).then(function (data) {
                    getUserDetails().then(function (data) {
                        updateUser(data);
                        updateTotalAmount();
                        checkCart();
                    })
                });
        }
    });

    document.querySelector('.continue-shopping-button').addEventListener('click', function () {
        $('#cartModal').modal('hide');
    })

    document.querySelector('.checkout-button').addEventListener('click', function () {
        let parentContainer = document.querySelector('.book-container');
        let orderItems = [];
        Array.from(parentContainer.children).forEach(function (item) {
            let obj = {};
            obj.bookId = item.getAttribute('bookId');
            obj.numberOfBooks = parseInt($(item).find($('.cart-book-qty')).val());
            obj.orderId = new Date().getTime();
            obj.transactionDate = new Date();
            obj.status = "Processing"
            orderItems.push(obj);
        })
        document.cookie = `orderdetails=${JSON.stringify(orderItems)};path=/`;
        location.href = "/user/shippingadressconfirmation";
    })

});