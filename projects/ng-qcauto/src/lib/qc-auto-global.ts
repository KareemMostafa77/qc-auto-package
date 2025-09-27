// qc-auto-global.ts
import { hashBase36 } from './qc-hash.util';
import { domPathWithinHost } from './qc-dompath.util';

export interface QcAutoConfig {
  tags: string[];
  classes: string[];
  ids: string[];
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
  return {
    tags: getArray('qcAuto-tags'),
    classes: getArray('qcAuto-classes'),
    ids: getArray('qcAuto-ids'),
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
}

let CONFIG: QcAutoConfig = { tags: [], classes: [], ids: [] };

export function initQcAutoGlobal() {
  ensureDefaults();
  CONFIG = loadConfigFromStorage();
  console.log('QC-Auto initialized with config:', CONFIG);

  // Initial scan
  document.querySelectorAll('*').forEach(assignQcId);

  // Watch DOM changes
  const obs = new MutationObserver(muts => {
    muts.forEach(m => {
      m.addedNodes.forEach(node => {
        if (node instanceof Element) {
          if (matchesTarget(node)) assignQcId(node);
          node.querySelectorAll?.('*').forEach(assignQcId);
        }
      });
    });
  });
  obs.observe(document.body, { childList: true, subtree: true });
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

  const key = el.getAttribute('data-qc-key');
  let basis: string;

  if (key) {
    basis = `${el.tagName}|${key}`;
  } else {
    const path = domPathWithinHost(el, document.body);
    basis = `${el.tagName}|${el.id}|${Array.from(el.classList).join('.') || ''}|${path}`;
  }

  const id = el.id
    ? `qc_${el.tagName.toLowerCase()}_${el.id}`
    : `qc_${el.tagName.toLowerCase()}_${hashBase36(basis)}`;

  el.setAttribute('data-qcauto', id);
}
