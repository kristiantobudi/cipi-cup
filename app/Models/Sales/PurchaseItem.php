<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Models\Sales\Purchases;

class PurchaseItem extends Model
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

    public function purchase()
    {
        return $this->belongsTo(Purchases::class, 'purchase_id');
    }

    protected $fillable = [
        "purchase_id",
        "item_name",
        "quantity",
        "unit",
        "price",
        "subtotal",
    ];
}
