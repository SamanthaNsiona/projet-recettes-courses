const { Client } = require('pg');

async function updateShoppingItem() {
  const client = new Client({
    connectionString: "postgresql://postgres.nddqnlzxqmwzdvkuwfzg:shZmEtTRVQK8ut9N@aws-1-eu-west-1.pooler.supabase.com:5432/postgres"
  });

  try {
    await client.connect();
    
    await client.query(`
      ALTER TABLE "ShoppingItem" 
      ADD COLUMN IF NOT EXISTS "checked" BOOLEAN NOT NULL DEFAULT false;
    `);
    
    console.log('✅ Colonne checked ajoutée à ShoppingItem');
  } catch (error) {
    console.error('❌ Erreur:', error);
  } finally {
    await client.end();
  }
}

updateShoppingItem();
