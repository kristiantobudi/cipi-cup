<?php

namespace App\Http\Controllers\Inventory;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Inventory\Categories;

class CategoriesController extends Controller
{
    public function index(Request $request)
    {
        $categories = Categories::latest()->get();

        return inertia('Inventory/Categories/Categories', [
            'categories' => $categories,
        ]);
    }


    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        Categories::create($validated);

        return redirect()->route('categories.index')->with('success', 'Category created successfully.');

    }
}
