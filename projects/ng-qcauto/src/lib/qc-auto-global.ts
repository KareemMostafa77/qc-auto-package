// qc-auto-global.ts
import { hashBase36 } from './qc-hash.util';
import { domPathWithinHost } from './qc-dompath.util';

export interface QcAutoConfig {
  tags: string[];
  classes: string[];
  ids: string[];
  clickToCopy?: boolean;
}

function loadConfigFromStorage(): QcAutoConfig {
  const getArray = (key: string): string[] => {
    const raw = localStorage.getItem(key);
    try {
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };
  const clickToCopy = localStorage.getItem('qcAuto-clickToCopy');
  return {
    tags: getArray('qcAuto-tags'),
    classes: getArray('qcAuto-classes'),
    ids: getArray('qcAuto-ids'),
    clickToCopy: clickToCopy === 'true',
  };
}

function ensureDefaults() {
  if (localStorage.getItem('qcAuto-tags') === null) {
    localStorage.setItem('qcAuto-tags', JSON.stringify([]));
  }
  if (localStorage.getItem('qcAuto-classes') === null) {
    localStorage.setItem('qcAuto-classes', JSON.stringify([]));
  }
  if (localStorage.getItem('qcAuto-ids') === null) {
    localStorage.setItem('qcAuto-ids', JSON.stringify([]));
  }
  if (localStorage.getItem('qcAuto-clickToCopy') === null) {
    localStorage.setItem('qcAuto-clickToCopy', 'false');
  }
}

let CONFIG: QcAutoConfig = { tags: [], classes: [], ids: [], clickToCopy: false };
let mutationObserver: MutationObserver | null = null;

function getCurrentRoutePath(): string {
  const path = window.location.pathname;
  // Clean up the path: remove leading/trailing slashes, replace slashes with underscores
  return path
    .replace(/^\/+|\/+$/g, '') // Remove leading/trailing slashes
    .replace(/\//g, '_') // Replace slashes with underscores
    .replace(/[^a-zA-Z0-9_-]/g, '') || 'home'; // Remove special chars, default to 'home'
}

export function initQcAutoGlobal() {
  ensureDefaults();
  CONFIG = loadConfigFromStorage();
  console.log('QC-Auto initialized with config:', CONFIG);

  // Inject styles for modal and toast
  injectModalStyles();

  // Setup keyboard shortcut listener (Ctrl+Q+C)
  setupKeyboardShortcut();

  // Setup click-to-copy if enabled
  if (CONFIG.clickToCopy) {
    setupClickToCopy();
  }

  // Initial scan
  document.querySelectorAll('*').forEach(el => {
    assignQcId(el);
  });

  // Watch DOM changes
  mutationObserver = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node instanceof Element) {
          if (matchesTarget(node)) {
            assignQcId(node);
          }
          node.querySelectorAll?.('*').forEach(el => {
            assignQcId(el);
          });
        }
      });
    });
  });
  mutationObserver.observe(document.body, { childList: true, subtree: true });
}

function matchesTarget(el: Element): boolean {
  const tag = el.tagName.toLowerCase();
  if (CONFIG.tags?.includes(tag)) return true;
  if (CONFIG.classes?.some(cls => el.classList.contains(cls))) return true;
  if (CONFIG.ids?.includes(el.id)) return true;
  return false;
}

function assignQcId(el: Element) {
  if (el.hasAttribute('data-qcauto')) return;
  if (!matchesTarget(el)) return;

  const routePath = getCurrentRoutePath();
  const key = el.getAttribute('data-qc-key');
  let basis: string;

  if (key) {
    basis = `${routePath}|${el.tagName}|${key}`;
  } else {
    const path = domPathWithinHost(el, document.body);
    basis = `${routePath}|${el.tagName}|${el.id}|${Array.from(el.classList).join('.') || ''}|${path}`;
  }

  const id = el.id
    ? `qc_${routePath}_${el.tagName.toLowerCase()}_${el.id}`
    : `qc_${routePath}_${el.tagName.toLowerCase()}_${hashBase36(basis)}`;

  el.setAttribute('data-qcauto', id);

  // Add cursor pointer if click-to-copy is enabled
  if (CONFIG.clickToCopy) {
    (el as HTMLElement).style.cursor = 'pointer';
  }
}

