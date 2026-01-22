<?php

namespace App\Http\Controllers\AdminPortal;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Cache;

class SettingsController extends Controller
{
    public function index()
    {
        $settings = Setting::all()->keyBy('key');

        return Inertia::render('AdminPortal/Settings/Index', [
            'settings' => $settings,
            'timezones' => $this->getTimezones(),
            'currencies' => $this->getCurrencies(),
            'dateFormats' => $this->getDateFormats(),
        ]);
    }

    public function update(Request $request)
    {
        $validated = $request->validate([
            'settings' => 'required|array',
            'settings.*.key' => 'required|string',
            'settings.*.value' => 'nullable',
        ]);

        foreach ($validated['settings'] as $settingData) {
            Setting::updateOrCreate(
                ['key' => $settingData['key']],
                [
                    'value' => $settingData['value'] ?? '',
                    'description' => $settingData['description'] ?? null,
                ]
            );
        }

        // Clear all settings-related caches
        Cache::forget('app_settings');
        \App\Services\OrganizationConfigService::clearCache();
        \App\Services\PasswordConfigService::clearCache();
        \App\Services\PaginationConfigService::clearCache();
        \App\Services\MemberConfigService::clearCache();
        \App\Services\FinancialConfigService::clearCache();
        \App\Services\EmailConfigService::clearCache();
        \App\Services\SessionConfigService::clearCache();
        \App\Services\AuthConfigService::clearCache();
        \App\Services\SystemConfigService::clearCache();
        \App\Services\MaintenanceConfigService::clearCache();
        \App\Services\BackupService::clearCache();

        return redirect()->back()->with('success', 'Settings updated successfully');
    }

    public function updateSingle(Request $request)
    {
        $validated = $request->validate([
            'key' => 'required|string',
            'value' => 'nullable',
            'description' => 'nullable|string',
        ]);

        Setting::updateOrCreate(
            ['key' => $validated['key']],
            [
                'value' => $validated['value'] ?? '',
                'description' => $validated['description'] ?? null,
            ]
        );

        // Clear settings cache
        Cache::forget('app_settings');

        return redirect()->back()->with('success', 'Setting updated successfully');
    }

    private function getTimezones()
    {
        return [
            'Africa/Dar_es_Salaam' => 'East Africa Time (EAT) - UTC+3',
            'Africa/Nairobi' => 'East Africa Time (EAT) - UTC+3',
            'Africa/Kampala' => 'East Africa Time (EAT) - UTC+3',
            'Africa/Lagos' => 'West Africa Time (WAT) - UTC+1',
            'Africa/Cairo' => 'Eastern European Time (EET) - UTC+2',
            'Africa/Johannesburg' => 'South Africa Standard Time (SAST) - UTC+2',
            'UTC' => 'Coordinated Universal Time (UTC)',
            'America/New_York' => 'Eastern Time (ET) - UTC-5/-4',
            'America/Chicago' => 'Central Time (CT) - UTC-6/-5',
            'America/Denver' => 'Mountain Time (MT) - UTC-7/-6',
            'America/Los_Angeles' => 'Pacific Time (PT) - UTC-8/-7',
            'Europe/London' => 'Greenwich Mean Time (GMT) - UTC+0/+1',
            'Europe/Paris' => 'Central European Time (CET) - UTC+1/+2',
            'Asia/Dubai' => 'Gulf Standard Time (GST) - UTC+4',
            'Asia/Kolkata' => 'India Standard Time (IST) - UTC+5:30',
            'Asia/Shanghai' => 'China Standard Time (CST) - UTC+8',
            'Asia/Tokyo' => 'Japan Standard Time (JST) - UTC+9',
            'Australia/Sydney' => 'Australian Eastern Time (AET) - UTC+10/+11',
        ];
    }

    private function getCurrencies()
    {
        return [
            'TZS' => 'Tanzanian Shilling (TZS)',
            'USD' => 'US Dollar (USD)',
            'EUR' => 'Euro (EUR)',
            'GBP' => 'British Pound (GBP)',
            'KES' => 'Kenyan Shilling (KES)',
            'UGX' => 'Ugandan Shilling (UGX)',
            'ZAR' => 'South African Rand (ZAR)',
            'NGN' => 'Nigerian Naira (NGN)',
        ];
    }

    private function getDateFormats()
    {
        return [
            'Y-m-d' => 'YYYY-MM-DD (2026-01-18)',
            'd/m/Y' => 'DD/MM/YYYY (18/01/2026)',
            'm/d/Y' => 'MM/DD/YYYY (01/18/2026)',
            'd-m-Y' => 'DD-MM-YYYY (18-01-2026)',
            'F j, Y' => 'Month Day, Year (January 18, 2026)',
            'M j, Y' => 'Mon Day, Year (Jan 18, 2026)',
        ];
    }
}
