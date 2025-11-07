// Student list array
let students = [];
let colors = [];
let isSpinning = false;
let currentListName = '';
let allLists = {}; // Object to store all named lists

// DOM elements
const studentInput = document.getElementById('studentInput');
const addBtn = document.getElementById('addBtn');
const studentList = document.getElementById('studentList');
const wheelCanvas = document.getElementById('wheelCanvas');
const goBtn = document.getElementById('goBtn');
const exportBtn = document.getElementById('exportBtn');
const importBtn = document.getElementById('importBtn');
const importFile = document.getElementById('importFile');
const listSelector = document.getElementById('listSelector');
const listNameInput = document.getElementById('listNameInput');
const deleteListBtn = document.getElementById('deleteListBtn');
const clearListBtn = document.getElementById('clearListBtn');
const listSaveSection = document.getElementById('listSaveSection');

// Initialize canvas
const ctx = wheelCanvas.getContext('2d');
let WHEEL_SIZE = Math.min(400, window.innerWidth - 80);
let CENTER_X = WHEEL_SIZE / 2;
let CENTER_Y = WHEEL_SIZE / 2;
let RADIUS = WHEEL_SIZE / 2 - 10;

function updateCanvasSize() {
    WHEEL_SIZE = Math.min(400, window.innerWidth - 80);
    CENTER_X = WHEEL_SIZE / 2;
    CENTER_Y = WHEEL_SIZE / 2;
    RADIUS = WHEEL_SIZE / 2 - 10;
    wheelCanvas.width = WHEEL_SIZE;
    wheelCanvas.height = WHEEL_SIZE;
    generateWheel();
}

updateCanvasSize();
window.addEventListener('resize', updateCanvasSize);

// Generate unique colors for students
function generateColor(index) {
    const hue = (index * 137.508) % 360; // Golden angle for color distribution
    return `hsl(${hue}, 70%, 60%)`;
}

// Save all lists to localStorage
function saveAllLists() {
    localStorage.setItem('allStudentLists', JSON.stringify(allLists));
    localStorage.setItem('currentListName', currentListName);
}

// Load all lists from localStorage
function loadAllLists() {
    const saved = localStorage.getItem('allStudentLists');
    if (saved) {
        try {
            allLists = JSON.parse(saved);
        } catch (e) {
            console.error('Error loading lists:', e);
            allLists = {};
        }
    }

    // Load current list name
    currentListName = localStorage.getItem('currentListName') || '';

    // Update selector dropdown
    updateListSelector();

    // Load current list if exists
    if (currentListName && allLists[currentListName]) {
        loadList(currentListName);
    }
}

// Update list selector dropdown
function updateListSelector() {
    listSelector.innerHTML = '<option value="">Select a list...</option>';

    Object.keys(allLists).sort().forEach(listName => {
        const option = document.createElement('option');
        option.value = listName;
        option.textContent = listName;
        if (listName === currentListName) {
            option.selected = true;
        }
        listSelector.appendChild(option);
    });

    // Update delete button visibility
    deleteListBtn.style.display = currentListName ? 'block' : 'none';
    listNameInput.value = currentListName || '';
}

// Save current students to current list
function saveCurrentList() {
    if (currentListName) {
        allLists[currentListName] = [...students];
        saveAllLists();
    }
}

// Load a specific list
function loadList(listName) {
    if (allLists[listName]) {
        currentListName = listName;
        students = [...allLists[listName]];
        colors = students.map((_, index) => generateColor(index));
        updateStudentList();
        generateWheel();
        updateListSelector();
        // Save the current list selection so it persists on refresh
        saveAllLists();

        // Hide the Save and Download List section when loading a saved list
        listSaveSection.style.display = 'none';
    }
}

// Delete current list
function deleteCurrentList() {
    if (!currentListName) {
        alert('No list selected!');
        return;
    }

    if (confirm(`Are you sure you want to delete "${currentListName}"?`)) {
        delete allLists[currentListName];
        currentListName = '';
        students = [];
        colors = [];
        updateStudentList();
        generateWheel();
        saveAllLists();
        updateListSelector();
    }
}

