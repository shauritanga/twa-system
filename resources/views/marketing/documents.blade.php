<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Public Documents - Tabata Welfare Association</title>
    <meta name="description" content="Access important documents, forms, policies, and reports from Tabata Welfare Association.">
    <meta name="keywords" content="Tabata Welfare Association, documents, forms, policies, reports, Tanzania welfare">

    <!-- Open Graph Meta Tags -->
    <meta property="og:title" content="Public Documents - Tabata Welfare Association">
    <meta property="og:description" content="Access important documents, forms, policies, and reports from Tabata Welfare Association.">
    <meta property="og:type" content="website">
    <meta property="og:url" content="{{ url('/public/documents') }}">
    <meta property="og:image" content="{{ asset('marketing/logo.jpeg') }}">

    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="{{ asset('marketing/logo.jpeg') }}">
    <link rel="apple-touch-icon" href="{{ asset('marketing/logo.jpeg') }}">

    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

    <!-- Font Awesome -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">

    <!-- Custom Styles -->
    <style>
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

        /* Enhanced member login button */
        .btn-member-login {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: 2px solid transparent;
            font-weight: 600;
            transition: all 0.3s ease;
            position: relative;
            overflow: hidden;
            z-index: 1;
        }

        .btn-member-login::before {
            content: '';
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            transition: left 0.3s ease;
            z-index: -1;
        }

        .btn-member-login:hover::before {
            left: 100%;
        }

        .btn-member-login:hover {
            transform: translateY(-2px);
            box-shadow: 0 12px 30px rgba(102, 126, 234, 0.4);
        }

        /* Combined Header and Navigation Styles */
        nav {
            top: 0 !important;
        }

        nav h2 {
            color: #ffffff;
        }

        nav p {
            color: #e0e7ff;
        }

        /* Responsive adjustments */
        @media (max-width: 640px) {
            nav h2 {
                font-size: 1.125rem;
                line-height: 1.25rem;
            }

            nav p {
                font-size: 0.75rem;
            }
        }

        /* Document page specific styles */
        .line-clamp-2 {
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .line-clamp-3 {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        /* Focus states for accessibility */
        .focus-visible:focus-visible {
            outline: 2px solid #2563eb;
            outline-offset: 2px;
        }

        /* Document card hover effects */
        .document-card {
            transition: all 0.3s ease;
        }

        .document-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
        }

        /* Button styles */
        .btn-primary {
            background: linear-gradient(135deg, #1e40af 0%, #1d4ed8 100%);
            color: white;
            font-weight: 600;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }

        .btn-primary:hover {
            background: linear-gradient(135deg, #1d4ed8 0%, #1e3a8a 100%);
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(30, 64, 175, 0.4);
        }

        .btn-secondary {
            background: #6b7280;
            color: white;
            font-weight: 600;
            border: 2px solid transparent;
            transition: all 0.3s ease;
        }

        .btn-secondary:hover {
            background: #4b5563;
            transform: translateY(-2px);
            box-shadow: 0 10px 25px rgba(107, 114, 128, 0.4);
        }

        /* Page content spacing */
        .page-content {
            padding-top: 180px; /* Account for fixed header */
        }
    </style>
</head>

<body class="font-sans antialiased bg-gray-50">
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
                    <a href="{{ route('marketing.index') }}"
                        class="nav-link-readable px-4 py-3 text-base font-medium transition-colors focus-visible whitespace-nowrap">Home</a>
                </div>

                <!-- Right Navigation - All Other Items -->
                <div class="hidden md:block">
                    <div class="flex items-center space-x-3 lg:space-x-4">
                        <a href="{{ route('marketing.announcements') }}"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">Announcements</a>
                        <a href="{{ route('marketing.documents') }}"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap text-white font-semibold">Documents</a>
                        <a href="{{ route('marketing.index') }}#about"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">About</a>
                        <a href="{{ route('marketing.index') }}#services"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">Services</a>
                        <a href="{{ route('marketing.index') }}#benefits"
                            class="hidden lg:block nav-link-readable px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">Benefits</a>
                        <a href="{{ route('marketing.index') }}#leadership"
                            class="hidden lg:block nav-link-readable px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">Leadership</a>
                        <a href="{{ route('marketing.index') }}#testimonials"
                            class="hidden lg:block nav-link-readable px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">Testimonials</a>
                        <a href="{{ route('marketing.index') }}#contact"
                            class="nav-link-readable px-2 lg:px-3 py-3 text-sm font-medium transition-colors focus-visible whitespace-nowrap">Contact</a>

                        <a href="{{ route('login') }}"
                            class="btn-member-login px-3 lg:px-4 py-3 rounded-lg text-sm font-medium focus-visible whitespace-nowrap">Member Login</a>
                    </div>
                </div>

                <!-- Mobile Navigation -->
                <div class="md:hidden flex items-center justify-between w-full">
                    <!-- Home link for mobile -->
                    <a href="{{ route('marketing.index') }}" class="nav-link-readable px-4 py-3 text-base font-medium">Home</a>

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
                <a href="{{ route('marketing.announcements') }}" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Announcements</a>
                <a href="{{ route('marketing.documents') }}" class="block px-4 py-4 text-white bg-blue-500 text-base rounded-lg font-semibold">Documents</a>
                <a href="{{ route('marketing.index') }}#about" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">About</a>
                <a href="{{ route('marketing.index') }}#services" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Services</a>
                <a href="{{ route('marketing.index') }}#benefits" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Benefits</a>
                <a href="{{ route('marketing.index') }}#leadership" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Leadership</a>
                <a href="{{ route('marketing.index') }}#testimonials" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Testimonials</a>
                <a href="{{ route('marketing.index') }}#contact" class="block px-4 py-4 text-blue-100 text-base rounded-lg hover:bg-blue-500 hover:text-white transition-colors">Contact</a>
                <a href="{{ route('login') }}"
                    class="block px-6 py-4 btn-member-login rounded-lg text-center mt-6 whitespace-nowrap">Member Login</a>
            </div>
        </div>
    </nav>
<div class="container mx-auto px-4 py-8">
    <!-- Header -->
    <div class="text-center mb-12">
        <h1 class="text-4xl font-bold text-gray-900 mb-4">Public Documents</h1>
        <p class="text-xl text-gray-600 max-w-3xl mx-auto">
            Access important documents, forms, policies, and reports from our organization.
        </p>
    </div>

    <!-- Search and Filter -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-8">
        <form method="GET" action="{{ route('marketing.documents') }}" class="flex flex-col md:flex-row gap-4">
            <!-- Search -->
            <div class="flex-1">
                <input 
                    type="text" 
                    name="search" 
                    value="{{ request('search') }}"
                    placeholder="Search documents..." 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
            </div>

            <!-- Category Filter -->
            <div class="md:w-64">
                <select 
                    name="category" 
                    class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="">All Categories</option>
                    @foreach($categories as $value => $label)
                        <option value="{{ $value }}" {{ request('category') === $value ? 'selected' : '' }}>
                            {{ $label }}
                        </option>
                    @endforeach
                </select>
            </div>

            <!-- Search Button -->
            <button 
                type="submit" 
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
                Search
            </button>

            <!-- Clear Filters -->
            @if(request('search') || request('category'))
                <a 
                    href="{{ route('marketing.documents') }}" 
                    class="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-center"
                >
                    Clear
                </a>
            @endif
        </form>
    </div>

    <!-- Documents Grid -->
    @if($documents->count() > 0)
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            @foreach($documents as $document)
                <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow p-6">
                    <!-- Document Icon and Type -->
                    <div class="flex items-center mb-4">
                        <div class="text-3xl mr-3">
                            @switch(strtolower($document->file_type))
                                @case('pdf')
                                    📄
                                    @break
                                @case('doc')
                                @case('docx')
                                    📝
                                    @break
                                @case('xls')
                                @case('xlsx')
                                    📊
                                    @break
                                @case('ppt')
                                @case('pptx')
                                    📋
                                    @break
                                @case('jpg')
                                @case('jpeg')
                                @case('png')
                                @case('gif')
                                    🖼️
                                    @break
                                @default
                                    📁
                            @endswitch
                        </div>
                        <div>
                            <span class="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                {{ strtoupper($document->file_type) }}
                            </span>
                            <span class="inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full ml-1">
                                {{ $document->category_display }}
                            </span>
                        </div>
                    </div>

                    <!-- Document Title -->
                    <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                        {{ $document->title }}
                    </h3>

                    <!-- Document Description -->
                    @if($document->description)
                        <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                            {{ $document->description }}
                        </p>
                    @endif

                    <!-- Document Meta -->
                    <div class="text-xs text-gray-500 mb-4 space-y-1">
                        @if($document->document_date)
                            <div>📅 {{ $document->document_date->format('M d, Y') }}</div>
                        @endif
                        <div>📥 {{ $document->download_count }} downloads</div>
                        <div>📦 {{ $document->formatted_file_size }}</div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="flex gap-2">
                        <!-- Download Button -->
                        <a 
                            href="{{ route('documents.public.download', $document) }}" 
                            class="flex-1 bg-blue-600 text-white text-center py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                            target="_blank"
                        >
                            Download
                        </a>

                        <!-- Preview Button (for supported file types) -->
                        @if(in_array(strtolower($document->file_type), ['pdf', 'jpg', 'jpeg', 'png', 'gif']))
                            <a 
                                href="{{ route('documents.public.preview', $document) }}" 
                                class="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition-colors text-sm font-medium"
                                target="_blank"
                            >
                                Preview
                            </a>
                        @endif
                    </div>
                </div>
            @endforeach
        </div>

        <!-- Pagination -->
        <div class="flex justify-center">
            {{ $documents->appends(request()->query())->links() }}
        </div>
    @else
        <!-- No Documents Found -->
        <div class="text-center py-12">
            <div class="text-6xl mb-4">📄</div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
            <p class="text-gray-600">
                @if(request('search') || request('category'))
                    No documents match your search criteria. Try adjusting your filters.
                @else
                    There are currently no public documents available.
                @endif
            </p>
        </div>
    @endif
</div>

<!-- Footer -->
<footer class="bg-gray-900 text-white py-12 mt-16">
    <div class="container mx-auto px-4">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
                <div class="flex items-center mb-4">
                    <img src="{{ asset('marketing/logo.jpeg') }}" alt="TWA Logo" class="h-10 w-10 mr-3">
                    <h3 class="text-lg font-bold">Tabata Welfare Association</h3>
                </div>
                <p class="text-gray-400">Building community, securing futures through collective support and financial security.</p>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                <ul class="space-y-2">
                    <li><a href="{{ route('marketing.index') }}" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
                    <li><a href="{{ route('marketing.announcements') }}" class="text-gray-400 hover:text-white transition-colors">Announcements</a></li>
                    <li><a href="{{ route('marketing.documents') }}" class="text-gray-400 hover:text-white transition-colors">Documents</a></li>
                    <li><a href="{{ route('login') }}" class="text-gray-400 hover:text-white transition-colors">Member Login</a></li>
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                <ul class="space-y-2 text-gray-400">
                    <li>📧 info@tabatawelfare.org</li>
                    <li>📞 +255 123 456 789</li>
                    <li>📍 Tabata, Dar es Salaam, Tanzania</li>
                </ul>
            </div>
            <div>
                <h4 class="text-lg font-semibold mb-4">Follow Us</h4>
                <div class="flex space-x-4">
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">Facebook</a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">Twitter</a>
                    <a href="#" class="text-gray-400 hover:text-white transition-colors">WhatsApp</a>
                </div>
            </div>
        </div>
        <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; {{ date('Y') }} Tabata Welfare Association. All rights reserved.</p>
        </div>
    </div>
</footer>

</body>
</html>
    <!-- Page Content -->
    <div class="page-content">
        <div class="container mx-auto px-4 py-8">
            <!-- Header -->
            <div class="text-center mb-12">
                <h1 class="text-4xl font-bold text-gray-900 mb-4">Public Documents</h1>
                <p class="text-xl text-gray-600 max-w-3xl mx-auto">
                    Access important documents, forms, policies, and reports from our organization.
                </p>
            </div>

            <!-- Search and Filter -->
            <div class="bg-white rounded-lg shadow-md p-6 mb-8">
                <form method="GET" action="{{ route('marketing.documents') }}" class="flex flex-col md:flex-row gap-4">
                    <!-- Search -->
                    <div class="flex-1">
                        <input 
                            type="text" 
                            name="search" 
                            value="{{ request('search') }}"
                            placeholder="Search documents..." 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                    </div>

                    <!-- Category Filter -->
                    <div class="md:w-64">
                        <select 
                            name="category" 
                            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            @foreach($categories as $value => $label)
                                <option value="{{ $value }}" {{ request('category') === $value ? 'selected' : '' }}>
                                    {{ $label }}
                                </option>
                            @endforeach
                        </select>
                    </div>

                    <!-- Search Button -->
                    <button 
                        type="submit" 
                        class="px-6 py-2 btn-primary rounded-lg transition-all"
                    >
                        Search
                    </button>

                    <!-- Clear Filters -->
                    @if(request('search') || request('category'))
                        <a 
                            href="{{ route('marketing.documents') }}" 
                            class="px-6 py-2 btn-secondary rounded-lg transition-all text-center"
                        >
                            Clear
                        </a>
                    @endif
                </form>
            </div>

            <!-- Documents Grid -->
            @if($documents->count() > 0)
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    @foreach($documents as $document)
                        <div class="document-card bg-white rounded-lg shadow-md hover:shadow-lg p-6">
                            <!-- Document Icon and Type -->
                            <div class="flex items-center mb-4">
                                <div class="text-3xl mr-3">
                                    @switch(strtolower($document->file_type))
                                        @case('pdf')
                                            📄
                                            @break
                                        @case('doc')
                                        @case('docx')
                                            📝
                                            @break
                                        @case('xls')
                                        @case('xlsx')
                                            📊
                                            @break
                                        @case('ppt')
                                        @case('pptx')
                                            📋
                                            @break
                                        @case('jpg')
                                        @case('jpeg')
                                        @case('png')
                                        @case('gif')
                                            🖼️
                                            @break
                                        @default
                                            📁
                                    @endswitch
                                </div>
                                <div>
                                    <span class="inline-block px-2 py-1 text-xs font-semibold text-blue-800 bg-blue-100 rounded-full">
                                        {{ strtoupper($document->file_type) }}
                                    </span>
                                    <span class="inline-block px-2 py-1 text-xs font-semibold text-gray-600 bg-gray-100 rounded-full ml-1">
                                        {{ $document->category_display }}
                                    </span>
                                </div>
                            </div>

                            <!-- Document Title -->
                            <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                                {{ $document->title }}
                            </h3>

                            <!-- Document Description -->
                            @if($document->description)
                                <p class="text-gray-600 text-sm mb-4 line-clamp-3">
                                    {{ $document->description }}
                                </p>
                            @endif

                            <!-- Document Meta -->
                            <div class="text-xs text-gray-500 mb-4 space-y-1">
                                @if($document->document_date)
                                    <div>📅 {{ $document->document_date->format('M d, Y') }}</div>
                                @endif
                                <div>📥 {{ $document->download_count }} downloads</div>
                                <div>📦 {{ $document->formatted_file_size }}</div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex gap-2">
                                <!-- Download Button -->
                                <a 
                                    href="{{ route('documents.public.download', $document) }}" 
                                    class="flex-1 btn-primary text-center py-2 px-4 rounded-lg transition-all text-sm font-medium"
                                    target="_blank"
                                >
                                    Download
                                </a>

                                <!-- Preview Button (for supported file types) -->
                                @if(in_array(strtolower($document->file_type), ['pdf', 'jpg', 'jpeg', 'png', 'gif']))
                                    <a 
                                        href="{{ route('documents.public.preview', $document) }}" 
                                        class="btn-secondary py-2 px-4 rounded-lg transition-all text-sm font-medium"
                                        target="_blank"
                                    >
                                        Preview
                                    </a>
                                @endif
                            </div>
                        </div>
                    @endforeach
                </div>

                <!-- Pagination -->
                <div class="flex justify-center">
                    {{ $documents->appends(request()->query())->links() }}
                </div>
            @else
                <!-- No Documents Found -->
                <div class="text-center py-12">
                    <div class="text-6xl mb-4">📄</div>
                    <h3 class="text-xl font-semibold text-gray-900 mb-2">No Documents Found</h3>
                    <p class="text-gray-600">
                        @if(request('search') || request('category'))
                            No documents match your search criteria. Try adjusting your filters.
                        @else
                            There are currently no public documents available.
                        @endif
                    </p>
                </div>
            @endif
        </div>
    </div>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-12 mt-16">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                    <div class="flex items-center mb-4">
                        <img src="{{ asset('marketing/logo.jpeg') }}" alt="TWA Logo" class="h-10 w-10 mr-3">
                        <h3 class="text-lg font-bold">Tabata Welfare Association</h3>
                    </div>
                    <p class="text-gray-400">Building community, securing futures through collective support and financial security.</p>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Quick Links</h4>
                    <ul class="space-y-2">
                        <li><a href="{{ route('marketing.index') }}" class="text-gray-400 hover:text-white transition-colors">Home</a></li>
                        <li><a href="{{ route('marketing.announcements') }}" class="text-gray-400 hover:text-white transition-colors">Announcements</a></li>
                        <li><a href="{{ route('marketing.documents') }}" class="text-gray-400 hover:text-white transition-colors">Documents</a></li>
                        <li><a href="{{ route('login') }}" class="text-gray-400 hover:text-white transition-colors">Member Login</a></li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Contact Info</h4>
                    <ul class="space-y-2 text-gray-400">
                        <li>📧 info@tabatawelfare.org</li>
                        <li>📞 +255 123 456 789</li>
                        <li>📍 Tabata, Dar es Salaam, Tanzania</li>
                    </ul>
                </div>
                <div>
                    <h4 class="text-lg font-semibold mb-4">Follow Us</h4>
                    <div class="flex space-x-4">
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Facebook</a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">Twitter</a>
                        <a href="#" class="text-gray-400 hover:text-white transition-colors">WhatsApp</a>
                    </div>
                </div>
            </div>
            <div class="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>&copy; {{ date('Y') }} Tabata Welfare Association. All rights reserved.</p>
            </div>
        </div>
    </footer>

    <!-- JavaScript -->
    <script>
        // Mobile menu toggle
        const mobileMenuButton = document.querySelector('.mobile-menu-button');
        const mobileMenu = document.querySelector('.mobile-menu');

        if (mobileMenuButton && mobileMenu) {
            mobileMenuButton.addEventListener('click', () => {
                mobileMenu.classList.toggle('hidden');
            });
        }

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
                }
            });
        });
    </script>

</body>
</html>