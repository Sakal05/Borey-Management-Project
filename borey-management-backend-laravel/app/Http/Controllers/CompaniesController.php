<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Companies;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Models\Role;

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

        $role = Role::where('name', 'company')->first();

        // Assign the role to the company
        $company->role_id = $role->id;
        $company->save();

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
}
