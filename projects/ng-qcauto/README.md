# 📘 `ng-qcauto`

**Effortless, stable test IDs for Angular apps, controlled by testers — not code.**

---

## 🌟 Overview
`ng-qcauto` is an Angular utility library that **automatically injects stable `data-qcauto` attributes** into DOM elements.  

It empowers **QA and test automation teams** by providing **deterministic, human-friendly selectors** without requiring developers to clutter templates with `data-testid`.  

### ✨ Key Features
- 🔄 **Automatic injection** — works globally, no directives or template edits.  
- 🎯 **Configurable** — track elements by **tag**, **class**, or **ID**.  
- 🔑 **Stable IDs** — deterministic hashes, with support for `data-qc-key` in lists.  
- 🧑‍🤝‍🧑 **Tester-friendly** — configuration lives in `localStorage`, editable in DevTools.  
- 🚦 **Test-only mode** — enable in dev/staging, disable in prod.  
- ⚡ **Lightweight** — observer-based, minimal performance impact.  
- 🏗 **Angular v14 and below + v15+ support** — works in both module-based and standalone bootstraps.  

---

## 📐 Angular Version Support

| Angular Version | Supported | Setup Type |
|-----------------|-----------|------------|
| **v15+**        | ✅ Yes    | Standalone bootstrap (`bootstrapApplication`) |
| **v14 and below** | ✅ Yes | Module bootstrap (`bootstrapModule(AppModule)`) |

---

## 📦 Installation

```bash
npm install ng-qcauto
```

---

## 🚀 Usage

### 🔹 Angular v14 and Below (Modules)
For module-bootstrapped apps:

```ts
// main.ts
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { initQcAutoGlobal } from 'ng-qcauto';

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .then(() => initQcAutoGlobal()) // init after Angular bootstraps
  .catch(err => console.error(err));
```

---

### 🔹 Angular v15+ (Standalone)
For standalone-bootstrapped apps:

```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { initQcAutoGlobal } from 'ng-qcauto';

bootstrapApplication(AppComponent).then(() => {
  initQcAutoGlobal(); // init after bootstrap
});
```

---

## 🧑‍💻 Tester Workflow

`ng-qcauto` reads its configuration from **localStorage**.  

### 1. Add Targets in DevTools
```js
localStorage.setItem('qcAuto-tags', JSON.stringify(['button','input','a']));
localStorage.setItem('qcAuto-classes', JSON.stringify(['btn-primary']));
localStorage.setItem('qcAuto-ids', JSON.stringify(['saveBtn']));
location.reload();
```

### 2. Example Template
```html
<button>Save</button>
<button class="btn-primary">Submit</button>
<form id="loginForm"> ... </form>

<ul>
  <li *ngFor="let user of users" [attr.data-qc-key]="user.id">
    {{ user.name }}
  </li>
</ul>
```

### 3. After Render
```html
<button data-qcauto="qc_button_1k9d2">Save</button>
<button class="btn-primary" data-qcauto="qc_button_btn-primary">Submit</button>
<form id="loginForm" data-qcauto="qc_form_loginForm"> ... </form>

<li data-qc-key="42" data-qcauto="qc_li_42">John Doe</li>
```

---

## 🔎 How IDs Are Generated
- If element has `data-qc-key` → used directly (`qc_li_42`).  
- Else if element has `id` → reused (`qc_form_loginForm`).  
- Else → deterministic hash (`qc_button_1k9d2`).  

IDs remain stable across reloads as long as structure doesn’t change.

---

## ⚙️ Configuration Reference

### LocalStorage Keys
- `qcAuto-tags` → Array of tag names (e.g. `['button','input']`)  
- `qcAuto-classes` → Array of class names (e.g. `['btn-primary']`)  
- `qcAuto-ids` → Array of element IDs (e.g. `['loginForm']`)  

### Reset Config
```js
localStorage.setItem('qcAuto-tags', JSON.stringify([]));
localStorage.setItem('qcAuto-classes', JSON.stringify([]));
localStorage.setItem('qcAuto-ids', JSON.stringify([]));
location.reload();
```

---

## 🧪 Testing Examples

### Cypress
```js
cy.get('[data-qcauto="qc_form_loginForm"]').should('be.visible');
cy.get('[data-qcauto^="qc_button"]').click();
```

Custom command:
```js
Cypress.Commands.add('qc', selector =>
  cy.get(`[data-qcauto="${selector}"]`)
);

// Usage
cy.qc('qc_form_loginForm').submit();
```

### Playwright
```ts
await page.locator('[data-qcauto="qc_li_42"]').click();
```

---

## 🛡 Test-Only Mode

To disable in production, guard init with environment flags:

```ts
import { environment } from './environments/environment';
import { initQcAutoGlobal } from 'ng-qcauto';

bootstrapApplication(AppComponent).then(() => {
  if (!environment.production) {
    initQcAutoGlobal();
  }
});
```

---

## ⚡ Performance Notes
- **Startup**: one-time DOM scan (few ms even for large apps).  
- **Runtime**: `MutationObserver` handles **only new nodes**.  
- **Optimized**:
  - Skips already tagged nodes.  
  - Filters by config before hashing.  
  - Uses `data-qc-key` for list stability.  

Overhead is negligible compared to Angular rendering.

---

## 📜 License
MIT © 2025 – Kareem Mostafa  
