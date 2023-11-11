<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\Api\ClassificationController;
use App\Http\Controllers\AppSettingsController;
use App\Http\Controllers\CalendarEventController;
use App\Http\Controllers\CampusController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReminderController;
use App\Http\Controllers\ReportCommentController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\SubmissionBinController;
use App\Http\Controllers\SuperAdminController;
use App\Http\Controllers\UnitHeadController;
use App\Http\Controllers\UsersController;
use App\Models\AppSettings;
use App\Models\CalendarEvent;
use App\Models\Reminder;
use App\Models\ReportComment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::prefix('/users')->group(function () {
    // Route::post('/check', [ProfileController::class, 'checkEmailAndPhone']);
    Route::post('/check', [UsersController::class, 'check']);
});

Route::prefix('/classifications')->group(function () {
    Route::get('/all', [ClassificationController::class, 'getAll'])->name('api.classifications.all');
});

Route::post('/image-upload', function (Request $request) {
    $image = $request->file('image');
    $imageName = $image->getClientOriginalName();
    $image->move(public_path('images'), $imageName);
    $imageUrl = "/images/" .  $imageName;

    return response()->json(['imageUrl' => $imageUrl]);
});

Route::post('/image-upload', function (Request $request) {
    $image = $request->file('image');
    $imageName = $image->getClientOriginalName();
    $image->move(public_path('images'), $imageName);
    $imageUrl = "/images/" .  $imageName;

    return response()->json(['imageUrl' => $imageUrl]);
});
Route::post('/file-upload', function (Request $request) {
    $file = $request->file('file');
    $fileName = $file->getClientOriginalName();
    $file->move(public_path('reports'), $fileName);
    $fileUrl = "/reports/" .  $fileName;

    return response()->json(['fileUrl' => $fileUrl]);
});

Route::post('/upload-report', [ReportController::class, 'addReport']);
Route::delete('/report/{id}/attachment', [ReportController::class, 'removeAttachment']);

Route::delete('/reminders/{id}', [ReminderController::class, 'delete']);
Route::delete('/announcements/{id}', [AnnouncementController::class, 'delete']);
Route::patch('/announcements/order', [AnnouncementController::class, 'order']);
Route::get('/announcements', [AnnouncementController::class, 'getAll']);
Route::get('/announcements/dashboard', [AnnouncementController::class, 'dashboard']);
Route::post('/unit-heads/designations', [AdminController::class, 'unit_heads_by_designation']);
Route::get('/admins', [AdminController::class, 'getAdmins']);
Route::get('/admins/{campus_id}', [AdminController::class, 'getAdminsByCampus']);


Route::prefix('/reports')->group(function () {
    Route::get('/{campus_id}/{submission_bin_id}/{unit_head_id}/all', [ReportController::class, 'all']);
    Route::get('/{campus_id}/{submission_bin_id}/{unit_head_id}/approved', [ReportController::class, 'getApproved']);
    Route::get('/{campus_id}/{designation_id}/unit_heads', [ReportController::class, 'unit_heads']);
    Route::get('/{campus_id}/unit_heads/{designation_id}', [ReportController::class, 'unit_heads_designated']);
    Route::get('/{campus_id}/unit_heads', [ReportController::class, 'unit_heads_campus']);
});

Route::prefix('/comments')->group(function () {
    Route::post('/add', [ReportCommentController::class, 'add']);
    Route::get('/{unit_head_id}/{submission_bin_id}/get', [ReportCommentController::class, 'get']);
});

Route::post('/policy/read', function (Request $request) {
    // $request->session()->put('has_read_policy', true);
    session(['has_read_policy' => true]);
    return response()->json(['success' => true]);
});


Route::prefix('/campus')->group(function () {
    Route::get('/', [CampusController::class, 'all']);
    Route::post('/', [CampusController::class, 'store']);
})->middleware(['auth']);

Route::prefix('/submissionBins')->group(function () {
    Route::get('/{id}', [SubmissionBinController::class, 'all']);
    Route::get('/{text}/search', [SubmissionBinController::class, 'search']);
    Route::delete('/{id}', [SubmissionBinController::class, 'delete']);
})->middleware(['auth']);

Route::prefix('/calendar')->group(function () {
    Route::get('/', [CalendarEventController::class, 'index']);
    Route::post('/', [CalendarEventController::class, 'store']);
    Route::delete('/{id}', [CalendarEventController::class, 'destroy']);
})->middleware(['auth']);

Route::prefix('/notifications')->group(function () {
    Route::get('/{id}', [NotificationController::class, 'get']);
    Route::get('/general/{user}', [NotificationController::class, 'general']);
    Route::get('/calendar/{user}', [NotificationController::class, 'calendar']);
    Route::patch('/read/{user}', [NotificationController::class, 'markAsRead']);
    Route::patch('/read/calendar/{user}', [NotificationController::class, 'markAsReadCalendar']);
})->middleware(['auth']);

Route::prefix('/unit_heads')->group(function () {
    Route::post('/delete/many', [UnitHeadController::class, 'deleteMany'])->name('unit_heads.delete.many');
})->middleware(['auth']);

Route::post('/admins/delete/many', [AdminController::class, 'deleteMany'])->name('admins.delete.many')->middleware(['auth', 'role:super_admin']);

Route::prefix('/reminders')->group(function () {
    Route::get('/', [ReminderController::class, 'all']);
})->middleware(['auth']);

Route::get('/policy', [AppSettingsController::class, 'getPolicy']);
