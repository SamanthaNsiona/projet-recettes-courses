-- Create User table
CREATE TABLE IF NOT EXISTS "User" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "email" VARCHAR(255) NOT NULL UNIQUE,
  "password" VARCHAR(255) NOT NULL,
  "role" VARCHAR(255) NOT NULL DEFAULT 'USER',
  "resetPasswordToken" VARCHAR(255),
  "resetPasswordExpiry" TIMESTAMP
);

-- Create Recipe table
CREATE TABLE IF NOT EXISTS "Recipe" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "description" TEXT,
  "ingredients" TEXT NOT NULL,
  "steps" TEXT NOT NULL,
  "createdAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "updatedAt" TIMESTAMP NOT NULL DEFAULT NOW(),
  "userId" INTEGER NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create Ingredient table
CREATE TABLE IF NOT EXISTS "Ingredient" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "unit" VARCHAR(255),
  "quantity" DOUBLE PRECISION,
  "recipeId" INTEGER,
  "userId" INTEGER,
  FOREIGN KEY ("recipeId") REFERENCES "Recipe"("id") ON DELETE CASCADE,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create ShoppingList table
CREATE TABLE IF NOT EXISTS "ShoppingList" (
  "id" SERIAL PRIMARY KEY,
  "title" VARCHAR(255) NOT NULL,
  "userId" INTEGER NOT NULL,
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE
);

-- Create ShoppingItem table
CREATE TABLE IF NOT EXISTS "ShoppingItem" (
  "id" SERIAL PRIMARY KEY,
  "name" VARCHAR(255) NOT NULL,
  "quantity" DOUBLE PRECISION,
  "unit" VARCHAR(255),
  "listId" INTEGER NOT NULL,
  FOREIGN KEY ("listId") REFERENCES "ShoppingList"("id") ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS "Recipe_userId_idx" ON "Recipe"("userId");
CREATE INDEX IF NOT EXISTS "Ingredient_recipeId_idx" ON "Ingredient"("recipeId");
CREATE INDEX IF NOT EXISTS "Ingredient_userId_idx" ON "Ingredient"("userId");
CREATE INDEX IF NOT EXISTS "ShoppingList_userId_idx" ON "ShoppingList"("userId");
CREATE INDEX IF NOT EXISTS "ShoppingItem_listId_idx" ON "ShoppingItem"("listId");
