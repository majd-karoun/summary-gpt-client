let bookInput = document.getElementById("book-title-input");
let generateBtn = document.getElementById("generate-btn");
let summaryElement = document.getElementById("summary");
let bookTitleElement = document.getElementById("book-title");
let summaryModal = document.getElementById("summary-modal");
let closeBtn = summaryModal.getElementsByClassName("close")[0];
let saveBtn = document.getElementById("save-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
let deleteBtn = document.getElementById("delete-btn");
const spinner = document.getElementById("spinner");
const bookList = document.getElementById("book-list");
const myBooksLabel = document.getElementById("my-books-label");
const languagePicker = document.getElementById("language-picker");

generateBtn.disabled = true;
// Retrieve saved books from localStorage
const savedBooks = JSON.parse(localStorage.getItem("books")) || [];

//hide "My Books" label if no books yet saved
function updateMyBooksLabel() {
  if (savedBooks.length === 0) {
    myBooksLabel.style.display = "none";
  } else {
    myBooksLabel.style.display = "block";
  }
}
updateMyBooksLabel();

let bookTitle;

const typewriterText = "Enter book title here...";

function typeWriter(text, targetElement, index = 0) {
  if (index < text.length) {
    targetElement.placeholder += text.charAt(index);
    setTimeout(() => typeWriter(text, targetElement, index + 1), 100);
  }
}

const titleInput = document.getElementById("book-title-input");
typeWriter(typewriterText, titleInput);
// Update bookTitle when input value changes
bookInput.addEventListener("change", () => {
  bookTitle = bookInput.value;
});

bookInput.addEventListener("input", () => {
  generateBtn.disabled = !bookInput.value;
});

// Update bookTitle when a book summary is clicked on
bookTitleElement.addEventListener("DOMSubtreeModified", () => {
  bookTitle = bookTitleElement.innerHTML;
});

async function fetchSummary(bookTitle, language) {
  const response = await fetch(
    "https://summary-gpt.onrender.com/api/summarize",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bookTitle, language }), // Add language to the request body
    }
  );
  const data = await response.json();
  if (data) {
    return data;
  } else {
    console.error("Unexpected data format:", data);
    return "An error occurred while fetching the summary. Please try again.";
  }
}


generateBtn.addEventListener("click", async (e) => {
  e.preventDefault();
  spinner.style.display = "block"; // show the spinner
  bookTitle = bookInput.value; // Get current input value
  const language = languagePicker.value; // Get the selected language

  // Show the modal instantly and set the book title
  summaryModal.style.display = "block";
  bookTitleElement.innerHTML = bookTitle;
  
  const summary = await fetchSummary(bookTitle, language); // Pass the language to fetchSummary
  spinner.style.display = "none";
  summaryElement.innerHTML = summary;

  // Show the Close button only if the book title is empty
  if (!bookTitle || summary.includes('SummaryError:')) {
    saveBtn.style.display = "none";
    closeModalBtn.style.display = "block";
    deleteBtn.style.display = "none";
  } else {
    saveBtn.style.display = "block";
    closeModalBtn.style.display = "block";
    deleteBtn.style.display = "none";
  }
});


// Add a new book to localStorage
function saveBook(title, summary, color) {
  const book = { title, summary, color };
  savedBooks.unshift(book); // Use unshift() instead of push() to add the book to the beginning of the array
  localStorage.setItem("books", JSON.stringify(savedBooks));
}



// Generate a list of buttons for each saved book title
savedBooks.forEach((book) => {
  const button = document.createElement("button");
  button.textContent = book.title;
  button.classList.add("card");
  button.addEventListener("click", () => {
    // Display the saved summary in a pop-up
    summaryModal.style.display = "block";
    summaryElement.innerHTML = book.summary;
    bookTitleElement.innerHTML = book.title;
    //hide savebtn and show close button
    saveBtn.style.display = "none";
    closeModalBtn.style.display = "block";
  });

  // Use the saved color for the button
  button.style.backgroundColor = book.color;
  
  bookList.append(button);
});

// Generate random dark color
function generateRandomColor() {
  const red = Math.floor(Math.random() * 51);
  const green = Math.floor(Math.random() * 51);
  const blue = Math.floor(Math.random() * 51);
  return `rgb(${red}, ${green}, ${blue})`;
}

// Handle save button click
saveBtn.addEventListener("click", () => {
  const summary = summaryElement.innerHTML;
  if (bookTitle && summary) {
    const color = generateRandomColor();
    saveBook(bookTitle, summary, color);
    summaryModal.classList.add("modal-out");
    // Remove the summary and book title after the animation is finished
    setTimeout(() => {
      summaryModal.style.display = "none";
      summaryModal.classList.remove("modal-out");
      summaryElement.innerHTML = "";
      bookTitleElement.innerHTML = "";
    }, 500);
    // Refresh the book list
    location.reload();
    updateMyBooksLabel();
  }
});

deleteBtn.addEventListener("click", () => {
  const confirmDelete = confirm(
    "Are you sure you want to delete this book summary?"
  );

  if (confirmDelete) {
    const bookIndex = savedBooks.findIndex(
      (book) => book.title === bookTitleElement.innerHTML
    );
    if (bookIndex !== -1) {
      savedBooks.splice(bookIndex, 1);
      localStorage.setItem("books", JSON.stringify(savedBooks));
      const buttonToRemove = bookList.children[bookIndex];
      bookList.removeChild(buttonToRemove);
      summaryModal.classList.add("modal-out");
      setTimeout(() => {
        summaryModal.style.display = "none";
        summaryModal.classList.remove("modal-out");
        summaryElement.innerHTML = "";
      }, 500);
    }
    updateMyBooksLabel();
  }
});

closeBtn.addEventListener("click", () => {
  summaryModal.classList.add("modal-out");
  setTimeout(() => {
    summaryModal.style.display = "none";
    summaryModal.classList.remove("modal-out");
    summaryElement.innerHTML = "";
  }, 500);
});

// Handle Close modal button click
closeModalBtn.addEventListener("click", () => {
  summaryModal.classList.add("modal-out");
  setTimeout(() => {
    summaryModal.style.display = "none";
    summaryModal.classList.remove("modal-out");
    summaryElement.innerHTML = "";
  }, 500);
});
