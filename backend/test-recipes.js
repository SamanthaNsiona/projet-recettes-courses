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
