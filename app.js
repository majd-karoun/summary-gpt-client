
let bookInput = document.getElementById('book-title-input');
let generateBtn = document.getElementById('generate-btn');
let summaryElement = document.getElementById('summary');
let bookTitleElement = document.getElementById('book-title');
let summaryModal = document.getElementById('summary-modal');
let closeBtn = summaryModal.getElementsByClassName('close')[0];
let saveBtn = document.getElementById('save-btn');
let deleteBtn = document.getElementById('delete-btn');
const spinner = document.getElementById("spinner");
const bookList = document.getElementById('book-list');
const myBooksLabel = document.getElementById('my-books-label');
// Retrieve saved books from localStorage
const savedBooks = JSON.parse(localStorage.getItem('books')) || [];

//hide "My Books" label if no books yet saved
function updateMyBooksLabel() {
  if (savedBooks.length === 0) {
    myBooksLabel.style.display = 'none';
  } else {
    myBooksLabel.style.display = 'block';
  }
}
updateMyBooksLabel();


let bookTitle;
// Update bookTitle when input value changes
bookInput.addEventListener('change', () => {
    bookTitle = bookInput.value;
});


// Add a new book to localStorage
function saveBook(title, summary, color) {
  const book = { title, summary, color };
  savedBooks.push(book);
  localStorage.setItem('books', JSON.stringify(savedBooks));
}


// Generate a list of buttons for each saved book title
savedBooks.forEach((book) => {
  const button = document.createElement('button');
  button.textContent = book.title;
  button.classList.add('card')
  button.addEventListener('click', () => {
    // Display the saved summary in a pop-up
    summaryModal.style.display = 'block';
    summaryElement.innerHTML = book.summary;
    bookTitleElement.innerHTML = book.title;
    //hide savebtn
    saveBtn.style.display = 'none';
  });

  // Use the saved color for the button
  button.style.backgroundColor = book.color;
  bookList.appendChild(button);
});

  
generateBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    spinner.style.display = "block"; // show the spinner
    bookTitle = bookInput.value; // Get current input value
    const summary = await fetchSummary(bookTitle);
    spinner.style.display = "none"; 
    summaryModal.style.display = 'block';
    summaryElement.innerHTML = summary;
    bookTitleElement.innerHTML = bookTitle;
    saveBtn.style.display = 'block';
});




// Generate random dark color
function generateRandomColor() {
  const red = Math.floor(Math.random() * 51);
  const green = Math.floor(Math.random() * 51);
  const blue = Math.floor(Math.random() * 51);
  return `rgb(${red}, ${green}, ${blue})`;
}
// Handle save button click
saveBtn.addEventListener('click', () => {
  const summary = summaryElement.innerHTML;
  if (bookTitle && summary) {
    const color = generateRandomColor();
    saveBook(bookTitle, summary, color);
    // Refresh the book list
    location.reload();
    updateMyBooksLabel();
  }

});







deleteBtn.addEventListener('click', () => {
  const confirmDelete = confirm("Are you sure you want to delete this book summary?");
  
  if (confirmDelete) {
      const bookIndex = savedBooks.findIndex((book) => book.title === bookTitleElement.innerHTML);
      if (bookIndex !== -1) {
        savedBooks.splice(bookIndex, 1);
        localStorage.setItem('books', JSON.stringify(savedBooks));
        const buttonToRemove = bookList.children[bookIndex];
        bookList.removeChild(buttonToRemove);
        summaryModal.style.display = 'none';
      }
      updateMyBooksLabel();
  }
});



async function fetchSummary(bookTitle) {
    const response = await fetch('https://summary-gpt.onrender.com/api/summarize', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bookTitle })
    });
    const data = await response.json();
    if (data) {
        return data 
    } else {
        console.error("Unexpected data format:", data);
        return "An error occurred while fetching the summary. Please try again.";
    }
}

closeBtn.addEventListener('click', () => {
  summaryModal.classList.add('modal-out');
  setTimeout(() => {
    summaryModal.style.display = 'none';
    summaryModal.classList.remove('modal-out');
    summaryElement.innerHTML = '';
  }, 500);
});