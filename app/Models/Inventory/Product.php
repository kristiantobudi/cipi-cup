<?php

namespace App\Models\Inventory;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Models\Inventory\Categories;
use Illuminate\Support\Str;
class Product extends Model
{
    use HasFactory;
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    protected $fillable = [
        "name",
        "sku",
        "category_id",
        "stock",
        "min_stock",
        "date",
        "users_id",
    ];


    // Define the relationship with the Categories model and show the category name
    public function category()
    {
        return $this->belongsTo(Categories::class);
    }
}
