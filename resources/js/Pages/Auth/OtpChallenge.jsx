import { useEffect, useState } from 'react';
import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import SecondaryButton from '@/Components/SecondaryButton';
import TextInput from '@/Components/TextInput';
import { Head, useForm } from '@inertiajs/react';

export default function OtpChallenge({ email, canResend = true }) {
    const [timeLeft, setTimeLeft] = useState(300); // 5 minutes in seconds
    const [canResendNow, setCanResendNow] = useState(!canResend);
    const [resendCooldown, setResendCooldown] = useState(0);

    const { data, setData, post, processing, errors, reset, clearErrors } = useForm({
        code: '',
    });

    const { data: resendData, post: resendPost, processing: resendProcessing } = useForm({});

    // Countdown timer for code expiration
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        }
    }, [timeLeft]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown > 0) {
            const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResendNow(true);
        }
    }, [resendCooldown]);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        clearErrors();
        post(route('otp.verify'));
    };

    const handleResend = () => {
        if (!canResendNow || resendProcessing) return;
        
        setCanResendNow(false);
        setResendCooldown(60); // 1 minute cooldown
        setTimeLeft(300); // Reset expiration timer
        
        resendPost(route('otp.resend'));
    };

    const handleCodeChange = (e) => {
        const value = e.target.value.replace(/\D/g, '').slice(0, 6);
        setData('code', value);
        
        // Auto-submit when 6 digits are entered
        if (value.length === 6) {
            clearErrors();
            setTimeout(() => {
                post(route('otp.verify'));
            }, 100);
        }
    };

    return (
        <GuestLayout>
            <Head title="Verify Your Identity" />

            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
                        <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        Verify Your Identity
                    </h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                        We've sent a 6-digit verification code to
                    </p>
                    <p className="font-medium text-gray-900 dark:text-white">
                        {email}
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <InputLabel htmlFor="code" value="Verification Code" />
                        <TextInput
                            id="code"
                            type="text"
                            name="code"
                            value={data.code}
                            className="mt-1 block w-full text-center text-2xl font-mono tracking-widest"
                            placeholder="000000"
                            onChange={handleCodeChange}
                            maxLength={6}
                            autoComplete="one-time-code"
                            autoFocus
                        />
                        <InputError message={errors.code} className="mt-2" />
                        
                        <div className="mt-2 text-center">
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Enter the 6-digit code from your email
                            </p>
                        </div>
                    </div>

                    {/* Timer Display */}
                    <div className="text-center">
                        {timeLeft > 0 ? (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Code expires in {formatTime(timeLeft)}
                            </div>
                        ) : (
                            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                                </svg>
                                Code has expired
                            </div>
                        )}
                    </div>

                    <div className="flex items-center justify-between space-x-4">
                        <SecondaryButton
                            type="button"
                            onClick={handleResend}
                            disabled={!canResendNow || resendProcessing}
                            className="flex-1"
                        >
                            {resendProcessing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Sending...
                                </>
                            ) : resendCooldown > 0 ? (
                                `Resend in ${resendCooldown}s`
                            ) : (
                                'Resend Code'
                            )}
                        </SecondaryButton>

                        <PrimaryButton 
                            disabled={processing || data.code.length !== 6}
                            className="flex-1"
                        >
                            {processing ? (
                                <>
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Verifying...
                                </>
                            ) : (
                                'Verify Code'
                            )}
                        </PrimaryButton>
                    </div>
                </form>

                <div className="mt-8 text-center">
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
                        <div className="flex items-start">
                            <svg className="flex-shrink-0 h-5 w-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div className="ml-3 text-left">
                                <h3 className="text-sm font-medium text-blue-800 dark:text-blue-200">
                                    Security Tips
                                </h3>
                                <div className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>Never share your verification code with anyone</li>
                                        <li>The code expires in 5 minutes for security</li>
                                        <li>Check your spam folder if you don't see the email</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <a
                        href={route('login')}
                        className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                    >
                        ← Back to login
                    </a>
                </div>
            </div>
        </GuestLayout>
    );
}
