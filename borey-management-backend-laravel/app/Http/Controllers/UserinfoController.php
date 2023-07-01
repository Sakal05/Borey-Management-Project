<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\User_info;
use App\Models\User;
use App\Http\Resources\UserinfoResource;
use App\Models\Role;

class UserinfoController extends Controller
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
            $data = User_Info::with('user')->latest()->get();
        } else {
            $data = User_Info::where('user_id', $user->user_id)->latest()->get();
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

        // Check if the user already has a user_info record
        if ($user->user_info) {
            return response()->json(['error' => 'User already has a user info record'], 400);
        }

        // Check if the authenticated user is a company
        if ($user->role->name === Role::COMPANY) {
            return response()->json(['error' => 'Company users are not allowed to create user info records'], 403);
        }

        $validator = Validator::make($request->all(), [
            'image' => 'required',
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

        $userinfo = User_info::create([
            'user_id' => $user->user_id, // Associate the user ID
            'image_cid' => $request->image,
            'dob' => $request->dob,
            'gender' => $request->gender,
            'phonenumber' => $request->phonenumber,
            'house_type' => $request->house_type,
            'house_number' => $request->house_number,
            'street_number' => $request->street_number,
        ]);

        
        return response()->json($userinfo, 200);
        // return response()->json(['message' => 'User Info created successfully', 'userinfo' => new UserinfoResource($userinfo)]);
    }


    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $userinfo = User_info::where('user_id', $id)->with('user')->get()->firstOrFail();
        if (is_null($userinfo)) {
            return response()->json('Data not found', 404);
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $userinfo->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to view this user info', 403);
        }

        return response($userinfo, 200);
    }

    public function logged_user_info()
    {
        $user_id = auth()->user()->user_id;
        $userinfo = User_info::where('user_id', $user_id)->with('user')->get()->firstOrFail();
        return response([
            'user' => $userinfo,
            'message' => 'Logged User Data',
            'status' => 'success'
        ], 200);

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

        // $validator = Validator::make($request->all(), [
        //     'image_cid' => 'required',
        //     'dob' => 'required',
        //     'gender' => 'required|string|max:255',
        //     'phonenumber' => 'required|string|max:255',
        //     'house_type' => 'required|string|max:255',
        //     'house_number' => 'required|string|max:255',
        //     'street_number' => 'required|string|max:255',
        // ]);

        // if ($validator->fails()) {
        //     return response()->json($validator->errors());       
        // }

        $user = auth()->user();
        // Retrieve the existing User_info record
        $userinfo = User_info::find($id);

        if (!$userinfo) {
            return response()->json('User info not found', 404);
        }

        // Check if the authenticated user is the owner of the user info or a company

        if ($user->user_id !== $userinfo->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to update this user info', 403);
        }

        $userinfo->image_cid = $request->image_cid;
        $userinfo->dob = $request->dob;
        $userinfo->gender = $request->gender;
        $userinfo->phonenumber = $request->phonenumber;
        $userinfo->house_type = $request->house_type;
        $userinfo->house_number = $request->house_number;
        $userinfo->street_number = $request->street_number;
        $userinfo->save();


        // Update the user record
        $userTable = User::where('user_id', $userinfo->user_id)->first();
        if (!$userTable) {
            return response()->json('User not found', 404);
        }

        // Update the user data
        if ($request->has('user.fullname') && $request->has('user.company_id')) {
            $userTable->fullname = $request->input('user.fullname');
            $userTable->company_id = $request->input('user.company_id');
            $userTable->save();
        } else if ($request->has('user.company_id') !== null) {
            $userTable->company_id = $request->input('user.company_id');
            $userTable->save();
        } else if ($request->has('user.fullname') !== null ){
            $userTable->fullname = $request->input('user.fullname');
            $userTable->save();
        }

        $userinfo = User_info::where('user_id', $userinfo->user_id)->with('user')->get()->firstOrFail();

        return response($userinfo, 200);

    }


    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id)
    {

        // Retrieve the existing User_info record
        $userinfo = User_Info::find($id);

        if (!$userinfo) {
            return response()->json('User info not found', 404);
        }

        // Check if the authenticated user is the owner of the user info or a company
        $user = auth()->user();
        if ($user->id !== $userinfo->user_id && $user->role->name !== Role::COMPANY) {
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
