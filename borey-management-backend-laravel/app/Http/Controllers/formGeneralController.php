<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Validator;
use App\Models\formGeneral;
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
        $data = formGeneral::latest()->get();
        return response()->json([FormGeneralResource::collection($data), 'Programs fetched.']);
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
            'username' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'path' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $formGeneral = formGeneral::create([
            'username' => $request->username,
            'name' => $request->name,
            'email' => $request->email,
            'category' => $request->category,
            'problem_description' => $request->problem_description,
            'path' => $request->path,
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
            'username' => 'required|string|max:255',
            'name' => 'required|string|max:255',
            'email' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'problem_description' => 'required',
            'path' => 'required',
        ]);

        if($validator->fails()){
            return response()->json($validator->errors());       
        }

        $formGeneral->username = $request->username;
        $formGeneral->name = $request->name;
        $formGeneral->email = $request->email;
        $formGeneral->category = $request->category;
        $formGeneral->problem_description = $request->problem_description;
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
        $formGeneral->delete();

        return response()->json('Form deleted successfully');
    }
}