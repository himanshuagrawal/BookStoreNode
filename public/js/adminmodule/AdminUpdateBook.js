window.addEventListener('load',function(){
    let bookId = location.search.split('=')[1];
    fetch(`/bookapi/getbook/${bookId}`).then((res)=>{
        return res.json();
    }).then((data)=>{
    $('#bookTitle').val(data.title),
            $('#isbn').val(data.isbn),
            $('#numberOfPages').val(data.pageCount),
            $('#shortDescription').val(data.shortDescription),
            $('#longDescription').val(data.longDescription),
            $('#category').val(data.categories),
            $('#bookAuthor').val(data.authors[0]),
            $('#buyPrice').val(data.buyPrice),
            $('#numberOfBooks').val(data.numberOfBooks)
    })

    let form = document.querySelector('.needs-validation');
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        if (form.checkValidity() === false) {
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
        }
        if(file){
            ref.put(file).then(()=>{
                ref.getDownloadURL().then((url)=>{
                    obj.thumbnailUrl=url;
                    fetch(`/bookapi/updatebookindb?bookid=${bookId}`,{
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
        }else{
            fetch(`/bookapi/updatebookindb?bookid=${bookId}`,{
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
        }
        
    }
})