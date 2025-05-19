<?php

namespace App\Models\Sales;

use App\Models\Inventory\Product;
use App\Models\Sales\SalesItems;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Sales extends Model
{
    use HasFactory, SoftDeletes;
    public $incrementing = false;

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            $model->id = (string) Str::uuid();
        });
    }

    public function items()
    {
        return $this->hasMany(SalesItems::class, "sales_id");
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    protected $fillable = [
        "date",
        "total_amount",
        "users_id"
    ];
}
