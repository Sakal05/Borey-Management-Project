<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\Post;
use App\Models\Role;

class PostController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {

        $user = auth()->user();

        // Check if the authenticated user is a company
        if ($user->role->name === Role::COMPANY) {
            $data = Post::latest()->get();
        } else {
            $data = Post::where('user_id', $user->user_id)->latest()->get();
        }
        
        return response($data, 200);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        $user = auth()->user();

        // Check if the authenticated user is a company
        if ($user->role->name === Role::COMPANY) {
            return response()->json(['error' => 'Company users are not allowed to create the records'], 403);
        }
        
        $validator = Validator::make($request->all(),[
            'content_type' => 'required',
            'heading' => 'required',
            'description' => 'required',
            'image' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }
        
        $user = auth()->user();

        $posts = Post::create([
            'user_id' => $user->user_id, // Associate the user ID
            'content_type' => $request->content_type,
            'heading' => $request->heading,
            'description' => $request->description,
            'image' => $request->image,
        ]);
        
        return response()->json($posts, 200);
        
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $posts = Post::find($id);
        if (is_null($posts)) {
            return response()->json('Post not found', 404); 
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $posts->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to view this Post', 403);
        }

        return response()->json($posts, 200);

    }


    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id)
    {
        // Validating the request data
        $validator = Validator::make($request->all(), [
            'content_type' => 'required',
            'heading' => 'required',
            'description' => 'required',
            'image' => 'required',
        ]);

        // Handling validation errors
        if ($validator->fails()) {
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        // Retrieve the existing Security bill record
        $posts = Post::find($id);

        if (!$posts) {
            return response()->json('Post not found', 404);
        }

        // Check if the authenticated user is the owner of the user info
        if ($user->user_id !== $posts->user_id) {
            return response()->json('You are not authorized to update this post', 403);
        }

        // Updating the electric bill form with the request data
        $posts->content_type = $request->content_type;
        $posts->heading = $request->heading;
        $posts->description = $request->description;
        $posts->image = $request->image;

        // Saving the updated electric bill form
        $posts->save();

        return response()->json($posts, 200);
        // return response()->json(['Bill updated successfully.', new WaterbillsResource($waterbills)]);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        $user = auth()->user();

        $posts = Post::find($id);

        if ($user->user_id !== $posts->user_id && $user->role->name !== Role::COMPANY) {
        // User is not authorized to delete this form
        return response()->json('You are not authorized to delete this post', 403);
        }
        $posts->delete();

        return response()->json('Post deleted successfully');
    }

    /**
     * Search user info records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        // Retrieve the keyword from the request
        $keyword = $request->input('keyword');

        $user = auth()->user();

        $query = Post::query();

        if (!$user->role) {
            return response()->json('You are not authorized to perform this action', 403);
        }

        // Check if the authenticated user is a company
        if ($user->role->name === Role::COMPANY) {
            // Add your search criteria for company role here
            $query->where(function ($innerQuery) use ($keyword) {
                $innerQuery->where('username', 'like', "%$keyword%")
                    ->orWhere('content_type', 'like', "%$keyword%")
                    ->orWhere('heading', 'like', "%$keyword%")
                    ->orWhere('description', 'like', "%$keyword%")
                    ->orWhere('image', 'like', "%$keyword%");
            });
        } else {
            // Add your search criteria for other roles here
            $query->where('user_id', $user->id)->where(function ($innerQuery) use ($keyword) {
                $innerQuery->where('username', 'like', "%$keyword%")
                ->orWhere('content_type', 'like', "%$keyword%")
                ->orWhere('heading', 'like', "%$keyword%")
                ->orWhere('description', 'like', "%$keyword%")
                ->orWhere('image', 'like', "%$keyword%");
            });
        }

        $results = $query->get();

        if ($results->isEmpty()) {
            return response()->json('No data found.', 404);
        }

        return response()->json($results);
    }



}
