
window.addEventListener('load', function () {

    let booksContainer = document.querySelector('.book-items-container');
    init();

    function init() {
        $('.add-books-button').on('click', () => { location.href = "addbook" })
    }

    fetch('/bookapi/getallbooks').then((response) => {
        return response.json();
    }).then((data) => {
        sortBooks(data);
    })

    //sorting the books on basis of title
    function sortBooks(data) {
        let books = Array.from(data).sort(function (a, b) {
            return a.title.toLowerCase() > b.title.toLowerCase() ? 1 : -1
        });
        addBooks(books);
    }

    //making and adding the books in the body
    function addBooks(books) {
        books.forEach(book => {
            makeBook(book);
        });
    }

    //making the books
    function makeBook(book) {
        let bookItemContainerRow = document.createElement('div');
        $(bookItemContainerRow).addClass('row row book-items-container-row').attr('bookid', book._id);

        let categoryContainer = document.createElement('div');
        $(categoryContainer).addClass('col-lg-3');
        let category = document.createElement('p');
        $(category).addClass('book-items').text(book.categories[0] ? book.categories[0] : "Other");
        categoryContainer.append(category);

        let titleContainer = document.createElement('div');
        $(titleContainer).addClass('col-lg-4');
        let title = document.createElement('p');
        $(title).addClass('book-items').text(book.title);
        titleContainer.append(title);

        let authorContainer = document.createElement('div');
        $(authorContainer).addClass('col-lg-3');
        let author = document.createElement('p');
        $(author).addClass('book-items').text(book.authors[0]);
        authorContainer.append(author);

        let editContainer = document.createElement('div');
        $(editContainer).addClass('col-lg-1');
        let edit = document.createElement('p');
        let pen = document.createElement('i');
        $(pen).addClass('fas fa-pen');
        $(pen).on('click',(e)=>{
            location.href=`/admin/editbook?bookid=${e.target.parentElement.parentElement.parentElement.getAttribute('bookid')}`
        })
        $(edit).addClass('book-items').append(pen);
        editContainer.append(edit);

        let deleteContainer = document.createElement('div');
        $(deleteContainer).addClass('col-lg-1');
        let deletee = document.createElement('p');
        let trash = document.createElement('i');
        $(trash).addClass('fas fa-trash');
        $(trash).on('click', (e) => {
            fetch(`/bookapi/deletebookfromdb?bookId=${e.target.parentElement.parentElement.parentElement.getAttribute('bookid')}`).then((res) => {
                return res.text();
            }).then((text) => {
                e.target.parentElement.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement.parentElement);
            })
        });
        $(deletee).addClass('book-items').append(trash);
        deleteContainer.append(deletee);

        $(bookItemContainerRow).append(categoryContainer).append(titleContainer).append(authorContainer).append(editContainer).append(deleteContainer);
        booksContainer.append(bookItemContainerRow);
    }

})
