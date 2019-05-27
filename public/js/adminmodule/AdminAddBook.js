window.addEventListener('load', function () {
    let form = document.querySelector('.needs-validation');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity() === false) {
            if (!document.querySelector('#image').files[0]) {
                document.querySelector('.image-needed').style.display = "block"
            } else {
                document.querySelector('.image-needed').style.display = "none"
            }
            form.classList.add('was-validated');
        } else {
            addBook();
        }
    });

    $('.cancelBookButton').on('click',()=>{
        location.href="/admin/home";
    })

    function addBook() {
        let file = document.querySelector('#image').files[0];
        let ref = STORE.ref().child('BooksImages').child(`${$('#bookTitle').val()}.png`);
        let obj = {
            title: $('#bookTitle').val(),
            isbn: $('#isbn').val(),
            pageCount: $('#numberOfPages').val(),
            shortDescription:$('#shortDescription').val(),
            longDescription:$('#longDescription').val(),
            categories:$('#category').val(),
            authors:$('#bookAuthor').val(),
            buyPrice:$('#buyPrice').val(),
            numberOfBooks:$('#numberOfBooks').val()
            //thumbnailUrl:$('#longDescription').val()
        }
        ref.put(file).then(()=>{
            ref.getDownloadURL().then((url)=>{
                obj.thumbnailUrl=url;
                fetch('/bookapi/addbooktodb',{
                    method:"Post",
                    body:JSON.stringify(obj),
                    headers:{
                        'Content-Type':'application/json'
                    }
                }).then((res)=>{
                    return res.text();
                }).then((text)=>{
                    form.classList.remove('was-validated');
                    form.reset();
                    alert(text);
                })
            })
        })
    }

})