// Clear current list (but keep it saved if it has a name)
function clearCurrentList() {
    if (students.length === 0) {
        alert('The list is already empty! You can start adding students.');
        return;
    }

    if (confirm('Are you sure you want to create a new list? This will not affect your saved lists.')) {
        students = [];
        colors = [];
        updateStudentList();
        generateWheel();

        // Clear the list name input and reset current selection
        // Don't save empty array to saved lists - just clear the working list
        listNameInput.value = '';
        currentListName = '';
        updateListSelector();

        // Show the Save and Download List section
        listSaveSection.style.display = 'block';

        // Scroll to the section smoothly
        listSaveSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

// Save students to localStorage (legacy - now uses saveCurrentList)
function saveStudents() {
    saveCurrentList();
}

// Load students from localStorage (legacy - now uses loadAllLists)
function loadStudents() {
    loadAllLists();
}

// Add student to list
function addStudent() {
    const name = studentInput.value.trim();
    if (name && !students.includes(name)) {
        students.push(name);
        colors.push(generateColor(students.length - 1));
        studentInput.value = '';
        updateStudentList();
        generateWheel();
        saveStudents(); // Auto-save
    } else if (students.includes(name)) {
        alert('Student already exists!');
    }
}

// Remove student from list
function removeStudent(index) {
    students.splice(index, 1);
    colors.splice(index, 1);
    updateStudentList();
    generateWheel();
    saveStudents(); // Auto-save
}

// Update student list display
function updateStudentList() {
    studentList.innerHTML = '';
    students.forEach((student, index) => {
        const li = document.createElement('li');
        li.className = 'student-item';

        const nameSpan = document.createElement('span');
        nameSpan.textContent = student;
        nameSpan.className = 'student-name';

        const removeBtn = document.createElement('button');
        removeBtn.textContent = '-';
        removeBtn.className = 'btn btn-remove';
        removeBtn.onclick = () => removeStudent(index);

        li.appendChild(nameSpan);
        li.appendChild(removeBtn);
        studentList.appendChild(li);
    });
}

// Generate wheel with student segments
function generateWheel() {
    if (students.length === 0) {
        ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);
        ctx.font = '24px Arial';
        ctx.fillStyle = '#666';
        ctx.textAlign = 'center';
        ctx.fillText('Add students to begin', CENTER_X, CENTER_Y);
        return;
    }

    ctx.clearRect(0, 0, WHEEL_SIZE, WHEEL_SIZE);

    const anglePerStudent = (2 * Math.PI) / students.length;

    students.forEach((student, index) => {
        const startAngle = index * anglePerStudent - Math.PI / 2;
        const endAngle = (index + 1) * anglePerStudent - Math.PI / 2;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(CENTER_X, CENTER_Y);
        ctx.arc(CENTER_X, CENTER_Y, RADIUS, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = colors[index];
        ctx.fill();
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw student name
        ctx.save();
        ctx.translate(CENTER_X, CENTER_Y);
        ctx.rotate(startAngle + anglePerStudent / 2);
        ctx.textAlign = 'left';
        ctx.textBaseline = 'middle';
        ctx.font = 'bold 14px Arial';

        const textX = RADIUS * 0.6;
        const maxWidth = RADIUS * 0.5;
        const text = student.length > 12 ? student.substring(0, 10) + '...' : student;

        // Draw text outline (border) with light black
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.lineWidth = 3;
        ctx.lineJoin = 'round';
        ctx.miterLimit = 2;
        ctx.strokeText(text, textX, 0);

        // Draw text fill (white) on top
        ctx.fillStyle = '#fff';
        ctx.fillText(text, textX, 0);

        ctx.restore();
    });
}

// Spin the wheel
function spinWheel() {
    if (students.length === 0) {
        alert('Please add at least one student!');
        return;
    }

    if (isSpinning) {
        return;
    }

    isSpinning = true;
    goBtn.disabled = true;

    // Randomly select winning student
    const winningIndex = Math.floor(Math.random() * students.length);
    const winningStudent = students[winningIndex];

    // Calculate angle to rotate so winning student is at top (arrow position)
    const anglePerStudent = (2 * Math.PI) / students.length;

    // Wheel is drawn starting at -π/2 (top), going counter-clockwise
    // Segment centers are at: -π/2 + index*anglePerStudent + anglePerStudent/2
    // Arrow points to top (-π/2)
    // CSS rotate() rotates clockwise, so we need to account for this

    // Current position of winning segment center (in canvas coordinates)
    const segmentCenterAngle = -Math.PI / 2 + winningIndex * anglePerStudent + anglePerStudent / 2;

    // We want the segment center to end up at -π/2 (top where arrow points)
    // Since CSS rotates clockwise and canvas is counter-clockwise:
    // After clockwise rotation R: newAngle = oldAngle - R
    // So: segmentCenterAngle - R = -π/2
    // Therefore: R = segmentCenterAngle + π/2

    // But we want to rotate the minimum amount, so we can also think:
    // We need to rotate clockwise by: (segmentCenterAngle - (-π/2)) mod 2π
    // Which simplifies to: (segmentCenterAngle + π/2) mod 2π

    let targetRotation = segmentCenterAngle + Math.PI / 2;

    // Add adjustment to account for visual alignment
    // If arrow stops to the left of center, rotate more clockwise (increase rotation)
    // Adjust this value if needed: positive = more clockwise, negative = more counter-clockwise
    targetRotation += anglePerStudent * 0.05; // 5% of segment width adjustment

    // Normalize to 0 to 2π range
    targetRotation = ((targetRotation % (2 * Math.PI)) + (2 * Math.PI)) % (2 * Math.PI);

    const normalizedRotation = targetRotation;

    // Calculate total rotation (multiple spins + final position)
    const spins = 5; // Number of full rotations
    const totalRotation = spins * 2 * Math.PI + normalizedRotation;

    // Reset rotation first (without transition)
    wheelCanvas.style.transition = 'none';
    wheelCanvas.style.transform = 'rotate(0rad)';

    // Force reflow to ensure reset is applied
    void wheelCanvas.offsetWidth;

    // Apply rotation with animation
    wheelCanvas.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
    wheelCanvas.style.transform = `rotate(${totalRotation}rad)`;

    // Re-enable button after animation
    setTimeout(() => {
        isSpinning = false;
        goBtn.disabled = false;
    }, 4000);
}

// Event listeners
addBtn.addEventListener('click', addStudent);
studentInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addStudent();
    }
});

