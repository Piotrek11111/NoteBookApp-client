"use-strict";

let notes = [];
let isLoading = true
const notesContainer = document.querySelector(".notes-container");

render();

function render() {
	document
		.querySelectorAll(".note-container")
		.forEach((noteCard) => notesContainer.removeChild(noteCard));
	notes.forEach((note, index) => {
		let cardArticle = document.createElement("div");
		cardArticle.classList.add("note-container");
		
		cardArticle.innerHTML = `
        <article class="note-card card text-bg-dark my-3">
          <div class="card-header border-0 pb-0 pt-3">
            <h3 class="card-title">
              Title
            </h3>
          </div>
          <div class="card-body pb-0">
            <p class="desc">
            </p>
          </div>
          <div class="card-footer border-0 pb-3">
            <button class="btn btn-outline-primary" data-bs-toggle="modal"
            data-bs-target="#notesEditModal" id="edit-btn">Edit</button>
            <button class="btn btn-outline-danger" id="delete-btn">Delete</button>
          </div>
        </article>`;

		const newDesc = cardArticle.querySelector(".desc");
		const newTitle = cardArticle.querySelector(".card-title");
		newTitle.addEventListener("click", () => toogleDescState(newDesc));

		const newEditBtn = cardArticle
			.querySelector("#edit-btn")
			.addEventListener("click", () => handleEdit(note));

		const newDeleteBtn = cardArticle
			.querySelector("#delete-btn")
			.addEventListener("click", () => handleDelete(note));

		newTitle.textContent = note.title;
		newDesc.textContent = truncate(note.body, 150);
		isLoading = false
		notesContainer.appendChild(cardArticle);
	});
}
function toogleDescState(el) {
	el.classList.toggle("hide");
}

async function handleDelete(note) {
	const lookingForNote = notes.findIndex((task) => task._id == note._id);
	notes.splice(lookingForNote, 1);
	render();
	await axios.delete(`https://api-notebook.onrender.com/api/notes/${note._id}`);
}

function handleEdit(note) {
	const editTitle = document.querySelector("#edit-title");
	const editBody = document.querySelector("#edit-body");

	editBody.textContent = note.body;
	editTitle.value = note.title;

	document.querySelector("#edit-note-form").addEventListener("submit", (e) => {
		e.preventDefault();
		handleSave(note, editTitle, editBody);
	});
}
async function handleSave(note, editTitle, editBody) {
	const editedNote = {
		title: editTitle.value,
		body: editBody.value,
	};
	note.body = editBody.value;
	note.title = editTitle.value;

	render();
	await axios.put(`https://api-notebook.onrender.com/api/notes/${note._id}`, editedNote);
	
}
async function fetchNotes() {
	isLoading = true
	const res = await axios.get("https://api-notebook.onrender.com/api/notes");
	res.data.map((note) => notes.push(note));
	render();
}
(() => {
	fetchNotes();
	
})();

function handleSubmit() {
	const noteTitle = document.querySelector("#title");
	const noteBody = document.querySelector("#body");
	handleAddNote(noteTitle, noteBody);
}
async function handleAddNote(noteTitle, noteBody) {
	const note = {
		title: noteTitle.value,
		body: noteBody.value,
	};
	notes.push(note)
	noteTitle.value = "";
	noteBody.value = "";
	render();
	isLoading = true
	const res = await axios.post("https://api-notebook.onrender.com/api/notes", note);
	const newNote = res.data;
	notes.pop()
	notes.push(newNote);
	
}
(() => {
	
})()
function truncate(str, n) {
	return str.length < n ? str : str.substring(0, n) + "...";
}
(() => {
	// Fetch all the forms we want to apply custom Bootstrap validation styles to
	const forms = document.querySelectorAll(".needs-validation");

	// Loop over them and prevent submission
	Array.from(forms).forEach((form) => {
		const currentModalID = document
			.getElementById(`${form.id}`)
			.closest(".modal").id;
		const currentModalInstance = bootstrap.Modal.getOrCreateInstance(
			document.getElementById(`${currentModalID}`)
		);

		form.addEventListener(
			"submit",
			async (event) => {
				if (!form.checkValidity()) {
					event.preventDefault();
					event.stopPropagation();
				} else {
					event.preventDefault();
					currentModalInstance.hide();
					if (currentModalID == "notesAddModal") handleSubmit();
				}
				form.classList.add("was-validated");
			},
			false
		);
	});
})();
