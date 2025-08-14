<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{{ __('marketing.hero.title') }} - Tabata Welfare Association</title>
    <meta name="description"
        content="{{ __('marketing.hero.subtitle') }}">
    <meta name="keywords"
        content="Tabata Welfare Association, Tanzania welfare, community support, financial security, disaster assistance, monthly contributions">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Tabata Welfare Association - Building Community, Securing Futures">
    <meta property="og:description"
        content="Join Tanzania's premier community welfare organization. Monthly contributions, disaster support, and financial security for members and families.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/') }}">
    <meta property="og:image" content="{{ asset('marketing/logo.jpeg') }}">

    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="{{ asset('marketing/logo.jpeg') }}">
    <link rel="apple-touch-icon" href="{{ asset('marketing/logo.jpeg') }}">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>

    <!-- Custom Tailwind Config -->
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        primary: {
                            50: '#eff6ff',
                            100: '#dbeafe',
                            200: '#bfdbfe',
                            300: '#93c5fd',
                            400: '#60a5fa',
                            500: '#3b82f6',
                            600: '#2563eb',
                            700: '#1d4ed8',
                            800: '#1e40af',
                            900: '#1e3a8a',
                        },
                        secondary: {
                            50: '#f0fdf4',
                            100: '#dcfce7',
                            200: '#bbf7d0',
                            300: '#86efac',
                            400: '#4ade80',
                            500: '#22c55e',
                            600: '#16a34a',
                            700: '#15803d',
                            800: '#166534',
                            900: '#14532d',
                        }
                    },
                    fontFamily: {
                        'sans': ['Inter', 'system-ui', 'sans-serif'],
                    }
                }
            }
        }
    </script>

    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>

    <!-- EmailJS Library -->
    <script type="text/javascript" src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></script>

    <!-- Custom Styles -->
    <style>
        .gradient-bg {
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 25%, #2563eb 50%, #1d4ed8 75%, #1e3a8a 100%) !important;
        }

        /* Ensure hero section gets the blue gradient */
        section.gradient-bg {
            background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 25%, #2563eb 50%, #1d4ed8 75%, #1e3a8a 100%) !important;
        }

        .hero-pattern {
            background-image:
                radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%),
                url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.08'%3E%3Ccircle cx='40' cy='40' r='3'/%3E%3Ccircle cx='20' cy='20' r='2'/%3E%3Ccircle cx='60' cy='20' r='2'/%3E%3Ccircle cx='20' cy='60' r='2'/%3E%3Ccircle cx='60' cy='60' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .card-hover {
            transition: all 0.3s ease;
        }

        .card-hover:hover {
            transform: translateY(-8px);
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
        }

        .text-gradient {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        .btn-primary {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.2);
        }

        .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .btn-primary:active {
            transform: translateY(0);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.3);
        }

        .btn-primary:focus {
            outline: 2px solid #667eea;
            outline-offset: 2px;
        }

        /* Enhanced member login button */
        .btn-member-login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-weight: 600;
            transition: all 0.3s ease;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.25);
            border: none;
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            display: inline-flex;
            align-items: center;
            justify-content: center;
        }

        .btn-member-login::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
            transition: left 0.5s;
        }

        .btn-member-login:hover::before {
            left: 100%;
        }

        .btn-member-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
            background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
        }

        .stats-counter {
            font-size: 2.5rem;
            font-weight: 800;
            color: #1e40af;
        }

        /* Leadership section styles */
        .leadership-card {
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .leadership-card:hover {
            transform: translateY(-8px) scale(1.02);
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
        }

        .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }

        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }

        /* Leadership card gradient animations */
        .leadership-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.1), transparent);
            transform: translateX(-100%);
            transition: transform 0.6s;
            pointer-events: none;
            border-radius: 1rem;
        }

        .leadership-card:hover::before {
            transform: translateX(100%);
        }

        /* Scroll button animations */
        #scroll-left,
        #scroll-right {
            transition: all 0.3s ease;
        }

        #scroll-left:hover,
        #scroll-right:hover {
            transform: translateY(-50%) scale(1.1);
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        /* Improved readability and accessibility */
        .text-readable {
            color: #1f2937 !important;
            /* Darker gray for better contrast */
            line-height: 1.7;
            font-weight: 400;
        }

        .text-readable-light {
            color: #374151 !important;
            /* Medium gray for secondary text */
            line-height: 1.6;
            font-weight: 400;
        }

        .text-readable-white {
            color: #ffffff !important;
            text-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
            line-height: 1.6;
        }

        .bg-readable-overlay {
            background: linear-gradient(135deg, rgba(0, 0, 0, 0.1) 0%, rgba(0, 0, 0, 0.05) 100%);
        }

        /* Alternative overlay for better text readability without graying out */
        .bg-blue-overlay {
            background: linear-gradient(135deg, rgba(37, 99, 235, 0.1) 0%, rgba(29, 78, 216, 0.05) 100%);
        }

        /* Enhanced hero section with animation */
        .hero-enhanced {
            position: relative;
            overflow: hidden;
        }

        .hero-enhanced::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%);
            transform: translateX(-100%);
            animation: shimmer 3s infinite;
        }

        @keyframes shimmer {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(100%); }
        }

        /* Floating elements for visual interest */
        .floating-elements {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            pointer-events: none;
            overflow: hidden;
        }

        .floating-elements::before,
        .floating-elements::after {
            content: '';
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            animation: float 6s ease-in-out infinite;
        }

        .floating-elements::before {
            width: 100px;
            height: 100px;
            top: 20%;
            left: 10%;
            animation-delay: 0s;
        }

        .floating-elements::after {
            width: 150px;
            height: 150px;
            top: 60%;
            right: 15%;
            animation-delay: 3s;
        }

        @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
        }

        /* Enhanced button contrast */
        .btn-primary-readable {
            background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
            color: white;
            font-weight: 600;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }

        .btn-primary-readable:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(30, 64, 175, 0.4);
        }

        .btn-secondary-readable {
            background: white;
            color: #1e40af;
            font-weight: 600;
            border: 2px solid #1e40af;
            transition: all 0.3s ease;
        }

        .btn-secondary-readable:hover {
            background: #1e40af;
            color: white;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
        }

        /* Improved card readability */
        .card-readable {
            background: white;
            border: 1px solid #e5e7eb;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        .card-readable:hover {
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Enhanced navigation readability */
        .nav-readable {
            background: #2563eb !important;
            backdrop-filter: blur(10px);
            border-bottom: 1px solid rgba(59, 130, 246, 0.3);
        }

        .nav-link-readable {
            color: #e0e7ff !important;
            font-weight: 500;
            transition: color 0.3s ease;
        }

        .nav-link-readable:hover {
            color: #ffffff !important;
        }

        /* Improved section spacing */
        .section-padding {
            padding-top: 5rem;
            padding-bottom: 5rem;
        }

        @media (max-width: 768px) {
            .section-padding {
                padding-top: 3rem;
                padding-bottom: 3rem;
            }
        }

        /* Enhanced typography hierarchy */
        .heading-primary {
            font-size: 3.5rem;
            font-weight: 800;
            line-height: 1.1;
            color: #111827;
        }

        .heading-secondary {
            font-size: 2.5rem;
            font-weight: 700;
            line-height: 1.2;
            color: #111827;
        }

        .heading-tertiary {
            font-size: 1.5rem;
            font-weight: 600;
            line-height: 1.3;
            color: #111827;
        }

        .text-large {
            font-size: 1.25rem;
            line-height: 1.7;
            color: #374151;
        }

        .text-body {
            font-size: 1.125rem;
            line-height: 1.7;
            color: #4b5563;
        }

        /* Mobile responsive adjustments */
        @media (max-width: 768px) {
            .stats-counter {
                font-size: 2rem;
            }

            .leadership-card {
                width: 280px;
            }

            #scroll-left,
            #scroll-right {
                width: 40px;
                height: 40px;
            }

            .heading-primary {
                font-size: 2.5rem;
            }

            .heading-secondary {
                font-size: 2rem;
            }

            .text-large {
                font-size: 1.125rem;
            }

            .text-body {
                font-size: 1rem;
            }
        }

        @media (max-width: 640px) {
            .leadership-card {
                width: 260px;
            }

            .heading-primary {
                font-size: 2rem;
            }

            .heading-secondary {
                font-size: 1.75rem;
            }
        }

        /* Enhanced form styling */
        .form-input {
            background: #ffffff;
            border: 2px solid #e5e7eb;
            border-radius: 10px;
            padding: 10px 14px;
            font-size: 14px;
            transition: all 0.3s ease;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .form-input:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1), 0 4px 6px rgba(0, 0, 0, 0.1);
            transform: translateY(-1px);
        }

        .form-input:hover {
            border-color: #9ca3af;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .form-label {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            display: block;
            font-size: 14px;
            letter-spacing: 0.025em;
        }

        .form-group {
            position: relative;
        }

        .form-icon {
            position: absolute;
            left: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: #9ca3af;
            font-size: 14px;
            transition: color 0.3s ease;
            pointer-events: none;
        }

        .form-input.has-icon {
            padding-left: 38px;
        }

        .form-input:focus+.form-icon,
        .form-group:hover .form-icon {
            color: #3b82f6;
        }

        .form-select {
            background: #ffffff url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3e%3c/svg%3e") no-repeat right 12px center/16px 16px;
            appearance: none;
            padding-right: 48px;
        }

        .form-textarea {
            resize: vertical;
            min-height: 80px;
        }

        .required-asterisk {
            color: #ef4444;
            margin-left: 4px;
        }

        /* Form responsive enhancements */
        @media (max-width: 640px) {
            .form-input {
                padding: 10px 14px;
                font-size: 16px;
                /* Prevents zoom on iOS */
            }

            .form-input.has-icon {
                padding-left: 36px;
            }

            .form-icon {
                left: 10px;
                font-size: 13px;
            }
        }

        /* Form animation enhancements */
        .form-group {
            animation: fadeInUp 0.6s ease-out;
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        /* Success/Error message styling */
        .form-message {
            border-radius: 12px;
            padding: 16px 20px;
            margin-bottom: 24px;
            font-weight: 500;
            display: flex;
            align-items: center;
            animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }

            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .form-message.success {
            background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
            border: 2px solid #10b981;
            color: #065f46;
        }

        .form-message.error {
            background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
            border: 2px solid #ef4444;
            color: #991b1b;
        }

        /* Focus states for accessibility */
        .focus-visible:focus-visible {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
        }



        /* High contrast mode support */
        @media (prefers-contrast: high) {
            .text-readable {
                color: #000000 !important;
            }

            .text-readable-light {
                color: #333333 !important;
            }

            .btn-primary-readable {
                background: #000000;
                border-color: #000000;
            }
        }

        /* Combined Header and Navigation Styles */
        nav {
            top: 0 !important;
        }

        nav h1 {
            background: linear-gradient(135deg, #1e40af, #3b82f6);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        nav h2 {
            color: #374151;
        }

        nav p {
            color: #6b7280;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
            nav h1 {
                font-size: 0.875rem;
                line-height: 1.25rem;
            }

            nav h2 {
                font-size: 0.75rem;
                line-height: 1.25rem;
            }

            nav p {
                font-size: 0.75rem;
            }
        }
    </style>
</head>

<body class="font-sans antialiased">
    <!-- Flash Messages -->
    @if(session('status'))
        <div id="flash-message" class="fixed top-4 right-4 z-50 max-w-sm w-full bg-green-500 text-white px-6 py-4 rounded-lg shadow-lg transform transition-all duration-300 ease-in-out">
            <div class="flex items-center">
                <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                </svg>
                <span class="text-sm font-medium">{{ session('status') }}</span>
                <button onclick="closeFlashMessage()" class="ml-4 text-white hover:text-gray-200 focus:outline-none">
                    <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>
    @endif

    <!-- Combined Header and Navigation -->
    <nav class="fixed w-full z-50 nav-readable shadow-lg">
        <!-- Header Section -->
        <div class="w-full border-b border-blue-500 py-3">
            <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div class="flex items-center justify-between">
                    <!-- Left TWA Logo -->
                    <div class="flex-shrink-0">
                        <img src="{{ asset('marketing/logo.jpeg') }}" alt="TWA Logo" class="w-12 h-12 sm:w-16 sm:h-16 object-contain">
                    </div>

                    <!-- Center Text -->
                    <div class="flex-1 text-center px-4">
                        <h2 class="text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mt-1">
                            Tabata Welfare Association (TWA)
                        </h2>
                        <p class="text-sm sm:text-base text-blue-100 mt-1 italic hidden sm:block">
                            TWA, Together We Can Together We Succeed
                        </p>
                    </div>

                    <!-- Language Switcher with Country Flags -->
                    <div class="flex items-center space-x-2 text-sm">
                        <a href="?locale=en" class="flex items-center px-2 py-1 rounded hover:bg-blue-500 transition-colors {{ app()->getLocale() == 'en' ? 'bg-blue-500 text-white font-semibold' : 'text-blue-100' }}">
                            <span class="text-lg mr-1">🇬🇧</span>
                            <span class="hidden sm:inline">EN</span>
                        </a>
                        <span class="text-blue-300">|</span>
                        <a href="?locale=sw" class="flex items-center px-2 py-1 rounded hover:bg-blue-500 transition-colors {{ app()->getLocale() == 'sw' ? 'bg-blue-500 text-white font-semibold' : 'text-blue-100' }}">
                            <span class="text-lg mr-1">🇹🇿</span>
                            <span class="hidden sm:inline">SW</span>
                        </a>
                    </div>
                </div>
            </div>
        </div>

        <!-- Navigation Menu -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-4">

                <!-- Left Navigation - Home Only -->
                <div class="hidden md:block">
                    <a href="#home"
                        class="nav-link-readable px-4 py-3 text-base font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.home') }}</a>
                </div>

                <!-- Right Navigation - All Other Items -->
                <div class="hidden md:block">
                    <div class="flex items-center space-x-3 lg:space-x-4">
                        <a href="#announcements"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.announcements') }}</a>
                        <a href="#about"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.about') }}</a>
                        <a href="#services"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.services') }}</a>
                        <a href="#benefits"
                            class="hidden lg:block nav-link-readable px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.benefits') }}</a>
                        <a href="#leadership"
                            class="hidden lg:block nav-link-readable px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.leadership') }}</a>
                        <a href="#testimonials"
                            class="hidden lg:block nav-link-readable px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.testimonials') }}</a>
                        <a href="#contact"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">{{ __('marketing.nav.contact') }}</a>
                        @if($activeCampaigns->count() > 0)
                        <a href="#donate"
                            class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 lg:px-4 py-3 rounded-lg text-sm font-medium hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap">
                            <i class="fas fa-heart mr-1"></i>{{ __('marketing.nav.donate') }}
                        </a>
                        @endif

                        <a href="{{ route('login') }}"
                            class="btn-member-login px-3 lg:px-4 py-3 rounded-lg text-sm font-medium focus-visible whitespace-nowrap">{{ __('marketing.nav.login') }}</a>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div class="md:hidden flex items-center justify-between w-full">
                    <!-- Home link for mobile -->
                    <a href="#home" class="nav-link-readable px-4 py-3 text-base font-medium">{{ __('marketing.nav.home') }}</a>

                    <!-- Mobile menu button -->
                    <button type="button"
                        class="mobile-menu-button nav-link-readable focus:outline-none focus-visible p-3">
                        <i class="fas fa-bars text-2xl"></i>
                    </button>
                </div>
            </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="mobile-menu hidden md:hidden bg-blue-600 border-t border-blue-500">
            <div class="px-6 py-6 space-y-3">
                <a href="#announcements" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.announcements') }}</a>
                <a href="#about" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.about') }}</a>
                <a href="#services" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.services') }}</a>
                <a href="#benefits" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.benefits') }}</a>
                <a href="#leadership" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.leadership') }}</a>
                <a href="#testimonials" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.testimonials') }}</a>
                <a href="#contact" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">{{ __('marketing.nav.contact') }}</a>
                @if($activeCampaigns->count() > 0)
                <a href="#donate" class="block px-4 py-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg hover:from-yellow-600 hover:to-orange-600 transition-all duration-200 shadow-lg hover:shadow-xl">
                    <i class="fas fa-heart mr-2"></i>{{ __('marketing.nav.donate') }}
                </a>
                @endif
                <a href="{{ route('login') }}"
                    class="block px-6 py-4 btn-member-login rounded-lg text-center mt-6 whitespace-nowrap">{{ __('marketing.nav.member_login') }}</a>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="relative gradient-bg hero-pattern hero-enhanced section-padding pt-48 lg:pt-56">
        <div class="absolute inset-0 bg-readable-overlay"></div>
        <div class="floating-elements"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-12 lg:gap-12 items-center">
                <div class="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left" data-aos="fade-right">
                    <h1 class="heading-primary text-readable-white sm:text-5xl lg:text-6xl">
                        {{ __('marketing.hero.title') }}
                    </h1>
                    <p class="mt-8 text-large text-readable-white max-w-3xl">
                        {{ __('marketing.hero.subtitle') }}
                    </p>
                    <div class="mt-10 sm:max-w-lg sm:mx-auto sm:text-center lg:text-left lg:mx-0">
                        <div class="flex flex-col sm:flex-row gap-6">
                            <a href="#contact"
                                class="btn-secondary-readable inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-lg transition-all focus-visible">
                                <i class="fas fa-user-plus mr-3"></i>
                                {{ __('marketing.hero.cta_join') }}
                            </a>
                            <a href="#about"
                                class="inline-flex items-center justify-center px-8 py-4 border-2 border-white text-lg font-semibold rounded-lg text-readable-white hover:bg-white hover:text-blue-700 transition-all focus-visible">
                                <i class="fas fa-info-circle mr-3"></i>
                                {{ __('marketing.hero.cta_learn') }}
                            </a>
                        </div>
                    </div>
                </div>
                <div class="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center"
                    data-aos="fade-left">
                    <div class="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                        <div class="relative block w-full bg-white rounded-lg overflow-hidden">
                            <img class="w-full h-64 sm:h-80 object-cover" src="{{ asset('marketing/images/event.jpeg') }}"
                                alt="Community gathering">
                            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>

                            <!-- Logo overlay -->
                            <div class="absolute top-4 right-4">
                                <img src="{{ asset('marketing/logo.jpeg') }}" alt="Tabata Welfare Association Logo"
                                    class="w-16 h-16 rounded-lg object-cover logo-image border-2 border-white/30">
                            </div>

                            <div class="absolute bottom-4 left-4 right-4">
                                <h3 class="text-white font-semibold text-lg">Together We Can Together We Succeed</h3>
                                <p class="text-gray-200 text-sm mt-1">Supporting each other through life's challenges
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Stats Section -->
    <section class="bg-white section-padding">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="heading-secondary mb-4">{{ __('marketing.stats.title') }}</h2>
                <p class="text-large text-readable-light max-w-3xl mx-auto">
                    {{ __('marketing.stats.subtitle') }}
                </p>
            </div>
            <div class="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-5">
                <div class="text-center bg-blue-50 rounded-2xl p-8 card-readable" data-aos="fade-up"
                    data-aos-delay="100">
                    <div class="stats-counter text-blue-600 mb-4" data-target="{{ $stats['active_members'] }}">0</div>
                    <p class="text-readable font-semibold text-lg">{{ __('marketing.stats.active_members') }}</p>
                    <p class="text-readable-light text-sm mt-2">{{ __('marketing.stats.active_members_desc') }}</p>
                </div>
                <div class="text-center bg-green-50 rounded-2xl p-8 card-readable" data-aos="fade-up"
                    data-aos-delay="200">
                    <div class="stats-counter text-green-600 mb-4" data-target="{{ $stats['amount_distributed'] }}">0</div>
                    <p class="text-readable font-semibold text-lg">{{ __('marketing.stats.amount_distributed') }}</p>
                    <p class="text-readable-light text-sm mt-2">{{ __('marketing.stats.amount_distributed_desc') }}</p>
                </div>
                <div class="text-center bg-purple-50 rounded-2xl p-8 card-readable" data-aos="fade-up"
                    data-aos-delay="300">
                    <div class="stats-counter text-purple-600 mb-4" data-target="{{ $stats['helped_families'] }}">0</div>
                    <p class="text-readable font-semibold text-lg">{{ __('marketing.stats.families_helped') }}</p>
                    <p class="text-readable-light text-sm mt-2">{{ __('marketing.stats.families_helped_desc') }}</p>
                </div>
                <div class="text-center bg-orange-50 rounded-2xl p-8 card-readable" data-aos="fade-up"
                    data-aos-delay="400">
                    <div class="stats-counter text-orange-600 mb-4" data-target="8">0</div>
                    <p class="text-readable font-semibold text-lg">{{ __('marketing.stats.years_service') }}</p>
                    <p class="text-readable-light text-sm mt-2">{{ __('marketing.stats.years_service_desc') }}</p>
                </div>
                <div class="text-center bg-cyan-50 rounded-2xl p-8 card-readable" data-aos="fade-up"
                    data-aos-delay="500">
                    <div class="stats-counter text-cyan-600 mb-4" data-target="{{ $stats['website_visits'] ?? 0 }}">0</div>
                    <p class="text-readable font-semibold text-lg">{{ __('marketing.stats.website_visits') }}</p>
                    <p class="text-readable-light text-sm mt-2">{{ __('marketing.stats.website_visits_desc') }}</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Announcements Section -->
    <section id="announcements" class="py-16 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-12" data-aos="fade-up">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                    {{ __('marketing.announcements.title') }}
                </h2>
                <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                    {{ __('marketing.announcements.subtitle') }}
                </p>
            </div>

            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                @forelse($announcements as $index => $announcement)
                    <!-- Announcement {{ $index + 1 }} -->
                    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
                         data-aos="fade-up" data-aos-delay="{{ ($index + 1) * 100 }}">

                        @if($announcement->hasMedia())
                            <!-- Media Section -->
                            <div class="relative">
                                @if($announcement->media_type === 'image' && $announcement->image_path)
                                    <img src="{{ $announcement->image_url }}"
                                         alt="{{ $announcement->image_alt_text ?? $announcement->title }}"
                                         class="w-full h-48 object-cover">
                                @elseif($announcement->media_type === 'video' && $announcement->video_path)
                                    <video class="w-full h-48 object-cover" controls>
                                        <source src="{{ $announcement->video_url_full }}" type="video/mp4">
                                        Your browser does not support the video tag.
                                    </video>
                                @elseif($announcement->media_type === 'video_url' && $announcement->isYoutubeVideo())
                                    <div class="relative h-48">
                                        <iframe class="w-full h-full"
                                                src="https://www.youtube.com/embed/{{ $announcement->youtube_video_id }}"
                                                frameborder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowfullscreen>
                                        </iframe>
                                    </div>
                                @elseif($announcement->media_type === 'video_url' && $announcement->video_url)
                                    <div class="relative h-48 bg-gray-100 flex items-center justify-center">
                                        <a href="{{ $announcement->video_url }}" target="_blank"
                                           class="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                            <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"></path>
                                            </svg>
                                            Watch Video
                                        </a>
                                    </div>
                                @endif
                            </div>
                        @endif

                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium {{ $announcement->type_badge_color }}">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        {!! $announcement->type_icon !!}
                                    </svg>
                                    {{ ucfirst($announcement->type) }}
                                </span>
                                <span class="text-sm text-gray-500">{{ $announcement->announcement_date->format('M d, Y') }}</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">
                                {{ $announcement->title }}
                            </h3>
                            <p class="text-gray-600 mb-4">
                                {{ Str::limit($announcement->content, 120) }}
                            </p>
                            @if($announcement->link_url)
                                <a href="{{ $announcement->link_url }}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                    {{ $announcement->link_text ?? 'Learn More' }}
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                    </svg>
                                </a>
                            @endif
                        </div>
                    </div>
                @empty
                    <!-- Default announcements when no database entries exist -->
                    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" data-aos="fade-up" data-aos-delay="100">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"></path>
                                    </svg>
                                    Important
                                </span>
                                <span class="text-sm text-gray-500">Jan 15, 2025</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">
                                Welcome to Our New Website
                            </h3>
                            <p class="text-gray-600 mb-4">
                                We're excited to launch our new website with improved features and better user experience for all our members.
                            </p>
                            <a href="#contact" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                Learn More
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" data-aos="fade-up" data-aos-delay="200">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                    </svg>
                                    Event
                                </span>
                                <span class="text-sm text-gray-500">Jan 10, 2025</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">
                                New Member Registration Open
                            </h3>
                            <p class="text-gray-600 mb-4">
                                We are now accepting new member applications for 2025. Join our growing community and enjoy exclusive benefits and support services.
                            </p>
                            <a href="{{ route('login') }}" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                Apply Now
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>

                    <div class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" data-aos="fade-up" data-aos-delay="300">
                        <div class="p-6">
                            <div class="flex items-center justify-between mb-4">
                                <span class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                        <path fill-rule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clip-rule="evenodd"></path>
                                    </svg>
                                    Update
                                </span>
                                <span class="text-sm text-gray-500">Jan 5, 2025</span>
                            </div>
                            <h3 class="text-xl font-semibold text-gray-900 mb-3">
                                Updated Contribution Guidelines
                            </h3>
                            <p class="text-gray-600 mb-4">
                                Please review the updated monthly contribution guidelines and payment methods. New digital payment options are now available for your convenience.
                            </p>
                            <a href="#services" class="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium">
                                View Details
                                <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                                </svg>
                            </a>
                        </div>
                    </div>
                @endforelse
            </div>

            <!-- View All Announcements Button -->
            <div class="text-center mt-12" data-aos="fade-up" data-aos-delay="400">
                <a href="{{ route('marketing.announcements') }}" class="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl">
                    {{ __('marketing.announcements.view_all') }}
                    <svg class="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                    </svg>
                </a>
            </div>
        </div>
    </section>

    <!-- About Section -->
    <section id="about" class="section-padding bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="lg:grid lg:grid-cols-2 lg:gap-20 items-center">
                <div data-aos="fade-right">
                    <h2 class="heading-secondary mb-8">
                        {{ __('marketing.about.title') }}
                    </h2>
                    <p class="text-body mb-6">
                        {{ __('marketing.about.description') }}
                    </p>
                    <p class="text-body mb-10">
                        {{ __('marketing.about.mission_text') }}
                    </p>

                    <div class="space-y-8">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                    <i class="fas fa-shield-alt text-blue-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-6">
                                <h4 class="heading-tertiary mb-2">{{ __('marketing.benefits.financial_security.title') }}</h4>
                                <p class="text-body">{{ __('marketing.benefits.financial_security.description') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                                    <i class="fas fa-heart text-green-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-6">
                                <h4 class="heading-tertiary mb-2">{{ __('marketing.services.community_support.title') }}</h4>
                                <p class="text-body">{{ __('marketing.services.community_support.description') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                                    <i class="fas fa-star text-yellow-600 text-xl"></i>
                                </div>
                            </div>
                            <div class="ml-6">
                                <h4 class="heading-tertiary mb-2">{{ __('marketing.about.values.integrity') }}</h4>
                                <p class="text-body">{{ __('marketing.about.vision_text') }}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="mt-12 lg:mt-0" data-aos="fade-left">
                    <div class="grid grid-cols-2 gap-4">
                        <img class="rounded-lg shadow-lg" src="{{ asset('marketing/images/magufuli.jpeg') }}" alt="Community meeting">
                        <img class="rounded-lg shadow-lg mt-8" src="{{ asset('marketing/images/4.jpg') }}" alt="Helping hands">
                        <img class="rounded-lg shadow-lg -mt-8" src="{{ asset('marketing/images/3.jpeg') }}" alt="Financial planning">
                        <img class="rounded-lg shadow-lg" src="{{ asset('marketing/images/1.jpeg') }}" alt="Team collaboration">
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Services Section -->
    <section id="services" class="section-padding bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center mb-20" data-aos="fade-up">
                <h2 class="heading-secondary mb-6">
                    {{ __('marketing.services.title') }}
                </h2>
                <p class="text-large text-readable-light max-w-4xl mx-auto">
                    {{ __('marketing.services.subtitle') }}
                </p>
            </div>

            <div class="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                <!-- Monthly Contributions -->
                <div class="card-readable card-hover rounded-2xl p-10 border-2 border-blue-100" data-aos="fade-up"
                    data-aos-delay="100">
                    <div class="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-8">
                        <i class="fas fa-calendar-check text-blue-600 text-2xl"></i>
                    </div>
                    <h3 class="heading-tertiary mb-6">{{ __('marketing.services.monthly_contributions.title') }}</h3>
                    <p class="text-body mb-8">
                        {{ __('marketing.services.monthly_contributions.description') }}
                    </p>
                    <ul class="space-y-3 text-readable">
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.flexible_payment') }}</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.automatic_reminders') }}</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.transparent_tracking') }}</span></li>
                    </ul>
                </div>

                <!-- Disaster Support -->
                <div class="card-readable card-hover rounded-2xl p-10 border-2 border-red-100" data-aos="fade-up"
                    data-aos-delay="200">
                    <div class="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mb-8">
                        <i class="fas fa-hands-helping text-red-600 text-2xl"></i>
                    </div>
                    <h3 class="heading-tertiary mb-6">{{ __('marketing.services.disaster_support.title') }}</h3>
                    <p class="text-body mb-8">
                        {{ __('marketing.services.disaster_support.description') }}
                    </p>
                    <ul class="space-y-3 text-readable">
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.emergency_medical') }}</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.family_crisis') }}</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.quick_disbursement') }}</span></li>
                    </ul>
                </div>

                <!-- Family Coverage -->
                <div class="card-readable card-hover rounded-2xl p-10 border-2 border-green-100" data-aos="fade-up"
                    data-aos-delay="300">
                    <div class="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mb-8">
                        <i class="fas fa-users text-green-600 text-2xl"></i>
                    </div>
                    <h3 class="heading-tertiary mb-6">{{ __('marketing.services.family_protection.title') }}</h3>
                    <p class="text-body mb-8">
                        {{ __('marketing.services.family_protection.description') }}
                    </p>
                    <ul class="space-y-3 text-readable">
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.spouse_coverage') }}</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.children_protection') }}</span></li>
                        <li class="flex items-center"><i class="fas fa-check text-green-600 mr-3 text-lg"></i> <span
                                class="font-medium">{{ __('marketing.common.extended_family') }}</span></li>
                    </ul>
                </div>

                <!-- Financial Planning -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100" data-aos="fade-up"
                    data-aos-delay="400">
                    <div class="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-6">
                        <i class="fas fa-chart-line text-yellow-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ __('marketing.services.financial_planning.title') }}</h3>
                    <p class="text-gray-600 mb-6">
                        {{ __('marketing.services.financial_planning.description') }}
                    </p>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.personal_consultations') }}</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.investment_advice') }}</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.retirement_planning') }}</li>
                    </ul>
                </div>

                <!-- Community Events -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100" data-aos="fade-up"
                    data-aos-delay="500">
                    <div class="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-6">
                        <i class="fas fa-calendar-alt text-purple-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ __('marketing.services.community_events.title') }}</h3>
                    <p class="text-gray-600 mb-6">
                        {{ __('marketing.services.community_events.description') }}
                    </p>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.monthly_meetings') }}</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.educational_workshops') }}</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.social_celebrations') }}</li>
                    </ul>
                </div>

                <!-- Digital Platform -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100" data-aos="fade-up"
                    data-aos-delay="600">
                    <div class="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
                        <i class="fas fa-mobile-alt text-indigo-600 text-xl"></i>
                    </div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-4">{{ __('marketing.services.digital_platform.title') }}</h3>
                    <p class="text-gray-600 mb-6">
                        {{ __('marketing.services.digital_platform.description') }}
                    </p>
                    <ul class="space-y-2 text-sm text-gray-600">
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.online_dashboard') }}</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.mobile_friendly') }}</li>
                        <li class="flex items-center"><i class="fas fa-check text-green-500 mr-2"></i> {{ __('marketing.common.realtime_updates') }}</li>
                    </ul>
                </div>
            </div>
        </div>
    </section>

    <!-- Benefits Section -->
    <section id="benefits" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center" data-aos="fade-up">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {{ __('marketing.benefits.title') }}
                </h2>
                <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    {{ __('marketing.benefits.subtitle') }}
                </p>
            </div>

            <div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <!-- Left Column -->
                <div class="space-y-8" data-aos="fade-right">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-shield-alt text-primary-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.benefits.financial_security.title') }}</h4>
                            <p class="text-gray-600 mt-2">{{ __('marketing.benefits.financial_security.description') }}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-users text-secondary-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.benefits.community_network.title') }}</h4>
                            <p class="text-gray-600 mt-2">{{ __('marketing.benefits.community_network.description') }}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-clock text-yellow-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.benefits.quick_response.title') }}</h4>
                            <p class="text-gray-600 mt-2">{{ __('marketing.benefits.quick_response.description') }}</p>
                        </div>
                    </div>
                </div>

                <!-- Right Column -->
                <div class="space-y-8" data-aos="fade-left">
                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-eye text-red-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.benefits.transparent_operations.title') }}</h4>
                            <p class="text-gray-600 mt-2">{{ __('marketing.benefits.transparent_operations.description') }}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-graduation-cap text-purple-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.benefits.financial_education.title') }}</h4>
                            <p class="text-gray-600 mt-2">{{ __('marketing.benefits.financial_education.description') }}</p>
                        </div>
                    </div>

                    <div class="flex items-start">
                        <div class="flex-shrink-0">
                            <div class="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                <i class="fas fa-mobile-alt text-indigo-600"></i>
                            </div>
                        </div>
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.benefits.modern_technology.title') }}</h4>
                            <p class="text-gray-600 mt-2">{{ __('marketing.benefits.modern_technology.description') }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Leadership Section -->
    <section id="leadership" class="py-20 bg-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center" data-aos="fade-up">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {{ __('marketing.leadership.title') }}
                </h2>
                <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    {{ __('marketing.leadership.subtitle') }}
                </p>
            </div>

            <!-- Leadership Cards Container -->
            <div class="mt-16 relative">
                <!-- Scroll Buttons -->
                <button id="scroll-left"
                    class="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200 opacity-50 hover:opacity-100">
                    <i class="fas fa-chevron-left text-gray-600"></i>
                </button>
                <button id="scroll-right"
                    class="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-white rounded-full shadow-lg border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors duration-200">
                    <i class="fas fa-chevron-right text-gray-600"></i>
                </button>

                <!-- Scrollable Container -->
                <div id="leadership-container" class="overflow-x-auto scrollbar-hide scroll-smooth"
                    style="scrollbar-width: none; -ms-overflow-style: none;">
                    <div class="flex space-x-6 pb-4" style="width: max-content;">

                        <!-- Leader 1 - Chairman -->
                        <div class="leadership-card flex-shrink-0 w-80 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-blue-100"
                            data-aos="fade-up" data-aos-delay="100">
                            <div class="text-center">
                                <div class="relative inline-block mb-6">
                                    <img class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        src="{{ asset('marketing/images/chairman.jpeg') }}"
                                        alt="Chairman - Tabata Welfare Association">
                                    <div
                                        class="absolute -bottom-2 -right-2 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-crown text-white text-sm"></i>
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">Abdallah Mbura</h3>
                                <p class="text-blue-600 font-semibold mb-4">{{ __('marketing.leadership.chairman_title') }}</p>
                                <p class="text-gray-600 text-sm leading-relaxed mb-6">
                                    {{ __('marketing.leadership.chairman_description') }}
                                </p>
                                <div class="flex justify-center space-x-3">
                                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i class="fab fa-linkedin-in text-blue-600 text-sm"></i>
                                    </div>
                                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-envelope text-blue-600 text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Leader 2 - Secretary -->
                        <div class="leadership-card flex-shrink-0 w-80 bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-green-100"
                            data-aos="fade-up" data-aos-delay="200">
                            <div class="text-center">
                                <div class="relative inline-block mb-6">
                                    <img class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        src="{{ asset('marketing/images/secretary.jpeg') }}"
                                        alt="Secretary - Tabata Welfare Association">
                                    <div
                                        class="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-pen text-white text-sm"></i>
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">Rajab H. Rajab</h3>
                                <p class="text-green-600 font-semibold mb-4">{{ __('marketing.leadership.secretary_title') }}</p>
                                <p class="text-gray-600 text-sm leading-relaxed mb-6">
                                    {{ __('marketing.leadership.secretary_description') }}
                                </p>
                                <div class="flex justify-center space-x-3">
                                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <i class="fab fa-linkedin-in text-green-600 text-sm"></i>
                                    </div>
                                    <div class="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-envelope text-green-600 text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Leader 3 - Treasurer -->
                        <div class="leadership-card flex-shrink-0 w-80 bg-gradient-to-br from-purple-50 to-violet-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-purple-100"
                            data-aos="fade-up" data-aos-delay="300">
                            <div class="text-center">
                                <div class="relative inline-block mb-6">
                                    <img class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        src="{{ asset('marketing/images/tresurere.jpg') }}"
                                        alt="Treasurer - Tabata Welfare Association">
                                    <div
                                        class="absolute -bottom-2 -right-2 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-coins text-white text-sm"></i>
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">Bi Lilian Kijugo</h3>
                                <p class="text-purple-600 font-semibold mb-4">{{ __('marketing.leadership.treasurer_title') }}</p>
                                <p class="text-gray-600 text-sm leading-relaxed mb-6">
                                    {{ __('marketing.leadership.treasurer_description') }}
                                </p>
                                <div class="flex justify-center space-x-3">
                                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <i class="fab fa-linkedin-in text-purple-600 text-sm"></i>
                                    </div>
                                    <div class="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-envelope text-purple-600 text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        </div>



                        <!-- Leader 5 - Committee Member -->
                        <div class="leadership-card flex-shrink-0 w-80 bg-gradient-to-br from-teal-50 to-cyan-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-teal-100"
                            data-aos="fade-up" data-aos-delay="500">
                            <div class="text-center">
                                <div class="relative inline-block mb-6">
                                    <img class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        src="{{ asset('marketing/images/commitee.jpg') }}"
                                        alt="Committee Member - Tabata Welfare Association">
                                    <div
                                        class="absolute -bottom-2 -right-2 w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-users text-white text-sm"></i>
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">Blandina Edward</h3>
                                <p class="text-teal-600 font-semibold mb-4">{{ __('marketing.leadership.committee_title') }}</p>
                                <p class="text-gray-600 text-sm leading-relaxed mb-6">
                                    {{ __('marketing.leadership.committee_description') }}
                                </p>
                                <div class="flex justify-center space-x-3">
                                    <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                        <i class="fab fa-linkedin-in text-teal-600 text-sm"></i>
                                    </div>
                                    <div class="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-envelope text-teal-600 text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Leader 6 - Spokesman -->
                        <div class="leadership-card flex-shrink-0 w-80 bg-gradient-to-br from-pink-50 to-rose-100 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-pink-100"
                            data-aos="fade-up" data-aos-delay="600">
                            <div class="text-center">
                                <div class="relative inline-block mb-6">
                                    <img class="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg"
                                        src="{{ asset('marketing/images/spokesman.jpeg') }}"
                                        alt="Spokesman - Tabata Welfare Association">
                                    <div
                                        class="absolute -bottom-2 -right-2 w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
                                        <i class="fas fa-microphone text-white text-sm"></i>
                                    </div>
                                </div>
                                <h3 class="text-xl font-bold text-gray-900 mb-2">Jackson Ngosha</h3>
                                <p class="text-pink-600 font-semibold mb-4">{{ __('marketing.leadership.spokesman_title') }}</p>
                                <p class="text-gray-600 text-sm leading-relaxed mb-6">
                                    {{ __('marketing.leadership.spokesman_description') }}
                                </p>
                                <div class="flex justify-center space-x-3">
                                    <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                        <i class="fab fa-linkedin-in text-pink-600 text-sm"></i>
                                    </div>
                                    <div class="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
                                        <i class="fas fa-envelope text-pink-600 text-sm"></i>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>

                <!-- Scroll Indicators -->
                <div class="flex justify-center mt-8 space-x-2">
                    <div class="scroll-indicator w-2 h-2 bg-primary-500 rounded-full transition-all duration-300"></div>
                    <div class="scroll-indicator w-2 h-2 bg-gray-300 rounded-full transition-all duration-300"></div>
                    <div class="scroll-indicator w-2 h-2 bg-gray-300 rounded-full transition-all duration-300"></div>
                </div>
            </div>
        </div>
    </section>

    <!-- Testimonials Section -->
    <section id="testimonials" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center" data-aos="fade-up">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {{ __('marketing.testimonials.title') }}
                </h2>
                <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    {{ __('marketing.testimonials.subtitle') }}
                </p>
            </div>

            <div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-3">
                <!-- Testimonial 1 -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100" data-aos="fade-up"
                    data-aos-delay="100">
                    <div class="flex items-center mb-6">
                        <img class="w-12 h-12 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            alt="Sarah Mwangi">
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Sarah Mwangi</h4>
                            <p class="text-gray-600">{{ __('marketing.testimonials.member_since') }} 2018</p>
                        </div>
                    </div>
                    <div class="flex text-yellow-400 mb-4">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="text-gray-600 italic">
                        "{{ __('marketing.testimonials.testimonial_1') }}"
                    </p>
                </div>

                <!-- Testimonial 2 -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100" data-aos="fade-up"
                    data-aos-delay="200">
                    <div class="flex items-center mb-6">
                        <img class="w-12 h-12 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            alt="John Kimani">
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">John Kimani</h4>
                            <p class="text-gray-600">{{ __('marketing.testimonials.member_since') }} 2017</p>
                        </div>
                    </div>
                    <div class="flex text-yellow-400 mb-4">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="text-gray-600 italic">
                        "{{ __('marketing.testimonials.testimonial_2') }}"
                    </p>
                </div>

                <!-- Testimonial 3 -->
                <div class="card-hover bg-white rounded-xl shadow-lg p-8 border border-gray-100" data-aos="fade-up"
                    data-aos-delay="300">
                    <div class="flex items-center mb-6">
                        <img class="w-12 h-12 rounded-full object-cover"
                            src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&q=80"
                            alt="Grace Mwende">
                        <div class="ml-4">
                            <h4 class="text-lg font-semibold text-gray-900">Grace Mwende</h4>
                            <p class="text-gray-600">{{ __('marketing.testimonials.member_since') }} 2019</p>
                        </div>
                    </div>
                    <div class="flex text-yellow-400 mb-4">
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                        <i class="fas fa-star"></i>
                    </div>
                    <p class="text-gray-600 italic">
                        "{{ __('marketing.testimonials.testimonial_3') }}"
                    </p>
                </div>
            </div>
        </div>
    </section>

    <!-- CTA Section -->
    <section class="relative gradient-bg hero-pattern hero-enhanced section-padding">
        <div class="absolute inset-0 bg-readable-overlay"></div>
        <div class="floating-elements"></div>
        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center" data-aos="fade-up">
            <h2 class="heading-secondary text-readable-white mb-8">
                {{ __('marketing.cta.title') }}
            </h2>
            <p class="text-large text-readable-white max-w-4xl mx-auto mb-12">
                {{ __('marketing.cta.subtitle') }}
            </p>
            <div class="flex flex-col sm:flex-row gap-6 justify-center">
                <a href="#contact"
                    class="btn-secondary-readable inline-flex items-center justify-center px-10 py-4 text-lg font-semibold rounded-lg transition-all focus-visible">
                    <i class="fas fa-phone mr-3"></i>
                    {{ __('marketing.cta.contact_today') }}
                </a>
                <a href="{{ route('login') }}"
                    class="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-base font-medium rounded-lg text-white hover:bg-white hover:text-primary-700 transition-colors">
                    <i class="fas fa-sign-in-alt mr-2"></i>
                    {{ __('marketing.cta.member_portal') }}
                </a>
            </div>
        </div>
    </section>

    @if($activeCampaigns->count() > 0)
    <!-- Fund-Raising Section -->
    <section id="donate" class="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <!-- Section Header -->
            <div class="text-center mb-16" data-aos="fade-up">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl mb-4">
                    {{ __('marketing.donation.title') }}
                </h2>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    {{ __('marketing.donation.subtitle') }}
                </p>
            </div>

            <!-- Active Campaigns -->
            <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
                @foreach($activeCampaigns as $campaign)
                    <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300" data-aos="fade-up" data-aos-delay="{{ $loop->index * 100 }}">
                        @if($campaign->image_path)
                            <img src="{{ $campaign->image_url }}" alt="{{ $campaign->title }}" class="w-full h-48 object-cover">
                        @endif

                        <div class="p-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-3">{{ $campaign->title }}</h3>
                            <p class="text-gray-600 mb-4">{{ $campaign->description }}</p>

                            <!-- Progress Bar -->
                            <div class="mb-4">
                                <div class="flex justify-between text-sm text-gray-600 mb-2">
                                    <span>{{ $campaign->formatted_raised_amount }} raised</span>
                                    <span>{{ number_format($campaign->progress_percentage, 1) }}%</span>
                                </div>
                                <div class="w-full bg-gray-200 rounded-full h-3">
                                    <div class="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-300"
                                         style="width: {{ $campaign->progress_percentage }}%"></div>
                                </div>
                                <div class="flex justify-between text-sm text-gray-500 mt-2">
                                    <span>Goal: {{ $campaign->formatted_goal_amount }}</span>
                                    @if($campaign->days_remaining !== null)
                                        <span>{{ $campaign->days_remaining }} days left</span>
                                    @endif
                                </div>
                            </div>

                            @if($campaign->acceptsDonations())
                                <button onclick="selectCampaign('{{ $campaign->id }}', '{{ $campaign->title }}')"
                                        class="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200">
                                    {{ __('marketing.donation.donate_to_campaign') }}
                                </button>
                            @else
                                <div class="text-center py-3 text-gray-500 font-medium">
                                    @if($campaign->is_completed)
                                        ✅ Goal Achieved!
                                    @elseif($campaign->is_expired)
                                        ⏰ Campaign Ended
                                    @else
                                        ⏸️ Campaign Paused
                                    @endif
                                </div>
                            @endif
                        </div>
                    </div>
                @endforeach
            </div>
            <!-- How to Donate -->
            <div class="bg-white rounded-2xl shadow-xl p-8 mb-12" data-aos="fade-up" data-aos-delay="200">
                <h3 class="text-2xl font-bold text-center mb-8">{{ __('marketing.donation.how_to_donate') }}</h3>
                <p class="text-center text-gray-600 mb-8">{{ __('marketing.donation.payment_instructions') }}</p>

                <!-- Payment Methods -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
                    @if($activeCampaigns->count() > 0)
                        @php $featuredCampaign = $activeCampaigns->where('is_featured', true)->first() ?? $activeCampaigns->first(); @endphp

                        @if($featuredCampaign && $featuredCampaign->payment_methods)
                            @if(in_array('mobile_money', $featuredCampaign->payment_methods) && $featuredCampaign->mobile_money_number)
                            <!-- Mobile Money -->
                            <div class="bg-gradient-to-r from-green-50 to-blue-50 p-6 rounded-xl border border-green-200">
                                <div class="flex items-center mb-4">
                                    <div class="text-3xl mr-3">📱</div>
                                    <h4 class="text-xl font-bold text-gray-900">{{ __('marketing.donation.mobile_money') }}</h4>
                                </div>
                                <div class="space-y-2 text-sm text-gray-700">
                                    <div><strong>Number:</strong> {{ $featuredCampaign->mobile_money_number }}</div>
                                    <div><strong>Name:</strong> Tabata Welfare Association</div>
                                </div>
                                <p class="text-xs text-gray-600 mt-3">Send payment and SMS reference to confirm</p>
                            </div>
                            @endif

                            @if(in_array('bank_transfer', $featuredCampaign->payment_methods) && $featuredCampaign->bank_details)
                            <!-- Bank Transfer -->
                            <div class="bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200">
                                <div class="flex items-center mb-4">
                                    <div class="text-3xl mr-3">🏦</div>
                                    <h4 class="text-xl font-bold text-gray-900">Bank Transfer</h4>
                                </div>
                                <div class="space-y-1 text-sm text-gray-700 whitespace-pre-line">{{ $featuredCampaign->bank_details }}</div>
                                <p class="text-xs text-gray-600 mt-3">Include campaign name in transfer reference</p>
                            </div>
                            @endif
                        @endif
                    @endif
                </div>

                <!-- Contact for Donations -->
                <div class="mt-8 text-center">
                    <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                        <p class="text-sm text-yellow-800">
                            <strong>Need help with your donation?</strong> Contact us at
                            <a href="tel:+255123456789" class="font-medium underline">+255 123 456 789</a> or
                            <a href="mailto:donations@tabatawelfare.org" class="font-medium underline">donations@tabatawelfare.org</a>
                        </p>
                    </div>
                </div>
            </div>

            <!-- Impact Stories - Completed Campaigns -->
            @if($completedCampaigns->count() > 0)
            <div class="mb-12" data-aos="fade-up" data-aos-delay="400">
                <h3 class="text-2xl font-bold text-center mb-8">{{ __('marketing.impact.title') }}</h3>
                <p class="text-center text-gray-600 mb-8">{{ __('marketing.impact.subtitle') }}</p>

                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    @foreach($completedCampaigns->take(6) as $campaign)
                        <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300">
                            @if($campaign->image_path)
                                <img src="{{ $campaign->image_url }}" alt="{{ $campaign->title }}" class="w-full h-40 object-cover">
                            @else
                                <div class="w-full h-40 bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center">
                                    <div class="text-white text-center">
                                        <svg class="w-12 h-12 mx-auto mb-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
                                        </svg>
                                        <p class="text-sm font-semibold">{{ __('marketing.impact.campaign_completed') }}</p>
                                    </div>
                                </div>
                            @endif

                            <div class="p-6">
                                <div class="flex items-center justify-between mb-3">
                                    <h4 class="text-lg font-bold text-gray-900">{{ $campaign->title }}</h4>
                                    <span class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        ✅ {{ __('marketing.impact.completed') }}
                                    </span>
                                </div>

                                <p class="text-gray-600 text-sm mb-4">
                                    {{ Str::limit($campaign->description, 100) }}
                                </p>

                                <!-- Success Metrics -->
                                <div class="space-y-3">
                                    <div class="bg-green-50 p-3 rounded-lg">
                                        <div class="flex justify-between items-center mb-2">
                                            <span class="text-sm font-medium text-green-800">{{ __('marketing.impact.goal_achieved') }}</span>
                                            <span class="text-sm font-bold text-green-800">{{ number_format($campaign->progress_percentage, 0) }}%</span>
                                        </div>
                                        <div class="w-full bg-green-200 rounded-full h-2">
                                            <div class="bg-green-600 h-2 rounded-full" style="width: {{ min(100, $campaign->progress_percentage) }}%"></div>
                                        </div>
                                    </div>

                                    <div class="grid grid-cols-2 gap-3 text-center">
                                        <div class="bg-blue-50 p-2 rounded">
                                            <div class="text-xs text-blue-800 font-medium">{{ __('marketing.impact.total_raised') }}</div>
                                            <div class="text-sm font-bold text-blue-900">{{ $campaign->formatted_raised_amount }}</div>
                                        </div>
                                        <div class="bg-purple-50 p-2 rounded">
                                            <div class="text-xs text-purple-800 font-medium">{{ __('marketing.impact.goal') }}</div>
                                            <div class="text-sm font-bold text-purple-900">{{ $campaign->formatted_goal_amount }}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    @endforeach
                </div>

                @if($completedCampaigns->count() > 6)
                    <div class="text-center mt-8">
                        <p class="text-gray-600">{{ __('marketing.impact.more_campaigns', ['count' => $completedCampaigns->count() - 6]) }}</p>
                    </div>
                @endif
            </div>
            @endif

            <!-- Call to Action -->
            <div class="text-center" data-aos="fade-up" data-aos-delay="500">
                <div class="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                    <h3 class="text-2xl font-bold mb-4">{{ __('marketing.donation.ready_to_make_difference') }}</h3>
                    <p class="text-lg mb-6 opacity-90">
                        {{ __('marketing.donation.join_donors_text') }}
                    </p>
                    <button onclick="document.getElementById('customAmount').focus()"
                        class="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-200">
                        <i class="fas fa-heart mr-2"></i>
                        {{ __('marketing.donation.donate_now') }}
                    </button>
                </div>
            </div>
        </div>
    </section>
    @endif

    <!-- Contact Section -->
    <section id="contact" class="py-20 bg-gray-50">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="text-center" data-aos="fade-up">
                <h2 class="text-3xl font-bold text-gray-900 sm:text-4xl">
                    {{ __('marketing.contact.title') }}
                </h2>
                <p class="mt-4 text-xl text-gray-600 max-w-3xl mx-auto">
                    {{ __('marketing.contact.subtitle') }}
                </p>
            </div>

            <div class="mt-16 grid grid-cols-1 gap-8 lg:grid-cols-2">
                <!-- Contact Information -->
                <div data-aos="fade-right">
                    <h3 class="text-2xl font-bold text-gray-900 mb-8">{{ __('marketing.contact.contact_information') }}</h3>

                    <div class="space-y-6">
                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-map-marker-alt text-primary-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.contact.office_location') }}</h4>
                                <p class="text-gray-600">{{ __('marketing.contact.address') }}</p>
                                <p class="text-gray-600">{{ __('marketing.contact.landmark') }}</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-phone text-secondary-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.contact.phone_numbers') }}</h4>
                                <p class="text-gray-600">+255 123 456 789</p>
                                <p class="text-gray-600">+255 987 654 321</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-envelope text-yellow-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.contact.email') }}</h4>
                                <p class="text-gray-600">info@tabatawelfare.org</p>
                                <p class="text-gray-600">support@tabatawelfare.org</p>
                            </div>
                        </div>

                        <div class="flex items-start">
                            <div class="flex-shrink-0">
                                <div class="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                                    <i class="fas fa-clock text-purple-600"></i>
                                </div>
                            </div>
                            <div class="ml-4">
                                <h4 class="text-lg font-semibold text-gray-900">{{ __('marketing.contact.office_hours') }}</h4>
                                <p class="text-gray-600">{{ __('marketing.contact.weekdays') }}</p>
                                <p class="text-gray-600">{{ __('marketing.contact.saturday') }}</p>
                                <p class="text-gray-600">{{ __('marketing.contact.sunday') }}</p>
                            </div>
                        </div>
                    </div>

                    <!-- Social Media -->
                    <div class="mt-8">
                        <h4 class="text-lg font-semibold text-gray-900 mb-4">{{ __('marketing.contact.follow_us') }}</h4>
                        <div class="flex space-x-4">
                            <a href="#"
                                class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                                <i class="fab fa-facebook-f text-blue-600"></i>
                            </a>
                            <a href="#"
                                class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center hover:bg-blue-200 transition-colors">
                                <i class="fab fa-twitter text-blue-600"></i>
                            </a>
                            <a href="#"
                                class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center hover:bg-green-200 transition-colors">
                                <i class="fab fa-whatsapp text-green-600"></i>
                            </a>
                            <a href="#"
                                class="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center hover:bg-pink-200 transition-colors">
                                <i class="fab fa-instagram text-pink-600"></i>
                            </a>
                        </div>
                    </div>
                </div>

                <!-- Contact Form -->
                <div data-aos="fade-left">
                    <div class="bg-white rounded-2xl shadow-2xl p-6 border border-gray-100">
                        <div class="text-center mb-6">
                            <h3 class="text-xl font-bold text-gray-900 mb-2">{{ __('marketing.contact.send_message') }}</h3>
                            <p class="text-gray-600 text-sm">{{ __('marketing.contact.love_to_hear') }}</p>
                        </div>

                        <form id="contact-form" class="space-y-4">
                            <!-- Success/Error Messages -->
                            <div id="form-messages" class="hidden"></div>

                            <!-- Name Fields -->
                            <div class="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div class="form-group">
                                    <label for="from_name" class="form-label">
                                        {{ __('marketing.contact.form.first_name') }}<span class="required-asterisk">*</span>
                                    </label>
                                    <div class="relative">
                                        <input type="text" id="from_name" name="from_name" required
                                            class="form-input has-icon w-full" placeholder="{{ __('marketing.contact.form.first_name_placeholder') }}">
                                        <i class="fas fa-user form-icon"></i>
                                    </div>
                                </div>
                                <div class="form-group">
                                    <label for="last_name" class="form-label">
                                        {{ __('marketing.contact.form.last_name') }}<span class="required-asterisk">*</span>
                                    </label>
                                    <div class="relative">
                                        <input type="text" id="last_name" name="last_name" required
                                            class="form-input has-icon w-full" placeholder="{{ __('marketing.contact.form.last_name_placeholder') }}">
                                        <i class="fas fa-user form-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Email Field -->
                            <div class="form-group">
                                <label for="reply_to" class="form-label">
                                    {{ __('marketing.contact.form.email') }}<span class="required-asterisk">*</span>
                                </label>
                                <div class="relative">
                                    <input type="email" id="reply_to" name="reply_to" required
                                        class="form-input has-icon w-full" placeholder="your.email@example.com">
                                    <i class="fas fa-envelope form-icon"></i>
                                </div>
                            </div>

                            <!-- Phone and Subject Fields -->
                            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div class="form-group">
                                    <label for="phone_number" class="form-label">{{ __('marketing.contact.form.phone') }}</label>
                                    <div class="relative">
                                        <input type="tel" id="phone_number" name="phone_number"
                                            class="form-input has-icon w-full" placeholder="+255 123 456 789">
                                        <i class="fas fa-phone form-icon"></i>
                                    </div>
                                </div>

                                <div class="form-group">
                                    <label for="subject" class="form-label">
                                        {{ __('marketing.contact.form.subject') }}<span class="required-asterisk">*</span>
                                    </label>
                                    <div class="relative">
                                        <select id="subject" name="subject" required
                                            class="form-input form-select w-full">
                                            <option value="">{{ __('marketing.contact.form.select_subject') }}</option>
                                            <option value="General Inquiry">💬 General Inquiry</option>
                                            <option value="Membership Information">👥 Membership Information</option>
                                            <option value="Support Request">🆘 Support Request</option>
                                            <option value="Partnership Opportunity">🤝 Partnership Opportunity</option>
                                            <option value="Financial Services">💰 Financial Services</option>
                                            <option value="Community Events">🎉 Community Events</option>
                                        </select>
                                        <i class="fas fa-tag form-icon"></i>
                                    </div>
                                </div>
                            </div>

                            <!-- Message Field -->
                            <div class="form-group">
                                <label for="message" class="form-label">
                                    {{ __('marketing.contact.form.message') }}<span class="required-asterisk">*</span>
                                </label>
                                <div class="relative">
                                    <textarea id="message" name="message" rows="3" required
                                        class="form-input form-textarea w-full"
                                        placeholder="{{ __('marketing.contact.form.message_placeholder') }}"></textarea>
                                </div>
                            </div>

                            <!-- Hidden fields for EmailJS -->
                            <input type="hidden" name="to_name" value="Tabata Welfare Association">
                            <input type="hidden" name="website" value="twa.or.tz">

                            <!-- Submit Button -->
                            <div class="pt-1">
                                <button type="submit" id="submit-btn"
                                    class="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-2.5 px-5 rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-300">
                                    <span id="btn-text" class="flex items-center justify-center">
                                        <i class="fas fa-paper-plane mr-2"></i>
                                        <span>{{ __('marketing.contact.form.send_button') }}</span>
                                    </span>
                                    <span id="btn-loading" class="hidden items-center justify-center">
                                        <i class="fas fa-spinner fa-spin mr-2"></i>
                                        <span>{{ __('marketing.contact.form.sending') }}</span>
                                    </span>
                                </button>

                            </div>
                        </form>
                    </div>
                    </form>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
            <div class="grid grid-cols-1 gap-8 lg:grid-cols-4">
                <!-- Company Info -->
                <div class="lg:col-span-2">
                    <div class="flex items-center mb-6">
                        <img src="{{ asset('marketing/logo.jpeg') }}" alt="Tabata Welfare Association Logo"
                            class="w-14 h-14 rounded-lg object-cover logo-image">
                        <div class="ml-4">
                            <span class="text-xl font-bold block">Tabata Welfare Association</span>
                            <span class="text-sm text-gray-300">{{ __('marketing.footer.tagline') }}</span>
                        </div>
                    </div>
                    <p class="text-gray-300 mb-6 max-w-md">
                        {{ __('marketing.footer.description') }}
                    </p>
                    <div class="flex space-x-4">
                        <a href="#"
                            class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                            <i class="fab fa-facebook-f"></i>
                        </a>
                        <a href="#"
                            class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                            <i class="fab fa-twitter"></i>
                        </a>
                        <a href="#"
                            class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                            <i class="fab fa-whatsapp"></i>
                        </a>
                        <a href="#"
                            class="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors">
                            <i class="fab fa-instagram"></i>
                        </a>
                    </div>
                </div>

                <!-- Quick Links -->
                <div>
                    <h3 class="text-lg font-semibold mb-6">{{ __('marketing.footer.quick_links') }}</h3>
                    <ul class="space-y-3">
                        <li><a href="#about" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.about') }}</a></li>
                        <li><a href="#announcements" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.announcements') }}</a></li>
                        <li><a href="#services" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.services') }}</a></li>
                        <li><a href="#benefits" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.benefits') }}</a></li>
                        <li><a href="#testimonials"
                                class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.testimonials') }}</a></li>
                        <li><a href="#contact" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.contact') }}</a>
                        </li>
                        <li><a href="{{ route('login') }}" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.nav.member_login') }}</a>
                        </li>
                        <li><a href="https://www.moha.go.tz/home" target="_blank" class="text-gray-300 hover:text-white transition-colors">{{ __('marketing.footer.ministry_link') }}</a>
                    </ul>
                </div>

                <!-- Contact Info -->
                <div>
                    <h3 class="text-lg font-semibold mb-6">{{ __('marketing.footer.contact_info') }}</h3>
                    <ul class="space-y-3">
                        <li class="flex items-start">
                            <i class="fas fa-map-marker-alt text-primary-400 mt-1 mr-3"></i>
                            <span class="text-gray-300">Tabata, Dar es Salaam<br>Tanzania</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-phone text-primary-400 mr-3"></i>
                            <span class="text-gray-300">+255 123 456 789</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-envelope text-primary-400 mr-3"></i>
                            <span class="text-gray-300">info@twa.or.tz</span>
                        </li>
                        <li class="flex items-center">
                            <i class="fas fa-clock text-primary-400 mr-3"></i>
                            <span class="text-gray-300">Mon-Fri: 8AM-5PM</span>
                        </li>
                    </ul>
                </div>
            </div>

            <!-- Bottom Footer -->
            <div class="border-t border-gray-800 mt-12 pt-8">
                <div class="flex flex-col md:flex-row justify-between items-center">
                    <p class="text-gray-400 text-sm">
                        {{ __('marketing.footer.copyright') }}
                    </p>
                    <div class="flex space-x-6 mt-4 md:mt-0">
                        <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">{{ __('marketing.footer.privacy_policy') }}</a>
                        <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">{{ __('marketing.footer.terms_service') }}</a>
                        <a href="#" class="text-gray-400 hover:text-white text-sm transition-colors">{{ __('marketing.footer.cookie_policy') }}</a>
                    </div>
                </div>
            </div>
        </div>
    </footer>

    <!-- Back to Top Button -->
    <button id="back-to-top"
        class="fixed bottom-8 right-8 w-12 h-12 bg-primary-600 text-white rounded-full shadow-lg hover:bg-primary-700 transition-all duration-300 opacity-0 invisible">
        <i class="fas fa-chevron-up"></i>
    </button>
    <!-- JavaScript -->
    <script>
        // Initialize AOS
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            offset: 200
        });

        // Mobile menu toggle
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');

        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });

        // Smooth scrolling for anchor links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Calculate offset for fixed navigation (approximately 180px for header + nav)
                    const navOffset = 180;
                    const targetPosition = target.offsetTop - navOffset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });

                    // Close mobile menu if open
                    mobileMenu.classList.add('hidden');
                }
            });
        });

        // Stats counter animation
        function animateCounter(element, target) {
            let current = 0;
            const increment = target / 100;
            const timer = setInterval(() => {
                current += increment;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }

                // Format large numbers
                if (target >= 1000000) {
                    element.textContent = (current / 1000000).toFixed(1) + 'M';
                } else if (target >= 1000) {
                    element.textContent = (current / 1000).toFixed(0) + 'K';
                } else {
                    element.textContent = Math.floor(current);
                }
            }, 20);
        }

        // Trigger counter animation when stats section is visible
        const statsSection = document.querySelector('.stats-counter').closest('section');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    document.querySelectorAll('.stats-counter').forEach(counter => {
                        const target = parseInt(counter.getAttribute('data-target'));
                        animateCounter(counter, target);
                    });
                    observer.unobserve(entry.target);
                }
            });
        });

        if (statsSection) {
            observer.observe(statsSection);
        }

        // Back to top button
        const backToTopButton = document.getElementById('back-to-top');

        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.remove('opacity-0', 'invisible');
                backToTopButton.classList.add('opacity-100', 'visible');
            } else {
                backToTopButton.classList.add('opacity-0', 'invisible');
                backToTopButton.classList.remove('opacity-100', 'visible');
            }
        });

        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // EmailJS Configuration
        // REPLACE THESE WITH YOUR ACTUAL EMAILJS CREDENTIALS
        const EMAILJS_CONFIG = {
            USER_ID: 'Zi1ISG7P8SrBKupqX',        // Get from EmailJS dashboard
            SERVICE_ID: 'service_c9h8m2h',          // Get from EmailJS dashboard
            TEMPLATE_ID: 'template_ku339nl'         // Get from EmailJS dashboard
        };

        // Initialize EmailJS
        (function () {
            emailjs.init(EMAILJS_CONFIG.USER_ID);
        })();

        // Form submission with EmailJS
        const contactForm = document.getElementById('contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function (e) {
                e.preventDefault();

                // Get form elements
                const submitBtn = document.getElementById('submit-btn');
                const btnText = document.getElementById('btn-text');
                const btnLoading = document.getElementById('btn-loading');
                const formMessages = document.getElementById('form-messages');

                // Show loading state
                btnText.classList.add('hidden');
                btnLoading.classList.remove('hidden');
                btnLoading.classList.add('flex');
                submitBtn.disabled = true;
                formMessages.classList.add('hidden');

                // Prepare form data for EmailJS
                const formData = new FormData(this);
                const templateParams = {
                    to_name: 'Tabata Welfare Association',
                    from_name: formData.get('from_name'),
                    last_name: formData.get('last_name'),
                    reply_to: formData.get('reply_to'),
                    phone_number: formData.get('phone_number'),
                    subject: formData.get('subject'),
                    message: formData.get('message'),
                    website: 'twa.or.tz'
                };

                console.log('Sending email with data:', templateParams);

                // Send email using EmailJS
                emailjs.send(
                    EMAILJS_CONFIG.SERVICE_ID,
                    EMAILJS_CONFIG.TEMPLATE_ID,
                    templateParams
                ).then(function (response) {
                    // Success
                    console.log('SUCCESS!', response.status, response.text);
                    showMessage('success', 'Thank you! Your message has been sent successfully. We will get back to you soon.');
                    contactForm.reset();

                }, function (error) {
                    // Error
                    console.log('FAILED...', error);
                    showMessage('error', 'Sorry, there was an error sending your message. Please try again or contact us directly.');

                }).finally(function () {
                    // Reset button state
                    btnText.classList.remove('hidden');
                    btnLoading.classList.add('hidden');
                    btnLoading.classList.remove('flex');
                    submitBtn.disabled = false;
                });
            });
        }

        // Show success/error messages
        function showMessage(type, message) {
            const formMessages = document.getElementById('form-messages');
            formMessages.className = `form-message ${type}`;
            formMessages.innerHTML = `
                <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-triangle'} mr-3 text-lg"></i>
                <span>${message}</span>
            `;
            formMessages.classList.remove('hidden');

            // Auto-hide success messages after 5 seconds
            if (type === 'success') {
                setTimeout(() => {
                    formMessages.classList.add('hidden');
                }, 5000);
            }
        }

        // Navbar background on scroll
        const navbar = document.querySelector('nav');
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 50) {
                navbar.classList.add('shadow-xl');
                navbar.classList.remove('shadow-lg');
            } else {
                navbar.classList.add('shadow-lg');
                navbar.classList.remove('shadow-xl');
            }
        });

        // Leadership section horizontal scrolling
        const leadershipContainer = document.getElementById('leadership-container');
        const scrollLeftBtn = document.getElementById('scroll-left');
        const scrollRightBtn = document.getElementById('scroll-right');
        const scrollIndicators = document.querySelectorAll('.scroll-indicator');

        if (leadershipContainer && scrollLeftBtn && scrollRightBtn) {
            const cardWidth = 320; // Card width + gap
            let currentIndex = 0;
            const maxIndex = 2; // 3 sets of cards (0, 1, 2)

            // Update scroll indicators
            function updateIndicators() {
                scrollIndicators.forEach((indicator, index) => {
                    if (index === currentIndex) {
                        indicator.classList.remove('bg-gray-300');
                        indicator.classList.add('bg-primary-500');
                    } else {
                        indicator.classList.remove('bg-primary-500');
                        indicator.classList.add('bg-gray-300');
                    }
                });
            }

            // Update button states
            function updateButtons() {
                scrollLeftBtn.style.opacity = currentIndex === 0 ? '0.5' : '1';
                scrollRightBtn.style.opacity = currentIndex === maxIndex ? '0.5' : '1';
            }

            // Scroll left
            scrollLeftBtn.addEventListener('click', () => {
                if (currentIndex > 0) {
                    currentIndex--;
                    leadershipContainer.scrollTo({
                        left: currentIndex * cardWidth * 2,
                        behavior: 'smooth'
                    });
                    updateIndicators();
                    updateButtons();
                }
            });

            // Scroll right
            scrollRightBtn.addEventListener('click', () => {
                if (currentIndex < maxIndex) {
                    currentIndex++;
                    leadershipContainer.scrollTo({
                        left: currentIndex * cardWidth * 2,
                        behavior: 'smooth'
                    });
                    updateIndicators();
                    updateButtons();
                }
            });

            // Touch/swipe support for mobile
            let startX = 0;
            let scrollLeft = 0;

            leadershipContainer.addEventListener('touchstart', (e) => {
                startX = e.touches[0].pageX - leadershipContainer.offsetLeft;
                scrollLeft = leadershipContainer.scrollLeft;
            });

            leadershipContainer.addEventListener('touchmove', (e) => {
                e.preventDefault();
                const x = e.touches[0].pageX - leadershipContainer.offsetLeft;
                const walk = (x - startX) * 2;
                leadershipContainer.scrollLeft = scrollLeft - walk;
            });

            // Auto-scroll functionality (optional)
            let autoScrollInterval;

            function startAutoScroll() {
                autoScrollInterval = setInterval(() => {
                    if (currentIndex < maxIndex) {
                        scrollRightBtn.click();
                    } else {
                        currentIndex = 0;
                        leadershipContainer.scrollTo({
                            left: 0,
                            behavior: 'smooth'
                        });
                        updateIndicators();
                        updateButtons();
                    }
                }, 5000); // Auto-scroll every 5 seconds
            }

            function stopAutoScroll() {
                clearInterval(autoScrollInterval);
            }

            // Start auto-scroll
            startAutoScroll();

            // Pause auto-scroll on hover
            leadershipContainer.addEventListener('mouseenter', stopAutoScroll);
            leadershipContainer.addEventListener('mouseleave', startAutoScroll);

            // Initialize button states
            updateButtons();
        }

        // Leadership card hover effects
        document.querySelectorAll('.leadership-card').forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-8px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Campaign functionality
        function selectCampaign(campaignId, campaignTitle) {
            // Scroll to donation instructions
            const donationSection = document.querySelector('#donate');
            if (donationSection) {
                // Calculate offset for fixed navigation
                const navOffset = 180;
                const targetPosition = donationSection.offsetTop - navOffset;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });

                // Show alert with campaign selection
                setTimeout(() => {
                    alert(`You selected: ${campaignTitle}\\n\\nPlease use the payment methods below to donate to this campaign. Include the campaign name in your payment reference.`);
                }, 500);
            }
        }

        // Flash message functionality
        function closeFlashMessage() {
            const flashMessage = document.getElementById('flash-message');
            if (flashMessage) {
                flashMessage.style.transform = 'translateX(100%)';
                flashMessage.style.opacity = '0';
                setTimeout(() => {
                    flashMessage.remove();
                }, 300);
            }
        }

        // Auto-hide flash message after 5 seconds
        document.addEventListener('DOMContentLoaded', function () {
            const flashMessage = document.getElementById('flash-message');
            if (flashMessage) {
                setTimeout(() => {
                    closeFlashMessage();
                }, 5000);
            }
        });

        // Initialize page functionality
        document.addEventListener('DOMContentLoaded', function () {
            console.log('Tabata Welfare Association website loaded successfully');
        });
    </script>
</body>

</html>