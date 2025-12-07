# Contributing to ShadowMaster

Thank you for your interest in contributing to ShadowMaster! This document provides guidelines and instructions for contributing.

## Code of Conduct

By participating in this project, you agree to maintain a respectful and inclusive environment for all contributors.

## How Can I Contribute?

### Reporting Bugs

If you find a bug, please open an issue on GitHub with:

- **Clear title and description** of the issue
- **Steps to reproduce** the problem
- **Expected behavior** vs **actual behavior**
- **Environment details** (OS, Go version, Node.js version, etc.)
- **Relevant logs or error messages**

### Suggesting Enhancements

Enhancement suggestions are welcome! Please open an issue with:

- **Clear description** of the proposed enhancement
- **Use case** or problem it would solve
- **Examples** of how it would be used (if applicable)

### Pull Requests

1. **Fork the repository** and create a branch from `main`
2. **Make your changes** following the coding standards below
3. **Write or update tests** as needed
4. **Update documentation** if you've changed functionality
5. **Ensure all tests pass** before submitting
6. **Submit a pull request** with a clear description of changes

## Development Setup

### Prerequisites

- Go 1.24.3 or later
- Node.js 18+ and npm
- Make (for macOS/Linux/WSL) or PowerShell (for Windows)

See the [Setup Guide](docs/getting-started/SETUP.md) for detailed instructions.

### Quick Start

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/ShadowMaster.git
cd ShadowMaster

# Install dependencies
make init
# or on Windows: .\scripts\setup.ps1

# Run tests
make test

# Run in development mode
make run-dev
```

## Coding Standards

### Go Code

- Follow standard Go formatting (`gofmt` or `goimports`)
- Run `make lint` before committing (formats code and runs `go vet`)
- Write tests for new functionality
- Follow existing code style and patterns
- Keep functions focused and reasonably sized
- Add comments for exported functions and types

### TypeScript/React Code

- Follow existing TypeScript patterns and type definitions
- Use functional components with hooks
- Follow React best practices (keys, proper dependencies, etc.)
- Ensure TypeScript compiles without errors
- Format code consistently (project uses Prettier if configured)

### Commit Messages

- Use clear, descriptive commit messages
- Start with a verb (Add, Fix, Update, Refactor, etc.)
- Reference issue numbers when applicable: `Fix character creation bug (#123)`

### Testing

- Write tests for new features and bug fixes
- Ensure existing tests continue to pass
- Aim for reasonable test coverage of new code

```bash
# Run Go tests
make test
# or
go test ./...

# Run tests with coverage
make test-coverage
```

## Project Structure

- `cmd/` - Application entry points (server, CLI)
- `internal/` - Private application code (not importable by other projects)
  - `domain/` - Domain models
  - `repository/` - Data access layer interfaces and implementations
  - `service/` - Business logic
  - `api/` - HTTP handlers
- `pkg/` - Public libraries (importable by other projects)
  - `shadowrun/` - Shadowrun game mechanics
  - `storage/` - Storage utilities
- `web/ui/` - React frontend application
- `docs/` - Project documentation

## Documentation

- Update relevant documentation when adding features
- Add examples for new APIs or features
- Keep the README.md up to date
- Document breaking changes clearly

## Questions?

- Open an issue for discussion
- Check existing issues and pull requests
- Review the [Documentation](docs/README.md) for more details

## License

By contributing, you agree that your contributions will be licensed under the GNU General Public License v3.0, the same license as the project.

