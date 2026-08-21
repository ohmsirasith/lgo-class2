const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Enable CORS for frontend integration
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// In-memory data store initialized with 3 seed ideas
let ideas = [
    {
        id: 'sample-1',
        title: 'Natural Language Search & Filtering',
        status: 'Considering',
        description: 'Allow users to search across their records using natural conversational queries rather than rigid exact keyword matches.',
        createdAt: 1718000000000
    },
    {
        id: 'sample-2',
        title: 'Dark Mode & Theme Customization',
        status: 'Selected',
        description: 'Provide an eye-friendly dark mode option with customizable accent colors to enhance working in low light environments.',
        createdAt: 1718100000000
    },
    {
        id: 'sample-3',
        title: 'Weekly Automated Progress Digest',
        status: 'New',
        description: 'Send a concise summary email every Monday morning showing top accomplishments and upcoming milestone dates.',
        createdAt: 1718200000000
    }
];

// Helper router / route handlers supporting both /ideas and /api/ideas
const getIdeas = (req, res) => {
    res.json(ideas);
};

const getIdeaById = (req, res) => {
    const { id } = req.params;
    const idea = ideas.find(item => item.id === id);
    if (!idea) {
        return res.status(404).json({ error: 'Idea not found', id });
    }
    res.json(idea);
};

const createIdea = (req, res) => {
    const { title, status, description } = req.body;
    if (!title || !description) {
        return res.status(400).json({ error: 'Title and description are required' });
    }

    const newIdea = {
        id: 'idea-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
        title,
        status: status || 'New',
        description,
        createdAt: Date.now()
    };

    ideas.unshift(newIdea);
    res.status(201).json(newIdea);
};

const updateIdea = (req, res) => {
    const { id } = req.params;
    const { title, status, description } = req.body;

    const index = ideas.findIndex(item => item.id === id);
    if (index === -1) {
        return res.status(404).json({ error: 'Idea not found', id });
    }

    ideas[index] = {
        ...ideas[index],
        title: title !== undefined ? title : ideas[index].title,
        status: status !== undefined ? status : ideas[index].status,
        description: description !== undefined ? description : ideas[index].description
    };

    res.json(ideas[index]);
};

const deleteIdea = (req, res) => {
    const { id } = req.params;
    const initialLength = ideas.length;
    ideas = ideas.filter(item => item.id !== id);

    if (ideas.length === initialLength) {
        return res.status(404).json({ error: 'Idea not found', id });
    }

    res.json({ message: 'Idea deleted successfully', id });
};

// Root endpoint: Info and route listing
app.get('/', (req, res) => {
    res.json({
        message: 'Idea Board API Server is running',
        endpoints: {
            getAllIdeas: 'GET /ideas (or GET /api/ideas)',
            getIdeaById: 'GET /ideas/:id (or GET /api/ideas/:id)',
            createIdea: 'POST /ideas (or POST /api/ideas)',
            updateIdea: 'PUT /ideas/:id (or PUT /api/ideas/:id)',
            deleteIdea: 'DELETE /ideas/:id (or DELETE /api/ideas/:id)'
        }
    });
});

// Register routes for both /ideas and /api/ideas
app.get('/ideas', getIdeas);
app.get('/api/ideas', getIdeas);

app.get('/ideas/:id', getIdeaById);
app.get('/api/ideas/:id', getIdeaById);

app.post('/ideas', createIdea);
app.post('/api/ideas', createIdea);

app.put('/ideas/:id', updateIdea);
app.put('/api/ideas/:id', updateIdea);

app.delete('/ideas/:id', deleteIdea);
app.delete('/api/ideas/:id', deleteIdea);

// Start server
app.listen(PORT, () => {
    console.log(`Idea Board backend server running at http://localhost:${PORT}`);
});
