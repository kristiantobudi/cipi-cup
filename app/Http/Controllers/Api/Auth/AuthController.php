<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
class AuthController extends Controller
{
     public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'email' => 'required|email',
            'password' => 'required',
            'confirmation_password' => 'required|same:password'
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        $input = $request->all();
        $input['password'] = bcrypt($input['password']);
        $input = User::create($input);
        $success['token'] = $input->createToken('MyApp')->accessToken;
        $success['name'] = $input->name;

        return $this->sendResponse($success, 'User register successfully.');
    }

    // Login User
    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validation Error.', $validator->errors());
        }

        if (Auth::attempt(['email' => $request->email, 'password' => $request->password])) {
            $user = Auth::user();
            $token = $user->createToken('MyApp')->plainTextToken;
            // $success['token'] = $user->createToken('MyApp')->$token = $user->createToken('MyApp')->plainTextToken;
            $success['name'] = $user->name;
            $success['token'] = $token;

            return $this->sendResponse($success, 'User login successfully.',);
        } else {
            return $this->sendError('Unauthorised.', ['error' => 'Email or Password is wrong'],);
        }
    }
}