goBtn.addEventListener('click', spinWheel);

// Export students to JSON file (also saves to localStorage)
exportBtn.addEventListener('click', () => {
    if (students.length === 0) {
        alert('No students to download! Please add some students first.');
        return;
    }

    // Get list name from input or use current list name
    const listName = listNameInput.value.trim() || currentListName || 'Unnamed List';

    // Save to localStorage if a name is provided
    if (listNameInput.value.trim()) {
        allLists[listName] = [...students];
        currentListName = listName;
        saveAllLists();
        updateListSelector();

        // Show success feedback
        const originalText = exportBtn.textContent;
        exportBtn.textContent = '✓ Saved & Downloaded!';
        exportBtn.style.background = '#28a745';
        setTimeout(() => {
            exportBtn.textContent = originalText;
            exportBtn.style.background = '';
            // Hide the Save and Download List section after successful download
            listSaveSection.style.display = 'none';
        }, 2000);
    }

    const exportData = {
        listName: listName,
        students: students,
        exportedAt: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    const fileName = `${listName.replace(/[^a-z0-9]/gi, '_')}.json`;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
});

// Import students from file
importBtn.addEventListener('click', () => {
    importFile.click();
});

importFile.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);

            let importedStudents = [];
            let importedListName = '';

            // Check if it's the new format with listName
            if (importedData.students && Array.isArray(importedData.students)) {
                importedStudents = importedData.students;
                importedListName = importedData.listName || '';
            } else if (Array.isArray(importedData)) {
                // Legacy format - just an array
                importedStudents = importedData;
            } else {
                throw new Error('Invalid file format');
            }

            // Filter out empty strings and duplicates
            const validStudents = importedStudents
                .map(s => String(s).trim())
                .filter(s => s.length > 0)
                .filter((s, index, arr) => arr.indexOf(s) === index);

            if (validStudents.length === 0) {
                alert('No valid students found in file!');
                return;
            }

            // Ask user if they want to replace or merge
            const action = confirm(
                `Found ${validStudents.length} student(s)${importedListName ? ` from list "${importedListName}"` : ''}.\n\n` +
                `Click OK to replace your current list, or Cancel to add these students to your current list.`
            );

            if (action) {
                // Replace
                students = validStudents;
            } else {
                // Merge (add only new students)
                validStudents.forEach(student => {
                    if (!students.includes(student)) {
                        students.push(student);
                    }
                });
            }

            // Regenerate colors
            colors = students.map((_, index) => generateColor(index));
            updateStudentList();
            generateWheel();
            saveCurrentList(); // Auto-save

            alert(`Successfully loaded ${validStudents.length} student(s)${importedListName ? ` from "${importedListName}"` : ''}!`);
        } catch (error) {
            alert('Error loading file. Please make sure you selected a valid list file (JSON format).');
            console.error('Import error:', error);
        }
    };

    reader.readAsText(file);
    // Reset file input
    e.target.value = '';
});

// List management event listeners
listSelector.addEventListener('change', (e) => {
    const selectedName = e.target.value;
    if (selectedName) {
        // Save current list before switching (if there are students)
        if (students.length > 0) {
            if (currentListName) {
                saveCurrentList();
            } else {
                // Prompt to save current students before switching
                const save = confirm('You have unsaved students. Save them before switching?');
                if (save) {
                    const listName = prompt('Enter a name for this list:', 'New List');
                    if (listName && listName.trim()) {
                        allLists[listName.trim()] = [...students];
                        currentListName = listName.trim();
                        saveAllLists();
                        updateListSelector();
                    } else {
                        // User cancelled, don't switch
                        listSelector.value = '';
                        return;
                    }
                }
            }
        }
        loadList(selectedName);
    }
});

// Allow Enter key to trigger download
listNameInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        exportBtn.click();
    }
});

deleteListBtn.addEventListener('click', deleteCurrentList);
clearListBtn.addEventListener('click', clearCurrentList);

// Load students on page load
loadAllLists();

// Initial wheel generation
generateWheel();

