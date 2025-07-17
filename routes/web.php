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

// Marketing website route
Route::get('/', function () {
    return response()->file(public_path('marketing/index.html'));
});

// Serve marketing website assets
Route::get('/marketing', function () {
    return response()->file(public_path('marketing/index.html'));
});

// Original welcome route (for development/testing)
Route::get('/welcome', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

// Legacy profile routes - redirect to role-specific routes
Route::middleware('auth')->group(function () {
    Route::get('/profile', function () {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return redirect()->route('admin.profile.show');
        }
        return redirect()->route('member.profile.show');
    })->name('profile.show');

    Route::get('/profile/edit', function () {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return redirect()->route('admin.profile.edit');
        }
        return redirect()->route('member.profile.edit');
    });

    Route::get('/profile/security', function () {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return redirect()->route('admin.profile.security');
        }
        return redirect()->route('member.profile.security');
    });

    Route::get('/profile/settings', function () {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return redirect()->route('admin.profile.settings');
        }
        return redirect()->route('member.profile.settings');
    });

    Route::get('/profile/activities', function () {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return redirect()->route('admin.profile.activities');
        }
        return redirect()->route('member.profile.activities');
    });
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
Route::post('penalties/mark-multiple-as-paid', [PenaltyController::class, 'markMultipleAsPaid'])->name('penalties.markMultipleAsPaid');
Route::post('penalties/recalculate-member', [PenaltyController::class, 'recalculateForMember'])->name('penalties.recalculateForMember');
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

    // Backup Management Routes
    Route::get('/admin/backups', [\App\Http\Controllers\BackupController::class, 'index'])->name('admin.backups.index');
    Route::post('/admin/backups/create', [\App\Http\Controllers\BackupController::class, 'create'])->name('admin.backups.create');
    Route::post('/admin/backups/create-database', [\App\Http\Controllers\BackupController::class, 'createDatabase'])->name('admin.backups.create-database');
    Route::get('/admin/backups/download/{filename}', [\App\Http\Controllers\BackupController::class, 'download'])->name('admin.backups.download');
    Route::delete('/admin/backups/{filename}', [\App\Http\Controllers\BackupController::class, 'delete'])->name('admin.backups.delete');
    Route::post('/admin/backups/clean', [\App\Http\Controllers\BackupController::class, 'clean'])->name('admin.backups.clean');
    Route::get('/admin/backups/list', [\App\Http\Controllers\BackupController::class, 'list'])->name('admin.backups.list');

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
    Route::get('/admin/members/{member}/application-form', [MemberController::class, 'downloadApplicationForm'])->name('admin.members.application-form');
    Route::post('/admin/members', [MemberController::class, 'store'])->name('members.store');
    Route::match(['PUT', 'POST'], '/admin/members/{member}', [MemberController::class, 'update'])->name('members.update');
    Route::delete('/admin/members/{member}', [MemberController::class, 'destroy'])->name('members.destroy');
    Route::post('/admin/members/cleanup-orphaned-users', [MemberController::class, 'cleanupOrphanedUsers'])->name('admin.members.cleanup');
    Route::get('/admin/financials', [FinancialsController::class, 'index'])->name('admin.financials.index');

    // Admin Profile Routes
    Route::get('/admin/profile', [ProfileController::class, 'show'])->name('admin.profile.show');
    Route::get('/admin/profile/edit', [ProfileController::class, 'edit'])->name('admin.profile.edit');
    Route::patch('/admin/profile', [ProfileController::class, 'update'])->name('admin.profile.update');
    Route::post('/admin/profile/password', [ProfileController::class, 'updatePassword'])->name('admin.profile.password.update');
    Route::post('/admin/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('admin.profile.avatar.upload');
    Route::delete('/admin/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('admin.profile.avatar.remove');
    Route::post('/admin/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('admin.profile.preferences.update');
    Route::get('/admin/profile/activities', [ProfileController::class, 'activities'])->name('admin.profile.activities');
    Route::get('/admin/profile/security', [ProfileController::class, 'security'])->name('admin.profile.security');
    Route::get('/admin/profile/settings', [ProfileController::class, 'settings'])->name('admin.profile.settings');

    // Admin Penalty Management Routes
    Route::get('/admin/penalties', [PenaltyController::class, 'index'])->name('admin.penalties.index');
    Route::delete('/admin/penalties/{penalty}', [PenaltyController::class, 'destroy'])->name('admin.penalties.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/member/dashboard', [MemberDashboardController::class, 'index'])->name('member.dashboard');
    Route::get('/member/dependents', [DependentController::class, 'memberIndex'])->name('member.dependents');

    // Member Profile Routes
    Route::get('/member/profile', [ProfileController::class, 'show'])->name('member.profile.show');
    Route::get('/member/profile/edit', [ProfileController::class, 'edit'])->name('member.profile.edit');
    Route::patch('/member/profile', [ProfileController::class, 'update'])->name('member.profile.update');
    Route::post('/member/profile/password', [ProfileController::class, 'updatePassword'])->name('member.profile.password.update');
    Route::post('/member/profile/avatar', [ProfileController::class, 'uploadAvatar'])->name('member.profile.avatar.upload');
    Route::delete('/member/profile/avatar', [ProfileController::class, 'removeAvatar'])->name('member.profile.avatar.remove');
    Route::post('/member/profile/preferences', [ProfileController::class, 'updatePreferences'])->name('member.profile.preferences.update');
    Route::get('/member/profile/activities', [ProfileController::class, 'activities'])->name('member.profile.activities');
    Route::get('/member/profile/security', [ProfileController::class, 'security'])->name('member.profile.security');
    Route::get('/member/profile/settings', [ProfileController::class, 'settings'])->name('member.profile.settings');
});

require __DIR__.'/auth.php';
