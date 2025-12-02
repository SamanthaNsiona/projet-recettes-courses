import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function RecipeCard({
  recipe,
  onEdit,
  onDelete,
  onToggleIngredients,
  expanded,
  children,
}) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-2">{recipe.title}</h3>
      <p className="text-gray-600 mb-4">{recipe.description}</p>

      {expanded && children}

      <div className="flex justify-between items-center">
        <span className={`text-sm ${recipe.isPublic ? 'text-green-600' : 'text-gray-500'}`}>
          {recipe.isPublic ? 'Public' : 'Privé'}
        </span>
        <div className="flex gap-2">
          <button onClick={() => onEdit(recipe)} className="p-2 text-blue-600 hover:bg-blue-50 rounded">
            <PencilIcon className="h-5 w-5" />
          </button>
          <button onClick={() => onDelete(recipe.id)} className="p-2 text-red-600 hover:bg-red-50 rounded">
            <TrashIcon className="h-5 w-5" />
          </button>
          <button onClick={() => onToggleIngredients(recipe.id)} className="p-2 text-gray-600 hover:bg-gray-50 rounded">
            {expanded ? 'Masquer' : 'Ingrédients'}
          </button>
        </div>
      </div>
    </div>
  );
}
