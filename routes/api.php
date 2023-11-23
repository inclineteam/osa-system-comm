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
    Route::post('/check', [UsersController::class, 'check'])->name('users.check');
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
})->name('image.upload');

Route::post('/file-upload', function (Request $request) {
    $file = $request->file('file');
    $fileName = $file->getClientOriginalName();
    $file->move(public_path('reports'), $fileName);
    $fileUrl = "/reports/" .  $fileName;

    return response()->json(['fileUrl' => $fileUrl]);
});

Route::post('/upload-report', [ReportController::class, 'addReport'])->name('report.upload');
Route::delete('/report/{id}/attachment', [ReportController::class, 'removeAttachment'])->name('report.attachment.delete');

Route::delete('/reminders/{id}', [ReminderController::class, 'delete'])->name('reminder.delete');
Route::get('/reminders/latest', [ReminderController::class, 'getLatest'])->name('reminder.latest');
Route::delete('/announcements/{id}', [AnnouncementController::class, 'delete'])->name('announcements.delete');
Route::patch('/announcements/order', [AnnouncementController::class, 'order']);
Route::get('/announcements', [AnnouncementController::class, 'getAll'])->name('announcements.index');
Route::get('/announcements/latest', [AnnouncementController::class, 'getLatest'])->name('announcements.latest');
Route::get('/announcements/dashboard', [AnnouncementController::class, 'dashboard'])->name('announcements.dashboard');
Route::post('/unit-heads/designations', [AdminController::class, 'unit_heads_by_designation'])->name('unit_heads.designations');
Route::get('/admins', [AdminController::class, 'getAdmins'])->name('admins');
Route::get('/admins/{campus_id}', [AdminController::class, 'getAdminsByCampus']);


Route::prefix('/reports')->group(function () {
    Route::get('/{campus_id}/{submission_bin_id}/{unit_head_id}/all', [ReportController::class, 'all'])->name('reports.all.index');
    Route::get('/{campus_id}/{submission_bin_id}/{unit_head_id}/approved', [ReportController::class, 'getApproved'])->name('reports.approved.index');
    Route::get('/{campus_id}/{designation_id}/unit_heads', [ReportController::class, 'unit_heads'])->name('reports.designation.unit_heads.index');
    Route::get('/{campus_id}/unit_heads/{designation_id}', [ReportController::class, 'unit_heads_designated']);
    Route::get('/{campus_id}/unit_heads', [ReportController::class, 'unit_heads_campus'])->name('reports.unit_heads.index');
});

Route::prefix('/comments')->group(function () {
    Route::post('/add', [ReportCommentController::class, 'add'])->name('comments.add');
    Route::get('/{unit_head_id}/{submission_bin_id}/get', [ReportCommentController::class, 'get'])->name('comments.unit_head.sub_bin_id.index');
});

Route::prefix('/campus')->group(function () {
    Route::get('/', [CampusController::class, 'all'])->name('campus.index');
    Route::post('/', [CampusController::class, 'store'])->name('campus.store');
})->middleware(['auth']);

Route::prefix('/submissionBins')->group(function () {
    Route::get('/{id}', [SubmissionBinController::class, 'all'])->name('submission-bins.index');
    Route::get('/{text}/search', [SubmissionBinController::class, 'search'])->name('submission-bins.search');
    Route::delete('/{id}', [SubmissionBinController::class, 'delete'])->name('submission-bins.delete');
})->middleware(['auth']);

Route::prefix('/calendar')->group(function () {
    Route::get('/', [CalendarEventController::class, 'index'])->name('calendar.index');
    Route::post('/', [CalendarEventController::class, 'store'])->name('calendar.store');
    Route::delete('/{id}', [CalendarEventController::class, 'destroy'])->name('calendar.destroy');
})->middleware(['auth']);

Route::prefix('/notifications')->group(function () {
    Route::get('/{id}', [NotificationController::class, 'get']);
    Route::get('/general/{user}', [NotificationController::class, 'general'])->name('notifications.general');
    Route::get('/calendar/{user}', [NotificationController::class, 'calendar'])->name('notifications.calendar');
    Route::patch('/read/{user}', [NotificationController::class, 'markAsRead'])->name('notifications.read.general');
    Route::patch('/read/calendar/{user}', [NotificationController::class, 'markAsReadCalendar'])->name('notifications.read.calendar');
})->middleware(['auth']);

Route::prefix('/unit_heads')->group(function () {
    Route::post('/delete/many', [UnitHeadController::class, 'deleteMany'])->name('unit_heads.delete.many');
})->middleware(['auth']);

Route::prefix('/admins')->group(function () {
    Route::post('/delete/many', [AdminController::class, 'deleteMany'])->name('admins.delete.many');
})->middleware(['auth', 'role:super_admin']);

Route::prefix('/reminders')->group(function () {
    Route::get('/', [ReminderController::class, 'all']);
})->middleware(['auth']);

Route::get('/policy', [AppSettingsController::class, 'getPolicy'])->name('policy');

// Route::post('/policy/read', function (Request $request) {
//     $request->session()->put('has_read_policy', true);
//     return redirect()->back();
// })->name('policy.read');

Route::group(['middleware' => ['web']], function () {
    Route::post('/policy/read', function (Request $request) {
        $request->session()->put('has_read_policy', true);
        return redirect()->back();
    })->name('policy.read');
});
