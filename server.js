const fs = require("fs");
const http = require("http");
const path = require("path");

const root = __dirname;
const port = Number(process.env.PORT || 3000);
const canonicalHost = "oceanviewauto.com";

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
};

function send(res, status, headers, body = "") {
  res.writeHead(status, headers);
  res.end(body);
}

function safePath(urlPath) {
  const cleanPath = decodeURIComponent(urlPath.split("?")[0]).replace(/\/+$/, "") || "/";
  const filePath = cleanPath === "/" ? "/index.html" : cleanPath;
  const resolved = path.normalize(path.join(root, filePath));
  return resolved.startsWith(root) ? resolved : path.join(root, "404.html");
}

function canonicalPath(urlPath) {
  if (urlPath === "/index.html") return "/";
  return urlPath;
}

function htmlFileForCleanPath(urlPath) {
  if (urlPath === "/" || path.extname(urlPath)) return "";
  const candidate = safePath(`${urlPath}.html`);
  return fs.existsSync(candidate) ? candidate : "";
}

http.createServer((req, res) => {
  const host = String(req.headers.host || "").split(":")[0].toLowerCase();
  const url = new URL(req.url || "/", `https://${canonicalHost}`);
  const cleanPath = canonicalPath(url.pathname);

  if (host.endsWith(".up.railway.app")) {
    send(res, 301, {
      Location: `https://${canonicalHost}${cleanPath}${url.search}`,
      "Cache-Control": "public, max-age=3600",
    });
    return;
  }

  if (url.pathname === "/index.html") {
    send(res, 301, {
      Location: "/",
      "Cache-Control": "public, max-age=3600",
    });
    return;
  }

  const cleanHtmlFile = htmlFileForCleanPath(url.pathname);
  if (cleanHtmlFile) {
    send(res, 301, {
      Location: `${url.pathname}.html${url.search}`,
      "Cache-Control": "public, max-age=3600",
    });
    return;
  }

  const file = safePath(url.pathname);
  fs.readFile(file, (error, data) => {
    if (error) {
      send(res, 404, { "Content-Type": "text/plain; charset=utf-8" }, "404 Not Found");
      return;
    }

    const ext = path.extname(file);
    const headers = {
      "Content-Type": mimeTypes[ext] || "application/octet-stream",
      "Cache-Control": ext === ".html" ? "public, max-age=0, must-revalidate" : "public, max-age=86400",
    };

    if (url.pathname.startsWith("/api/")) {
      headers["X-Robots-Tag"] = "noindex, nofollow";
    }

    send(res, 200, headers, data);
  });
}).listen(port, () => {
  console.log(`Oceanview Auto site running on port ${port}`);
});
