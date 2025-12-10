// Script de test pour l'API
const http = require('http');

const API_URL = 'http://localhost:5000';
let authToken = null;
let userId = null;
let recipeId = null;
let listId = null;

// Helper pour faire des requêtes HTTP
function request(method, path, data = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, API_URL);
    const options = {
      method,
      headers: {
        'Content-Type': 'application/json',
      }
    };

    if (authToken) {
      options.headers['Authorization'] = `Bearer ${authToken}`;
    }

    const req = http.request(url, options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testAPI() {
  console.log('🧪 Début des tests API\n');

  try {
    // Test 1: Inscription
    console.log('1️⃣ Test inscription...');
    const registerRes = await request('POST', '/api/auth/register', {
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      password: 'password123'
    });
    console.log(`   Status: ${registerRes.status}`);
    if (registerRes.data.token) {
      authToken = registerRes.data.token;
      userId = registerRes.data.user.id;
      console.log('   ✅ Inscription réussie, token reçu\n');
    } else {
      console.log('   ❌ Échec:', registerRes.data, '\n');
      return;
    }

    // Test 2: Connexion
    console.log('2️⃣ Test connexion...');
    const loginRes = await request('POST', '/api/auth/login', {
      email: registerRes.data.user.email,
      password: 'password123'
    });
    console.log(`   Status: ${loginRes.status}`);
    console.log(loginRes.data.token ? '   ✅ Connexion réussie\n' : '   ❌ Échec\n');

    // Test 3: Créer une recette
    console.log('3️⃣ Test création recette...');
    const createRecipeRes = await request('POST', '/api/recipes', {
      title: 'Pâtes Carbonara',
      description: 'Délicieuses pâtes à la carbonara',
      isPublic: true
    });
    console.log(`   Status: ${createRecipeRes.status}`);
    if (createRecipeRes.data.recipe) {
      recipeId = createRecipeRes.data.recipe.id;
      console.log('   ✅ Recette créée\n');
    } else {
      console.log('   ❌ Échec:', createRecipeRes.data, '\n');
    }

    // Test 4: Lire les recettes
    console.log('4️⃣ Test lecture recettes...');
    const getRecipesRes = await request('GET', '/api/recipes');
    console.log(`   Status: ${getRecipesRes.status}`);
    console.log(`   ✅ ${getRecipesRes.data.length || 0} recette(s) trouvée(s)\n`);

    // Test 5: Modifier une recette
    if (recipeId) {
      console.log('5️⃣ Test modification recette...');
      const updateRecipeRes = await request('PUT', `/api/recipes/${recipeId}`, {
        title: 'Pâtes Carbonara Modifiées',
        description: 'Version améliorée',
        isPublic: false
      });
      console.log(`   Status: ${updateRecipeRes.status}`);
      console.log(updateRecipeRes.data.recipe ? '   ✅ Recette modifiée\n' : '   ❌ Échec\n');
    }

    // Test 6: Créer une liste de courses
    console.log('6️⃣ Test création liste de courses...');
    const createListRes = await request('POST', '/api/shopping-lists', {
      title: 'Courses du weekend',
      userId: userId
    });
    console.log(`   Status: ${createListRes.status}`);
    if (createListRes.data.id) {
      listId = createListRes.data.id;
      console.log('   ✅ Liste créée\n');
    } else {
      console.log('   ❌ Échec:', createListRes.data, '\n');
    }

    // Test 7: Lire les listes
    console.log('7️⃣ Test lecture listes...');
    const getListsRes = await request('GET', '/api/shopping-lists');
    console.log(`   Status: ${getListsRes.status}`);
    console.log(`   ✅ ${getListsRes.data.length || 0} liste(s) trouvée(s)\n`);

    // Test 8: Ajouter un item à la liste
    if (listId) {
      console.log('8️⃣ Test ajout item...');
      const addItemRes = await request('POST', `/api/shopping-items/${listId}`, {
        name: 'Pâtes',
        quantity: 500,
        unit: 'g'
      });
      console.log(`   Status: ${addItemRes.status}`);
      console.log(addItemRes.data.id ? '   ✅ Item ajouté\n' : '   ❌ Échec\n');
    }

    // Test 9: Supprimer la recette
    if (recipeId) {
      console.log('9️⃣ Test suppression recette...');
      const deleteRecipeRes = await request('DELETE', `/api/recipes/${recipeId}`);
      console.log(`   Status: ${deleteRecipeRes.status}`);
      console.log(deleteRecipeRes.status === 200 ? '   ✅ Recette supprimée\n' : '   ❌ Échec\n');
    }

    console.log('✅ Tests terminés avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors des tests:', error.message);
  }
}

// Exécuter les tests
testAPI();
