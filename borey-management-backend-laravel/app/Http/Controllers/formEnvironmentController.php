<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\formEnvironment;
use App\Models\User;
use App\Http\Resources\FormEnvironmentResource;


class formEnvironmentController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
            
        $userId = auth()->user()->user_id;

        $data = formEnvironment::where('user_id', $userId)->latest()->get();

        return response()->json([FormEnvironmentResource::collection($data), 'Programs fetched.']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(),[
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Restrict the file types and size
            'environment_status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }
        
        $user = auth()->user();
        $username = $user->username;
        $fullname = $user->fullname;
        $email = $user->email;

        $imagePath = $request->file('image')->store('images'); // Save the image to the 'images' directory


        $formEnvironment = formEnvironment::create([
            'user_id' => $user->user_id, // Associate the user ID
            'username' => $username,
            'fullname' => $fullname,
            'email' => $email,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'path' => $imagePath, // Save the image path in the database
            'environment_status' => $request->environment_status,
        ]);
        
        return response()->json(['Form created successfully.', new FormEnvironmentResource($formEnvironment)]);

        return response()->json(['error' => 'Image not found.'], 400);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $formEnvironment = formEnvironment::find($id);
        if (is_null($formEnvironment)) {
            return response()->json('Data not found', 404); 
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $formEnvironment->user_id) {
            return response()->json('You are not authorized to view this form', 403);
        }

        return response()->json([new FormEnvironmentResource($formEnvironment)]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, formEnvironment $formEnvironment)
    {
        $validator = Validator::make($request->all(),[
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'new_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Add validation for the new image
            'environment_status' => 'required',
    ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        // Check if the authenticated user is the owner of the form
        if ($user->user_id !== $formEnvironment->user_id) {
            return response()->json('You are not authorized to update this user info', 403);
        }

        $formEnvironment->user_id;
        $formEnvironment->username;
        $formEnvironment->fullname;
        $formEnvironment->email;
        $formEnvironment->category = $request->category;
        $formEnvironment->problem_description = $request->problem_description;

        if ($request->hasFile('new_image')) {
            // Delete the previous image if needed
            if ($formEnvironment->path) {
                Storage::delete('images/' . $formEnvironment->path);
            }
    
            // Store the new image
            $newImagePath = $request->file('new_image')->store('images');
            $formEnvironment->path = str_replace('images/', '', $newImagePath);
        }

        $formEnvironment->environment_status = $request->environment_status; // Update the environment_status value

        $formEnvironment->save();

        return response()->json(['Form updated successfully.', new FormEnvironmentResource($formEnvironment)]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(formEnvironment $formEnvironment)
    {

        $user = auth()->user();
        if ($user->id !== $formEnvironment->user_id) {
        // User is not authorized to delete this form
        return response()->json('You are not authorized to delete this form', 403);
        }
        $formEnvironment->delete();

        return response()->json('Form deleted successfully');
    }

    /**
     * Search user info records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $keyword = $request->input('keyword');

        $query = formEnvironment::query();

        // Add your search criteria based on your needs
        $query->where('user_id', auth()->user()->user_id)
        ->where(function ($innerQuery) use ($keyword) {
            $innerQuery->where('username', 'like', "%$keyword%")
                ->orWhere('fullname', 'like', "%$keyword%")
                ->orWhere('email', 'like', "%$keyword%")
                ->orWhere('category', 'like', "%$keyword%")
                ->orWhere('problem_description', 'like', "%$keyword%")
                ->orWhere('environment_status', 'like', "%$keyword%");
        });
        $results = $query->get();

        if ($results->isEmpty()) {
            return response()->json('No data found.', 404);
        }

        return response()->json($results);
    }

}
