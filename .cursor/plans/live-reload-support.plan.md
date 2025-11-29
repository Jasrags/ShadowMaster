# Live Reload Support Plan for Go API Server

## Overview
This document outlines the plan to add live reload support for the Go API server across Windows, Linux, and macOS platforms.

## Tool Selection: Air

**Recommended Tool:** [Air](https://github.com/cosmtrek/air) by cosmtrek

### Why Air?
- ✅ Cross-platform support (Windows, Linux, macOS)
- ✅ Actively maintained (regular updates)
- ✅ Easy installation via `go install`
- ✅ Flexible configuration via TOML
- ✅ Fast rebuilds and restarts
- ✅ Good documentation and community support

### Alternatives Considered
- **CompileDaemon**: Less actively maintained, more complex setup
- **Fresh**: Simpler but less configurable
- **Custom file watcher**: More maintenance overhead

## Implementation Plan

### Phase 1: Installation & Configuration

#### 1.1 Installation Method
**Option A: Go Install (Recommended)**
```bash
go install github.com/cosmtrek/air@latest
```
- Works on all platforms
- Requires Go to be in PATH
- No additional dependencies

**Option B: Binary Download**
- Platform-specific binaries available
- More complex distribution
- Not recommended for this use case

#### 1.2 Configuration File
Create `.air.toml` in project root with:
- Watch patterns for `.go` files
- Exclude patterns (vendor, test files, etc.)
- Build and run commands
- Binary output location
- Log settings

### Phase 2: Script Updates

#### 2.1 Makefile (Linux/macOS)
Update `run-dev` target to:
- Check if `air` is installed
- Use `air` if available, fallback to `go run`
- Maintain backward compatibility

#### 2.2 PowerShell Script (Windows)
Update `scripts/run-dev.ps1` to:
- Check if `air` is in PATH
- Use `air` if available, fallback to `go run`
- Handle separate window for logs

#### 2.3 Shell Script (Linux/macOS alternative)
Create `scripts/run-dev.sh` as alternative to Makefile:
- Same logic as PowerShell version
- Use `air` with fallback

### Phase 3: Documentation

#### 3.1 Update README
- Add Air installation instructions
- Document live reload feature
- Explain fallback behavior

#### 3.2 Update Setup Scripts
- Add Air installation check
- Optional: Auto-install Air if missing
- Provide clear error messages if Air not found

## Configuration Details

### .air.toml Structure
```toml
root = "."
testdata_dir = "testdata"
tmp_dir = "tmp"

[build]
  args_bin = ["-port", "8080", "-data", "./data", "-web", "./web/static"]
  bin = "./tmp/main"
  cmd = "go build -o ./tmp/main ./cmd/shadowmaster-server"
  delay = 1000
  exclude_dir = ["assets", "tmp", "vendor", "testdata", "web/static"]
  exclude_file = []
  exclude_regex = ["_test.go"]
  exclude_unchanged = false
  follow_symlink = false
  full_bin = ""
  include_dir = []
  include_ext = ["go", "tpl", "tmpl", "html"]
  include_file = []
  kill_delay = "0s"
  log = "build-errors.log"
  poll = false
  poll_interval = 0
  rerun = false
  rerun_delay = 500
  send_interrupt = false
  stop_on_error = false

[color]
  app = ""
  build = "yellow"
  main = "magenta"
  runner = "green"
  watcher = "cyan"

[log]
  main_only = false
  time = false

[misc]
  clean_on_exit = true

[screen]
  clear_on_rebuild = false
  keep_scroll = true
```

### Key Configuration Points
- **Build command**: Matches current `go run` behavior
- **Binary location**: `./tmp/main` (gitignored)
- **Watch patterns**: Only `.go` files in source directories
- **Exclude patterns**: Test files, vendor, static assets
- **Arguments**: Port, data dir, web dir passed to binary

## Fallback Strategy

### Detection Logic
1. Check if `air` command exists in PATH
2. If found, use `air`
3. If not found, fallback to `go run` with warning message

### User Experience
- **With Air**: Automatic rebuilds on file changes
- **Without Air**: Manual restart required (current behavior)
- Clear messaging about which mode is active

## Testing Plan

### Platform Testing
- [ ] Windows 10/11
- [ ] Linux (Ubuntu/Debian)
- [ ] macOS (Intel and Apple Silicon)

### Scenario Testing
- [ ] Basic file change triggers rebuild
- [ ] Multiple rapid changes handled correctly
- [ ] Build errors don't crash watcher
- [ ] Cleanup on Ctrl+C
- [ ] Fallback to `go run` when Air missing

## Migration Path

### Step 1: Add Configuration
- Create `.air.toml`
- Add to `.gitignore`: `tmp/` directory

### Step 2: Update Scripts
- Modify `run-dev.ps1` with Air support
- Modify `Makefile` with Air support
- Create `run-dev.sh` if needed

### Step 3: Documentation
- Update README with installation steps
- Add troubleshooting section

### Step 4: Optional Enhancements
- Auto-install Air in setup scripts
- Add Air version check
- Performance monitoring

## Benefits

1. **Developer Experience**
   - Faster iteration cycles
   - No manual restarts needed
   - Focus on coding, not process management

2. **Cross-Platform**
   - Same experience on all platforms
   - Consistent tooling across team

3. **Backward Compatible**
   - Works without Air (fallback)
   - No breaking changes
   - Gradual adoption possible

## Risks & Mitigations

### Risk: Air Installation Required
**Mitigation**: Fallback to `go run` with clear messaging

### Risk: Platform-Specific Issues
**Mitigation**: Test on all platforms, document known issues

### Risk: Performance Impact
**Mitigation**: Configure excludes properly, monitor resource usage

### Risk: Build Cache Issues
**Mitigation**: Use `tmp/` directory, clean on exit

## Success Criteria

- ✅ Air works on Windows, Linux, macOS
- ✅ Automatic rebuilds on `.go` file changes
- ✅ Graceful fallback when Air not installed
- ✅ No breaking changes to existing workflows
- ✅ Clear documentation for setup
- ✅ Fast rebuild times (< 2 seconds for typical changes)

## Next Steps

1. Review and approve this plan
2. Create `.air.toml` configuration
3. Update `scripts/run-dev.ps1`
4. Update `Makefile`
5. Test on all platforms
6. Update documentation
7. Optional: Add to setup scripts

