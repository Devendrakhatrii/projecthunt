<?php

namespace App\Models;

use App\ApiResponse;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Project extends Model
{
    use ApiResponse;

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

    /**
     * Get the user that owns the project.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function upvotes() : MorphMany {
        return $this->morphMany(Upvote::class,'upvotable');
    }
}
