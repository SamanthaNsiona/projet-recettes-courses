const http = require("http");

const BASE_URL = "http://localhost:5000/api";
let TOKEN = "";
let RECIPE_ID = "";

// 🔐 1. S'inscrire
const register = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/auth/register",
      method: "POST",
      headers: { "Content-Type": "application/json" }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const response = JSON.parse(data);
        TOKEN = response.token;
        console.log("✅ Inscription réussie");
        console.log(`Token: ${TOKEN}\n`);
        resolve();
      });
    });

    req.on("error", reject);
    req.write(
      JSON.stringify({
        name: "Test User",
        email: `test${Date.now()}@example.com`,
        password: "password123"
      })
    );
    req.end();
  });
};

// 🟢 2. Créer une recette
const createRecipe = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/recipes",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const response = JSON.parse(data);
        RECIPE_ID = response.recipe.id;
        console.log("✅ Recette créée");
        console.log(`ID: ${RECIPE_ID}\n`);
        resolve();
      });
    });

    req.on("error", reject);
    req.write(
      JSON.stringify({
        title: "Pâtes Carbonara",
        description: "Délicieuse recette italienne",
        isPublic: false
      })
    );
    req.end();
  });
};

// ➕ 3. Ajouter des ingrédients
const addIngredients = () => {
  const ingredients = [
    { name: "Pâtes", unit: "g", quantity: 400 },
    { name: "Œufs", unit: "pièce", quantity: 4 },
    { name: "Lard", unit: "g", quantity: 200 },
    { name: "Parmesan", unit: "g", quantity: 100 }
  ];

  return Promise.all(
    ingredients.map(
      (ingredient) =>
        new Promise((resolve, reject) => {
          const options = {
            hostname: "localhost",
            port: 5000,
            path: `/api/recipes/${RECIPE_ID}/ingredients`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${TOKEN}`
            }
          };

          const req = http.request(options, (res) => {
            let data = "";
            res.on("data", (chunk) => (data += chunk));
            res.on("end", () => {
              console.log(`✅ Ingrédient ajouté: ${ingredient.name}`);
              resolve();
            });
          });

          req.on("error", reject);
          req.write(JSON.stringify(ingredient));
          req.end();
        })
    )
  ).then(() => console.log(""));
};

// 🔍 4. Récupérer la recette avec ingrédients
const getRecipe = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: `/api/recipes/${RECIPE_ID}`,
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("✅ Recette récupérée avec ingrédients:");
        console.log(JSON.stringify(response, null, 2));
        console.log("");
        resolve();
      });
    });

    req.on("error", reject);
    req.end();
  });
};

// 📋 5. Récupérer toutes les recettes
const getRecipes = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: "/api/recipes",
      method: "GET",
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("✅ Toutes les recettes:");
        console.log(JSON.stringify(response, null, 2));
        console.log("");
        resolve();
      });
    });

    req.on("error", reject);
    req.end();
  });
};

// ✏️ 6. Modifier une recette
const updateRecipe = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: `/api/recipes/${RECIPE_ID}`,
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("✅ Recette mise à jour:");
        console.log(JSON.stringify(response, null, 2));
        console.log("");
        resolve();
      });
    });

    req.on("error", reject);
    req.write(
      JSON.stringify({
        title: "Pâtes Carbonara Perfectionnées",
        description: "La meilleure recette carbonara!",
        isPublic: true
      })
    );
    req.end();
  });
};

// ❌ 7. Supprimer une recette
const deleteRecipe = () => {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: "localhost",
      port: 5000,
      path: `/api/recipes/${RECIPE_ID}`,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${TOKEN}`
      }
    };

    const req = http.request(options, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => {
        const response = JSON.parse(data);
        console.log("✅ Recette supprimée:");
        console.log(JSON.stringify(response, null, 2));
        console.log("");
        resolve();
      });
    });

    req.on("error", reject);
    req.end();
  });
};

// 🚀 Exécuter tous les tests
async function runTests() {
  try {
    console.log("🧪 Lancement des tests...\n");
    await register();
    await createRecipe();
    await addIngredients();
    await getRecipe();
    await getRecipes();
    await updateRecipe();
    await deleteRecipe();
    console.log("✅ Tous les tests sont terminés!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error.message);
    process.exit(1);
  }
}

runTests();
