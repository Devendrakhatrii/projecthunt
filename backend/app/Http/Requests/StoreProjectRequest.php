<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreProjectRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => ['required', 'string', 'max:255'],
            'tech_stack' => ['required', 'array'],
            'tech_stack.*' => ['required', 'string'],
            'description' => ['nullable', 'string'],
            'repo_url' => ['nullable', 'url'],
            'live_url' => ['nullable', 'url'],
            'project_type' => ['required', Rule::in(['personal', 'client', 'open-source'])],
            'status' => ['boolean']
        ];
    }
}
