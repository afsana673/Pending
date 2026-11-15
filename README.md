# HR HABIB — Instagram GC API Bridge

Deployable Node.js/Express API scaffold for Render.

## Important compatibility note

This project is a secure API bridge scaffold, **not yet a working Instagram GC approval bot**. The exact pending-list, approve and reject method names/signatures for `@eryxenx/insta-chat@2.2.7` have not been verified. The adapter intentionally returns HTTP `501` instead of pretending an action succeeded.

To finish the integration, inspect the installed package source and implement:
- `listPending()`
- `approve(threadId)`
- `reject(threadId)`

in `src/adapter.js`, using the real authenticated Instagram client and the exact documented methods. The API server must have access to that authenticated client/session; deploying this server alone does not transfer the login/session from another bot process.

## Deploy to Render

1. Upload this ZIP's contents to a new GitHub repository.
2. In Render, choose **New + → Web Service** and connect the repository.
3. Render detects `render.yaml`, or use:
   - Build command: `npm install`
   - Start command: `npm start`
4. Add environment variable `API_SECRET` with a long random value.
5. Deploy. Check `https://YOUR-SERVICE.onrender.com/health`.

## API authentication

Send the secret in `x-api-key` header (or `Authorization: Bearer SECRET`).

### Check pending requests
`GET /api/gc/pending`

### Approve a group
`POST /api/gc/approve`
```json
{"threadId":"INSTAGRAM_GROUP_THREAD_ID"}
```

### Reject a group
`POST /api/gc/reject`
```json
{"threadId":"INSTAGRAM_GROUP_THREAD_ID"}
```

Example:
```bash
curl -H "x-api-key: YOUR_SECRET" \
  https://YOUR-SERVICE.onrender.com/api/gc/pending
```

## Security

- Never commit `.env`, cookies, session files, passwords or Instagram credentials to GitHub.
- Keep `API_SECRET` private.
- Use only an account and groups you are authorized to manage.
