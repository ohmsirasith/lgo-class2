// --- DOM Elements ---
const ideasGrid = document.getElementById('ideasGrid');
const emptyState = document.getElementById('emptyState');
const ideaModal = document.getElementById('ideaModal');
const ideaForm = document.getElementById('ideaForm');
const modalTitle = document.getElementById('modalTitle');
const addIdeaBtn = document.getElementById('addIdeaBtn');
const closeModalBtn = document.getElementById('closeModalBtn');
const cancelModalBtn = document.getElementById('cancelModalBtn');

// Form inputs
const ideaIdInput = document.getElementById('ideaId');
const ideaTitleInput = document.getElementById('ideaTitle');
const ideaStatusInput = document.getElementById('ideaStatus');
const ideaDescriptionInput = document.getElementById('ideaDescription');

// Stats elements
const statTotal = document.getElementById('statTotal');
const statNew = document.getElementById('statNew');
const statConsidering = document.getElementById('statConsidering');
const statSelected = document.getElementById('statSelected');

// --- Modal Management ---
function openCreateModal() {
  ideaForm.reset();
  ideaIdInput.value = '';
  ideaStatusInput.value = 'New';
  modalTitle.textContent = 'Add New Idea';
  ideaModal.classList.add('active');
  ideaModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => ideaTitleInput.focus(), 100);
}

async function openEditModal(id) {
  const idea = await IdeaAPI.getById(id);
  if (!idea) return;

  ideaIdInput.value = idea.id;
  ideaTitleInput.value = idea.title;
  ideaStatusInput.value = idea.status;
  ideaDescriptionInput.value = idea.description;

  modalTitle.textContent = 'Edit Idea';
  ideaModal.classList.add('active');
  ideaModal.setAttribute('aria-hidden', 'false');
  setTimeout(() => ideaTitleInput.focus(), 100);
}

function closeModal() {
  ideaModal.classList.remove('active');
  ideaModal.setAttribute('aria-hidden', 'true');
  ideaForm.reset();
  ideaIdInput.value = '';
}

// --- Form Submission (Create & Update) ---
async function handleFormSubmit(e) {
  e.preventDefault();

  const title = ideaTitleInput.value.trim();
  const status = ideaStatusInput.value;
  const description = ideaDescriptionInput.value.trim();
  const currentId = ideaIdInput.value;

  if (!title || !description) {
    alert('Please fill in all required fields.');
    return;
  }

  const payload = { title, status, description };

  if (currentId) {
    // Update existing idea
    await IdeaAPI.update(currentId, payload);
  } else {
    // Create new idea
    await IdeaAPI.create(payload);
  }

  closeModal();
  await renderDashboard();
}

// --- Delete Idea with Confirmation ---
async function deleteIdea(id) {
  const ideaToDelete = await IdeaAPI.getById(id);
  const ideaTitle = ideaToDelete ? `"${ideaToDelete.title}"` : 'this idea';

  const confirmed = window.confirm(`Are you sure you want to delete ${ideaTitle}?\nThis action cannot be undone.`);
  if (confirmed) {
    await IdeaAPI.delete(id);
    await renderDashboard();
  }
}

// --- Escape HTML for Security ---
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// --- Render Functions ---
function renderStats(ideas) {
  statTotal.textContent = ideas.length;
  statNew.textContent = ideas.filter(i => i.status === 'New').length;
  statConsidering.textContent = ideas.filter(i => i.status === 'Considering').length;
  statSelected.textContent = ideas.filter(i => i.status === 'Selected').length;
}

async function renderDashboard() {
  const ideas = await IdeaAPI.getAll();
  renderStats(ideas);

  if (ideas.length === 0) {
    ideasGrid.innerHTML = '';
    emptyState.style.display = 'block';
    return;
  }

  emptyState.style.display = 'none';

  ideasGrid.innerHTML = ideas.map(idea => {
    const safeTitle = escapeHtml(idea.title);
    const safeDescription = escapeHtml(idea.description);
    const safeStatus = escapeHtml(idea.status || 'New');
    const safeId = escapeHtml(idea.id);

    return `
      <div class="idea-card" data-id="${safeId}">
        <h3 class="card-title">${safeTitle}</h3>
        <p class="card-desc">${safeDescription}</p>

        <div class="card-footer">
          <span class="badge status-${safeStatus}">
            <span class="badge-dot"></span>
            ${safeStatus}
          </span>
          <div class="card-actions">
            <button class="btn-icon-edit" onclick="openEditModal('${safeId}')" title="Edit this idea">
              ✏️ Edit
            </button>
            <button class="btn-icon-danger" onclick="deleteIdea('${safeId}')" title="Delete this idea">
              🗑️ Delete
            </button>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// --- Event Listeners ---
addIdeaBtn.addEventListener('click', openCreateModal);
closeModalBtn.addEventListener('click', closeModal);
cancelModalBtn.addEventListener('click', closeModal);
ideaForm.addEventListener('submit', handleFormSubmit);

// Close modal when clicking outside the dialog content
ideaModal.addEventListener('click', (e) => {
  if (e.target === ideaModal) {
    closeModal();
  }
});

// Close modal on Escape key press
window.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && ideaModal.classList.contains('active')) {
    closeModal();
  }
});

// Initial render on page load
document.addEventListener('DOMContentLoaded', renderDashboard);
