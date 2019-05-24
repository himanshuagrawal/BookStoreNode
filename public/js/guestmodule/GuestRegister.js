window.addEventListener('load', function () {
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
    // Bootstrap validation
    var forms = document.getElementsByClassName('needs-validation');
    var validation = Array.prototype.filter.call(forms, function (form) {
        form.addEventListener('submit', function (event) {
            event.preventDefault();
            event.stopPropagation();
            if (form.checkValidity() === false) {
            } else {
                if (loginPassword.value !== reTypePassword.value) {
                    document.querySelector('#reTypePasswordSmall').style.display = "inline"
                } else {
                    addUser();
                }
            }
            form.classList.add('was-validated');
        }, false);
    });



    function addUser() {
        if (check) {
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
            fetch('/userapi/adduser', {
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
                    openLogin();
                })
        }
    }

    function openLogin() {
        let form = document.querySelector('.needs-validation');
        form.classList.remove('was-validated');
        let input = document.getElementsByTagName('input');
        Array.from(input).forEach(function (item) {
            item.value = "";
        });
        document.querySelector('#registrationSuccessful').style.display = "block";
        $('#loginModal').modal('show');
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


    //preferred User Name validation
    prefFullName.addEventListener('blur', function () {
        checkPreferredUserName();
    });
    prefFullName.addEventListener('focus', function () {
        document.querySelector('#preferredLoginNameSmall').style.display = "none";
    })
    function checkPreferredUserName() {
        fetch(`/userapi/checkpreferredusername?name=${prefFullName.value}`)
            .then(function (response) {
                return response.text();
            })
            .then((data) => {
                if (data === "true") {
                    document.querySelector('#preferredLoginNameSmall').style.display = "inline";
                    check = false;
                } else {
                    check = true;
                }
            });
    }

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

    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/guest/home#${event.target.textContent}`;
        }
    });

})
