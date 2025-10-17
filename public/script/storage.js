import Maze3d from "../generation/maze3d.js";

function storageKeyFor(username) {
  return username ? `maze3d_${username}` : null;
}

export function loadSavedMaze(username) {
  const key = storageKeyFor(username);
  if (!key) return null;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.maze && typeof parsed.size !== 'undefined' && typeof parsed.floors !== 'undefined') {
      return Maze3d.fromJSON(parsed);
    }
  } catch (e) {
    console.warn('Could not load saved maze from localStorage:', e);
  }
  return null;
}

export function saveMaze(username, maze) {
  const key = storageKeyFor(username);
  if (!key) return;
  try {
    localStorage.setItem(key, JSON.stringify(maze));
  } catch (e) {
    console.warn('Could not save maze to localStorage:', e);
  }
}

export function clearSavedMaze(username) {
  const key = storageKeyFor(username);
  if (!key) return;
  try {
    localStorage.removeItem(key);
  } catch (e) {
    console.warn('Could not remove saved game from localStorage:', e);
  }
  try {
    const namePart = username || '';
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (!k) continue;
      if (k.startsWith('maze3d_') && namePart && k.includes(namePart)) {
        try { localStorage.removeItem(k); } catch (e) { /* ignore individual failures */ }
      }
    }
  } catch (e) {
    // ignore iteration errors
  }
}
