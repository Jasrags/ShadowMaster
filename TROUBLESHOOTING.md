# Troubleshooting CORS Errors

## If you see "CORS request did not succeed" error:

### 1. Make sure the backend server is running:
```bash
cd server
npm run dev
```

You should see:
```
Server running on port 3001
Environment: development
```

### 2. Verify the server is accessible:
Open your browser and go to: `http://localhost:3001/health`

You should see: `{"status":"ok"}`

### 3. Check browser console:
- Open Developer Tools (F12)
- Go to the Network tab
- Try the request again
- Look for the actual error message

### 4. Clear browser cache:
- Hard refresh: Cmd+Shift+R (Mac) or Ctrl+Shift+R (Windows/Linux)
- Or clear browser cache completely

### 5. Check for browser extensions:
- Some ad blockers or privacy extensions can block CORS requests
- Try disabling extensions temporarily

### 6. Verify ports:
- Frontend should be on: `http://localhost:3000`
- Backend should be on: `http://localhost:3001`

### 7. Check firewall/antivirus:
- Make sure nothing is blocking localhost connections

## Common Issues:

**"CORS request did not succeed" with status (null):**
- Usually means the server isn't running or isn't reachable
- Check if port 3001 is in use: `lsof -ti:3001`

**"CORS policy" error:**
- Server is running but CORS headers aren't correct
- Check server logs for errors
- Verify CORS configuration in `server/src/index.ts`

## Quick Test:

Test the API directly:
```bash
curl http://localhost:3001/health
```

Should return: `{"status":"ok"}`

