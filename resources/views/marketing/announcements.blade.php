<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Announcements - Tabata Welfare Association</title>
    <meta name="description" content="Latest announcements and news from Tabata Welfare Association">
    
    <!-- Favicon -->
    <link rel="icon" type="image/jpeg" href="{{ asset('marketing/logo.jpeg') }}">
    
    <!-- Tailwind CSS -->
    <script src="https://cdn.tailwindcss.com"></script>
    
    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
    
    <!-- AOS Animation Library -->
    <link href="https://unpkg.com/aos@2.3.1/dist/aos.css" rel="stylesheet">
    
    <style>
        body {
            font-family: 'Inter', sans-serif;
        }
        
        .gradient-bg {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
        
        .text-gradient {
            background: linear-gradient(135deg, #667eea, #764ba2);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
    </style>
</head>

<body class="bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-lg">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex justify-between items-center py-6">
                <div class="flex items-center">
                    <img src="{{ asset('marketing/logo.jpeg') }}" alt="TWA Logo" class="w-12 h-12 rounded-lg object-cover">
                    <div class="ml-3">
                        <h1 class="text-xl font-bold text-gray-900">Tabata Welfare Association</h1>
                        <p class="text-sm text-gray-600">Announcements</p>
                    </div>
                </div>
                <div class="flex space-x-4">
                    <a href="{{ route('marketing.index') }}" class="text-gray-600 hover:text-blue-600 font-medium">
                        ← Back to Home
                    </a>
                    <a href="{{ route('login') }}" class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        Member Login
                    </a>
                </div>
            </div>
        </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="text-center mb-12">
            <h1 class="text-4xl font-bold text-gray-900 mb-4">
                All <span class="text-gradient">Announcements</span>
            </h1>
            <p class="text-lg text-gray-600 max-w-3xl mx-auto">
                Stay informed with the latest news, events, and important updates from Tabata Welfare Association
            </p>
        </div>

        <!-- Announcements Grid -->
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            @forelse($announcements as $announcement)
                <article class="bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden" data-aos="fade-up">

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
                            <time class="text-sm text-gray-500">{{ $announcement->announcement_date->format('M d, Y') }}</time>
                        </div>

                        <h2 class="text-xl font-semibold text-gray-900 mb-3">
                            {{ $announcement->title }}
                        </h2>

                        <p class="text-gray-600 mb-4 leading-relaxed">
                            {{ $announcement->content }}
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
                </article>
            @empty
                <div class="col-span-full text-center py-12">
                    <svg class="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path>
                    </svg>
                    <h3 class="text-lg font-medium text-gray-900 mb-2">No announcements yet</h3>
                    <p class="text-gray-600">Check back later for the latest news and updates.</p>
                </div>
            @endforelse
        </div>

        <!-- Pagination -->
        @if($announcements->hasPages())
            <div class="mt-12">
                {{ $announcements->links() }}
            </div>
        @endif
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-16">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div class="flex items-center justify-center mb-4">
                <img src="{{ asset('marketing/logo.jpeg') }}" alt="TWA Logo" class="w-10 h-10 rounded-lg object-cover mr-3">
                <span class="text-lg font-semibold">Tabata Welfare Association</span>
            </div>
            <p class="text-gray-400 mb-4">Building Community, Securing Futures</p>
            <div class="flex justify-center space-x-6">
                <a href="{{ route('marketing.index') }}" class="text-gray-400 hover:text-white transition-colors">Home</a>
                <a href="{{ route('marketing.index') }}#about" class="text-gray-400 hover:text-white transition-colors">About</a>
                <a href="{{ route('marketing.index') }}#contact" class="text-gray-400 hover:text-white transition-colors">Contact</a>
                <a href="{{ route('login') }}" class="text-gray-400 hover:text-white transition-colors">Member Login</a>
            </div>
            <div class="mt-6 pt-6 border-t border-gray-800">
                <p class="text-gray-400 text-sm">
                    © {{ date('Y') }} Tabata Welfare Association. All rights reserved.
                </p>
            </div>
        </div>
    </footer>

    <!-- Scripts -->
    <script src="https://unpkg.com/aos@2.3.1/dist/aos.js"></script>
    <script>
        AOS.init({
            duration: 800,
            easing: 'ease-in-out',
            once: true,
            mirror: false
        });
    </script>
</body>
</html>
