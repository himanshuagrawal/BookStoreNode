window.addEventListener('load', function () {

    let user;
    let userId;
    let address;
    let order;
    getDetails();

    //getting the user details
    function getDetails() {
        let cookieArray = document.cookie.split('=');
        cookieArray.forEach(function (item, index) {
            if (item.includes('userId')) {
                userId = cookieArray[index + 1].toString();
                userId=userId.split(';')[0];
            }
            if(item.includes('addressdetails')){
                address = cookieArray[index+1].toString();
                address=address.split(';')[0];
                address = JSON.parse(address);
            }
            if(item.includes('orderdetails')){
                order = cookieArray[index+1].toString();
                order=order.split(';')[0];
                order = JSON.parse(order);
            }
        });
        return fetch(`/userapi/getuser?userId=${userId}`)
            .then((response) => {
                return response.json();
            }).then(function(data){
                user=data;
                getOrderConfirmationPage();
            })
    };

    //getting order confirmation page details
    function getOrderConfirmationPage(){
        populateAddress();
        populateOrderNumber();
        makeOrderedBooks();
        document.cookie = "addressdetails= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
        document.cookie = "orderdetails= ; expires = Thu, 01 Jan 1970 00:00:00 GMT; path=/";
    }

    function populateAddress(){
        $('.fullName').text(user.fullName);
        $('.address1').text(address.address1);
        if(address.address2){
            $('.address2').text(address.address2);
        }
        $('.city-state').text(`${address.city} , ${address.state}`);
        if(address.phoneNumber){
            $('.phoneNumber').text(address.phoneNumber);
        }
        $('.mobileNumber').text(address.mobileNumber);
        
    }

    function populateOrderNumber(){
        $('.order-number').text(`Order Number is : ${order[0].orderId}`);
    }

    function makeOrderedBooks(){
        Array.from(order).forEach(function(item){
            fetch(`/bookapi/getbook/${item.bookId}`)
            .then(function(response){
                return response.json();
            })
            .then(function(book){
                makeItem(book,item);
            })
        })
    }

    function makeItem(book,item){
        let parentRow = document.createElement('div');
        $(parentRow).addClass('row order-container-items-row');

        let imgContainer = document.createElement('div');
        $(imgContainer).addClass('col-sm-1 order-container-items order-container-items-img');
        let img = document.createElement('img');
        $(img).addClass('order-book-img').attr('src',book.thumbnailUrl);
        imgContainer.append(img);

        let titleContainer = document.createElement('div');
        $(titleContainer).addClass('col-sm-5 order-container-items order-container-items-title');
        let title = document.createElement('h2');
        $(title).addClass('order-book-title').text(book.title);
        titleContainer.append(title);

        let qtyContainer = document.createElement('div');
        $(qtyContainer).addClass('col-sm-2 order-container-items order-container-items-qty');
        let qty = document.createElement('input');
        $(qty).addClass('order-book-qty').attr('type','Number').val(item.numberOfBooks).prop('disabled',true);
        qtyContainer.append(qty);

        let priceContainer =document.createElement('div');
        $(priceContainer).addClass('col-sm-2 order-container-items order-container-items-price');
        let price = document.createElement('h2');
        $(price).addClass('order-book-price').text(`$ ${book.buyPrice}`);
        priceContainer.append(price);

        let totalPriceContainer = document.createElement('div');
        $(totalPriceContainer).addClass('col-sm-2 order-container-items order-container-items-total');
        let totalPrice = document.createElement('h2');
        $(totalPrice).addClass('order-book-total').text(`$ ${book.buyPrice*item.numberOfBooks}`);
        totalPriceContainer.append(totalPrice);

        parentRow.append(imgContainer);
        parentRow.append(titleContainer);
        parentRow.append(qtyContainer);
        parentRow.append(priceContainer);
        parentRow.append(totalPriceContainer);

        document.querySelector('.order-item-container').append(parentRow);
    }

    //adding listener to shop more button
    $('.shop-more-button').on('click',function(){
        location.href = '/user/home';
    })

    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/user/home#${event.target.textContent}`;
        }
    });


});