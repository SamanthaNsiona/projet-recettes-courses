const http = require("http");

const BASE_URL = "http://localhost:5000/api";

// Test simple : vérifier que le serveur répond
const testServer = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/",
      method: "GET"
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        console.log("✅ Serveur OK:", data);
        resolve();
      });
    });

    req.on("error", (err) => {
      console.error("❌ Erreur serveur:", err.message);
      reject(err);
    });

    req.end();
  });
};

testServer()
  .then(() => {
    console.log("✅ Test réussi!");
    process.exit(0);
  })
  .catch(() => {
    process.exit(1);
  });
