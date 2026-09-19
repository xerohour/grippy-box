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
const srAnnouncer = document.getElementById('sr-announcer');

// State
let notes = loadNotes();
let editingNoteId = null;
let previousFocusElement = null;

// --- Utility functions ---

/** Load notes from localStorage with error handling */
function loadNotes() {
    try {
        const stored = localStorage.getItem('keep-notes');
        if (stored) {
            const parsed = JSON.parse(stored);
            if (Array.isArray(parsed)) return parsed;
        }
    } catch (e) {
        console.warn('Failed to load notes from localStorage:', e);
    }
    return [...sampleNotes];
}

/** Save notes to localStorage with error handling */
function saveNotes() {
    try {
        localStorage.setItem('keep-notes', JSON.stringify(notes));
    } catch (e) {
        console.warn('Failed to save notes to localStorage:', e);
        announce('Could not save notes — storage may be full.');
    }
}

/** Announce a message to screen readers */
function announce(message) {
    if (srAnnouncer) {
        srAnnouncer.textContent = '';
        // Small delay to ensure the live region picks up the change
        requestAnimationFrame(() => {
            srAnnouncer.textContent = message;
        });
    }
}

/** Create a debounced version of a function */
function debounce(fn, delay) {
    let timer = null;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

/** Get all focusable elements within a container */
function getFocusableElements(container) {
    return container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
}

/** Trap focus within a container (for dialogs) */
function trapFocus(container, event) {
    const focusable = getFocusableElements(container);
    if (!focusable.length) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.key === 'Tab') {
        if (event.shiftKey && document.activeElement === first) {
            event.preventDefault();
            last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
            event.preventDefault();
            first.focus();
        }
    }
}

// --- Core app functions ---

// Initialize the app
function init() {
    renderNotes();
    setupEventListeners();
}

// Render all notes
function renderNotes(filteredNotes) {
    const notesToRender = filteredNotes !== undefined ? filteredNotes : notes;

    // Clear existing notes except the add button
    const addBtn = document.getElementById('add-note-btn');
    notesGrid.innerHTML = '';
    notesGrid.appendChild(addBtn);

    // Add filtered notes (pinned first, then unpinned)
    const pinned = notesToRender.filter(n => n.pinned);
    const unpinned = notesToRender.filter(n => !n.pinned);
    const ordered = [...pinned, ...unpinned];

    ordered.forEach(note => {
        const noteElement = createNoteElement(note);
        notesGrid.appendChild(noteElement);
    });
}

// Create a note element (XSS-safe)
function createNoteElement(note) {
    const noteElement = document.createElement('div');
    noteElement.className = `note-card ${note.color} ${note.pinned ? 'pinned' : ''}`;
    noteElement.dataset.id = note.id;
    noteElement.setAttribute('role', 'article');
    noteElement.setAttribute('aria-label', `Note: ${note.title}`);

    // Title (safe text insertion)
    const titleDiv = document.createElement('div');
    titleDiv.className = 'note-title';
    titleDiv.textContent = note.title;

    // Content (safe text insertion, preserve newlines via CSS white-space)
    const contentDiv = document.createElement('div');
    contentDiv.className = 'note-content';
    contentDiv.textContent = note.content;

    // Header
    const headerDiv = document.createElement('div');
    headerDiv.className = 'note-header';
    headerDiv.appendChild(titleDiv);

    // Actions
    const actionsDiv = document.createElement('div');
    actionsDiv.className = 'note-actions';

    const pinBtn = document.createElement('button');
    pinBtn.className = 'pin-btn';
    pinBtn.title = note.pinned ? 'Unpin note' : 'Pin note';
    pinBtn.setAttribute('aria-label', note.pinned ? 'Unpin note' : 'Pin note');
    pinBtn.innerHTML = `<i class="fas fa-${note.pinned ? 'thumbtack-slash' : 'thumbtack'}" aria-hidden="true"></i>`;

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-btn';
    editBtn.title = 'Edit note';
    editBtn.setAttribute('aria-label', 'Edit note');
    editBtn.innerHTML = '<i class="fas fa-edit" aria-hidden="true"></i>';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-btn';
    deleteBtn.title = 'Delete note';
    deleteBtn.setAttribute('aria-label', 'Delete note');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt" aria-hidden="true"></i>';

    actionsDiv.appendChild(pinBtn);
    actionsDiv.appendChild(editBtn);
    actionsDiv.appendChild(deleteBtn);

    // Footer
    const footerDiv = document.createElement('div');
    footerDiv.className = 'note-footer';
    footerDiv.appendChild(actionsDiv);

    // Color picker
    const colorPicker = document.createElement('div');
    colorPicker.className = 'color-picker';
    colorPicker.setAttribute('role', 'group');
    colorPicker.setAttribute('aria-label', 'Note color');

    const colors = ['white', 'blue', 'green', 'yellow', 'pink'];
    colors.forEach(color => {
        const option = document.createElement('button');
        option.className = `color-option ${color} ${note.color === color ? 'active' : ''}`;
        option.dataset.color = color;
        option.setAttribute('aria-label', `${color} color`);
        option.title = `Set ${color} color`;
        colorPicker.appendChild(option);
    });

    noteElement.appendChild(headerDiv);
    noteElement.appendChild(contentDiv);
    noteElement.appendChild(footerDiv);
    noteElement.appendChild(colorPicker);

    return noteElement;
}

