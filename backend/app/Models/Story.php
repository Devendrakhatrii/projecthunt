<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Str;
use Laravel\Scout\Searchable;

class Story extends Model
{
    use Searchable, HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'slug',
        'content',
        'tags',
        'published',
    ];

    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'content' => $this->content,
        ];
    }

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

    public function comments()
    {
        return $this->morphMany(Comment::class, 'commentable')
            ->whereNull('parent_id') // only top-level comments
            ->with('user')
            ->with('replies')       // eager load nested replies
            ->latest();             // newest first, or use oldest() if you prefer
    }
}
