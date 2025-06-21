<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, HasApiTokens;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'user_name',
        'role',
        'bio',
        'picture'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function projects(): HasMany
    {
        return  $this->hasMany(Project::class);
    }

    public function bookmarks(): HasMany
    {
        return $this->hasMany(Bookmark::class);
    }

    // People this user is following
    public function following()
    {
        //from followers table find the user_id where follower_id is the current user_id
        return $this->belongsToMany(User::class, 'followers', 'follower_id', 'user_id');
    }

    // People who follow this user
    public function followers()
    {
        //from follower table find follower_id where user_id is current user_id
        return $this->belongsToMany(User::class, 'followers', 'user_id', 'follower_id');
    }

    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }


    public function unreadNotifications()
    {
        return $this->notifications()->whereNull('read_at');
    }
}
