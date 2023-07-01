<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\User;
use App\Models\User_Info;
use App\Http\Resources\ElectricbillsResource;
use App\Models\electricbills;
use App\Models\Role;


class electricbillsController extends Controller
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
            $data = electricbills::latest()->get();
        } else {
            $data = electricbills::where('user_id', $user->user_id)->latest()->get();
        }
        
        return response($data, 200);
        // return response()->json([ElectricbillsResource::collection($data), 'Programs fetched.']);
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
            'category' => 'required',
            'date_payment' => 'required',
            'price' => 'required',
            'payment_status' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }
        
        $user = auth()->user();
        // $username = $user->username;
        // $fullname = $user->fullname;
        // $userInfo = $user->userInfo; 

        $userInfo = User_Info::where('user_id', $user->user_id)->first();

        $electricbills = electricbills::create([
            'user_id' => $userInfo->user_id, // Associate the user ID
            'username' => $userInfo->username,
            'fullname' => $userInfo->fullname,
            'phonenumber' => $userInfo->phonenumber, // Retrieve the value from the user info
            'house_type' => $userInfo->house_type, // Retrieve the value from the user info
            'house_number' => $userInfo->house_number, // Retrieve the value from the user info
            'street_number' => $userInfo->street_number, // Retrieve the value from the user info
            'category' => $request->category,
            'date_payment' => $request->date_payment,
            'price' => $request->price,
            'payment_status' => $request->payment_status,
        ]);
        

        return response($electricbills, 200);

    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id)
    {
        $electricbills = electricbills::find($id);
        if (is_null($electricbills)) {
            return response()->json('Bill not found', 404); 
        }

        // Check if the authenticated user is the owner of the form
        $user = auth()->user();
        if ($user->user_id !== $electricbills->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to view this bill', 403);
        }

        return response()->json($electricbills, 200);
        // return response()->json([new ElectricbillsResource($electricbills)]);
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
            'category' => 'required',
            'date_payment' => 'required',
            'price' => 'required',
            'payment_status' => 'required',
        ]);

        // Handling validation errors
        if ($validator->fails()) {
            return response()->json($validator->errors());       
        }

        $user = auth()->user();
        // Retrieve the existing User_info record
        $electricbills = electricbills::find($id);

        if (!$electricbills) {
            return response()->json('Bill not found', 404);
        }

        // Check if the authenticated user is the owner of the user info
        if ($user->user_id !== $electricbills->user_id && $user->role->name !== Role::COMPANY) {
            return response()->json('You are not authorized to update this bill', 403);
        }

        // Updating the electric bill form with the request data
        $electricbills->category = $request->category;
        $electricbills->date_payment = $request->date_payment;
        $electricbills->price = $request->price;
        $electricbills->payment_status = $request->payment_status;

        // Saving the updated electric bill form
        $electricbills->save();


        // Returning the response
        return response($$electricbills, 200);

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

        $electricbills = electricbills::find($id);

        if ($user->user_id !== $electricbills->user_id && $user->role->name !== Role::COMPANY) {
        // User is not authorized to delete this form
        return response()->json('You are not authorized to delete this bill', 403);
        }

        $electricbills->delete();

        return response()->json('Bill deleted successfully');
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

        $query = electricbills::query();

        // Add your search criteria based on your needs
        $query->where('user_id', auth()->user()->user_id)
        ->where(function ($innerQuery) use ($keyword) {
            $innerQuery->where('username', 'like', "%$keyword%")
                ->orWhere('fullname', 'like', "%$keyword%")
                ->orWhere('phonenumber', 'like', "%$keyword%")
                ->orWhere('house_type', 'like', "%$keyword%")
                ->orWhere('house_number', 'like', "%$keyword%")
                ->orWhere('street_number', 'like', "%$keyword%")
                ->orWhere('category', 'like', "%$keyword%")
                ->orWhere('date_payment', 'like', "%$keyword%")
                ->orWhere('price', 'like', "%$keyword%")
                ->orWhere('payment_status', 'like', "%$keyword%");
        });
        $results = $query->get();

        if ($results->isEmpty()) {
            return response()->json('No data found.', 404);
        }

        return response()->json($results);
    }

}