// Add a new note
function addNote(title, content, color) {
    color = color || 'white';
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
    announce('Note added');
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
        announce('Note updated');
    }
}

// Delete a note (after confirmation)
function deleteNote(id) {
    const note = notes.find(n => n.id === id);
    if (!note) return;

    showConfirmDialog(
        'Delete note?',
        `Are you sure you want to delete "${note.title}"? This cannot be undone.`,
        () => {
            notes = notes.filter(n => n.id !== id);
            saveNotes();
            renderNotes();
            announce('Note deleted');
        }
    );
}

// Toggle pin status
function togglePin(id) {
    const note = notes.find(n => n.id === id);
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
        announce(note.pinned ? 'Note pinned' : 'Note unpinned');
    }
}

// Change note color
function changeNoteColor(id, color) {
    const note = notes.find(n => n.id === id);
    if (note) {
        note.color = color;
        saveNotes();
        renderNotes();
        announce(`Note color changed to ${color}`);
    }
}

// --- Dialogs ---

// Show delete confirmation dialog
function showConfirmDialog(title, message, onConfirm) {
    // Prevent opening multiple dialogs
    if (document.querySelector('.note-dialog-overlay, .confirm-dialog-overlay')) return;
    previousFocusElement = document.activeElement;

    const overlay = document.createElement('div');
    overlay.className = 'confirm-dialog-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'confirm-title');

    const content = document.createElement('div');
    content.className = 'confirm-dialog-content';

    const h3 = document.createElement('h3');
    h3.id = 'confirm-title';
    h3.textContent = title;

    const p = document.createElement('p');
    p.textContent = message;

    const actions = document.createElement('div');
    actions.className = 'confirm-dialog-actions';

    const cancelBtn = document.createElement('button');
    cancelBtn.className = 'btn-cancel';
    cancelBtn.textContent = 'Cancel';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'btn-delete';
    deleteBtn.textContent = 'Delete';

    actions.appendChild(cancelBtn);
    actions.appendChild(deleteBtn);

    content.appendChild(h3);
    content.appendChild(p);
    content.appendChild(actions);
    overlay.appendChild(content);
    document.body.appendChild(overlay);

    // Focus the cancel button (safest choice)
    cancelBtn.focus();

    // Event handlers
    let keydownHandler = null;

    function closeDialog() {
        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        previousFocusElement && previousFocusElement.focus();
    }

    cancelBtn.addEventListener('click', closeDialog);

    deleteBtn.addEventListener('click', () => {
        closeDialog();
        onConfirm();
    });

    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });

    keydownHandler = (e) => {
        if (e.key === 'Escape') {
            closeDialog();
        } else {
            trapFocus(content, e);
        }
    };

    document.addEventListener('keydown', keydownHandler);
}

