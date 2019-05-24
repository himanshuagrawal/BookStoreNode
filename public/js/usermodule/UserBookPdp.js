window.addEventListener('load', function () {

    let user;
    let userId;
    getUserDetails().then(function (data) {
        user = data;
        updateCartCount();
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


    let commentList = document.querySelector('.book-comments-commentlist');
    let id = document.querySelector('#parent').getAttribute('_id');
    let comments;
    let count = 0;

    //getting comments
    fetch(`/bookapi/getbook/${id}/getallcomments`)
        .then(function (response) {
            return response.json();
        }).then(function (data) {
            comments = Array.from(data).reverse();
            if(comments.length>5){
                document.querySelector('.book-comments-readall').style.display="inline";
            }else{
                document.querySelector('.book-comments-readall').style.display="none";
            }
            loadComments();
        });

    function loadComments() {
        let initialComments = comments.slice(count * 5, count * 5 + 5);
        initialComments.forEach(function (item) {
            let comment = makeComment(item);
            commentList.append(comment);
        });
        count++;
    };

    //read All Link listener
    document.querySelector('.book-comments-readall').addEventListener('click', function () {
        document.querySelector('.book-comments-readall').style.display="none";
        window.addEventListener('scroll', function () {
            let key = $(window).scrollTop() + $(window).height();
            let dockey = $(document).height();
            let y = dockey - key;
            if (y <= 50) {
                loadComments();
            }
        });
    })

    //opening modal
    document.querySelector('#writeAReview').addEventListener('click', function () {
        $('#reviewModal').modal({});
    });
    //closing modal
    document.querySelector('#closeOptionsLink').addEventListener('click', function () {
        $('#reviewModal').modal('hide');
    });

    //storing the comment int the db and do the frontend operations
    document.querySelector('#closeOptionsButton').addEventListener('click', function () {
        let emptyComment = document.querySelector('.empty-comment');
        let validComment = document.querySelector('.valid-comment');
        let commentTextArea = document.querySelector('#modalCommentInput');
        let comment = commentTextArea.value;
        let id = document.querySelector('#parent').getAttribute('_id');
        commentTextArea.addEventListener('click', function () {
            this.style.borderColor = 'black';
            emptyComment.style.display = 'none';
        })
        if (comment === "") {
            commentTextArea.style.borderColor = 'red';
            emptyComment.style.display = 'block';
        } else {
            let rating;
            if (document.querySelector('input[name="rating"]:checked') !== null) {
                rating = document.querySelector('input[name="rating"]:checked').value;
            } else {
                rating = null;
            }
            let obj = {
                "username": user.fullName,
                "comment": comment,
                "rating": rating,
                "date": new Date()
            }
            fetch(`/bookapi/getbook/${id}/addcomment`, {
                method: "Post",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(obj)
            }).then(function (response) {
                return response.json();
            }).then(function (data) {
                validComment.style.display = 'block';
                commentTextArea.value = "";
                setTimeout(() => {
                    $('#reviewModal').modal('hide');
                    validComment.style.display = "none";
                    document.querySelector('input[name="rating"]:checked').checked = false;
                }, 1000);
                document.querySelector('.book-details-review-rating').textContent = `${data.ratingCount} Ratings |`;
                document.querySelector('.book-details-review-comment').textContent = `${data.commentCount} Reviews`;
                document.querySelector('.bookRating').style.width = `${data.rating * 20}%`;
                commentList.insertBefore(makeComment(obj), commentList.firstChild);
            })

        }
    });

    //making comment
    function makeComment(cmmnt) {
        //comment container
        let commentWrapper = document.createElement('div');
        commentWrapper.classList.add('book-comments-commentlist-comment');

        // comment username
        let commentUsername = document.createElement('h2');
        commentUsername.classList.add('book-comment-username');
        commentUsername.setAttribute('id', 'bookCommentUsername');
        commentUsername.innerText = cmmnt.username;

        //making stars
        let starWrapper = document.createElement('div');
        starWrapper.classList.add('book-comment-rating');
        starWrapper.setAttribute('id', 'bookCommentRating');
        let outerStar = document.createElement('div');
        outerStar.classList.add('stars-outer');
        let innerStar = document.createElement('div');
        innerStar.classList.add('stars-inner');
        innerStar.classList.add('commentRating');
        innerStar.style.width = `${cmmnt.rating * 20}%`;
        outerStar.append(innerStar);
        starWrapper.append(outerStar);

        //comment date
        let commentDate = document.createElement('h2');
        commentDate.classList.add('book-comment-date');
        commentDate.setAttribute('id', 'bookCommentDate');
        commentDate.innerText = new Date(cmmnt.date).toDateString();

        //actual comment
        let comment = document.createElement('h5');
        comment.classList.add('book-comment-content');
        comment.setAttribute('id', 'bookCommentContent');
        comment.innerText = cmmnt.comment;

        //appending the children in comment wrapper
        commentWrapper.append(commentUsername);
        commentWrapper.append(starWrapper);
        commentWrapper.append(commentDate);
        commentWrapper.append(comment);
        return commentWrapper;
    };

    //reviews link listener
    document.querySelector('.book-details-review-comment').addEventListener('click', function () {
        location.href = "#bookCommentsHeading";
    })


    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/user/home#${event.target.textContent}`;
        }
    });

    //buy button event listener
    document.querySelector('.book-price-cart-buy').addEventListener('click', function () {
        var obj = {
            bookId: document.querySelector('.book-pdp').getAttribute('_id')
        };
        fetch(`/userapi/addbooktocart?userId=${user._id}`, {
            method: "POST",
            body: JSON.stringify(obj),
            headers: {
                'Content-Type': "Application/json"
            }
        }).then(function (response) {
            return response.json();
        }).then(function (data) {
            getUserDetails().then(function (data) {
                user = data;
                updateCartCount();
                $('.cart-icon').click();
            })
        });
    });

    //wishlist link event listener
    document.querySelector('#addToWishlist').addEventListener('click', function () {
        let bookId = document.querySelector('.book-pdp').getAttribute('_id')
        fetch(`/userapi/addbooktowishlist?userId=${user._id}&bookId=${bookId}`)
        .then(function(response){
            return response.json();
        }).then(function(data){
            location.href="/user/wishlist";
        })
    })

})