<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\JsonResponse;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;

abstract class Controller
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function sendResponse($result, $message): JsonResponse
    {
        return response()->json([
            'data' => $result,
            'message' => $message,
            'status' => 200
        ], 200);
    }

    public function sendError($error, $errorMessages = [], $code = 400): JsonResponse
    {
        $response = [
            'message' => $error,
            'status' => $code,
        ];

        if (!empty($errorMessages)) {
            $response['data'] = $errorMessages;
        }

        return response()->json($response, $code);
    }
}
