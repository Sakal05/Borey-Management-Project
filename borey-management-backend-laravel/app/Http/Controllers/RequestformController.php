<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Validator;
use App\Models\Role;
use App\Models\Requestform;

class RequestformController extends Controller
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
            $data = Requestform::latest()->get();
        } else {
            $data = Requestform::where('user_id', $user->user_id)->latest()->get();
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
            return response()->json(['error' => 'Company users are not allowed to create user info records'], 403);
        }

        $validator = Validator::make($request->all(),[
            'category' => 'required|string|max:255',
            'request_description' => 'required',
            'image' => 'required', // Restrict the file types and size
            'request_status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        $username = $user->username;
        $fullname = $user->fullname;
        $email = $user->email;

        $requestform = Requestform::create([
            'user_id' => $user->user_id, // Associate the user ID
            'username' => $username,
            'fullname' => $fullname,
            'email' => $email,
            'category' => $request->category,
            'request_description' => $request->request_description,
            'path' => $request->image, // Save the image path in the database
            'request_status' => $request->request_status,
         ]);
        
        return response()->json($requestform, 200);
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $requestform = Requestform::find($id);
        if (is_null($requestform)) {
            return response()->json('Data not found', 404); 
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $requestform->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to view this form', 403);
        }

        return response()->json($requestform, 200);
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
        $validator = Validator::make($request->all(),[
            'category' => 'required|string|max:255',
            'request_description' => 'required',
            'new_image' => 'required', // Add validation for the new image
            'request_status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        $requestform = Requestform::find($id);
        // Check if the authenticated user is the owner of the form
        if ($user->user_id !== $requestform->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to update this form', 403);
        }

        $requestform->user_id;
        $requestform->username;
        $requestform->fullname;
        $requestform->email;
        $requestform->category = $request->category;
        $requestform->request_description = $request->request_description;
        $requestform->path = $request->new_image;
        $requestform->request_status = $request->request_status; // Update the environment_status value

        $requestform->save();
        

        return response($requestform, 200);
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy(Requestform $requestform)
    {
        $user = auth()->user();
        if ($user->user_id !== $requestform->user_id && $user->role->name !== Role::COMPANY) {
        // User is not authorized to delete this form
        return response()->json('You are not authorized to delete this form', 403);
        }

        $requestform->delete();
        
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

        $query = Requestform::query();

        // Add your search criteria based on your needs
        $query->where('user_id', auth()->user()->user_id)
        ->where(function ($innerQuery) use ($keyword) {
            $innerQuery->where('username', 'like', "%$keyword%")
                ->orWhere('fullname', 'like', "%$keyword%")
                ->orWhere('email', 'like', "%$keyword%")
                ->orWhere('category', 'like', "%$keyword%")
                ->orWhere('request_description', 'like', "%$keyword%")
                ->orWhere('request_status', 'like', "%$keyword%");
        });
        $results = $query->get();

        if ($results->isEmpty()) {
            return response()->json('No data found.', 404);
        }

        return response()->json($results);
    }
}
