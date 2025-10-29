# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-10-05

### 🎉 Major Changes

#### Added
- **Route-based ID Classification**: IDs now include the current route path as a prefix for improved stability and organization
  - Format: `qc_{route}_{tag}_{identifier}`
  - Example: `qc_dashboard_button_save` instead of `qc_button_save`
  - Routes like `/users/profile` become `users_profile` in the ID
  
- **Visual Configuration Modal**: New keyboard shortcut `Ctrl+Q` (or `Cmd+Q` on Mac) opens an interactive configuration modal
  - No more need to use DevTools console
  - User-friendly interface with text inputs for tags, classes, and IDs
  - Toggle for visual ID indicators
  - Save & Reload button for instant application
  
- **Right-Click to Copy**: Simple click-to-copy mode for quick ID extraction
  - Enable "Click-to-Copy QC IDs" in configuration modal
  - Right-click any tracked element to copy its QC ID to clipboard
  - Toast notification shows the copied ID: `✓ qc_dashboard_button_123`
  - Pointer cursor appears on tracked elements when enabled
  - No interference with left-click automation workflows
  - Prevents default context menu when copying

- **Enhanced Configuration**: New localStorage key `qcAuto-clickToCopy` to control right-click copy mode

#### Changed
- **ID Generation Algorithm**: Now includes route path in the hash calculation for better stability
  - IDs are now route-specific, preventing collisions across different pages
  - More deterministic behavior when same component appears on different routes

#### Breaking Changes
- **ID Format**: All IDs now include route prefix
  - Old format: `qc_button_abc123`
  - New format: `qc_home_button_abc123`
  - Migration: Update test selectors or use suffix matching (`[data-qcauto$="button_abc123"]`)

### Technical Details

#### New Functions
- `getCurrentRoutePath()`: Extracts and sanitizes current route path
- `openConfigModal()`: Renders and manages configuration modal
- `saveConfigAndReload()`: Persists configuration and reloads page
- `setupClickToCopy()`: Sets up right-click event listener for copying QC IDs
- `copyToClipboard()`: Handles ID copying with fallback support
- `showToast()`: Displays temporary notification messages
- `setupKeyboardShortcut()`: Listens for Ctrl+Q key sequence
- `injectModalStyles()`: Injects CSS for modal and toast notifications

#### Styling
- Added comprehensive CSS for modal interface
- Added toast notification animations with slide-in effect
- All styles are scoped and non-intrusive
- Minimal visual footprint (only modal and toast)

---

## [1.0.6] - 2025-10-04

### Fixed
- Minor bug fixes and improvements

---

## [1.0.0] - 2025-09-01

### Added
- Initial release
- Automatic injection of `data-qcauto` attributes
- Configuration via localStorage (tags, classes, ids)
- Support for `data-qc-key` attribute for manual ID specification
- MutationObserver for dynamic content
- Hash-based deterministic ID generation
- Support for Angular v14+ and v15+ (standalone)

---

## Legend

- 🎉 Major feature
- ✨ Enhancement
- 🐛 Bug fix
- 🔧 Configuration
- 📝 Documentation
- ⚠️ Breaking change
- 🗑️ Deprecated
