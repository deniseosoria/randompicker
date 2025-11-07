# Random Student Picker

🔗 **Live Demo:** [View Live Site](https://yjrandompicker.netlify.app/)

A fun and interactive web application for randomly selecting students using a colorful spinning wheel. Perfect for teachers, trainers, or anyone who needs to randomly pick from a list of participants.

## Features

### 🎡 Interactive Spinning Wheel
- Beautiful, colorful wheel visualization with unique colors for each student
- Smooth spinning animation that stops at a randomly selected student
- Arrow indicator at the top to show the selected student

### 📝 Student Management
- Add students individually with the "+" button
- Remove students with the "-" button next to each name
- Enter key support for quick student entry
- Duplicate prevention to avoid adding the same student twice
- Empty state message displays when the list is empty to guide users

### 💾 Multiple Named Lists
- Create and save multiple student lists (e.g., "Class A", "Class B", "Team 1")
- Switch between saved lists using the dropdown selector in "Select Saved List" section
- Auto-save functionality - your lists are automatically saved to your browser
- List selection persists across page refreshes
- Smart button behavior: "Save List" appears when list is empty or unsaved, "+ New List" appears when list has students and is saved

### 📥 Download & Upload
- **Download List**: Save your list as a JSON file and download it to your computer (also saves to browser)
- **Upload List**: Import previously saved lists from JSON files on your PC
- Lists can be shared between devices or backed up
- Clear instructions guide users on how to upload saved lists

### 🆕 Quick Actions
- **New List**: Clear the current list to start fresh (doesn't affect saved lists)
- **Delete List**: Permanently remove a saved list
- All actions include confirmation prompts to prevent accidental changes

## How to Use

### Getting Started
1. Open the application in your web browser
2. Start adding students using the input field and "+" button
3. Click "Go!" to spin the wheel and randomly select a student

### Saving Lists
1. Click "Save List" button (appears when list is empty or unsaved) to reveal the "Save and Download List" section
2. Enter a name for your list (e.g., "Class A")
3. Click "Download List" to save and download your list
4. Your list is automatically saved to your browser's local storage

### Loading Saved Lists
1. Go to the "Select Saved List" section
2. Use the dropdown menu to select a previously saved list
3. The list will load automatically with all students displayed

### Managing Lists
- **Switch Lists**: Select a different list from the dropdown in "Select Saved List" section
- **New List**: Click "+ New List" (or "Save List" if list is empty) to start fresh or save current list
- **Delete List**: Select a list from the dropdown, then click the "Delete" button
- **Import List**: Click "Upload List" in the "Select Saved List" section to load a previously downloaded JSON file from your PC

## Technical Details

### Technologies Used
- **HTML5**: Structure and semantic markup
- **CSS3**: Modern styling with gradients, animations, and responsive design
- **JavaScript (Vanilla)**: All functionality without frameworks
- **Canvas API**: For drawing the spinning wheel
- **LocalStorage API**: For saving lists in the browser

### Browser Compatibility
Works in all modern browsers that support:
- HTML5 Canvas
- CSS3 Transforms and Animations
- LocalStorage API
- ES6 JavaScript features

### Data Storage
- All lists are stored locally in your browser using LocalStorage
- No server or database required - everything works offline
- Data persists across browser sessions
- Export/Import feature allows backup and sharing

## File Structure

```
randompicker/
├── index.html      # Main HTML structure
├── index.js        # All JavaScript functionality
├── style.css       # Styling and animations
└── README.md       # This file
```

## Features in Detail

### Wheel Spinning Algorithm
- Randomly selects a winning student before spinning
- Calculates precise rotation to align the selected segment with the arrow
- Smooth deceleration animation for realistic wheel spinning effect
- Multiple full rotations before stopping for dramatic effect

### Color Generation
- Each student gets a unique color using HSL color space
- Colors are distributed evenly using the golden angle (137.508°)
- Ensures visual distinction between adjacent segments

### Responsive Design
- Works on desktop, tablet, and mobile devices
- Adapts wheel size based on screen width
- Touch-friendly buttons and controls

## Future Enhancements

Potential features for future versions:
- Sound effects for wheel spinning
- Customizable wheel colors
- Statistics tracking (who was selected how many times)
- Multiple selection modes
- Timer functionality
- Export to CSV/Excel

## License

This project is open source and available for personal and educational use.

## Contributing

Feel free to fork this project and submit pull requests for improvements!

---

**Enjoy randomly selecting students!** 🎲

