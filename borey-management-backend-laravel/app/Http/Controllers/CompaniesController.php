<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Companies;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Models\User;
use App\Models\formGeneral;
use App\Http\Resources\FormGeneralResource;


class CompaniesController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'company_name' => 'required',
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed',
        ]);

        if (Companies::where('email', $request->email)->first()) {
            return response([
                'message' => 'Email already exists',
                'status' => 'failed'
            ], 200);
        }

        $company = Companies::create([
            'company_name' => $request->company_name,
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'date_registered' => now(), // Set the current date and time
        ]);

        $token = $company->createToken($request->email)->plainTextToken;
        return response([
            'token' => $token,
            'message' => 'Registration Success',
            'status' => 'success'
        ], 201);
    }

    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);
        $company = Companies::where('email', $request->email)->first();
        if ($company && Hash::check($request->password, $company->password)) {
            $token = $company->createToken($request->email)->plainTextToken;
            return response([
                'token' => $token,
                'message' => 'Login Success',
                'status' => 'success'
            ], 200);
        }
        return response([
            'message' => 'The Provided Credentials are incorrect',
            'status' => 'failed'
        ], 401);
    }

    public function logout()
    {
        auth()->user()->tokens()->delete();
        return response([
            'message' => 'Logout Success',
            'status' => 'success'
        ], 200);
    }

    public function logged_company()
    {
        $loggedCompany = auth()->user();
        return response([
            'company' => $loggedCompany,
            'message' => 'Logged Company Data',
            'status' => 'success'
        ], 200);
    }

    public function change_password(Request $request)
    {
        $request->validate([
            'password' => 'required|confirmed',
        ]);
        $loggedCompany = auth()->user();
        $loggedCompany->password = Hash::make($request->password);
        $loggedCompany->save();
        return response([
            'message' => 'Password Changed Successfully',
            'status' => 'success'
        ], 200);
    }

    public function users($id)
    {
        // $company = Companies::findOrFail($id);
        auth()->user();
        // // Load the users associated with the company
        // $users = $company->users;

        $users = User::where('company_id', $id)->get();
        
        // Perform any necessary operations on the users
        
        return response()->json($users);
    }

    public function updateStatus(Request $request, formGeneral $formGeneral)
    {
        $validator = Validator::make($request->all(), [
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'new_image' => 'required', // Add validation for the new image
            'general_status' => 'required',
        ]);

        if ($validator->fails()) {
            return response()->json($validator->errors(), 505);
        }
        $user = auth()->user();
        // $user = auth()->user();
        // Check if the authenticated user is the owner of the form
        // ======= @!!!!!!!!! add company id column to the table to perform auth to company

        $formGeneral->user_id = $request->user_id;
        $formGeneral->username = $request->username;
        $formGeneral->fullname = $request->fullname;
        $formGeneral->email = $request->email;
        $formGeneral->category = $request->category;
        $formGeneral->problem_description = $request->problem_description;
        $formGeneral->path = $request->new_image;
        $formGeneral->general_status = $request->general_status; // Update the environment_status value

        $formGeneral->save();

        return response()->json(['Form updated successfully.', new FormGeneralResource($formGeneral)]);
    }

    
}
