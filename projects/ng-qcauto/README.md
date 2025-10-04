# 📘 `ng-qcauto` v2.0

**Effortless, stable test IDs for Angular apps, controlled by testers — not code.**

---

## 🌟 Overview
`ng-qcauto` is an Angular utility library that **automatically injects stable `data-qcauto` attributes** into DOM elements.  

It empowers **QA and test automation teams** by providing **deterministic, human-friendly selectors** without requiring developers to clutter templates with `data-testid`.

```
        ┌─────────────────────────────┐
        │ qc_dashboard_button_xyz [📋] │  ← Overlay appears on hover
        └─────────────────────────────┘
                ┌──────────┐
                │  Submit  │  ← Your button (with dashed outline)
                └──────────┘
```

**Features**:
- 🎯 **Hover to Reveal**: IDs only show when you hover over elements
- 📋 **Copy Button**: Click to copy the ID to clipboard
- ✅ **Toast Notification**: Confirms successful copy
- 🎛️ **Toggle On/Off**: Control visibility from the config modal
- 🎨 **Non-intrusive**: Overlay doesn't disrupt your UI layout
- 🔍 **Visual Outline**: Dashed green border helps identify tracked elementsIDs for Angular apps, controlled by testers — not code.**

-### 3. After Render
```html
<!-- On /dashboard route -->
<button data-qcauto="qc_dashboard_button_1k9d2">Save</button>
<button class="btn-primary" data-qcauto="qc_dashboard_button_btn-primary">Submit</button>
<form id="loginForm" data-qcauto="qc_dashboard_form_loginForm"> ... </form>

<!-- With data-qc-key -->
<li data-qc-key="42" data-qcauto="qc_dashboard_li_42">John Doe</li>
```

**Note**: IDs now include the route path (e.g., `qc_dashboard_*`, `qc_users_profile_*`)

---

## 🔎 How IDs Are Generated (v2.0)
IDs follow this pattern: `qc_{route}_{tag}_{identifier}`

1. **Route Path**: Current URL path (e.g., `/users/profile` → `users_profile`)
2. **Tag**: Element's tag name (e.g., `button`, `input`)
3. **Identifier**:
   - If element has `data-qc-key` → used directly (`qc_home_li_42`)
   - Else if element has `id` → reused (`qc_dashboard_form_loginForm`)
   - Else → deterministic hash (`qc_users_button_1k9d2`)

IDs remain stable across reloads as long as route and structure don't change.

---

## 👁️ Visual ID Indicators (NEW!)

When enabled, you'll see **green badges** above tracked elements showing their `data-qcauto` value:

```
┌─────────────────────────────┐
│ qc_dashboard_button_xyz [📋] │  ← Visual indicator with copy button
└─────────────────────────────┘
        ┌──────────┐
        │  Submit  │  ← Your button
        └──────────┘
```

**Features**:
- 📋 **Copy Button**: Click to copy the ID to clipboard
- ✅ **Toast Notification**: Confirms successful copy
- �️ **Toggle On/Off**: Control visibility from the config modal
- 🎨 **Non-intrusive**: Styled to not interfere with your UI

---

## ⌨️ Keyboard Shortcuts

- **`Ctrl+Q+C`** (or `Cmd+Q+C` on Mac): Open configuration modaliew
`ng-qcauto` is an Angular utility library that **automatically injects stable `data-qcauto` attributes** into DOM elements.  

It empowers **QA and test automation teams** by providing **deterministic, human-friendly selectors** without requiring developers to clutter templates with `data-testid`.  

### ✨ Key Features
- 🔄 **Automatic injection** — works globally, no directives or template edits.  
- 🎯 **Configurable** — track elements by **tag**, **class**, or **ID**.  
- 🔑 **Stable IDs** — deterministic hashes, with support for `data-qc-key` in lists.  
- 🛣️ **Route-based IDs** — IDs now include current route path for better stability.  
- ⌨️ **Visual Configuration Modal** — Press `Ctrl+Q+C` to open config modal (no DevTools needed!).  
- 👁️ **Visual ID Indicators** — See IDs directly in the UI with copy functionality.  
- 🧑‍🤝‍🧑 **Tester-friendly** — configuration lives in `localStorage`, editable via modal.  
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

### 🎯 Method 1: Visual Config Modal (NEW in v2.0!)
1. Press **`Ctrl+Q+C`** anywhere in the app
2. The configuration modal will appear
3. Enter your targets:
   - **Tags**: `button, input, a`
   - **Classes**: `btn-primary, form-control`
   - **IDs**: `saveBtn, loginForm`
