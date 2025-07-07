<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\MemberController;
use App\Http\Controllers\ContributionController;
use App\Http\Controllers\DebtController;
use App\Http\Controllers\PenaltyController;
use App\Http\Controllers\DisasterPaymentController;
use App\Http\Controllers\DependentController;
use App\Http\Controllers\CertificateController; // Commented out due to dropped table
use App\Http\Controllers\AdminDashboardController;
use App\Http\Controllers\MemberDashboardController;
use App\Http\Controllers\FinancialsController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
                'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::get('members/export', [MemberController::class, 'export'])->name('members.export');
Route::post('members/import', [MemberController::class, 'import'])->name('members.import');
Route::get('members/template', [MemberController::class, 'downloadTemplate'])->name('members.template');
Route::get('financials', [FinancialsController::class, 'index'])->name('financials.index');
Route::get('contributions/export', [ContributionController::class, 'export'])->name('contributions.export');
Route::post('contributions/import', [ContributionController::class, 'import'])->name('contributions.import');
Route::post('contributions/validate-import', [ContributionController::class, 'validateImport'])->name('contributions.validateImport');
Route::get('contributions/template', [ContributionController::class, 'downloadTemplate'])->name('contributions.template');
Route::resource('contributions', ContributionController::class)->only(['index', 'store']);
Route::resource('disaster-payments', DisasterPaymentController::class)->only(['store']);
Route::patch('penalties/{penalty}/mark-as-paid', [PenaltyController::class, 'markAsPaid'])->name('penalties.markAsPaid');
Route::resource('debts', DebtController::class)->only(['store']);
Route::patch('debts/{debt}/mark-as-paid', [DebtController::class, 'markAsPaid'])->name('debts.markAsPaid');
Route::resource('dependents', DependentController::class);
Route::resource('certificates', CertificateController::class); // Commented out due to dropped table

Route::middleware(['auth', 'verified', 'is_admin'])->group(function () {
    Route::get('/admin/dashboard', [AdminDashboardController::class, 'index'])->name('admin.dashboard');
    // Route::post('certificates/{certificate}/approve', [CertificateController::class, 'approve'])->name('certificates.approve'); // Commented out due to dropped table
    // Route::post('certificates/{certificate}/reject', [CertificateController::class, 'reject'])->name('certificates.reject'); // Commented out due to dropped table
    Route::post('dependents/{dependent}/approve', [DependentController::class, 'approve'])->name('dependents.approve');
    Route::post('dependents/{dependent}/reject', [DependentController::class, 'reject'])->name('dependents.reject');
    Route::get('/admin/report', [AdminDashboardController::class, 'report'])->name('admin.report');
    Route::get('/admin/reports', [AdminDashboardController::class, 'reportsPage'])->name('admin.reports');
    Route::get('/admin/charts', [AdminDashboardController::class, 'chartsPage'])->name('admin.charts');
    Route::get('/admin/settings', [AdminDashboardController::class, 'settings'])->name('admin.settings');
    Route::post('/admin/settings', [AdminDashboardController::class, 'updateSettings'])->name('admin.settings.update');
    Route::post('/admin/settings/backup', [AdminDashboardController::class, 'backup'])->name('admin.settings.backup');
    Route::post('/admin/users/{user}/update-role', [AdminDashboardController::class, 'updateUserRole'])->name('admin.users.updateRole');
    Route::get('/admin/roles', [AdminDashboardController::class, 'roles'])->name('admin.roles');
    Route::post('/admin/roles', [AdminDashboardController::class, 'createRole'])->name('admin.roles.create');
    Route::put('/admin/roles/{role}', [AdminDashboardController::class, 'updateRole'])->name('admin.roles.update');
    Route::delete('/admin/roles/{role}', [AdminDashboardController::class, 'deleteRole'])->name('admin.roles.delete');
    Route::post('/admin/roles/{role}/permissions', [AdminDashboardController::class, 'assignPermissionsToRole'])->name('admin.roles.permissions.assign');
    Route::post('/admin/permissions', [AdminDashboardController::class, 'createPermission'])->name('admin.permissions.create');
    Route::put('/admin/permissions/{permission}', [AdminDashboardController::class, 'updatePermission'])->name('admin.permissions.update');
    Route::delete('/admin/permissions/{permission}', [AdminDashboardController::class, 'deletePermission'])->name('admin.permissions.delete');
    Route::get('/admin/members', [MemberController::class, 'index'])->name('admin.members.index');
    Route::get('/admin/members/{member}', [MemberController::class, 'show'])->name('admin.members.show');
    Route::post('/admin/members', [MemberController::class, 'store'])->name('members.store');
    Route::match(['PUT', 'POST'], '/admin/members/{member}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/admin/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');
    Route::get('/admin/financials', [FinancialsController::class, 'index'])->name('admin.financials.index');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/member/dashboard', [MemberDashboardController::class, 'index'])->name('member.dashboard');
    Route::get('/member/dependents', [DependentController::class, 'memberIndex'])->name('member.dependents');
});

require __DIR__.'/auth.php';
