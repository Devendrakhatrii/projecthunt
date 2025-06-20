<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BookmarkItem extends Model
{
    protected $fillable = ['bookmark_id', 'project_id'];
    public function bookmark(): BelongsTo
    {
        return $this->belongsTo(Bookmark::class);
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
