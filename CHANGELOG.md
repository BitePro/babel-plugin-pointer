# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2025-11-16

### Added
- 🎉 Multi-framework support: separate entry points for Vue and React
  - `babel-plugin-pointer/vue` for Vue 3 projects
  - `babel-plugin-pointer/react` for React projects
- ✨ Intelligent CSS detection using `window.getComputedStyle()`
- 🔍 Runtime cursor checking to respect CSS-defined cursor values
- 📦 Modular architecture with shared utilities
- 📚 Comprehensive documentation in English and Chinese
- 🧪 Extended test scenarios for CSS cursor compatibility

### Changed
- 📦 Package renamed from `babel-plugin-auto-cursor-pointer` to `babel-plugin-pointer`
- 🏗️ Refactored codebase into separate Vue and React implementations
- 📝 Improved README with better examples and usage instructions
- ⚡ Better performance with optimized AST transformations

### Fixed
- 🐛 Plugin now correctly detects cursor styles defined in CSS files
- 🐛 Plugin now respects cursor styles defined in CSS classes
- 🐛 No longer overwrites user-defined cursor values from any source

## [1.0.0] - 2025-11-15

### Added
- Initial release
- Basic support for Vue 3 `@click` events
- Basic support for React `onClick` events
- Support for native `addEventListener('click', ...)`
- Inline style cursor detection

