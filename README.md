# Idea Board (Frontend with localStorage)

A clean, modern, frontend-only web application for capturing, organizing, and managing ideas.

## Features

- **Full CRUD Operations**:
  - **Create**: Add new ideas with title, status, and description.
  - **Read**: Responsive dashboard with color-coded status badges and summary counters.
  - **Update**: Edit existing ideas in place.
  - **Delete**: Remove ideas with a confirmation prompt.
- **Client-side Storage**: Data is stored persistently in the browser using `localStorage`.
- **Pre-seeded Ideas**: Automatically loads starter sample ideas on first launch.
- **Service Layer Architecture**: `api.js` encapsulates all CRUD operations, making it easy to swap with a real backend server without modifying UI code.
- **Pure Web Tech**: Built using vanilla HTML5, CSS3, and standard JavaScript with no external dependencies or frameworks.

## Project Structure

```
.
├── backend/          # Reserved for backend server / API integration
└── frontend/         # Frontend web application
    ├── index.html    # Semantic HTML markup
    ├── style.css     # CSS custom properties, modern layout & responsive styling
    ├── api.js        # Data access / CRUD service layer (localStorage / REST API)
    └── script.js     # UI event listeners, modal dialogs & DOM rendering
```

## Getting Started

### Option 1: Direct File
Open `frontend/index.html` directly in any modern web browser.

### Option 2: Local Static Server
```bash
cd frontend
python3 -m http.server 8000
```
Then visit `http://localhost:8000` in your browser.
