// Sample initial notes data
const sampleNotes = [
    {
        id: 1,
        title: "Welcome to Keep Notes!",
        content: "This is a simple Google Keep clone. You can add, edit, delete, and pin your notes.",
        color: "white",
        pinned: true
    },
    {
        id: 2,
        title: "To-Do List",
        content: "- Buy groceries\n- Finish project proposal\n- Call mom\n- Schedule dentist appointment",
        color: "yellow",
        pinned: false
    },
    {
        id: 3,
        title: "Meeting Notes",
        content: "Discussed Q3 goals:\n- Increase user engagement by 20%\n- Launch new features\n- Improve customer support response time",
        color: "blue",
        pinned: true
    }
];

// DOM Elements
const notesGrid = document.querySelector('.notes-grid');
const addNoteBtn = document.getElementById('add-note-btn');
const searchInput = document.getElementById('search-input');

// State
let notes = JSON.parse(localStorage.getItem('keep-notes')) || sampleNotes;
let editingNoteId = null;

// Initialize the app
function init() {
    renderNotes();
    setupEventListeners();
}

// Render all notes
function renderNotes(filteredNotes = notes) {
    // Clear existing notes except the add button
    notesGrid.innerHTML = '<div class="add-note" id="add-note-btn"><i class="fas fa-plus"></i><p>Take a note...</p></div>';
    
    // Add filtered notes
    filteredNotes.forEach(note => {
        const noteElement = createNoteElement(note);
        notesGrid.insertBefore(noteElement, notesGrid.firstChild.nextSibling);
    });
    
    // Reattach event listeners to the new elements
    setupNoteEventListeners();
    
    // Reattach event listener to the new add-note-btn
    document.getElementById('add-note-btn').addEventListener('click', () => {
        showNoteDialog();
    });
}

// Create a note element
function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = `note-card ${note.color} ${note.pinned ? 'pinned' : ''}`;
    noteElement.dataset.id = note.id;
    
    noteElement.innerHTML = `
        <div class="note-header">
            <div class="note-title">${note.title}</div>
        </div>
        <div class="note-content">${note.content.replace(/\n/g, '<br>')}</div>
        <div class="note-footer">
            <div class="note-actions">
                <button class="pin-btn" title="${note.pinned ? 'Unpin' : 'Pin'}">
                    <i class="fas fa-${note.pinned ? 'thumbtack-slash' : 'thumbtack'}"></i>
                </button>
                <button class="edit-btn" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button class="delete-btn" title="Delete">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
        <div class="color-picker">
            <div class="color-option white ${note.color === 'white' ? 'active' : ''}" data-color="white"></div>
            <div class="color-option blue ${note.color === 'blue' ? 'active' : ''}" data-color="blue"></div>
            <div class="color-option green ${note.color === 'green' ? 'active' : ''}" data-color="green"></div>
            <div class="color-option yellow ${note.color === 'yellow' ? 'active' : ''}" data-color="yellow"></div>
            <div class="color-option pink ${note.color === 'pink' ? 'active' : ''}" data-color="pink"></div>
        </div>
    `;
    
    return noteElement;
}

// Save notes to localStorage
function saveNotes() {
    localStorage.setItem('keep-notes', JSON.stringify(notes));
}

// Add a new note
function addNote(title, content, color = 'white') {
    const newNote = {
        id: Date.now(),
        title: title || 'New Note',
        content: content || '',
        color: color,
        pinned: false
    };
    
    notes.unshift(newNote);
    saveNotes();
    renderNotes();
}

// Edit a note
function editNote(id, title, content, color) {
    const noteIndex = notes.findIndex(note => note.id === id);
    if (noteIndex !== -1) {
        notes[noteIndex].title = title;
        notes[noteIndex].content = content;
        notes[noteIndex].color = color;
        saveNotes();
        renderNotes();
    }
}

// Delete a note
function deleteNote(id) {
    notes = notes.filter(note => note.id !== id);
    saveNotes();
    renderNotes();
}

// Toggle pin status
function togglePin(id) {
    const note = notes.find(note => note.id === id);
    if (note) {
        note.pinned = !note.pinned;
        saveNotes();
        
        // Move pinned notes to the top
        notes.sort((a, b) => {
            if (a.pinned && !b.pinned) return -1;
            if (!a.pinned && b.pinned) return 1;
            return 0;
        });
        
        renderNotes();
    }
}

// Change note color
function changeNoteColor(id, color) {
    const note = notes.find(note => note.id === id);
    if (note) {
        note.color = color;
        saveNotes();
        renderNotes();
    }
}

// Setup event listeners
function setupEventListeners() {
    // Add note button (initial)
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            showNoteDialog();
        });
    }
    
    // Search functionality
    searchInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const filteredNotes = notes.filter(note => 
            note.title.toLowerCase().includes(searchTerm) || 
            note.content.toLowerCase().includes(searchTerm)
        );
        renderNotes(filteredNotes);
    });
}

