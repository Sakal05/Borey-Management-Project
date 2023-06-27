<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\User_info;
use App\Http\Resources\UserinfoResource;


class UserinfoController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
            
        $userId = auth()->user()->user_id;

        $data = User_info::where('user_id', $userId)->latest()->get();

        return response()->json([UserinfoResource::collection($data), 'Programs fetched.']);
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request){
        $user = auth()->user();

        // Check if the user already has a user_info record
        if ($user->user_info) {
            return response()->json(['error' => 'User already has a user info record'], 400);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dob' => 'required',
            'gender' => 'required|string|max:255',
            'phonenumber' => 'required|string|max:255',
            'house_type' => 'required|string|max:255',
            'house_number' => 'required|string|max:255',
            'street_number' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 400);       
        }

        // Check if the user_info record already exists for the user
        $existingUserInfo = User_info::where('user_id', $user->user_id)->first();
        if ($existingUserInfo) {
            return response()->json(['error' => 'User already has a user info record'], 400);
        }

        $user = auth()->user();

        $imagePath = $request->file('image')->store('images'); // Save the image to the 'images' directory


        $userinfo = User_info::create([
            'user_id' => $user->user_id, // Associate the user ID
            'path' => $imagePath,
            'dob' => $request->dob,
            'gender' => $request->gender,
            'phonenumber' => $request->phonenumber,
            'house_type' => $request->house_type,
            'house_number' => $request->house_number,
            'street_number' => $request->street_number,
        ]);
        
        return response()->json(['message' => 'User Info created successfully', 'userinfo' => new UserinfoResource($userinfo)]);

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
        $userinfo = User_info::find($id);
        if (is_null($userinfo)) {
            return response()->json('Data not found', 404); 
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $userinfo->user_id) {
            return response()->json('You are not authorized to view this user info', 403);
        }

        return response()->json([new UserinfoResource($userinfo)]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id){

        $validator = Validator::make($request->all(), [
            'new_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
            'dob' => 'required',
            'gender' => 'required|string|max:255',
            'phonenumber' => 'required|string|max:255',
            'house_type' => 'required|string|max:255',
            'house_number' => 'required|string|max:255',
            'street_number' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        // Retrieve the existing User_info record
        $userinfo = User_info::find($id);

        if (!$userinfo) {
            return response()->json('User info not found', 404);
        }

        // Check if the authenticated user is the owner of the user info
        if ($user->user_id !== $userinfo->user_id) {
            return response()->json('You are not authorized to update this user info', 403);
        }

        

        if ($request->hasFile('new_image')) {
            // Delete the previous image if needed
            if ($userinfo->path) {
                Storage::delete('images/' . $userinfo->path);
            }

            // Store the new image
            $newImagePath = $request->file('new_image')->store('images');
            $userinfo->path = str_replace('images/', '', $newImagePath);
        }

        $userinfo->dob = $request->dob;
        $userinfo->gender = $request->gender;
        $userinfo->phonenumber = $request->phonenumber;
        $userinfo->house_type = $request->house_type;
        $userinfo->house_number = $request->house_number;
        $userinfo->street_number = $request->street_number;
        $userinfo->save();

        return response()->json(['message' => 'User info updated successfully.', 'userinfo' => new UserinfoResource($userinfo)]);
    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(User_info $userinfo)
    {

        $user = auth()->user();
        if ($user->user_id !== $userinfo->user_id) {
            // User is not authorized to delete this form
            return response()->json('You are not authorized to delete this user info', 403);
        }
        $userinfo->delete();

        return response()->json('User info deleted successfully');
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

        $query = User_Info::query();

        // Add your search criteria based on your needs
        $query->where('user_id', auth()->user()->user_id)
        ->where(function ($innerQuery) use ($keyword) {
            $innerQuery->where('dob', 'like', "%$keyword%")
                ->orWhere('gender', 'like', "%$keyword%")
                ->orWhere('phonenumber', 'like', "%$keyword%")
                ->orWhere('house_type', 'like', "%$keyword%")
                ->orWhere('house_number', 'like', "%$keyword%")
                ->orWhere('street_number', 'like', "%$keyword%");
        });
        $results = $query->get();

        if ($results->isEmpty()) {
            return response()->json('No data found.', 404);
        }
        
        return response()->json($results);
    }

}