// Click-to-Copy System
function setupClickToCopy() {
  document.body.addEventListener('contextmenu', (e: MouseEvent) => {
    const target = e.target as Element;

    // Don't copy if clicking on modal elements
    if (target.closest('.qc-config-modal')) return;

    // Find the closest element with data-qcauto attribute
    const qcElement = target.closest('[data-qcauto]');
    if (qcElement) {
      const qcId = qcElement.getAttribute('data-qcauto');
      if (qcId) {
        e.preventDefault(); // Prevent context menu from showing
        e.stopPropagation();
        copyToClipboard(qcId);
      }
    }
  }, true); // Use capture phase to catch events early
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    console.log('Copied to clipboard:', text);
    showToast(`✓ ${text}`);
  }).catch(err => {
    console.error('Failed to copy:', err);
    // Fallback method
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand('copy');
    document.body.removeChild(textarea);
    showToast(`✓ ${text}`);
  });
}

function showToast(message: string) {
  const toast = document.createElement('div');
  toast.className = 'qc-toast';
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// Keyboard Shortcut System (Ctrl+Q+C)
let keySequence: string[] = [];
let keySequenceTimeout: any = null;

function setupKeyboardShortcut() {
  document.addEventListener('keydown', (e: KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      keySequence.push(e.key.toLowerCase());

      // Clear timeout if exists
      if (keySequenceTimeout) {
        clearTimeout(keySequenceTimeout);
      }

      // Reset sequence after 1 second
      keySequenceTimeout = setTimeout(() => {
        keySequence = [];
      }, 1000);

      // Check if sequence matches Ctrl+Q+C
      const sequenceStr = keySequence.join('');
      if (sequenceStr.includes('q') && sequenceStr.includes('c')) {
        e.preventDefault();
        openConfigModal();
        keySequence = [];
      }
    }
  });
}

// Configuration Modal
function openConfigModal() {
  // Remove existing modal if any
  const existing = document.querySelector('.qc-config-modal');
  if (existing) {
    existing.remove();
    return;
  }

  const modal = document.createElement('div');
  modal.className = 'qc-config-modal';

  const currentConfig = loadConfigFromStorage();

  modal.innerHTML = `
    <div class="qc-modal-content">
      <div class="qc-modal-header">
        <h2>QC Auto Configuration</h2>
        <button class="qc-modal-close">&times;</button>
      </div>
      <div class="qc-modal-body">
        <div class="qc-form-group">
          <label for="qc-tags">Tags (comma-separated):</label>
          <input
            type="text"
            id="qc-tags"
            placeholder="e.g., button, input, a"
            value="${currentConfig.tags.join(', ')}"
          />
        </div>
        <div class="qc-form-group">
          <label for="qc-classes">Classes (comma-separated):</label>
          <input
            type="text"
            id="qc-classes"
            placeholder="e.g., btn, form-control"
            value="${currentConfig.classes.join(', ')}"
          />
        </div>
        <div class="qc-form-group">
          <label for="qc-ids">IDs (comma-separated):</label>
          <input
            type="text"
            id="qc-ids"
            placeholder="e.g., submit-btn, user-form"
            value="${currentConfig.ids.join(', ')}"
          />
        </div>
        <div class="qc-form-group qc-checkbox-group">
          <label>
            <input
              type="checkbox"
              id="qc-click-to-copy"
              ${currentConfig.clickToCopy ? 'checked' : ''}
            />
            Enable Click-to-Copy QC IDs
          </label>
        </div>
      </div>
      <div class="qc-modal-footer">
        <button class="qc-btn qc-btn-primary" id="qc-reload-btn">Save & Reload</button>
        <button class="qc-btn qc-btn-secondary" id="qc-cancel-btn">Cancel</button>
      </div>
    </div>
  `;

  document.body.appendChild(modal);
  injectModalStyles();

  // Event listeners
  modal.querySelector('.qc-modal-close')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#qc-cancel-btn')?.addEventListener('click', () => modal.remove());
  modal.querySelector('#qc-reload-btn')?.addEventListener('click', () => {
    saveConfigAndReload(modal);
  });

  // Close on outside click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Focus first input
  setTimeout(() => {
    (modal.querySelector('#qc-tags') as HTMLInputElement)?.focus();
  }, 100);
}

