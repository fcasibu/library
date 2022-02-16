const tableBody = document.querySelector(".table-body");
const bookTitle = document.querySelector("#book-title");
const bookAuthor = document.querySelector("#book-author");
const bookCurrentPage = document.querySelector("#book-current-page");
const bookMaxPages = document.querySelector("#book-max-pages");
const bookStatus = document.querySelector("#book-status");

const bookStorage = localStorage.getItem("books");

let myLibrary = [];

function getLocalStorage() {
  const libraryItems = JSON.parse(localStorage.getItem("books"));
  myLibrary = libraryItems;
}

function setLocalStorage() {
  localStorage.setItem("books", JSON.stringify(myLibrary));
}

function Book(title, author, currentPage, maxPages, status) {
  this.title = title;
  this.author = author;
  this.currentPage = currentPage;
  this.maxPages = maxPages;
  this.status = status;
}

function addBookToLibrary() {
  const book = new Book(
    bookTitle.value,
    bookAuthor.value,
    bookCurrentPage.value,
    bookMaxPages.value,
    bookStatus.value
  );
  myLibrary.push(book);
  setLocalStorage();
  displayBooks();
}

function displayBooks() {
  getLocalStorage();
  tableBody.textContent = "";
  for (let i = 0; i < myLibrary.length; i++) {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("table-row");
    tableRow.dataset.index = i;
    tableBody.appendChild(tableRow);

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.dataset.key = "Delete";
    deleteButton.textContent = "X";
    tableRow.appendChild(deleteButton);

    const title = document.createElement("td");
    title.classList.add("title");
    title.textContent = myLibrary[i].title;
    tableRow.appendChild(title);

    const author = document.createElement("td");
    author.classList.add("author");
    author.textContent = myLibrary[i].author;
    tableRow.appendChild(author);

    const pages = document.createElement("td");
    pages.classList.add("pages");
    pages.textContent = `${myLibrary[i].currentPage} / ${myLibrary[i].maxPages}`;
    tableRow.appendChild(pages);

    const status = document.createElement("td");
    status.classList.add("status");
    const options = ["plan to read", "reading", "completed", "dropped"];
    for (let option of options) {
      if (option === myLibrary[i].status) {
        status.textContent = option;
        if (myLibrary[i].status === "plan to read") {
          status.style.border = "1px solid var(--text-color)";
          status.style.color = "var(--text-color)";
        } else if (myLibrary[i].status === "reading") {
          status.style.border = "1px solid var(--success)";
          status.style.color = "var(--success)";
        } else if (myLibrary[i].status === "completed") {
          status.style.border = "1px solid #72bcd4";
          status.style.color = "#72bcd4";
        } else {
          status.style.border = "1px solid var(--danger)";
          status.style.color = "var(--danger)";
        }
      }
    }
    tableRow.appendChild(status);
  }
}

window.onload = displayBooks();

function changePage(e) {
  if (e.target.classList.contains("pages")) {
    const index = e.target.parentElement.dataset.index;
    const currentEdit = prompt("Current Page");
    const maxEdit = prompt("Maximum Page");
    myLibrary[index].currentPage = currentEdit;
    myLibrary[index].maxPages = maxEdit;
  }
}

function changeStatus(e) {
  const index = e.target.parentElement.dataset.index;
  const options = ["plan to read", "reading", "completed", "dropped"];
  if (options.includes(e.target.textContent)) {
    if (e.target.textContent === options[0]) {
      e.target.textContent = options[1];
      myLibrary[index].status = options[1];
    } else if (e.target.textContent === options[1]) {
      e.target.textContent = options[2];
      myLibrary[index].status = options[2];
    } else if (e.target.textContent === options[2]) {
      e.target.textContent = options[3];
      myLibrary[index].status = options[3];
    } else {
      e.target.textContent = options[0];
      myLibrary[index].status = options[0];
    }
  }
}

function deleteButton(e) {
  const index = e.target.parentElement.dataset.index;
  if (e.target.dataset.key === "Delete") {
    myLibrary.splice(index, 1);
  }
}

function submitButton(e) {
  if (e.target.type === "submit") {
    e.preventDefault();
    if (
      bookTitle.value.length &&
      bookAuthor.value.length &&
      bookCurrentPage.value.length &&
      bookMaxPages.value.length
    ) {
      addBookToLibrary();
      bookTitle.value = "";
      bookAuthor.value = "";
      bookCurrentPage.value = "";
      bookMaxPages.value = "";
    }
  }
}

document.addEventListener("click", (e) => {
  changePage(e);
  changeStatus(e);
  deleteButton(e);
  submitButton(e);
  setLocalStorage();
  displayBooks();
});

const currentTheme = localStorage.getItem("theme");
const toggleTheme = document.querySelector("#toggle-theme");

if (currentTheme) {
  document.documentElement.setAttribute("data-theme", currentTheme);

  if (currentTheme === "dark") {
    toggleTheme.checked = true;
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

toggleTheme.addEventListener("change", changeTheme);
