<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\formGeneral;
use App\Models\User;
use App\Http\Resources\FormGeneralResource;

class formGeneralController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $userId = auth()->user()->user_id;

        $data = formGeneral::where('user_id', $userId)->latest()->get();
        return response()->json([FormGeneralResource::collection($data), 'Programs fetched.']);

        // $data = formGeneral::latest()->get();
        // return response()->json([FormGeneralResource::collection($data), 'Programs fetched.']);
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
            'fullname' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Restrict the file types and size
    
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        $username = $user->username;

        $imagePath = $request->file('image')->store('images'); // Save the image to the 'images' directory

        $formGeneral = formGeneral::create([
            'user_id' => $user->user_id, // Associate the user ID
            'username' => $username,
            'fullname' => $request->fullname,
            'email' => $request->email,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'path' => $imagePath, // Save the image path in the database
         ]);
        
        return response()->json(['Form created successfully.', new FormGeneralResource($formGeneral)]);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $formGeneral = formGeneral::find($id);
        if (is_null($formGeneral)) {
            return response()->json('Data not found', 404); 
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $formGeneral->user_id) {
            return response()->json('You are not authorized to view this form', 403);
        }

        return response()->json([new FormGeneralResource($formGeneral)]);
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, formGeneral $formGeneral)
    {
        $validator = Validator::make($request->all(),[
            'fullname' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'new_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Add validation for the new image
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();

        $formGeneral->user_id;
        $formGeneral->username;
        $formGeneral->fullname = $request->fullname;
        $formGeneral->email = $request->email;
        $formGeneral->category = $request->category;
        $formGeneral->problem_description = $request->problem_description;

        if ($request->hasFile('new_image')) {
            // Delete the previous image if needed
            if ($formGeneral->path) {
                Storage::delete('images/' . $formGeneral->path);
            }
    
            // Store the new image
            $newImagePath = $request->file('new_image')->store('images');
            $formGeneral->path = str_replace('images/', '', $newImagePath);
        }

        $formGeneral->save();
        
        return response()->json(['Form updated successfully.', new FormGeneralResource($formGeneral)]);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(formGeneral $formGeneral)
    {
        $user = auth()->user();
        if ($user->id !== $formGeneral->user_id) {
        // User is not authorized to delete this form
        return response()->json('You are not authorized to delete this form', 403);
        }

        $formGeneral->delete();
        
        return response()->json('Form deleted successfully');
    }
}