4. Toggle **"Show Visual ID Indicators"** to see IDs in the UI
5. Click **"Save & Reload"**

### 🛠️ Method 2: Add Targets in DevTools (Classic)
```js
localStorage.setItem('qcAuto-tags', JSON.stringify(['button','input','a']));
localStorage.setItem('qcAuto-classes', JSON.stringify(['btn-primary']));
localStorage.setItem('qcAuto-ids', JSON.stringify(['saveBtn']));
localStorage.setItem('qcAuto-showVisualIds', 'true'); // NEW: Show visual indicators
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
- `qcAuto-showVisualIds` → Boolean string (`'true'` or `'false'`) for visual indicators (NEW!)

### Reset Config
```js
localStorage.setItem('qcAuto-tags', JSON.stringify([]));
localStorage.setItem('qcAuto-classes', JSON.stringify([]));
localStorage.setItem('qcAuto-ids', JSON.stringify([]));
localStorage.setItem('qcAuto-showVisualIds', 'false');
location.reload();
```

---

## 🧪 Testing Examples

### Cypress
```js
// Using full ID with route
cy.get('[data-qcauto="qc_dashboard_form_loginForm"]').should('be.visible');

// Using partial match for route independence
cy.get('[data-qcauto$="form_loginForm"]').click();

// Find all buttons on a specific route
cy.get('[data-qcauto^="qc_dashboard_button"]').should('have.length', 3);
```

Custom command:
```js
Cypress.Commands.add('qc', (selector, matchType = 'exact') => {
  if (matchType === 'exact') {
    return cy.get(`[data-qcauto="${selector}"]`);
  } else if (matchType === 'ends') {
    return cy.get(`[data-qcauto$="${selector}"]`);
  } else if (matchType === 'contains') {
    return cy.get(`[data-qcauto*="${selector}"]`);
  }
});

// Usage
cy.qc('qc_dashboard_form_loginForm').submit();
cy.qc('form_loginForm', 'ends').submit(); // Route-independent
```

### Playwright
```ts
// Full ID
await page.locator('[data-qcauto="qc_users_li_42"]').click();

// Partial match (route-independent)
await page.locator('[data-qcauto$="li_42"]').click();

// Find by route prefix
const dashboardButtons = await page.locator('[data-qcauto^="qc_dashboard_"]').all();
```

### Selenium
```java
// Java example
WebElement loginForm = driver.findElement(
    By.cssSelector("[data-qcauto='qc_home_form_loginForm']")
);

// Route-independent
WebElement loginForm = driver.findElement(
    By.cssSelector("[data-qcauto$='form_loginForm']")
);
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

## � Migration from v1.x to v2.0

### Breaking Changes
**ID Format Change**: IDs now include route path prefix.

**Before (v1.x)**:
```html
<button data-qcauto="qc_button_1k9d2">Submit</button>
```

**After (v2.0)**:
```html
<button data-qcauto="qc_dashboard_button_1k9d2">Submit</button>
```

### Migration Strategy

#### Option 1: Update Test Selectors (Recommended)
Update your test selectors to use the new format:
```js
// Old
cy.get('[data-qcauto="qc_button_xyz"]')

// New
cy.get('[data-qcauto="qc_dashboard_button_xyz"]')
```

#### Option 2: Use Partial Matching (Quick Fix)
Use suffix matching to ignore route prefix:
```js
// Works with both v1.x and v2.0
cy.get('[data-qcauto$="button_xyz"]')
```

### New Features to Adopt
1. **Visual Config Modal**: Use `Ctrl+Q+C` instead of DevTools
2. **Visual ID Indicators**: Enable to easily discover IDs
3. **Route-based Stability**: IDs are now more stable per route

---

## 🐛 Troubleshooting

### Modal doesn't open with Ctrl+Q+C
- Make sure the page has loaded completely
- Check browser console for errors
- Try `Cmd+Q+C` on Mac

### Visual indicators not showing
- Open config modal (`Ctrl+Q+C`)
- Check "Show Visual ID Indicators"
- Click "Save & Reload"

### IDs changing unexpectedly
- IDs now include route path
- Ensure you're on the same route when testing
- Use `data-qc-key` for dynamic list items

### Elements not getting IDs
- Check your configuration (tags, classes, ids)
- Open config modal to verify settings
- Check browser console for initialization logs

---

## �📜 License
MIT © 2025 – Kareem Mostafa  

