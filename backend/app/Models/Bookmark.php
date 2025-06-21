<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class Bookmark extends Model
{

    protected $fillable = ['user_id', 'title'];
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function bookmarkItems(): HasMany
    {
        return $this->hasMany(BookmarkItem::class);
    }
}



