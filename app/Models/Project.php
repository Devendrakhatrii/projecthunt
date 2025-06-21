<?php

namespace App\Models;

use App\ApiResponse;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Laravel\Scout\Searchable;

class Project extends Model
{
    use ApiResponse, Searchable, HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'tech_stack',
        'description',
        'repo_url',
        'live_url',
        'status',
        'project_type'
    ];

    protected $casts = [
        'status' => 'boolean',
        'tech_stack' => 'array'
    ];

    public function toSearchableArray()
    {
        return [
            'title' => $this->title,
            'description' => $this->description,
        ];
    }

    /**
     * Get the user that owns the project.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function upvotes(): MorphMany
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
