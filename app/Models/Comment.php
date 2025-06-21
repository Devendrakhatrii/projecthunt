<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Comment extends Model
{
    protected $fillable = ['body', 'user_id', 'parent_id'];

    // Polymorphic relation to owning model (Project, Story, etc.)
    public function commentable()
    {
        return $this->morphTo();
    }

    // Parent comment for replies
    public function parent()
    {
        return $this->belongsTo(Comment::class, 'parent_id');
    }

    // Replies (child comments)
    public function replies()
    {
        return $this->hasMany(Comment::class, 'parent_id')->with('user')->with('replies');
    }

    // Comment author
    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
