# 📘 `ng-qcauto` v2.0

**Effortless, stable test IDs for Angular apps, controlled by testers — not code.**

---
## 🔎 How IDs Are Generated (v2.0)

IDs follow this pattern: **`qc_{route}_{tag}_{identifier}`**

**Examples**:
- `/dashboard` route → `qc_dashboard_button_abc123`
- `/users/profile` route → `qc_users_profile_input_xyz789`
- Root `/` route → `qc_home_form_loginForm`

**Identifier Logic**:
1. If element has `data-qc-key` → used directly (`qc_dashboard_li_42`)
2. Else if element has `id` → reused (`qc_dashboard_form_loginForm`)  
3. Else → deterministic hash (`qc_dashboard_button_1k9d2`)

IDs remain stable across reloads as long as **route** and **structure** don't change. Overview
`ng-qcauto` is an Angular utility library that **automatically injects stable `data-qcauto` attributes** into DOM elements.  

It empowers **QA and test automation teams** by providing **deterministic, human-friendly selectors** without requiring developers to clutter templates with `data-testid`.  

### ✨ Key Features
- 🔄 **Automatic injection** — works globally, no directives or template edits.  
- 🎯 **Configurable** — track elements by **tag**, **class**, or **ID**.  
- 🔑 **Route-based stable IDs** — IDs include route path for better organization.  
- ⌨️ **Ctrl+Q+C Modal** — Easy configuration interface without DevTools.  
- 🖱️ **Right-click to Copy** — Quickly copy QC IDs during testing.  
- 🧑‍🤝‍🧑 **Tester-friendly** — configuration lives in `localStorage`, manageable via modal.  
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

### 1️⃣ Open Configuration Modal
Press **Ctrl+Q+C** (or **Cmd+Q+C** on Mac) anywhere in the app to open the configuration modal:

```
┌─────────────────────────────────────┐
│  QC Auto Configuration           ✕  │
├─────────────────────────────────────┤
│  Tags: button, input, a             │
│  Classes: btn-primary               │
│  IDs: saveBtn                       │
│  ☑ Enable Click-to-Copy QC IDs     │
│                                     │
│         [Save & Reload] [Cancel]    │
└─────────────────────────────────────┘
```

**OR** use DevTools Console:
```js
localStorage.setItem('qcAuto-tags', JSON.stringify(['button','input','a']));
localStorage.setItem('qcAuto-classes', JSON.stringify(['btn-primary']));
localStorage.setItem('qcAuto-ids', JSON.stringify(['saveBtn']));
localStorage.setItem('qcAuto-clickToCopy', 'true');
location.reload();
```

### 2️⃣ Example Template
```html
<!-- On /dashboard route -->
<button>Save</button>
<button class="btn-primary">Submit</button>
<form id="loginForm"> ... </form>

<ul>
  <li *ngFor="let user of users" [attr.data-qc-key]="user.id">
    {{ user.name }}
  </li>
</ul>
```

### 3️⃣ After Render
```html
<!-- On /dashboard route -->
<button data-qcauto="qc_dashboard_button_1k9d2">Save</button>
<button class="btn-primary" data-qcauto="qc_dashboard_button_btn-primary">Submit</button>
<form id="loginForm" data-qcauto="qc_dashboard_form_loginForm"> ... </form>

<li data-qc-key="42" data-qcauto="qc_dashboard_li_42">John Doe</li>
```

### 4️⃣ Copy QC IDs (NEW!)
When **Click-to-Copy** is enabled:
1. Elements with QC IDs show a **pointer cursor** 👆
2. **Right-click** any element to copy its QC ID
3. A toast notification appears: `✓ qc_dashboard_button_1k9d2`
4. Paste anywhere: `Ctrl+V`

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
- `qcAuto-clickToCopy` → Boolean string (`'true'` or `'false'`) for right-click copy mode

### ⌨️ Keyboard Shortcut
- **Ctrl+Q+C** (Windows/Linux) or **Cmd+Q+C** (Mac) → Opens configuration modal
- Press again to close modal

### Reset Config
```js
localStorage.setItem('qcAuto-tags', JSON.stringify([]));
localStorage.setItem('qcAuto-classes', JSON.stringify([]));
localStorage.setItem('qcAuto-ids', JSON.stringify([]));
localStorage.setItem('qcAuto-clickToCopy', 'false');
location.reload();
```

---

## 🧪 Testing Examples

### Cypress
```js
// Full ID
cy.get('[data-qcauto="qc_dashboard_form_loginForm"]').should('be.visible');

// Pattern matching (all buttons on dashboard)
cy.get('[data-qcauto^="qc_dashboard_button"]').click();

// By route prefix
cy.get('[data-qcauto^="qc_users_profile"]').should('exist');
```

Custom command:
```js
Cypress.Commands.add('qc', selector =>
  cy.get(`[data-qcauto="${selector}"]`)
);

// Usage
cy.qc('qc_dashboard_form_loginForm').submit();
cy.qc('qc_users_profile_button_save').click();
```

### Playwright
```ts
// Direct selector
await page.locator('[data-qcauto="qc_dashboard_li_42"]').click();

// Route-based pattern
await page.locator('[data-qcauto^="qc_checkout"]').count();
```

### Selenium
```java
// Java
WebElement element = driver.findElement(
  By.cssSelector("[data-qcauto='qc_dashboard_button_submit']"));
element.click();
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
