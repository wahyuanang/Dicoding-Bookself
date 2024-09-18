const books = [];
const RENDER_EVENT = `render_book`;
const STORAGE_KEY = `BOOKSHELF_APPS`;
const SAVED_DATA = `SAVED_DATA`;

document.addEventListener(`DOMContentLoaded`, function () {
  const submitBook = document.getElementById(`inputBook`);

  submitBook.addEventListener(`submit`, function (event) {
    event.preventDefault();
    addBook();
  });

  if (isStorageExist()) {
    loadDataFromStorage();
  }
});

// Fungsi untuk menambahkan buku baru ke dalam array books start
function addBook() {
  const bookTitle = capitalizeFirstLetter(
    document.getElementById(`inputBookTitle`).value
  );
  const bookCategory = capitalizeFirstLetter(
    document.getElementById(`inputBookCategory`).value
  );
  const writerName = capitalizeFirstLetter(
    document.getElementById(`inputBookWriter`).value
  );
  const yearPublished = parseInt(
    document.getElementById(`inputBookYear`).value
  );
  const readStatus = document.getElementById(`inputBookIsComplete`).checked;

  const generateId = generateID();
  const bookObject = generateBookObject(
    generateId,
    bookTitle,
    bookCategory,
    writerName,
    yearPublished,
    readStatus
  );
  books.push(bookObject);

  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// Fungsi untuk menambahkan buku baru ke dalam array books end

// Fungsi untuk menghasilkan ID unik berdasarkan timestamp start
function generateID() {
  return +new Date();
}
function generateBookObject(id, title, category, writer, year, status) {
  return {
    id,
    title,
    category,
    writer,
    year,
    status,
  };
}
// Fungsi untuk menghasilkan ID unik berdasarkan timestamp end

// Fungsi untuk membuat elemen daftar buku yang belum selesai start
function itemUncompleteBookshelfList(bookObject) {
  const bookGroupUncompleted = document.createElement(`ul`);
  bookGroupUncompleted.classList.add(`list-group`, `mb-2`);
  bookGroupUncompleted.innerHTML = `<li class="list-group-item active" aria-current="true" style="background-color: #3294cd;"><strong>${bookObject.title}</strong></li>
                                    <li class="list-group-item"><span class="fw-semibold">Category</span> : ${bookObject.category}</li>
                                    <li class="list-group-item"><span class="fw-semibold">Writer</span> : ${bookObject.writer}</li>
                                    <li class="list-group-item"><span class="fw-semibold">Year</span> : ${bookObject.year}</li>
                                    <li class="list-group-item text-evenly">
                                      <button class="btn mx-1 border border-success btn-complete" style="background-color: #7BD3EA; --bs-border-opacity: .10;" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-check fa-lg btn-complete" style="color: #fff;" data-bookid="${bookObject.id}"></i></button>
                                      <button class="btn btn-primary mx-1 btn-edit" type="button" data-bookid="${bookObject.id}" data-bs-toggle="modal" data-bs-target="#editBook"><i class="fa-solid fa-pen-to-square btn-edit" data-bookid="${bookObject.id}"></i></button>
                                      <button class="btn btn-danger mx-1 btn-delete" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-trash-can btn-delete" data-bookid="${bookObject.id}"></i></button>
                                    </li>`;

  return bookGroupUncompleted;
}
// Fungsi untuk membuat elemen daftar buku yang belum selesai end

// Fungsi untuk membuat elemen daftar buku yang sudah selesai  start
function itemCompleteBookshelfList(bookObject) {
  const bookGroupCompleted = document.createElement(`ul`);
  bookGroupCompleted.classList.add(`list-group`, `mb-2`);
  bookGroupCompleted.innerHTML = `<li class="list-group-item active" aria-current="true" style="background-color: #3294cd;"><strong>${bookObject.title}</strong></li>
  <li class="list-group-item"><span class="fw-semibold">Category</span> : ${bookObject.category}</li>
                                  <li class="list-group-item"><span class="fw-semibold">Writer</span> : ${bookObject.writer}</li>
                                  <li class="list-group-item"><span class="fw-semibold">Year</span> : ${bookObject.year}</li>
                                  <li class="list-group-item text-evenly">
                                    <button class="btn mx-1 border border-success btn-undo" style="background-color: #ff8c00; --bs-border-opacity: .10;" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-rotate-right fa-flip-horizontal fa-lg btn-undo" style="color: #ffffff;" data-bookid="${bookObject.id}"></i></button>
                                    <button class="btn btn-primary mx-1 btn-edit" type="button" data-bookid="${bookObject.id}" data-bs-toggle="modal" data-bs-target="#editBook"><i class="fa-solid fa-pen-to-square btn-edit" data-bookid="${bookObject.id}"></i></button>
                                    <button class="btn btn-danger mx-1 btn-delete" type="button" data-bookid="${bookObject.id}"><i class="fa-solid fa-trash-can btn-delete" data-bookid="${bookObject.id}"></i></button>
                                  </li>`;

  return bookGroupCompleted;
}
// Fungsi untuk membuat elemen daftar buku yang sudah selesai  end

// Fungsi untuk mencari buku berdasarkan ID start
function findBook(bookId) {
  for (const bookTarget of books) {
    if (bookTarget.id == bookId) {
      return bookTarget;
    }
  }
  return null;
}
// Fungsi untuk mencari buku berdasarkan ID end

// Fungsi untuk mencari indeks buku berdasarkan ID start
function findBookIndex(bookId) {
  for (const index in books) {
    if (books[index].id == bookId) {
      return index;
    }
  }
  return -1;
}
// Fungsi untuk mencari indeks buku berdasarkan ID end

// Fungsi untuk menandai buku sebagai sudah selesai start
function addBookToComplete(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.status = true;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// Fungsi untuk menandai buku sebagai sudah selesai end

// Fungsi untuk mengembalikan status buku menjadi belum selesai start
function undoBookToComplete(bookId) {
  const bookTarget = findBook(bookId);

  bookTarget.status = false;
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}
// Fungsi untuk mengembalikan status buku menjadi belum selesai end

// Fungsi untuk menghapus buku dari array books start
function removeBook(bookId) {
  const bookTarget = findBookIndex(bookId);

  if (bookTarget === -1) return;

  books.splice(bookTarget, 1);
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

document.addEventListener(`click`, function (event) {
  const target = event.target;

  if (target.classList.contains(`btn-complete`)) {
    const bookid = target.dataset.bookid;
    addBookToComplete(bookid);
  }
  if (target.classList.contains(`btn-undo`)) {
    const bookid = target.dataset.bookid;
    undoBookToComplete(bookid);
  }
  if (target.classList.contains(`btn-edit`)) {
    const bookid = target.dataset.bookid;
    editDataBook(bookid);
  }
  if (target.classList.contains(`btn-delete`)) {
    const bookid = target.dataset.bookid;
    removeBook(bookid);
  }
});
// Fungsi untuk menghapus buku dari array books end

// Fungsi untuk mencari buku berdasarkan judul start
function findTitle(bookTitle) {
  console.log(bookTitle);
  for (const itemBook of books) {
    console.log(itemBook.title);
    if (itemBook.title == bookTitle) {
      return itemBook;
    }
  }
  return null;
}
// Fungsi untuk mencari buku berdasarkan judul end

// Event listener untuk mencari buku berdasarkan judul start
const btnSearch = document.getElementById(`btn-search`);
btnSearch.addEventListener(`click`, function () {
  const inputSearch = capitalizeFirstLetter(
    document.getElementById(`inputSearch`).value
  );
  const targetSearch = findTitle(inputSearch);
  console.log(inputSearch);
  console.log(targetSearch);

  if (targetSearch) {
    showSearchModal(targetSearch);
  } else {
    Swal.fire({
      title: "Buku Tidak Ditemukan :(",
      category: "Buku Tidak Ditemukan :(",
      icon: "error",
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: "OK",
      cancelButtonColor: "#d33",
    });
  }

  document.getElementById(`inputSearch`).value = ``;
});
// Event listener untuk mencari buku berdasarkan judul end

// search modal start
function showSearchModal(book) {
  const searchModal = new bootstrap.Modal(
    document.getElementById("searchBook")
  );

  const statusColor = book.status ? "text-success" : "text-danger";

  const modalBody = document.querySelector("#searchBook .modal-body");
  modalBody.innerHTML = `
      <ul class="list-group list-group-flush">
          <li class="list-group-item"><span class="fw-semibold fs-4">${
            book.title
          }</span></li>
          <li class="list-group-item"><span class="fw-semibold">Category:</span> ${
            book.category
          }</li>
          <li class="list-group-item"><span class="fw-semibold">Writer:</span> ${
            book.writer
          }</li>
          <li class="list-group-item"><span class="fw-semibold">Year:</span> ${
            book.year
          }</li>
          <li class="list-group-item"><span class="fw-semibold ${statusColor}">Status:</span> ${
    book.status ? "finished reading" : "Unfinished reading"
  }</li>
      </ul>
  `;
  searchModal.show();
}
// search modal end

// Fungsi untuk mengedit data buku start
function editDataBook(bookId) {
  const bookTarget = findBook(bookId);

  const btnSubmitEdit = document.getElementById(`btn-submit`);
  btnSubmitEdit.addEventListener(`click`, function () {
    const editTitle = capitalizeFirstLetter(
      document.getElementById(`inputEditBookTitle`).value
    );
    const editCategory = capitalizeFirstLetter(
      document.getElementById(`inputEditBookCategory`).value
    );
    const editWriter = capitalizeFirstLetter(
      document.getElementById(`inputEditBookWriter`).value
    );
    const editYear = document.getElementById(`inputEditBookYear`).value;

    if (
      editTitle !== null &&
      editCategory !== null &&
      editWriter !== null &&
      editYear !== null
    ) {
      bookTarget.title = editTitle;
      bookTarget.category = editCategory;
      bookTarget.writer = editWriter;
      bookTarget.year = editYear;

      saveData();
      document.dispatchEvent(new Event(RENDER_EVENT));
    }
  });
}
// Fungsi untuk mengedit data buku end

// Fungsi untuk mengkapitalisasi huruf pertama start
function capitalizeFirstLetter(word) {
  return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
}
// Fungsi untuk mengkapitalisasi huruf pertama end

// RENDER_EVENT start
document.addEventListener(RENDER_EVENT, function () {
  const uncompletedBOOKList = document.getElementById(
    `incompleteBookshelfList`
  );
  uncompletedBOOKList.innerHTML = ``;

  const completedBOOKList = document.getElementById(`completeBookshelfList`);
  completedBOOKList.innerHTML = ``;

  for (const bookItem of books) {
    if (!bookItem.status) {
      uncompletedBOOKList.appendChild(itemUncompleteBookshelfList(bookItem));
    } else {
      completedBOOKList.appendChild(itemCompleteBookshelfList(bookItem));
    }
  }
});
// RENDER_EVENT end

// Storage start
function isStorageExist() {
  if (typeof Storage == undefined) {
    alert(`Browser tidak mendukung local storage`);
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const data = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, data);
    document.dispatchEvent(new Event(SAVED_DATA));
  }
}

document.addEventListener(SAVED_DATA, function () {
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  const data = JSON.parse(serializedData);

  if (data != null) {
    for (const book of data) {
      books.push(book);
    }
  }

  document.dispatchEvent(new Event(RENDER_EVENT));
}
// Storage end
