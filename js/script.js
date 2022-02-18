let myLibrary = [];

function Book(title, author, currentPage, totalPage, status) {
  this.title = title;
  this.author = author;
  this.currentPage = currentPage;
  this.totalPage = totalPage;
  this.status = status;
}

function setLocalStorage() {
  const sortedBooks = myLibrary.sort((a, b) => {
    if (a.status > b.status) {
      return -1;
    }
  });
  localStorage.setItem("books", JSON.stringify(sortedBooks));
}

function getLocalStorage() {
  if (!myLibrary) {
    myLibrary = [];
  } else {
    const parsedItem = JSON.parse(localStorage.getItem("books"));
    myLibrary = parsedItem;
  }
}

getLocalStorage();

function getTotal() {
  const planToRead = document.querySelector(".plan-to-read");
  const reading = document.querySelector(".reading");
  const completed = document.querySelector(".completed");
  const dropped = document.querySelector(".dropped");
  const bookTotal = myLibrary.reduce(
    (obj, book) => {
      obj[book.status] += 1;
      return obj;
    },
    {
      Reading: 0,
      Completed: 0,
      "Plan to Read": 0,
      Dropped: 0,
    }
  );
  reading.textContent = bookTotal.Reading;
  completed.textContent = bookTotal.Completed;
  planToRead.textContent = bookTotal["Plan to Read"];
  dropped.textContent = bookTotal.Dropped;
}

function addBookToLibrary() {
  const bookTitle = document.querySelector("#book-title");
  const bookAuthor = document.querySelector("#book-author");
  const bookCurrentPage = document.querySelector("#book-current-page");
  const bookTotalPage = document.querySelector("#book-total-page");
  const bookStatus = document.querySelector("#book-status");
  const book = new Book(
    bookTitle.value,
    bookAuthor.value,
    bookCurrentPage.value,
    bookTotalPage.value,
    bookStatus.value
  );
  myLibrary.push(book);
  bookTitle.value = "";
  bookAuthor.value = "";
  bookCurrentPage.value = "";
  bookTotalPage.value = "";
  setLocalStorage();
}

function generateTitle(parent, index) {
  const title = document.createElement("td");
  title.textContent = myLibrary[index].title;
  parent.appendChild(title);
}

function generateAuthor(parent, index) {
  const author = document.createElement("td");
  author.textContent = myLibrary[index].author;
  parent.appendChild(author);
}

function generatePages(parent, index) {
  const page = document.createElement("td");
  page.textContent = `${myLibrary[index].currentPage} / ${myLibrary[index].totalPage}`;
  parent.appendChild(page);
}

function generateStatus(parent, index) {
  const status = document.createElement("td");
  status.classList.add("status");
  status.textContent = myLibrary[index].status;
  switch (myLibrary[index].status) {
    case "Reading":
      status.classList.add("reading-style");
      break;
    case "Plan to Read":
      status.classList.add("plan-to-read-style");
      break;
    case "Completed":
      status.classList.add("completed-style");
      break;
    case "Dropped":
      status.classList.add("dropped-style");
      break;
    default:
      return;
  }
  parent.appendChild(status);
}

function generateButtons(parent) {
  const buttons = document.createElement("td");
  const buttonsContainer = document.createElement("div");
  const editButton = document.createElement("i");
  const deleteButton = document.createElement("i");
  buttonsContainer.classList.add("buttons-container");
  editButton.classList.add("fa-solid", "fa-pen-to-square", "edit-button");
  deleteButton.classList.add("fa-solid", "fa-x", "delete-button");
  buttonsContainer.appendChild(editButton);
  buttonsContainer.appendChild(deleteButton);
  buttons.appendChild(buttonsContainer);
  parent.appendChild(buttons);
}

function displayBooks() {
  const tableBody = document.querySelector(".table-body");
  tableBody.textContent = "";
  getLocalStorage();
  getTotal();
  for (let i = 0; i < myLibrary.length; i++) {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("book-row");
    tableRow.dataset.index = i;
    tableBody.appendChild(tableRow);

    generateTitle(tableRow, i);
    generateAuthor(tableRow, i);
    generatePages(tableRow, i);
    generateStatus(tableRow, i);
    generateButtons(tableRow);
  }
}

displayBooks();

function addBook(e) {
  if (e.target.classList.contains("add")) {
    e.preventDefault();
    addBookToLibrary();
    displayBooks();
  }
}

function editBook(e) {
  const editModal = document.querySelector(".edit-modal");
  const editBookTitle = document.querySelector("#book-edit-title");
  const editBookAuthor = document.querySelector("#book-edit-author");
  const editBookCurrentPage = document.querySelector("#book-edit-current-page");
  const editBookTotalPage = document.querySelector("#book-edit-total-page");
  const editBookStatus = document.querySelector("#book-edit-status");
  const editBookButton = document.querySelector(".edit");

  if (e.target.classList.contains("edit-button")) {
    const index = e.target.parentNode.parentNode.parentNode.dataset.index;
    editBookButton.dataset.index = index;

    editModal.classList.toggle("show-edit-modal");
    editBookTitle.value = myLibrary[index].title;
    editBookAuthor.value = myLibrary[index].author;
    editBookCurrentPage.value = myLibrary[index].currentPage;
    editBookTotalPage.value = myLibrary[index].totalPage;
    editBookStatus.value = myLibrary[index].status;

    editBookButton.addEventListener("click", (event) => {
      event.preventDefault();
      if (event.target.dataset.index === index) {
        myLibrary[index].title = editBookTitle.value;
        myLibrary[index].author = editBookAuthor.value;
        myLibrary[index].currentPage = editBookCurrentPage.value;
        myLibrary[index].totalPage = editBookTotalPage.value;
        myLibrary[index].status = editBookStatus.value;
        editModal.classList.remove("show-edit-modal");
        setLocalStorage();
        displayBooks();
      } else {
        return;
      }
    });
  }
}

function deleteBook(e) {
  if (e.target.classList.contains("delete-button")) {
    const index = e.target.parentNode.parentNode.parentNode.dataset.index;
    myLibrary.splice(index, 1);
  }
}

document.addEventListener("click", (e) => {
  addBook(e);
  editBook(e);
  deleteBook(e);
  setLocalStorage();
  displayBooks();
});

const currentTheme = localStorage.getItem("theme");
const themeToggler = document.querySelector("#toggle-theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    themeToggler.checked = true;
  }
}

function changeTheme(e) {
  if (e.target.checked) {
    document.documentElement.setAttribute("data-theme", "dark");
    localStorage.setItem("theme", "dark");
  } else {
    document.documentElement.setAttribute("data-theme", "light");
    localStorage.setItem("theme", "light");
  }
}

themeToggler.addEventListener("change", changeTheme);
