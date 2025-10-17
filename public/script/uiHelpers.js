export function highlightButton(btnId, on) {
  const el = document.getElementById(btnId);
  if (!el) return;
  if (on) {
    if (el.dataset._prevOutline === undefined) el.dataset._prevOutline = el.style.outline || '';
    el.style.outline = '3px solid #ffd54f';
    el.style.transition = 'outline 120ms';
  } else {
    el.style.outline = el.dataset._prevOutline || '';
    delete el.dataset._prevOutline;
  }
}

export function disableControls() {
  document.querySelectorAll('button, input, select, textarea').forEach(el => {
    el.disabled = true;
  });
}

export function enableControls() {
  document.querySelectorAll('button, input, select, textarea').forEach(el => {
    el.disabled = false;
  });
}

export function showHalfPulse(cell, dir) {
  return new Promise((resolve) => {
    if (!cell) return resolve();
    try { if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(20); } catch (e) {}
    if (getComputedStyle(cell).position === 'static') cell.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.className = `pulse-overlay pulse-half ${dir === 'up' ? 'pulse-up' : 'pulse-down'}`;
    overlay.textContent = dir === 'up' ? '\u25B2' : '\u25BC';
    cell.appendChild(overlay);

    const timeout = setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    }, 250);

    overlay._cleanup = () => {
      clearTimeout(timeout);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    };
  });
}

export function showFullPulse(cell, dir) {
  return new Promise((resolve) => {
    try { if (navigator && typeof navigator.vibrate === 'function') navigator.vibrate(20); } catch (e) {}
    if (!cell) return resolve();
    if (getComputedStyle(cell).position === 'static') cell.style.position = 'relative';
    const overlay = document.createElement('div');
    overlay.className = `pulse-overlay pulse-full ${dir === 'up' ? 'pulse-up' : 'pulse-down'}`;
    overlay.textContent = dir === 'up' ? '\u25B2' : '\u25BC';
    cell.appendChild(overlay);

    const timeout = setTimeout(() => {
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    }, 420);

    overlay._cleanup = () => {
      clearTimeout(timeout);
      if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
      resolve();
    };
  });
}

export function removeFloorChooser() {
  const existing = document.getElementById('floor-chooser-overlay');
  if (existing && existing.parentNode) existing.parentNode.removeChild(existing);
}