// Show note dialog for adding/editing
function showNoteDialog(note) {
    // Prevent opening multiple dialogs
    if (document.querySelector('.note-dialog-overlay, .confirm-dialog-overlay')) return;
    const isEditing = note !== null && note !== undefined;
    editingNoteId = isEditing ? note.id : null;
    previousFocusElement = document.activeElement;

    const overlay = document.createElement('div');
    overlay.className = 'note-dialog-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-labelledby', 'dialog-title-label');

    const dialogContent = document.createElement('div');
    dialogContent.className = 'dialog-content';

    // Header
    const header = document.createElement('div');
    header.className = 'dialog-header';

    const closeBtn = document.createElement('button');
    closeBtn.className = 'dialog-close-btn';
    closeBtn.innerHTML = '&times;';
    closeBtn.setAttribute('aria-label', 'Close dialog');

    header.appendChild(closeBtn);

    // Body
    const body = document.createElement('div');
    body.className = 'dialog-body';

    const titleLabel = document.createElement('label');
    titleLabel.htmlFor = 'note-title';
    titleLabel.className = 'sr-only';
    titleLabel.textContent = 'Note title';

    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.id = 'note-title';
    titleInput.className = 'dialog-input';
    titleInput.placeholder = 'Title';
    titleInput.value = isEditing ? note.title : '';
    titleInput.setAttribute('aria-labelledby', 'dialog-title-label');

    // Hidden label for dialog aria-labelledby
    const dialogTitleLabel = document.createElement('span');
    dialogTitleLabel.id = 'dialog-title-label';
    dialogTitleLabel.className = 'sr-only';
    dialogTitleLabel.textContent = isEditing ? 'Edit note' : 'New note';

    const contentLabel = document.createElement('label');
    contentLabel.htmlFor = 'note-content';
    contentLabel.className = 'sr-only';
    contentLabel.textContent = 'Note content';

    const contentTextarea = document.createElement('textarea');
    contentTextarea.id = 'note-content';
    contentTextarea.className = 'dialog-textarea';
    contentTextarea.placeholder = 'Take a note...';
    contentTextarea.value = isEditing ? note.content : '';

    body.appendChild(titleLabel);
    body.appendChild(titleInput);
    body.appendChild(contentLabel);
    body.appendChild(contentTextarea);

    // Footer
    const footer = document.createElement('div');
    footer.className = 'dialog-footer';

    const colorOptions = document.createElement('div');
    colorOptions.className = 'color-options';
    colorOptions.setAttribute('role', 'radiogroup');
    colorOptions.setAttribute('aria-label', 'Note color');

    const colors = ['white', 'blue', 'green', 'yellow', 'pink'];
    const currentColor = isEditing ? note.color : 'white';

    colors.forEach(color => {
        const option = document.createElement('button');
        option.className = `color-option ${color} ${currentColor === color ? 'active' : ''}`;
        option.dataset.color = color;
        option.setAttribute('role', 'radio');
        option.setAttribute('aria-checked', currentColor === color ? 'true' : 'false');
        option.setAttribute('aria-label', `${color} color`);
        option.title = `Set ${color} color`;
        colorOptions.appendChild(option);
    });

    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-note';
    saveBtn.textContent = isEditing ? 'Update' : 'Save';

    footer.appendChild(colorOptions);
    footer.appendChild(saveBtn);

    dialogContent.appendChild(header);
    dialogContent.appendChild(body);
    dialogContent.appendChild(footer);
    overlay.appendChild(dialogTitleLabel);
    overlay.appendChild(dialogContent);
    document.body.appendChild(overlay);

    // Focus the title input
    titleInput.focus();

    // Event handlers
    let keydownHandler = null;

    function closeDialog() {
        if (keydownHandler) {
            document.removeEventListener('keydown', keydownHandler);
            keydownHandler = null;
        }
        if (document.body.contains(overlay)) {
            document.body.removeChild(overlay);
        }
        editingNoteId = null;
        previousFocusElement && previousFocusElement.focus();
    }

    closeBtn.addEventListener('click', closeDialog);

    saveBtn.addEventListener('click', () => {
        const title = titleInput.value.trim();
        const content = contentTextarea.value.trim();
        const activeOption = colorOptions.querySelector('.color-option.active');
        const color = activeOption ? activeOption.dataset.color : 'white';

        if (!title && !content) {
            announce('Please enter a title or content for the note.');
            titleInput.focus();
            return;
        }

        if (isEditing) {
            editNote(editingNoteId, title || 'Untitled', content, color);
        } else {
            addNote(title || 'Untitled', content, color);
        }

        closeDialog();
    });

    // Color selection in dialog
    colorOptions.addEventListener('click', (e) => {
        const option = e.target.closest('.color-option');
        if (!option) return;

        colorOptions.querySelectorAll('.color-option').forEach(opt => {
            opt.classList.remove('active');
            opt.setAttribute('aria-checked', 'false');
        });
        option.classList.add('active');
        option.setAttribute('aria-checked', 'true');
    });

    // Close on overlay click
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeDialog();
    });

    // Keyboard: Escape to close, Tab trap, Ctrl+Enter to save
    keydownHandler = (e) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            closeDialog();
        } else if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            saveBtn.click();
        } else {
            trapFocus(dialogContent, e);
        }
    };

    document.addEventListener('keydown', keydownHandler);
}

// --- Event Listeners ---

function setupEventListeners() {
    // Add note button
    if (addNoteBtn) {
        addNoteBtn.addEventListener('click', () => {
            showNoteDialog();
        });
    }

    // Debounced search
    const debouncedSearch = debounce((searchTerm) => {
        const term = searchTerm.toLowerCase();
        const filtered = notes.filter(note =>
            note.title.toLowerCase().includes(term) ||
            note.content.toLowerCase().includes(term)
        );
        renderNotes(filtered);
    }, 250);

    searchInput.addEventListener('input', (e) => {
        debouncedSearch(e.target.value);
    });

    // Delegated event listeners for note actions (more efficient than re-binding)
    notesGrid.addEventListener('click', (e) => {
        const noteCard = e.target.closest('.note-card');
        if (!noteCard) return;

        const id = parseInt(noteCard.dataset.id, 10);
        if (isNaN(id)) return;

        // Pin button
        if (e.target.closest('.pin-btn')) {
            togglePin(id);
            return;
        }

        // Edit button
        if (e.target.closest('.edit-btn')) {
            const note = notes.find(n => n.id === id);
            if (note) showNoteDialog(note);
            return;
        }

        // Delete button
        if (e.target.closest('.delete-btn')) {
            deleteNote(id);
            return;
        }

        // Color option
        if (e.target.closest('.color-option')) {
            const color = e.target.closest('.color-option').dataset.color;
            if (color) changeNoteColor(id, color);
            return;
        }
    });
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', init);
