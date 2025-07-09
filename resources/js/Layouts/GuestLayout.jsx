import { Link } from '@inertiajs/react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadFull } from "tsparticles";

export default function GuestLayout({ children, title = "Welcome Back", subtitle = "Sign in to your account" }) {
    const [init, setInit] = useState(false);

    useEffect(() => {
        initParticlesEngine(async (engine) => {
            await loadFull(engine);
        }).then(() => {
            setInit(true);
        });
    }, []);

    const particlesLoaded = (container) => {
        console.log(container);
    };

    return (
        <>
            <div className="relative min-h-screen bg-gray-900">
                {init && <Particles
                    id="tsparticles"
                    particlesLoaded={particlesLoaded}
                    options={{
background: {
    color: {
        value: '#ffffff',
    },
},
                        fpsLimit: 60,
                        interactivity: {
                            events: {
                                onHover: {
                                    enable: true,
                                    mode: 'repulse',
                                },
                                resize: true,
                            },
                            modes: {
                                repulse: {
                                    distance: 100,
                                    duration: 0.4,
                                },
                            },
                        },
particles: {
    color: {
        value: '#666666',
    },
    links: {
        color: '#666666',
        distance: 150,
        enable: true,
        opacity: 0.5,
        width: 1,
    },
                            collisions: {
                                enable: true,
                            },
                            move: {
                                direction: 'none',
                                enable: true,
                                outModes: {
                                    default: 'bounce',
                                },
                                random: false,
                                speed: 2,
                                straight: false,
                            },
                            number: {
                                density: {
                                    enable: true,
                                    area: 800,
                                },
                                value: 80,
                            },
                            opacity: {
                                value: 0.5,
                            },
                            shape: {
                                type: 'circle',
                            },
                            size: {
                                value: { min: 1, max: 5 },
                            },
                        },
                        detectRetina: true,
                    }}
                />}
                <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
                    <div className="w-full max-w-md">
                        {/* Enhanced login card with better visibility */}
                        <div className="relative overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-200">
                            {/* Subtle gradient overlay for depth */}
                            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-indigo-50/50"></div>

                            {/* Card content */}
                            <div className="relative px-8 py-10">
                                <div className="mb-8 text-center">
                                    <Link href="/">
                                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-full shadow-lg">
                                            <h1 className="text-2xl font-bold text-white">TWA</h1>
                                        </div>
                                        <h2 className="text-2xl font-bold text-gray-800 mb-2">{title}</h2>
                                        <p className="text-gray-600">{subtitle}</p>
                                    </Link>
                                </div>
                                {children}
                            </div>

                            {/* Bottom accent line */}
                            <div className="h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
