<?php

namespace App\Services;

use App\Helpers\SettingsHelper;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Config;

class EmailConfigService
{
    private const CACHE_KEY = 'email_config';
    private const CACHE_DURATION = 3600; // 1 hour

    /**
     * Get SMTP host
     */
    public function getSmtpHost(): ?string
    {
        return Cache::remember(self::CACHE_KEY . '_smtp_host', self::CACHE_DURATION, function () {
            return SettingsHelper::get('smtp_host');
        });
    }

    /**
     * Get SMTP port
     */
    public function getSmtpPort(): int
    {
        return Cache::remember(self::CACHE_KEY . '_smtp_port', self::CACHE_DURATION, function () {
            return SettingsHelper::getInt('smtp_port', 587);
        });
    }

    /**
     * Get SMTP username
     */
    public function getSmtpUsername(): ?string
    {
        return Cache::remember(self::CACHE_KEY . '_smtp_username', self::CACHE_DURATION, function () {
            return SettingsHelper::get('smtp_username');
        });
    }

    /**
     * Get SMTP encryption
     */
    public function getSmtpEncryption(): string
    {
        return Cache::remember(self::CACHE_KEY . '_smtp_encryption', self::CACHE_DURATION, function () {
            return SettingsHelper::get('smtp_encryption', 'tls');
        });
    }

    /**
     * Get mail from address
     */
    public function getMailFromAddress(): ?string
    {
        return Cache::remember(self::CACHE_KEY . '_mail_from_address', self::CACHE_DURATION, function () {
            return SettingsHelper::get('mail_from_address');
        });
    }

    /**
     * Get mail from name
     */
    public function getMailFromName(): string
    {
        return Cache::remember(self::CACHE_KEY . '_mail_from_name', self::CACHE_DURATION, function () {
            return SettingsHelper::get('mail_from_name', 'TWAOR');
        });
    }

    /**
     * Apply email configuration to Laravel mail config
     * This should be called in a service provider or middleware
     */
    public function applyConfiguration(): void
    {
        $host = $this->getSmtpHost();
        $port = $this->getSmtpPort();
        $username = $this->getSmtpUsername();
        $encryption = $this->getSmtpEncryption();
        $fromAddress = $this->getMailFromAddress();
        $fromName = $this->getMailFromName();

        // Only apply if SMTP host is configured
        if ($host) {
            Config::set('mail.mailers.smtp.host', $host);
            Config::set('mail.mailers.smtp.port', $port);
            Config::set('mail.mailers.smtp.encryption', $encryption);
            
            if ($username) {
                Config::set('mail.mailers.smtp.username', $username);
            }
        }

        // Apply from address and name
        if ($fromAddress) {
            Config::set('mail.from.address', $fromAddress);
        }
        
        Config::set('mail.from.name', $fromName);
    }

    /**
     * Get all email configuration
     */
    public function getAll(): array
    {
        return [
            'smtp_host' => $this->getSmtpHost(),
            'smtp_port' => $this->getSmtpPort(),
            'smtp_username' => $this->getSmtpUsername(),
            'smtp_encryption' => $this->getSmtpEncryption(),
            'mail_from_address' => $this->getMailFromAddress(),
            'mail_from_name' => $this->getMailFromName(),
        ];
    }

    /**
     * Clear cache
     */
    public static function clearCache(): void
    {
        Cache::forget(self::CACHE_KEY . '_smtp_host');
        Cache::forget(self::CACHE_KEY . '_smtp_port');
        Cache::forget(self::CACHE_KEY . '_smtp_username');
        Cache::forget(self::CACHE_KEY . '_smtp_encryption');
        Cache::forget(self::CACHE_KEY . '_mail_from_address');
        Cache::forget(self::CACHE_KEY . '_mail_from_name');
    }
}
