const express = require("express");
const { getAdapter } = require("./src/adapter");

const app = express();
app.disable("x-powered-by");
app.use(express.json({ limit: "32kb" }));

const PORT = process.env.PORT || 3000;
const API_SECRET = process.env.API_SECRET || "";
const adapter = getAdapter();

function auth(req, res, next) {
  if (!API_SECRET) {
    return res.status(503).json({
      ok: false,
      error: "API_SECRET is not configured on the server."
    });
  }
  const supplied = req.get("x-api-key") || req.get("authorization")?.replace(/^Bearer\s+/i, "");
  if (supplied !== API_SECRET) {
    return res.status(401).json({ ok: false, error: "Unauthorized" });
  }
  next();
}

app.get("/", (_req, res) => {
  res.json({
    name: "HR HABIB Instagram GC API",
    version: "1.0.0",
    status: "online",
    endpoints: ["GET /health", "GET /api/gc/pending", "POST /api/gc/approve", "POST /api/gc/reject"]
  });
});

app.get("/health", (_req, res) => {
  res.json({ ok: true, service: "hr-insta-gc-api", time: new Date().toISOString() });
});

app.use("/api", auth);

app.get("/api/gc/pending", async (_req, res) => {
  try {
    const result = await adapter.listPending();
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(err.status || 501).json({
      ok: false,
      error: err.message || "GC pending-list method is not configured."
    });
  }
});

app.post("/api/gc/approve", async (req, res) => {
  const { threadId } = req.body || {};
  if (typeof threadId !== "string" || !threadId.trim()) {
    return res.status(400).json({ ok: false, error: "threadId (string) is required." });
  }
  try {
    const result = await adapter.approve(threadId.trim());
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(err.status || 501).json({ ok: false, error: err.message || "GC approve method is not configured." });
  }
});

app.post("/api/gc/reject", async (req, res) => {
  const { threadId } = req.body || {};
  if (typeof threadId !== "string" || !threadId.trim()) {
    return res.status(400).json({ ok: false, error: "threadId (string) is required." });
  }
  try {
    const result = await adapter.reject(threadId.trim());
    res.json({ ok: true, data: result });
  } catch (err) {
    res.status(err.status || 501).json({ ok: false, error: err.message || "GC reject method is not configured." });
  }
});

app.use((err, _req, res, _next) => {
  res.status(400).json({ ok: false, error: "Invalid JSON request body." });
});

app.listen(PORT, () => {
  console.log(`HR HABIB GC API listening on ${PORT}`);
});
