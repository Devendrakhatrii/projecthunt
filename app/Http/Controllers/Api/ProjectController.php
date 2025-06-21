<?php

namespace App\Http\Controllers\Api;

use App\ApiResponse;
use App\Events\ProjectNotification;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreProjectRequest;
use App\Http\Requests\UpdateProjectRequest;
use App\Models\Project;
use App\Models\Notification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use App\LogResponse;

class ProjectController extends Controller
{
    use ApiResponse, LogResponse;

    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $projects = Project::with('user')->get();
            if ($projects->isEmpty()) {
                return $this->success([], 'No project');
            }
            return $this->success($projects, 'project fetched succesfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch projects', $e, 'project.index');
            return $this->failure('Failed fetching project');
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProjectRequest $request)
    {
        try {
            $validatedProject = $request->validated();

            $project = Project::create(['user_id' => Auth::id(), ...$validatedProject]);

            if ($project) {
                ProjectNotification::dispatch($project);
                return $this->success($project, 'project added successfully');
            }
        } catch (ValidationException $e) {
            $this->logError('Validation failed', $e, 'project.store', $request);
            return $this->failure('validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            $this->logError('Error creating project', $e, 'project.store', $request);
            return $this->failure('Failed creating project');
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        try {
            $project = Project::find($id);
            if (!$project) {
                return $this->success([], 'Project doesnot exist');
            }
            return $this->success($project, 'project fetched succesfully');
        } catch (\Exception $e) {
            $this->logError('Failed to fetch project', $e, 'project.show');
            return $this->failure('Failed fetching project');
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProjectRequest $request, string $id): JsonResponse
    {
        try {
            $project = Project::where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$project) {
                return $this->failure('Unauthorized or project not found', null, 403);
            }

            $validatedData = $request->validated();
            $project->update($validatedData);

            return $this->success(
                $project->fresh(),
                'Project updated successfully'
            );
        } catch (ValidationException $e) {
            $this->logError('Project validation failed', $e, 'project.update', $request);
            return $this->failure('Validation failed', $e->errors(), 422);
        } catch (\Exception $e) {
            $this->logError('Failed to update project', $e, 'project.update', $request);
            return $this->failure('Failed to update project');
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id): JsonResponse
    {
        try {
            $project = Project::where('id', $id)
                ->where('user_id', Auth::id())
                ->first();

            if (!$project) {
                return $this->failure('Unauthorized or project not found', null, 403);
            }

            $project->delete();

            return $this->success(null, 'Project deleted successfully');
        } catch (\Exception $e) {
            $this->logError('Failed to delete project', $e, 'project.destroy');
            return $this->failure('Failed to delete project');
        }
    }

    public function upvote(string $id)
    {
        try {
            Project::create();
            $count = Project::find('user_id', Auth::id());
            if ($count) {
                $count->decrement('count');
            }
            $count->increment('count');
            return $this->success([], 'upvoted');
        } catch (\Exception $e) {
            logger()->error(['error' => $e]);
            return $this->failure("couldn't upvote");
        }
    }


    public function search(Request $request)
    {
        try {
            $query = $request->input('search');
            $projects = Project::search($query)->get();

            return $this->success($projects, 'search successful');
        } catch (\Exception $e) {
            $this->logError('Failed to search projects', $e, 'project.search', $request);
            return $this->failure('Failed to search projects');
        }
    }
}