function saveConfigAndReload(modal: HTMLElement) {
  const tagsInput = (modal.querySelector('#qc-tags') as HTMLInputElement).value;
  const classesInput = (modal.querySelector('#qc-classes') as HTMLInputElement).value;
  const idsInput = (modal.querySelector('#qc-ids') as HTMLInputElement).value;
  const clickToCopy = (modal.querySelector('#qc-click-to-copy') as HTMLInputElement).checked;

  // Parse and save
  const tags = tagsInput.split(',').map(s => s.trim()).filter(s => s);
  const classes = classesInput.split(',').map(s => s.trim()).filter(s => s);
  const ids = idsInput.split(',').map(s => s.trim()).filter(s => s);

  localStorage.setItem('qcAuto-tags', JSON.stringify(tags));
  localStorage.setItem('qcAuto-classes', JSON.stringify(classes));
  localStorage.setItem('qcAuto-ids', JSON.stringify(ids));
  localStorage.setItem('qcAuto-clickToCopy', String(clickToCopy));

  console.log('Configuration saved:', { tags, classes, ids, clickToCopy });

  // Reload the page
  window.location.reload();
}

function injectModalStyles() {
  if (document.getElementById('qc-auto-styles')) return;

  const style = document.createElement('style');
  style.id = 'qc-auto-styles';
  style.textContent = `
    .qc-config-modal {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 999999;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    }

    .qc-modal-content {
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
      width: 90%;
      max-width: 500px;
      max-height: 90vh;
      overflow-y: auto;
    }

    .qc-modal-header {
      padding: 20px;
      border-bottom: 1px solid #e0e0e0;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .qc-modal-header h2 {
      margin: 0;
      font-size: 20px;
      color: #333;
    }

    .qc-modal-close {
      background: none;
      border: none;
      font-size: 28px;
      cursor: pointer;
      color: #999;
      padding: 0;
      width: 30px;
      height: 30px;
      display: flex;
      align-items: center;
      justify-content: center;
      line-height: 1;
    }

    .qc-modal-close:hover {
      color: #333;
    }

    .qc-modal-body {
      padding: 20px;
    }

    .qc-form-group {
      margin-bottom: 20px;
    }

    .qc-form-group label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      font-size: 14px;
    }

    .qc-form-group input[type="text"] {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 14px;
      box-sizing: border-box;
    }

    .qc-form-group input[type="text"]:focus {
      outline: none;
      border-color: #4CAF50;
    }

    .qc-checkbox-group label {
      display: flex;
      align-items: center;
      cursor: pointer;
      font-weight: normal;
    }

    .qc-checkbox-group input[type="checkbox"] {
      margin-right: 8px;
      width: 18px;
      height: 18px;
      cursor: pointer;
    }

    .qc-modal-footer {
      padding: 20px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      gap: 10px;
      justify-content: flex-end;
    }

    .qc-btn {
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: 600;
      transition: all 0.2s;
    }

    .qc-btn-primary {
      background: #4CAF50;
      color: white;
    }

    .qc-btn-primary:hover {
      background: #45a049;
    }

    .qc-btn-secondary {
      background: #f0f0f0;
      color: #333;
    }

    .qc-btn-secondary:hover {
      background: #e0e0e0;
    }

    /* Toast notification */
    .qc-toast {
      position: fixed;
      bottom: 20px;
      right: 20px;
      background: #323232;
      color: white;
      padding: 12px 20px;
      border-radius: 4px;
      z-index: 1000000;
      animation: qc-toast-in 0.3s ease-out;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      font-size: 14px;
    }

    @keyframes qc-toast-in {
      from {
        transform: translateY(100px);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;
  document.head.appendChild(style);
}
