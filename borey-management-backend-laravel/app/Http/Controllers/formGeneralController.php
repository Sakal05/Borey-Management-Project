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
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'image' => 'required', // Restrict the file types and size
            'general_status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        $username = $user->username;
        $fullname = $user->fullname;
        $email = $user->email;

        $formGeneral = formGeneral::create([
            'user_id' => $user->user_id, // Associate the user ID
            'username' => $username,
            'fullname' => $fullname,
            'email' => $email,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'path' => $request->image, // Save the image path in the database
            'general_status' => $request->general_status,
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
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'new_image' => 'required', // Add validation for the new image
            'general_status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        // Check if the authenticated user is the owner of the form
        if ($user->user_id !== $formGeneral->user_id) {
            return response()->json('You are not authorized to update this form', 403);
        }

        $formGeneral->user_id;
        $formGeneral->username;
        $formGeneral->fullname;
        $formGeneral->email;
        $formGeneral->category = $request->category;
        $formGeneral->problem_description = $request->problem_description;
        $formGeneral->image = $request->new_image;
        $formGeneral->general_status = $request->general_status; // Update the environment_status value

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

    /**
     * Search user info records.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function search(Request $request)
    {
        $keyword = $request->input('keyword');

        $query = formGeneral::query();

        // Add your search criteria based on your needs
        $query->where('user_id', auth()->user()->user_id)
        ->where(function ($innerQuery) use ($keyword) {
            $innerQuery->where('username', 'like', "%$keyword%")
                ->orWhere('fullname', 'like', "%$keyword%")
                ->orWhere('email', 'like', "%$keyword%")
                ->orWhere('category', 'like', "%$keyword%")
                ->orWhere('problem_description', 'like', "%$keyword%")
                ->orWhere('general_status', 'like', "%$keyword%");
        });
        $results = $query->get();

        if ($results->isEmpty()) {
            return response()->json('No data found.', 404);
        }

        return response()->json($results);
    }
}