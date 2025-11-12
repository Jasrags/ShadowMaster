.PHONY: help build run server cli clean test test-go test-react fmt vet deps install dev

# Variables
BINARY_NAME=shadowmaster-server
CLI_NAME=shadowmaster-cli
DATA_DIR=./data
WEB_DIR=./web/static
PORT=8080
GOFLAGS=-v
LDFLAGS=-s -w

# Colors for output
CYAN=\033[0;36m
GREEN=\033[0;32m
YELLOW=\033[0;33m
NC=\033[0m # No Color

help: ## Show this help message
	@echo "$(CYAN)ShadowMaster RPG System - Makefile$(NC)"
	@echo ""
	@echo "$(GREEN)Available targets:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-15s$(NC) %s\n", $$1, $$2}'
	@echo ""

deps: ## Download and install dependencies
	@echo "$(CYAN)Installing dependencies...$(NC)"
	@go mod download
	@go mod tidy
	@echo "$(GREEN)✓ Dependencies installed$(NC)"

build: frontend-build ## Build the server binary
	@echo "$(CYAN)Building server...$(NC)"
	@go build $(GOFLAGS) -ldflags "$(LDFLAGS)" -o bin/$(BINARY_NAME) ./cmd/shadowmaster-server
	@echo "$(GREEN)✓ Server built: bin/$(BINARY_NAME)$(NC)"

build-cli: ## Build the CLI binary
	@echo "$(CYAN)Building CLI...$(NC)"
	@go build $(GOFLAGS) -ldflags "$(LDFLAGS)" -o bin/$(CLI_NAME) ./cmd/shadowmaster-cli
	@echo "$(GREEN)✓ CLI built: bin/$(CLI_NAME)$(NC)"

build-all: build build-cli ## Build both server and CLI binaries
	@echo "$(GREEN)✓ All binaries built$(NC)"

run: test server ## Alias for server target that also runs tests

server: frontend-build ## Run the server
	@echo "$(CYAN)Starting ShadowMaster server...$(NC)"
	@echo "$(YELLOW)Port: $(PORT)$(NC)"
	@echo "$(YELLOW)Data directory: $(DATA_DIR)$(NC)"
	@echo "$(YELLOW)Web directory: $(WEB_DIR)$(NC)"
	@echo ""
	@mkdir -p $(DATA_DIR)
	@go run ./cmd/shadowmaster-server -port $(PORT) -data $(DATA_DIR) -web $(WEB_DIR)

dev: ## Run the server in development mode (with auto-reload if available)
	@echo "$(CYAN)Starting ShadowMaster server in development mode...$(NC)"
	@mkdir -p $(DATA_DIR)
	@go run ./cmd/shadowmaster-server -port $(PORT) -data $(DATA_DIR) -web $(WEB_DIR)

cli: ## Run the CLI (if implemented)
	@echo "$(CYAN)Running ShadowMaster CLI...$(NC)"
	@go run ./cmd/shadowmaster-cli

install: build ## Build and install the server binary to GOPATH/bin
	@echo "$(CYAN)Installing server...$(NC)"
	@go install ./cmd/shadowmaster-server
	@echo "$(GREEN)✓ Server installed$(NC)"

install-cli: build-cli ## Build and install the CLI binary to GOPATH/bin
	@echo "$(CYAN)Installing CLI...$(NC)"
	@go install ./cmd/shadowmaster-cli
	@echo "$(GREEN)✓ CLI installed$(NC)"

test: test-go test-react ## Run Go and React tests
	@echo "$(GREEN)✓ Go and React tests completed$(NC)"

test-go: ## Run Go tests
	@echo "$(CYAN)Running Go tests...$(NC)"
	@go test -v ./...

test-react: ## Run React tests
	@echo "$(CYAN)Running React smoke test...$(NC)"
	@cd web/app && npm test -- --watch=false
	@echo "$(CYAN)Running React unit tests...$(NC)"
	@cd web/app && npm run test:unit

test-coverage: ## Run tests with coverage
	@echo "$(CYAN)Running tests with coverage...$(NC)"
	@go test -v -coverprofile=coverage.out ./...
	@go tool cover -html=coverage.out -o coverage.html
	@echo "$(GREEN)✓ Coverage report generated: coverage.html$(NC)"

fmt: ## Format Go code
	@echo "$(CYAN)Formatting code...$(NC)"
	@go fmt ./...
	@echo "$(GREEN)✓ Code formatted$(NC)"

vet: ## Run go vet
	@echo "$(CYAN)Running go vet...$(NC)"
	@go vet ./...
	@echo "$(GREEN)✓ Vet completed$(NC)"

lint: fmt vet ## Format code and run vet
	@echo "$(GREEN)✓ Linting completed$(NC)"

clean: ## Clean build artifacts
	@echo "$(CYAN)Cleaning build artifacts...$(NC)"
	@rm -rf bin/
	@rm -f coverage.out coverage.html
	@echo "$(GREEN)✓ Clean completed$(NC)"

clean-data: ## Clean data directory (WARNING: removes all game data)
	@echo "$(YELLOW)WARNING: This will delete all game data!$(NC)"
	@read -p "Are you sure? [y/N] " -n 1 -r; \
	echo; \
	if [[ $$REPLY =~ ^[Yy]$$ ]]; then \
		rm -rf $(DATA_DIR)/*; \
		echo "$(GREEN)✓ Data directory cleaned$(NC)"; \
	else \
		echo "$(CYAN)Cleaning cancelled$(NC)"; \
	fi

init: deps ## Initialize project (install dependencies and create directories)
	@echo "$(CYAN)Initializing project...$(NC)"
	@mkdir -p $(DATA_DIR)/characters
	@mkdir -p $(DATA_DIR)/groups
	@mkdir -p $(DATA_DIR)/campaigns
	@mkdir -p $(DATA_DIR)/sessions
	@mkdir -p $(DATA_DIR)/scenes
	@mkdir -p bin
	@echo "$(GREEN)✓ Project initialized$(NC)"

watch: ## Watch for file changes and rebuild (requires fswatch or similar)
	@echo "$(CYAN)Watching for file changes...$(NC)"
	@echo "$(YELLOW)Note: Requires fswatch (brew install fswatch) or entr$(NC)"
	@if command -v fswatch > /dev/null; then \
		fswatch -o . --exclude='\.git' --exclude='\./(data|bin)' | xargs -n1 -I{} make build; \
	elif command -v entr > /dev/null; then \
		find . -name "*.go" -not -path "./.git/*" -not -path "./data/*" -not -path "./bin/*" | entr -c make build; \
	else \
		echo "$(YELLOW)Please install fswatch or entr for file watching$(NC)"; \
	fi

frontend-build: ## Build the React frontend bundle
	@echo "$(CYAN)Building React frontend...$(NC)"
	@cd web/app && npm run build
	@echo "$(GREEN)✓ Frontend bundle built$(NC)"

.DEFAULT_GOAL := help

