const startGameBtn = document.getElementById("startGame");
const floors = document.getElementById("numOfFloors");
const size = document.getElementById("sizeOfMaze");
const username = document.getElementById("userName");
const checkStorageBtn = document.getElementById("checkLocalStortage");
const modal = document.getElementById("modal");
const keepPlaying = document.getElementById("keepPlaying");
const mazeTypeSelect = document.getElementById("mazeType");
let savedMaze = null;

// Small contract:
// - Inputs: username (non-empty), floors (>=1), size (>=2), mazeType (non-empty)
// - Output: Navigate to pages/game.html with query params or open modal to continue saved game

function isPositiveInteger(value) {
  const n = Number(value);
  return Number.isInteger(n) && n > 0;
}

function validateForm() {
  const nameValid = typeof username.value === 'string' && username.value.trim().length > 0;
  const floorsValid = isPositiveInteger(floors.value) && Number(floors.value) >= 1;
  const sizeValid = isPositiveInteger(size.value) && Number(size.value) >= 2;
  const mazeTypeValid = typeof mazeTypeSelect.value === 'string' && mazeTypeSelect.value.trim().length > 0;

  const valid = nameValid && floorsValid && sizeValid && mazeTypeValid;
  // For accessibility and visual feedback set aria-disabled and a class,
  // but don't use the native disabled attribute so click handler still runs
  if (!valid) {
    checkStorageBtn.setAttribute('aria-disabled', 'true');
    checkStorageBtn.classList.add('disabled');
  } else {
    checkStorageBtn.setAttribute('aria-disabled', 'false');
    checkStorageBtn.classList.remove('disabled');
  }
  return { valid, nameValid, floorsValid, sizeValid, mazeTypeValid };
}

// Validate on input changes
[username, floors, size, mazeTypeSelect].forEach((el) => {
  el.addEventListener('input', () => {
    validateForm();
  });
  el.addEventListener('blur', () => {
    validateForm();
  });
});

// Initial validation run
validateForm();

checkStorageBtn.addEventListener("click", () => {
  // If a username is present, check first for a saved game and show the modal
  const nameTrim = username.value ? username.value.trim() : '';
  if (nameTrim.length > 0) {
    const exactKey = `maze3d_${nameTrim}`;
    let foundKey = null;
    // Prefer exact match
    if (localStorage.getItem(exactKey)) {
      foundKey = exactKey;
    } else {
      // Fallback: search for any key that looks like a saved maze for this username
      for (let i = 0; i < localStorage.length; i++) {
        const k = localStorage.key(i);
        if (!k) continue;
        if (k.startsWith('maze3d_') && k.includes(nameTrim)) {
          foundKey = k;
          break;
        }
      }
    }

    if (foundKey) {
      const raw = localStorage.getItem(foundKey);
      if (raw) {
        try {
          savedMaze = JSON.parse(raw);
          modal.classList.add('show');
          return; // let user decide (new or continue)
        } catch (err) {
          console.warn('Saved game could not be parsed, will start a new game. Error:', err);
          try { localStorage.removeItem(foundKey); } catch(e){}
          // fall through to normal start-new behavior
        }
      }
    }
  }

  // No saved game found (or no username): validate form and start a new game
  const { valid } = validateForm();
  if (!valid) {
    alert('Please fill all fields correctly before starting.');
    return;
  }

  const params = new URLSearchParams({
    floors: String(Number(floors.value)),
    size: String(Number(size.value)),
    username: username.value.trim(),
    mazeType: mazeTypeSelect.value
  });
  location.href = `pages/game.html?${params.toString()}`;
});

// Start a fresh game regardless of saved data
startGameBtn.addEventListener('click', () => {
  const { valid } = validateForm();
  if (!valid) {
    alert('Please fill all fields correctly before starting.');
    return;
  }
  const params = new URLSearchParams({
    floors: String(Number(floors.value)),
    size: String(Number(size.value)),
    username: username.value.trim(),
    mazeType: mazeTypeSelect.value
  });
  // index.html is located in the same folder as `pages/`, so use a relative path
  location.href = `pages/game.html?${params.toString()}`;
});

// Continue playing saved game
keepPlaying.addEventListener('click', () => {
  if (!savedMaze) {
    alert('No saved game was found.');
  modal.classList.remove('show');
    return;
  }

  // Expect savedMaze to include floors and size at minimum. Fall back to current form values.
  const floorsParam = savedMaze.floors ? String(savedMaze.floors) : String(Number(floors.value));
  const sizeParam = savedMaze.size ? String(savedMaze.size) : String(Number(size.value));
  const key = `maze3d_${username.value.trim()}`;

  const params = new URLSearchParams({
    floors: floorsParam,
    size: sizeParam,
    username: username.value.trim()
  });
  // Close modal and navigate
  modal.classList.remove('show');
  location.href = `pages/game.html?${params.toString()}`;
});

// Close modal when clicking outside or implement close button if present
const closeModalBtn = document.getElementById('closeModal');
if (closeModalBtn) {
  closeModalBtn.addEventListener('click', () => { modal.classList.remove('show'); });
}
