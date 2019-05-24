window.addEventListener('load', function () {

    let user;
    let userId;
    let fullName = document.querySelector('#fullName');
    let prefFullName = document.querySelector('#preferredLoginName');
    let loginPassword = document.querySelector('#loginPassword');
    let reTypePassword = document.querySelector('#reTypePassword');
    let email = document.querySelector('#email');
    let address1 = document.querySelector('#addressLine1');
    let address2 = document.querySelector('#addressLine2');
    let state = document.querySelector('#state');
    let city = document.querySelector('#city');
    let phoneNumber = document.querySelector('#phoneNumber');
    let mobileNumber = document.querySelector('#mobileNumber');
    let check = false;
    getUserDetails().then(function (data) {
        user = data;
        updateCartCount();
        getTransactionHistory();
        setInitialValues();
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
    }

    //getting the cart count
    function getCartCount() {
        let count = 0;
        user.cart.forEach(function (item) {
            count += item.numberOfBooks;
        });
        return count;
    }

    /*-------------------------------------------------------------------------------------------------------------------------*/

    // Bootstrap validation and updating user
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (form.checkValidity() === false) {
            } else {
                if (loginPassword.value !== reTypePassword.value) {
                    document.querySelector('#reTyprsePasswordSmall').style.display = "inline"
                } else {
                    updateUser();
                }
            }
            form.classList.add('was-validated');
        }, false);
    });
    function updateUser() {
        let user = {
            'fullName': fullName.value,
            'preferredLoginName': prefFullName.value,
            'password': loginPassword.value,
            'email': email.value,
            'address1': address1.value,
            'address2': address2.value,
            'city': city.value,
            'state': state.value,
            'phoneNumber': phoneNumber.value,
            'mobileNumber': mobileNumber.value
        };
        fetch(`/userapi/updateuser/${userId}`, {
            method: "Post",
            body: JSON.stringify(user),
            headers: {
                'Content-Type': "application/json"
            }
        }).then(function (response) {
            return response.json();
        })
            .then(function (data) {
                console.log(data);
                getUserDetails().then(function (data) {
                    user = data;
                    setInitialValues();
                });
            })
    }

    //displaying cities based on 
    
    state.addEventListener('change', function () {
        while (city.firstChild) {
            city.removeChild(city.firstChild);
        }
        fetch(`/cityapi/getCities?state=${state.value}`)
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                data.forEach(function (item) {
                    let cityElement = document.createElement('option');
                    cityElement.setAttribute('value', item);
                    cityElement.textContent = item;
                    city.append(cityElement);
                })
            })
    })

    //password validation
    loginPassword.addEventListener('focus', () => { document.querySelector('#passwordHelpBlock').style.display = "block" })
    loginPassword.addEventListener('blur', () => { document.querySelector('#passwordHelpBlock').style.display = "none" })
    reTypePassword.addEventListener('blur', () => {
        if (loginPassword.value !== reTypePassword.value) {
            document.querySelector('#reTypePasswordSmall').style.display = "inline"
        } else {
            document.querySelector('#reTypePasswordSmall').style.display = "none"
        }
    });
    


    /*-------------------------------------------------------------------------------------------------------------------------*/

    //transaction history functionality
    function getTransactionHistory(){
        Array.from(user.ordered).reverse().forEach(function(item){
            getTransactionHistoryItemDetails(item);
        })
    }

    // getting details of the transaction history items called by getTransactionHistory
    function getTransactionHistoryItemDetails(item){
        fetch(`/bookapi/getbook/${item.bookId}`)
        .then(function(response){
            return response.json();
        })
        .then(function(bookData){
            makeItem(item,bookData);
        })
    }

    //making transaction history items called by gettransactionHistoryItemDetails
    function makeItem(item,bookData){
        let itemRow = document.createElement('div');
        $(itemRow).addClass('row th-book-row');

        let imgContainer = document.createElement('div');
        $(imgContainer).addClass('col-sm-2 book-image-container');
        let img = document.createElement('img');
        $(img).addClass('book-image').attr('src',bookData.thumbnailUrl);
        imgContainer.append(img);

        let titleAuthorContainer = document.createElement('div');
        $(titleAuthorContainer).addClass('col-sm-4 book-title-author-container');
        let title = document.createElement('h2');
        $(title).addClass('book-title').text(bookData.title);
        let author = document.createElement('h2');
        $(author).addClass('book-author').text(bookData.authors[0]);
        titleAuthorContainer.append(title);
        titleAuthorContainer.append(author);

        let priceContainer = document.createElement('div');
        $(priceContainer).addClass('col-sm-1 book-price-container');
        let price = document.createElement('h2');
        $(price).addClass('book-price').text(`$ ${bookData.buyPrice*item.numberOfBooks}`);
        priceContainer.append(price);

        let qtyContainer = document.createElement('div');
        $(qtyContainer).addClass('col-sm-1 book-qty-container');
        let qty = document.createElement('h2');
        $(qty).addClass('book-qty').text(item.numberOfBooks);
        qtyContainer.append(qty);

        let dateContainer = document.createElement('div');
        $(dateContainer).addClass('col-sm-2 book-date-container');
        let date = document.createElement('h2');
        $(date).addClass('book-date').text(new Date(item.transactionDate).toDateString());
        dateContainer.append(date);

        let statusContainer = document.createElement('div');
        $(statusContainer).addClass('col-sm-2 book-status-container');
        let status = document.createElement('h2');
        $(status).addClass('book-status').text(item.status);
        statusContainer.append(status);

        let orderNumber = document.createElement('p');
        $(orderNumber).addClass('order-number').text(`Order Number :  ${item.orderId}`);

        itemRow.append(imgContainer);
        itemRow.append(titleAuthorContainer);
        itemRow.append(priceContainer);
        itemRow.append(qtyContainer);
        itemRow.append(dateContainer);
        itemRow.append(statusContainer);
        itemRow.append(orderNumber);
        $('.th-items').append(itemRow);
    }

    // edit profile functionality
    function setInitialValues() {
        fullName.setAttribute('value', user.fullName);
        fullName.disabled = true;
        prefFullName.setAttribute('value', user.preferredLoginName);
        prefFullName.disabled = true;
        loginPassword.setAttribute('value', user.password);
        loginPassword.disabled = true;
        email.setAttribute('value', user.email);
        email.disabled = true;
        address1.setAttribute('value', user.address1);
        address1.disabled = true;
        address2.setAttribute('value', user.address2);
        address2.disabled = true;
        state.value = user.state;
        state.disabled = true;
        city.value = user.city;
        city.disabled = true;
        phoneNumber.setAttribute('value', user.phoneNumber);
        phoneNumber.disabled = true;
        mobileNumber.setAttribute('value', user.mobileNumber);
        mobileNumber.disabled = true;
        document.querySelector('.edit-info').style.display = "block";
        document.querySelector('.update-info').style.display = "none";
        document.querySelector('.reTypePassword').style.display = "none";
    }
    function editInfo() {
        fullName.disabled = false;
        loginPassword.disabled = false;
        document.querySelector('.reTypePassword').style.display = "flex";
        email.disabled = false;
        address1.disabled = false;
        address2.disabled = false;
        state.disabled = false;
        state.value = "";
        city.disabled = false;
        phoneNumber.disabled = false;
        mobileNumber.disabled = false;
        document.querySelector('.edit-info').style.display = "none";
        document.querySelector('.update-info').style.display = "block"
    }
    document.querySelector('.edit-info').addEventListener('click', function () {
        editInfo();
    })

    //order status tracking listeners.
    document.querySelector('.orderStatusTrackingButton').addEventListener('click', function (event) {
        let orderNumber = document.querySelector('.orderStatusTrackingInput').value;
        let displayMessage = document.querySelector('.orderStatusTrackingResult');
        if (orderNumber === "" || isNaN(parseInt(orderNumber))) {
            displayMessage.textContent = "Please enter a valid order Id";
        } else {
            fetch(`/userapi/getorderstatus?userId=${userId}&orderId=${parseInt(orderNumber)}`)
                .then(function (response) {
                    return response.text();
                })
                .then(function (data) {
                    if (data == "false") {
                        displayMessage.textContent = `There is no such order with orderId ${orderNumber}`;
                    } else {
                        if (data = "Processing") {
                            displayMessage.textContent = `Your order ${orderNumber} is in Processing. `;
                        } else {
                            displayMessage.textContent = `Your order ${orderNumber} has been ${data} `;
                        }

                    }
                })
        }
    })

    //Tab Switching and displaying the relevant tab
    $('.transactionHistory').on('click', ()=>{openTab(event,"transactionHistory")});
    $('.editInformation').on('click', ()=>{openTab(event,"editInformation")});
    $('.orderStatusTracking').on('click', ()=>{openTab(event,"orderStatusTracking")});
    function openTab(event,tabName) {
        let i, tabcontent, tablinks;
        tabcontent = document.getElementsByClassName("tabcontent");
        for (i = 0; i < tabcontent.length; i++) {
            tabcontent[i].style.display = "none";
        }
        tablinks = document.getElementsByClassName("tablinks");
        for (i = 0; i < tablinks.length; i++) {
            tablinks[i].className = tablinks[i].className.replace(" active", "");
        }
        document.getElementById(tabName).style.display = "block";
        event.currentTarget.className += " active";
    }

    /*-------------------------------------------------------------------------------------------------------------------------*/
    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/user/home#${event.target.textContent}`;
        }
    });


});
