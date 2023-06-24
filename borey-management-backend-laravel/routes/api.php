<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Headers: Authorization');

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\UserController;
use App\Http\Controllers\PasswordResetController;
use App\Http\Controllers\FormGeneralController;
use App\Http\Controllers\FormEnvironmentController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Public Routes
Route::post('/register', [UserController::class, 'register']);
Route::post('/login', [UserController::class, 'login']);
Route::post('/send-reset-password-email', [PasswordResetController::class, 'send_reset_password_email']);
Route::post('/reset-password/{token}', [PasswordResetController::class, 'reset']);
//Route::resource('form_generals', FormGeneralController::class);

// Protected Routes
Route::middleware(['auth:sanctum'])->group(function(){
    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/loggeduser', [UserController::class, 'logged_user']);
    Route::post('/changepassword', [UserController::class, 'change_password']);
    //Route::resource('/form_generals', [FormGeneralController::class]);
    Route::resource('form_generals', FormGeneralController::class);
    Route::post('form_generals/{form_general}', [FormGeneralController::class, 'update'])->name('form_generals.update');
    
    Route::resource('form_environments', FormEnvironmentController::class);
    Route::post('form_environments/{form_environment}', [FormEnvironmentController::class, 'update'])->name('form_environments.update');

});

