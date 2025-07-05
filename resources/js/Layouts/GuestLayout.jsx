import { Link } from '@inertiajs/react';
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { useEffect, useMemo, useState } from "react";
import { loadFull } from "tsparticles";

export default function GuestLayout({ children }) {
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
                                value: '#111827',
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
                                value: '#ffffff',
                            },
                            links: {
                                color: '#ffffff',
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
                <div className="relative z-10 flex min-h-screen items-center justify-center">
                    <div className="w-full max-w-md rounded-lg bg-white/20 px-8 py-10 shadow-lg backdrop-blur-md">
                        <div className="mb-8 text-center">
                            <Link href="/">
                                <h1 className="text-4xl font-bold text-white">TWA</h1>
                            </Link>
                        </div>
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
