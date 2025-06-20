<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProjectRequest extends FormRequest
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
            'title' => ['sometimes', 'string', 'max:255'],
            'tech_stack' => ['sometimes', 'array'],
            'tech_stack.*' => ['required', 'string'],
            'description' => ['sometimes', 'nullable', 'string'],
            'repo_url' => ['sometimes', 'nullable', 'url'],
            'live_url' => ['sometimes', 'nullable', 'url'],
            'project_type' => ['sometimes', Rule::in(['personal', 'client', 'open-source'])],
            'status' => ['sometimes', 'boolean']
        ];
    }
}
