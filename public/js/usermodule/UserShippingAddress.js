window.addEventListener('load', function () {

    let user;
    let userId;
    getUserDetails().then(function (data) {
        user = data;
        document.querySelector('#fullName').value=user.fullName;
    });;

    //getting the user details
    function getUserDetails() {
        let cookieArray = document.cookie.split('=');
        cookieArray.forEach(function (item, index) {
            if (item.includes('userId')) {
                userId = cookieArray[index + 1].toString();
                userId=userId.split(';')[0];
            }
        });
        return fetch(`/userapi/getuser?userId=${userId}`)
            .then((response) => {
                return response.json();
            })
    };

    let address1 = document.querySelector('#addressLine1');
    let address2 = document.querySelector('#addressLine2');
    let state = document.querySelector('#state');
    let city = document.querySelector('#city');
    let phoneNumber = document.querySelector('#phoneNumber');
    let mobileNumber = document.querySelector('#mobileNumber');
    // Bootstrap validation
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (form.checkValidity() === false) {
            } else {
                    addOrder();
            }
            form.classList.add('was-validated');
        }, false);
    });


    function addOrder() {
            let user = {
                'address1': address1.value,
                'address2': address2.value,
                'city': city.value,
                'state': state.value,
                'phoneNumber': phoneNumber.value,
                'mobileNumber': mobileNumber.value
            };
            document.cookie=`addressdetails=${JSON.stringify(user)};path=/`;
            fetch(`/userapi/addorder?userId=${userId}`, {
            }).then(function (response) {
                return response.json();
            })
                .then(function (data) {
                    location.href="/user/orderconfirmation";
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
    

    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/guest/home#${event.target.textContent}`;
        }
    });

})