// Setup event listeners for note actions
function setupNoteEventListeners() {
    // Pin button
    document.querySelectorAll('.pin-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const noteCard = e.target.closest('.note-card');
            const id = parseInt(noteCard.dataset.id);
            togglePin(id);
        });
    });
    
    // Edit button
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const noteCard = e.target.closest('.note-card');
            const id = parseInt(noteCard.dataset.id);
            const note = notes.find(note => note.id === id);
            if (note) {
                showNoteDialog(note);
            }
        });
    });
    
    // Delete button
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', (e) => {
            const noteCard = e.target.closest('.note-card');
            const id = parseInt(noteCard.dataset.id);
            deleteNote(id);
        });
    });
    
    // Color picker
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            const noteCard = e.target.closest('.note-card');
            const id = parseInt(noteCard.dataset.id);
            const color = e.target.dataset.color;
            changeNoteColor(id, color);
        });
    });
}

// Show note dialog for adding/editing
function showNoteDialog(note = null) {
    const isEditing = note !== null;
    editingNoteId = isEditing ? note.id : null;
    
    // Create dialog element
    const dialog = document.createElement('div');
    dialog.className = 'note-dialog';
    dialog.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.5);
        display: flex;
        justify-content: center;
        align-items: center;
        z-index: 1000;
    `;
    
    dialog.innerHTML = `
        <div class="dialog-content" style="
            background: white;
            border-radius: 8px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            overflow: hidden;
        ">
            <div class="dialog-header" style="
                padding: 16px;
                border-bottom: 1px solid #e0e0e0;
                display: flex;
                justify-content: flex-end;
            ">
                <button id="close-dialog" style="
                    background: none;
                    border: none;
                    font-size: 20px;
                    cursor: pointer;
                    color: #5f6368;
                ">&times;</button>
            </div>
            <div class="dialog-body" style="padding: 16px;">
                <input type="text" id="note-title" placeholder="Title" value="${isEditing ? note.title : ''}" style="
                    width: 100%;
                    border: none;
                    outline: none;
                    font-size: 18px;
                    font-weight: 500;
                    margin-bottom: 10px;
                    padding: 8px;
                ">
                <textarea id="note-content" placeholder="Take a note..." style="
                    width: 100%;
                    height: 200px;
                    border: none;
                    resize: none;
                    outline: none;
                    font-size: 16px;
                    padding: 8px;
                    font-family: inherit;
                ">${isEditing ? note.content : ''}</textarea>
            </div>
            <div class="dialog-footer" style="
                padding: 16px;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #e0e0e0;
            ">
                <div class="color-options" style="display: flex; gap: 8px;">
                    <div class="color-option white ${!isEditing || note.color === 'white' ? 'active' : ''}" data-color="white" style="width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid ${!isEditing || note.color === 'white' ? '#5f6368' : 'transparent'};"></div>
                    <div class="color-option blue ${isEditing && note.color === 'blue' ? 'active' : ''}" data-color="blue" style="width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid ${isEditing && note.color === 'blue' ? '#5f6368' : 'transparent'};"></div>
                    <div class="color-option green ${isEditing && note.color === 'green' ? 'active' : ''}" data-color="green" style="width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid ${isEditing && note.color === 'green' ? '#5f6368' : 'transparent'};"></div>
                    <div class="color-option yellow ${isEditing && note.color === 'yellow' ? 'active' : ''}" data-color="yellow" style="width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid ${isEditing && note.color === 'yellow' ? '#5f6368' : 'transparent'};"></div>
                    <div class="color-option pink ${isEditing && note.color === 'pink' ? 'active' : ''}" data-color="pink" style="width: 24px; height: 24px; border-radius: 50%; cursor: pointer; border: 2px solid ${isEditing && note.color === 'pink' ? '#5f6368' : 'transparent'};"></div>
                </div>
                <button id="save-note" style="
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 4px;
                    cursor: pointer;
                    font-weight: 500;
                ">${isEditing ? 'Update' : 'Save'}</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(dialog);
    
    // Add event listeners for the dialog
    document.getElementById('close-dialog').addEventListener('click', () => {
        document.body.removeChild(dialog);
    });
    
    document.getElementById('save-note').addEventListener('click', () => {
        const title = document.getElementById('note-title').value;
        const content = document.getElementById('note-content').value;
        const activeColorOption = document.querySelector('.color-option.active');
        const color = activeColorOption ? activeColorOption.dataset.color : 'white';
        
        if (isEditing) {
            editNote(editingNoteId, title, content, color);
        } else {
            addNote(title, content, color);
        }
        
        document.body.removeChild(dialog);
    });
    
    // Color selection
    document.querySelectorAll('.color-option').forEach(option => {
        option.addEventListener('click', (e) => {
            document.querySelectorAll('.color-option').forEach(opt => {
                opt.style.border = '2px solid transparent';
                opt.classList.remove('active');
            });
            e.target.style.border = '2px solid #5f6368';
            e.target.classList.add('active');
        });
    });
    
    // Close dialog when clicking outside
    dialog.addEventListener('click', (e) => {
        if (e.target === dialog) {
            document.body.removeChild(dialog);
        }
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);
