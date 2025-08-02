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
use App\Http\Controllers\AuditController;
use App\Http\Controllers\MarketingController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Marketing website routes
Route::get('/', [MarketingController::class, 'index'])->name('marketing.index');
Route::get('/announcements', [MarketingController::class, 'announcements'])->name('marketing.announcements');
Route::get('/announcements/{announcement}', [MarketingController::class, 'announcement'])->name('marketing.announcement');

// Legacy marketing route (redirect to new route)
Route::get('/marketing', function () {
    return redirect()->route('marketing.index');
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

    // Legacy profile update route - redirect to role-specific routes
    Route::patch('/profile', function () {
        $user = auth()->user();
        if ($user->role && in_array($user->role->name, ['admin', 'secretary'])) {
            return redirect()->route('admin.profile.update');
        }
        return redirect()->route('member.profile.update');
    })->name('profile.update');
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
    Route::get('/admin/members-archived', [MemberController::class, 'archived'])->name('admin.members.archived');
    Route::post('/admin/members/{id}/restore', [MemberController::class, 'restore'])->name('members.restore');
    Route::delete('/admin/members/{id}/force-delete', [MemberController::class, 'forceDelete'])->name('members.force-delete');
    Route::post('/admin/members/cleanup-orphaned-users', [MemberController::class, 'cleanupOrphanedUsers'])->name('admin.members.cleanup');
    Route::get('/admin/financials', [FinancialsController::class, 'index'])->name('admin.financials.index');

    // Audit Log Routes
    Route::get('/admin/audit-logs', [AuditController::class, 'index'])->name('admin.audit-logs.index');
    Route::get('/admin/audit-logs/{auditLog}', [AuditController::class, 'show'])->name('admin.audit-logs.show');
    Route::get('/admin/audit-logs-export', [AuditController::class, 'export'])->name('admin.audit-logs.export');

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

    // Admin OTP Management Routes
    Route::post('/admin/profile/otp/enable', [\App\Http\Controllers\Profile\OtpManagementController::class, 'enable'])->name('admin.profile.otp.enable');
    Route::post('/admin/profile/otp/disable', [\App\Http\Controllers\Profile\OtpManagementController::class, 'disable'])->name('admin.profile.otp.disable');
    Route::post('/admin/profile/otp/test', [\App\Http\Controllers\Profile\OtpManagementController::class, 'test'])->name('admin.profile.otp.test');

    // Admin Penalty Management Routes
    Route::get('/admin/penalties', [PenaltyController::class, 'index'])->name('admin.penalties.index');
    Route::delete('/admin/penalties/{penalty}', [PenaltyController::class, 'destroy'])->name('admin.penalties.destroy');

    // Admin Document Management Routes
    Route::resource('/admin/documents', \App\Http\Controllers\Admin\DocumentController::class)->names([
        'index' => 'admin.documents.index',
        'create' => 'admin.documents.create',
        'store' => 'admin.documents.store',
        'show' => 'admin.documents.show',
        'edit' => 'admin.documents.edit',
        'update' => 'admin.documents.update',
        'destroy' => 'admin.documents.destroy',
    ])->middleware('handle.large.uploads');
    Route::post('/admin/documents/{document}/publish', [\App\Http\Controllers\Admin\DocumentController::class, 'publish'])->name('admin.documents.publish');
    Route::post('/admin/documents/{document}/unpublish', [\App\Http\Controllers\Admin\DocumentController::class, 'unpublish'])->name('admin.documents.unpublish');

    // Admin Announcement Management Routes
    Route::resource('/admin/announcements', \App\Http\Controllers\Admin\AnnouncementController::class)->names([
        'index' => 'admin.announcements.index',
        'create' => 'admin.announcements.create',
        'store' => 'admin.announcements.store',
        'show' => 'admin.announcements.show',
        'edit' => 'admin.announcements.edit',
        'update' => 'admin.announcements.update',
        'destroy' => 'admin.announcements.destroy',
    ])->middleware('handle.large.uploads');

    // Admin Fundraising Campaign Management Routes
    Route::resource('/admin/fundraising-campaigns', \App\Http\Controllers\Admin\FundraisingCampaignController::class)->names([
        'index' => 'admin.fundraising-campaigns.index',
        'create' => 'admin.fundraising-campaigns.create',
        'store' => 'admin.fundraising-campaigns.store',
        'show' => 'admin.fundraising-campaigns.show',
        'edit' => 'admin.fundraising-campaigns.edit',
        'update' => 'admin.fundraising-campaigns.update',
        'destroy' => 'admin.fundraising-campaigns.destroy',
    ])->middleware('handle.large.uploads');
    Route::patch('/admin/fundraising-campaigns/{fundraisingCampaign}/update-raised-amount', [\App\Http\Controllers\Admin\FundraisingCampaignController::class, 'updateRaisedAmount'])->name('admin.fundraising-campaigns.update-raised-amount');
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

    // OTP Management Routes
    Route::post('/member/profile/otp/enable', [\App\Http\Controllers\Profile\OtpManagementController::class, 'enable'])->name('member.profile.otp.enable');
    Route::post('/member/profile/otp/disable', [\App\Http\Controllers\Profile\OtpManagementController::class, 'disable'])->name('member.profile.otp.disable');
    Route::post('/member/profile/otp/test', [\App\Http\Controllers\Profile\OtpManagementController::class, 'test'])->name('member.profile.otp.test');

    // Member Document Routes
    Route::get('/member/documents', [\App\Http\Controllers\Member\DocumentController::class, 'index'])->name('member.documents.index');
    Route::get('/member/documents/{document}', [\App\Http\Controllers\Member\DocumentController::class, 'show'])->name('member.documents.show');
    Route::get('/member/documents/category/{category}', [\App\Http\Controllers\Member\DocumentController::class, 'byCategory'])->name('member.documents.category');
});

require __DIR__.'/auth.php';

// Session management routes (must be after auth routes)
Route::middleware('auth')->group(function () {
    Route::get('/api/session/status', [\App\Http\Controllers\SessionController::class, 'status'])->name('session.status');
    Route::post('/api/session/extend', [\App\Http\Controllers\SessionController::class, 'extend'])->name('session.extend');
    Route::get('/api/session/warning', [\App\Http\Controllers\SessionController::class, 'checkWarning'])->name('session.warning');
    Route::post('/api/session/heartbeat', [\App\Http\Controllers\SessionController::class, 'heartbeat'])->name('session.heartbeat');
});

// Document download routes (accessible to authenticated users)
Route::middleware('auth')->group(function () {
    Route::get('/documents/{document}/download', [\App\Http\Controllers\DocumentDownloadController::class, 'download'])->name('documents.download');
    Route::get('/documents/{document}/preview', [\App\Http\Controllers\DocumentDownloadController::class, 'preview'])->name('documents.preview');
});
