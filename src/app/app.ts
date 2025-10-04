import { Component, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface User {
  id: number;
  name: string;
}

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('ng-qcauto');
  protected readonly version = signal('0.0.1');

  // Demo data
  protected readonly users = signal<User[]>([
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' }
  ]);

  protected readonly currentConfig = signal({
    tags: [] as string[],
    classes: [] as string[],
    ids: [] as string[],
    clickToCopy: false
  });

  constructor() {
    this.loadCurrentConfig();
  }

  protected loadCurrentConfig() {
    try {
      const tags = JSON.parse(localStorage.getItem('qcAuto-tags') || '[]');
      const classes = JSON.parse(localStorage.getItem('qcAuto-classes') || '[]');
      const ids = JSON.parse(localStorage.getItem('qcAuto-ids') || '[]');
      const clickToCopy = localStorage.getItem('qcAuto-clickToCopy') === 'true';
      this.currentConfig.set({ tags, classes, ids, clickToCopy });
    } catch {
      this.currentConfig.set({ tags: [], classes: [], ids: [], clickToCopy: false });
    }
  }

  protected clearConfig() {
    localStorage.setItem('qcAuto-tags', JSON.stringify([]));
    localStorage.setItem('qcAuto-classes', JSON.stringify([]));
    localStorage.setItem('qcAuto-ids', JSON.stringify([]));
    localStorage.setItem('qcAuto-clickToCopy', 'false');
    this.currentConfig.set({ tags: [], classes: [], ids: [], clickToCopy: false });
    location.reload();
  }

  // Copy methods
  protected copyBasicConfig() {
    this.copyToClipboard("localStorage.setItem('qcAuto-tags', JSON.stringify(['button', 'input', 'form'])); localStorage.setItem('qcAuto-clickToCopy', 'true'); location.reload();");
  }

  protected copyReload() {
    this.copyToClipboard('location.reload();');
  }

  protected copyTagsConfig() {
    this.copyToClipboard("localStorage.setItem('qcAuto-tags', JSON.stringify(['button', 'input', 'a']));");
  }

  protected copyClassesConfig() {
    this.copyToClipboard("localStorage.setItem('qcAuto-classes', JSON.stringify(['btn-primary']));");
  }

  protected copyIdsConfig() {
    this.copyToClipboard("localStorage.setItem('qcAuto-ids', JSON.stringify(['saveBtn', 'demoForm']));");
  }

  protected copyClickToCopyConfig() {
    this.copyToClipboard("localStorage.setItem('qcAuto-clickToCopy', 'true');");
  }

  protected copyCypressExample() {
    this.copyToClipboard('// Full ID (route-specific)\ncy.get(\'[data-qcauto="qc_home_button_saveBtn"]\').click();\n\n// Pattern matching (route-independent)\ncy.get(\'[data-qcauto$="button_saveBtn"]\').click();\n\n// All buttons on home route\ncy.get(\'[data-qcauto^="qc_home_button"]\').should(\'exist\');');
  }

  protected copyPlaywrightExample() {
    this.copyToClipboard('// Full ID\nawait page.locator(\'[data-qcauto="qc_home_form_demoForm"]\').fill(\'test\');\n\n// Route-independent\nawait page.locator(\'[data-qcauto*="form_demoForm"]\').fill(\'test\');');
  }

  protected copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      // Simple feedback - in real app you might use a toast
      console.log('Copied to clipboard:', text);
    }).catch(err => {
      console.error('Failed to copy:', err);
    });
  }
}
