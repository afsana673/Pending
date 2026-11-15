/*
 * Integration adapter for @eryxenx/insta-chat v2.2.7.
 *
 * IMPORTANT:
 * This package's GC pending/approve/reject method names and signatures
 * have not yet been verified. Do not guess them. Implement the three
 * functions below only after checking the installed package source/docs.
 *
 * The API deliberately returns HTTP 501 until real methods are connected.
 */
function notConfigured(action) {
  const error = new Error(
    `Instagram GC ${action} is not connected. Verify the real v2.2.7 API method and configure src/adapter.js.`
  );
  error.status = 501;
  throw error;
}

function getAdapter() {
  return {
    async listPending() {
      return notConfigured("pending-list");
    },
    async approve(_threadId) {
      return notConfigured("approve");
    },
    async reject(_threadId) {
      return notConfigured("reject");
    }
  };
}

module.exports = { getAdapter };
