<?php

namespace App\Http\Api;

use App\ApiResponse;
use App\Http\Requests\SignInRequest;
use App\Http\Requests\SignUpRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class AuthController
{
    use ApiResponse;

    public function signin(SignInRequest $request)
    {
        try {
            $credentials = $request->validated();

            if (!Auth::attempt($credentials)) {
                return $this->failure(
                    'Invalid credentials',
                    ['The provided credentials are incorrect.'],
                    401
                );
            }

            $user = Auth::user();
            $token = $user->createToken('access_token')->accessToken;

            return $this->success(
                [
                    'user' => $user->only(['id', 'name', 'email', 'user_name', 'role']),
                    'token' => $token
                ],
                'Logged in successfully',
                200
            );
        } catch (ValidationException $e) {
            return $this->failure(
                'Validation failed',
                $e->errors(),
                422
            );
        } catch (\Exception $e) {
            Log::error('Login failed', ['error' => $e]);
            return $this->failure(
                'Login failed'
            );
        }
    }

    public function signup(SignUpRequest $request)
    {
        try {
            DB::beginTransaction();

            $validatedData = $request->validated();

            $user = User::create([
                'name' => $validatedData['name'],
                'email' => $validatedData['email'],
                'password' => Hash::make($validatedData['password']),
                'user_name' => $validatedData['user_name'],
                'role' => $validatedData['role'],
                'bio' => $validatedData['bio'] ?? null,
                'picture' => $validatedData['picture'] ?? null,
            ]);

            $token = $user->createToken('auth_token')->accessToken;

            DB::commit();

            return $this->success(
                [
                    'user' => $user->only(['id', 'name', 'email', 'user_name', 'role']),
                    'token' => $token
                ],
                'Registration successful',
                201
            );
        } catch (ValidationException $e) {
            DB::rollBack();
            return $this->failure(
                'Validation failed',
                $e->errors(),
                422
            );
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Registraiton failed', ['error' => $e]);
            return $this->failure(
                'Registration failed'
            );
        }
    }
}
