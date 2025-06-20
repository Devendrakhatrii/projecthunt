<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;


class Story extends Model
{
    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'tags',
        'published',
    ];

    public function getRouteKeyName()
    {
        return 'slug';
    }

    protected $casts = [
        'tags' => 'array',
        'published' => 'boolean',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($story) {
            $story->slug = Str::slug($story->title) . '-' . Str::random(6);
        });

        static::updating(function ($story) {
            if ($story->isDirty('title')) {
                $story->slug = Str::slug($story->title);
            }
        });
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function upvotes()
    {
        return $this->morphMany(Upvote::class, 'upvotable');
    }
}
