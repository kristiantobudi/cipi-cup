<?php

namespace App\Models\Sales;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use App\Models\Sales\PurchaseItem;

class Purchases extends Model
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
        return $this->hasMany(PurchaseItem::class, "purchase_id");
    }

    protected $fillable = [
        "date",
        "source",
        "description",
        "total_amount",
        "users_id",
    ];
}
