<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Admin;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Carbon;
use App\Models\Role;

class AdminController extends Controller
{
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required',
            'email' => 'required|email',
            'password' => 'required|confirmed',
        ]);

        if (Admin::where('email', $request->email)->first()) {
            return response([
                'message' => 'Email already exists',
                'status' => 'failed'
            ], 200);
        }

        $admin = Admin::create([
            'username' => $request->username,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'date_registered' => now(), // Set the current date and time
        ]);

        $role = Role::where('name', 'admin')->first();

        // Assign the role to the admin
        $admin->role_id = $role->id;
        $admin->save();

        $token = $admin->createToken($request->email)->plainTextToken;
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
        $admin = Admin::where('email', $request->email)->first();
        if ($admin && Hash::check($request->password, $admin->password)) {
            $token = $admin->createToken($request->email)->plainTextToken;
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

    public function logged_admin()
    {

        $loggedAdmin = auth()->user();
        if ($loggedAdmin->role->name !== Role::ADMIN) {
            return response()->json(['error' => 'Unauthorized, you must be a admin!'], 403);
        }
        return response([
            'admin' => $loggedAdmin,
            'message' => 'Logged admin Data',
            'status' => 'success'
        ], 200);
    }

    public function change_password(Request $request)
    {
        $request->validate([
            'password' => 'required|confirmed',
        ]);
        $loggedAdmin = auth()->user();
        $loggedAdmin->password = Hash::make($request->password);
        $loggedAdmin->save();
        return response([
            'message' => 'Password Changed Successfully',
            'status' => 'success'
        ], 200);
    }
}