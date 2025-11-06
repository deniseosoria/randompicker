// Student list array
let students = [];
let colors = [];
let isSpinning = false;

// DOM elements
const studentInput = document.getElementById('studentInput');
const addBtn = document.getElementById('addBtn');
const studentList = document.getElementById('studentList');
const wheelCanvas = document.getElementById('wheelCanvas');
const goBtn = document.getElementById('goBtn');
const result = document.getElementById('result');

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

// Add student to list
function addStudent() {
    const name = studentInput.value.trim();
    if (name && !students.includes(name)) {
        students.push(name);
        colors.push(generateColor(students.length - 1));
        studentInput.value = '';
        updateStudentList();
        generateWheel();
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
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 14px Arial';
        ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
        ctx.shadowBlur = 2;

        const textX = RADIUS * 0.6;
        const maxWidth = RADIUS * 0.5;
        const text = student.length > 12 ? student.substring(0, 10) + '...' : student;
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
    result.textContent = '';
    result.style.display = 'none';

    // Randomly select winning student
    const winningIndex = Math.floor(Math.random() * students.length);
    const winningStudent = students[winningIndex];

    // Calculate angle to rotate so winning student is at top (arrow position)
    const anglePerStudent = (2 * Math.PI) / students.length;

    // Arrow points to top (270 degrees or -90 degrees)
    // We need to rotate so the winning segment's center is at the top
    const segmentCenterAngle = winningIndex * anglePerStudent + anglePerStudent / 2;
    // The segment center should align with the top (which is -90 degrees or 270 degrees)
    const targetRotation = -segmentCenterAngle + Math.PI / 2;

    // Normalize to positive rotation
    const normalizedRotation = targetRotation < 0 ? targetRotation + 2 * Math.PI : targetRotation;

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

    // Show result after animation
    setTimeout(() => {
        result.textContent = `Selected: ${winningStudent}`;
        result.style.display = 'block';
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

// Initial wheel generation
generateWheel();

