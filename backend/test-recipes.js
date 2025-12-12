<<<<<<< HEAD
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
=======
const http = require('http');

// Teste les endpoints de recettes
async function testRecipeEndpoints() {
  console.log('🧪 Test des endpoints de recettes\n');

  // D'abord, se connecter pour obtenir un token
  console.log('1️⃣ Connexion...');
  const loginData = JSON.stringify({
    email: 'Myrecipesdev@gmail.com',
    password: 'mdp123'
  });

  const loginOptions = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': loginData.length
    }
  };

  return new Promise((resolve, reject) => {
    const loginReq = http.request(loginOptions, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.log('❌ Échec connexion:', body);
          reject(new Error('Login failed'));
          return;
        }

        const loginResponse = JSON.parse(body);
        const token = loginResponse.token;
        console.log('✅ Connecté, token obtenu\n');

        // Test 1: GET /recipes/public
        console.log('2️⃣ Test GET /api/recipes/public...');
        const publicOptions = {
          hostname: 'localhost',
          port: 5000,
          path: '/api/recipes/public',
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };

        const publicReq = http.request(publicOptions, (res2) => {
          let body2 = '';
          res2.on('data', chunk => body2 += chunk);
          res2.on('end', () => {
            console.log(`   Status: ${res2.statusCode}`);
            if (res2.statusCode === 200) {
              const recipes = JSON.parse(body2);
              console.log(`   ✅ Recettes publiques: ${recipes.length}`);
              recipes.forEach(r => console.log(`      - ${r.title} par ${r.user.name}`));
            } else {
              console.log('   ❌ Erreur:', body2);
            }

            // Test 2: GET /recipes (mes recettes)
            console.log('\n3️⃣ Test GET /api/recipes...');
            const myRecipesOptions = {
              hostname: 'localhost',
              port: 5000,
              path: '/api/recipes',
              method: 'GET',
              headers: {
                'Authorization': `Bearer ${token}`
              }
            };

            const myRecipesReq = http.request(myRecipesOptions, (res3) => {
              let body3 = '';
              res3.on('data', chunk => body3 += chunk);
              res3.on('end', () => {
                console.log(`   Status: ${res3.statusCode}`);
                if (res3.statusCode === 200) {
                  const myRecipes = JSON.parse(body3);
                  console.log(`   ✅ Mes recettes: ${myRecipes.length}`);
                  myRecipes.forEach(r => console.log(`      - ${r.title} (${r.isPublic ? 'Public' : 'Privé'})`));
                } else {
                  console.log('   ❌ Erreur:', body3);
                }
                console.log('\n✅ Tests terminés!');
                resolve();
              });
            });

            myRecipesReq.on('error', reject);
            myRecipesReq.end();
          });
        });

        publicReq.on('error', reject);
        publicReq.end();
      });
    });

    loginReq.on('error', reject);
    loginReq.write(loginData);
    loginReq.end();
  });
}

testRecipeEndpoints().catch(console.error);
>>>>>>> main
