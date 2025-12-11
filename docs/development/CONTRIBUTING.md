# Contributing to Storentia

## Getting Started

1. Fork the repository
2. Clone your fork
3. Install dependencies: `npm install`
4. Create a branch: `git checkout -b feature/your-feature`

## Development

### Testing the CLI Locally

```bash
# Link package locally
npm link

# Test CLI
create-storentia test-store

# Unlink when done
npm unlink -g create-storentia
```

### Testing with Tarball

```bash
npm pack
npm install -g ./create-storentia-*.tgz
create-storentia test-store
```

## Pull Request Process

1. Update documentation if needed
2. Test your changes locally
3. Submit PR with clear description
4. Wait for review

## Code Style

- Use consistent formatting
- Add comments for complex logic
- Follow existing patterns

## Reporting Issues

- Use GitHub Issues
- Include reproduction steps
- Provide environment details
