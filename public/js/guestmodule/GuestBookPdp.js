window.addEventListener('load', function () {

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
    document.querySelector('.book-comments-readall').addEventListener('click',function(){
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
        $('#loginModal').modal({});
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
        commentUsername.innerText = cmmnt.username;  // it has to be updated

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
    document.querySelector('.book-details-review-comment').addEventListener('click',function(){
        location.href="#bookCommentsHeading";
    })

    //add to wishlist listener
    document.querySelector('.book-details-options-wishlist').addEventListener('click',function(){
        $('#loginModal').modal('show');
    })


    //adding books categories listener
    document.querySelector('.book-categories-list').addEventListener('click', function (event) {
        if (event.target.tagName === 'A') {
            location.href = `/guest/home#${event.target.textContent}`;
        }
    });

    document.querySelector('.book-price-cart-buy').addEventListener('click',function(){
        $('#loginModal').modal('show');
    });
    

})