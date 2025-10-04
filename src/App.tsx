import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

// TypeScript interfaces (same as before)
interface AsteroidData {
    id: string;
    name: string;
    nasa_jpl_url: string;
    absolute_magnitude_h: number;
    estimated_diameter_km_min: number;
    estimated_diameter_km_max: number;
    estimated_diameter_m_min: number;
    estimated_diameter_m_max: number;
    estimated_diameter_mi_min: number;
    estimated_diameter_mi_max: number;
    estimated_diameter_ft_min: number;
    estimated_diameter_ft_max: number;
    is_potentially_hazardous_asteroid: boolean;
    is_sentry_object: boolean;
    close_approach_date: string;
    close_approach_date_full: string;
    epoch_date_close_approach: number;
    relative_velocity_km_s: number;
    relative_velocity_km_h: number;
    relative_velocity_mph: number;
    miss_distance_au: number;
    miss_distance_lunar: number;
    miss_distance_km: number;
    miss_distance_mi: number;
    orbiting_body: string;
    impact: {
        energy_megatons: number;
        crater_km: number;
        risk_zones: string[];
    };
    torino_scale: number;
    importance_score: number;
}

interface AsteroidMesh extends THREE.Mesh {
    userData: AsteroidData;
}

// Same asteroid data
const ASTEROID_DATA: AsteroidData[] = [
    {
        id: '2465633',
        name: '465633 (2009 JR5)',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2465633',
        absolute_magnitude_h: 20.44,
        estimated_diameter_km_min: 0.2170475943,
        estimated_diameter_km_max: 0.4853331752,
        estimated_diameter_m_min: 217.0475943071,
        estimated_diameter_m_max: 485.3331752235,
        estimated_diameter_mi_min: 0.1348670807,
        estimated_diameter_mi_max: 0.3015719604,
        estimated_diameter_ft_min: 712.0984293066,
        estimated_diameter_ft_max: 1592.3004946003,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2015-09-08',
        close_approach_date_full: '2015-Sep-08 20:28',
        epoch_date_close_approach: 1441744080000,
        relative_velocity_km_s: 18.1279360862,
        relative_velocity_km_h: 65260.5699103704,
        relative_velocity_mph: 40550.3802312521,
        miss_distance_au: 0.3027469457,
        miss_distance_lunar: 117.7685618773,
        miss_distance_km: 45290298.22572566,
        miss_distance_mi: 28142086.351581734,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 150,
            crater_km: 3.2,
            risk_zones: ['Pacific Ocean', 'Coastal Japan'],
        },
        torino_scale: 1,
        importance_score: 5,
    },
    {
        id: '2394051',
        name: '394051 (2006 AM4)',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2394051',
        absolute_magnitude_h: 18.9,
        estimated_diameter_km_min: 0.4,
        estimated_diameter_km_max: 0.9,
        estimated_diameter_m_min: 400,
        estimated_diameter_m_max: 900,
        estimated_diameter_mi_min: 0.248548,
        estimated_diameter_mi_max: 0.559234,
        estimated_diameter_ft_min: 1312.336,
        estimated_diameter_ft_max: 2952.756,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: true,
        close_approach_date: '2029-04-13',
        close_approach_date_full: '2029-Apr-13 21:46',
        epoch_date_close_approach: 1871234080000,
        relative_velocity_km_s: 7.42,
        relative_velocity_km_h: 26712,
        relative_velocity_mph: 16590.2,
        miss_distance_au: 0.0255,
        miss_distance_lunar: 9.93,
        miss_distance_km: 3816906,
        miss_distance_mi: 2371234,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 875,
            crater_km: 8.5,
            risk_zones: ['Atlantic Ocean', 'European Coast', 'African Coast'],
        },
        torino_scale: 3,
        importance_score: 10,
    },
    {
        id: '2099942',
        name: '99942 Apophis',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2099942',
        absolute_magnitude_h: 19.7,
        estimated_diameter_km_min: 0.31,
        estimated_diameter_km_max: 0.34,
        estimated_diameter_m_min: 310,
        estimated_diameter_m_max: 340,
        estimated_diameter_mi_min: 0.192625,
        estimated_diameter_mi_max: 0.211266,
        estimated_diameter_ft_min: 1017.06,
        estimated_diameter_ft_max: 1115.49,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2029-04-13',
        close_approach_date_full: '2029-Apr-13 21:46',
        epoch_date_close_approach: 1871234080000,
        relative_velocity_km_s: 7.42,
        relative_velocity_km_h: 26712,
        relative_velocity_mph: 16590.2,
        miss_distance_au: 0.0255,
        miss_distance_lunar: 9.93,
        miss_distance_km: 3816906,
        miss_distance_mi: 2371234,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 506,
            crater_km: 5.1,
            risk_zones: ['Indian Ocean', 'Southeast Asia'],
        },
        torino_scale: 2,
        importance_score: 8,
    },
    {
        id: '2001036',
        name: '1036 Ganymed',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001036',
        absolute_magnitude_h: 9.45,
        estimated_diameter_km_min: 31.7,
        estimated_diameter_km_max: 38.9,
        estimated_diameter_m_min: 31700,
        estimated_diameter_m_max: 38900,
        estimated_diameter_mi_min: 19.7,
        estimated_diameter_mi_max: 24.2,
        estimated_diameter_ft_min: 104000,
        estimated_diameter_ft_max: 127600,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2024-10-13',
        close_approach_date_full: '2024-Oct-13 14:56',
        epoch_date_close_approach: 1728825360000,
        relative_velocity_km_s: 19.56,
        relative_velocity_km_h: 70416,
        relative_velocity_mph: 43750.8,
        miss_distance_au: 0.381,
        miss_distance_lunar: 148.2,
        miss_distance_km: 57000000,
        miss_distance_mi: 35418600,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 50000,
            crater_km: 45,
            risk_zones: ['Global Impact', 'Mass Extinction Event'],
        },
        torino_scale: 0,
        importance_score: 7,
    },
    {
        id: '2000433',
        name: '433 Eros',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2000433',
        absolute_magnitude_h: 10.4,
        estimated_diameter_km_min: 16.84,
        estimated_diameter_km_max: 16.84,
        estimated_diameter_m_min: 16840,
        estimated_diameter_m_max: 16840,
        estimated_diameter_mi_min: 10.46,
        estimated_diameter_mi_max: 10.46,
        estimated_diameter_ft_min: 55250,
        estimated_diameter_ft_max: 55250,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2031-01-31',
        close_approach_date_full: '2031-Jan-31 02:17',
        epoch_date_close_approach: 1927758720000,
        relative_velocity_km_s: 23.04,
        relative_velocity_km_h: 82944,
        relative_velocity_mph: 51544.3,
        miss_distance_au: 0.178,
        miss_distance_lunar: 69.3,
        miss_distance_km: 26640000,
        miss_distance_mi: 16553600,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 15000,
            crater_km: 30,
            risk_zones: ['Continental Devastation'],
        },
        torino_scale: 0,
        importance_score: 4,
    },
    {
        id: '2004769',
        name: '4769 Castalia',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2004769',
        absolute_magnitude_h: 16.9,
        estimated_diameter_km_min: 1.4,
        estimated_diameter_km_max: 1.8,
        estimated_diameter_m_min: 1400,
        estimated_diameter_m_max: 1800,
        estimated_diameter_mi_min: 0.87,
        estimated_diameter_mi_max: 1.12,
        estimated_diameter_ft_min: 4593,
        estimated_diameter_ft_max: 5906,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2028-08-19',
        close_approach_date_full: '2028-Aug-19 12:03',
        epoch_date_close_approach: 1850825380000,
        relative_velocity_km_s: 8.89,
        relative_velocity_km_h: 32004,
        relative_velocity_mph: 19884.8,
        miss_distance_au: 0.545,
        miss_distance_lunar: 212.0,
        miss_distance_km: 81500000,
        miss_distance_mi: 50642500,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 800,
            crater_km: 12,
            risk_zones: ['Regional Damage'],
        },
        torino_scale: 0,
        importance_score: 2,
    },
].sort((a, b) => b.importance_score - a.importance_score);

// Function to create space background with stars
function createStarField() {
    const starsGeometry = new THREE.BufferGeometry();
    const starCount = 15000; // Many stars for space feel

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        // Random positions in a large sphere
        positions[i * 3] = (Math.random() - 0.5) * 4000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4000;

        // Random star colors (white, blue, yellow, red)
        const starType = Math.random();
        if (starType < 0.7) {
            // White stars (most common)
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        } else if (starType < 0.85) {
            // Blue stars
            colors[i * 3] = 0.7;
            colors[i * 3 + 1] = 0.8;
            colors[i * 3 + 2] = 1;
        } else if (starType < 0.95) {
            // Yellow stars
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 0.7;
        } else {
            // Red stars
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 0.7;
            colors[i * 3 + 2] = 0.7;
        }
    }

    starsGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    starsGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const starsMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
    });

    return new THREE.Points(starsGeometry, starsMaterial);
}

// Function to create simple country outlines on Earth
function createEarthWithCountries() {
    // Create Earth sphere (BIGGER)
    const earthGeometry = new THREE.SphereGeometry(3, 64, 64); // Increased from 1.2 to 3
    const earthMaterial = new THREE.MeshPhongMaterial({
        color: 0x1a5490, // Ocean blue
        shininess: 100,
        transparent: true,
        opacity: 0.9,
    });
    const earth = new THREE.Mesh(earthGeometry, earthMaterial);

    // Add simple continent shapes as green overlays
    const continentGeometry = new THREE.SphereGeometry(3.01, 32, 32); // Slightly larger radius

    // Create a simple procedural texture for continents
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    // Fill with transparent
    context.fillStyle = 'rgba(0,0,0,0)';
    context.fillRect(0, 0, 512, 256);

    // Draw simplified continent shapes
    context.fillStyle = 'rgba(34, 139, 34, 0.8)'; // Forest green

    // North America (rough)
    context.fillRect(60, 40, 80, 60);
    context.fillRect(40, 50, 40, 40);

    // South America (rough)
    context.fillRect(90, 110, 30, 80);
    context.fillRect(85, 130, 20, 60);

    // Europe (rough)
    context.fillRect(200, 60, 40, 30);

    // Africa (rough)
    context.fillRect(210, 90, 50, 100);
    context.fillRect(215, 100, 40, 80);

    // Asia (rough)
    context.fillRect(250, 50, 120, 70);
    context.fillRect(280, 80, 80, 40);

    // Australia (rough)
    context.fillRect(350, 140, 50, 25);

    // Add some random islands
    for (let i = 0; i < 20; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        const size = Math.random() * 8 + 2;
        context.fillRect(x, y, size, size);
    }

    const continentTexture = new THREE.CanvasTexture(canvas);
    const continentMaterial = new THREE.MeshPhongMaterial({
        map: continentTexture,
        transparent: true,
        opacity: 0.8,
    });

    const continents = new THREE.Mesh(continentGeometry, continentMaterial);

    // Group Earth and continents
    const earthGroup = new THREE.Group();
    earthGroup.add(earth);
    earthGroup.add(continents);

    return earthGroup;
}

export default function App(): JSX.Element {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null);
    const [showOrbits, setShowOrbits] = useState<boolean>(true);
    const [animationSpeed, setAnimationSpeed] = useState<number>(1);
    const [maxAsteroids, setMaxAsteroids] = useState<number>(ASTEROID_DATA.length);
    const asteroidMeshes = useRef<Record<string, AsteroidMesh>>({});

    const visibleAsteroids = useMemo(() => {
        return ASTEROID_DATA.slice(0, maxAsteroids);
    }, [maxAsteroids]);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            10000,
        );

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace,
        });
        renderer.setClearColor(0x000011); // Very dark blue instead of pure black
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);

        mountRef.current.appendChild(renderer.domElement);

        // ADD SPACE BACKGROUND WITH STARS
        const starField = createStarField();
        scene.add(starField);
        console.log('Space background with 15000 stars created'); // [web:264][web:265]

        // Enhanced lighting for space
        const ambientLight = new THREE.AmbientLight(0x404040, 0.4);
        scene.add(ambientLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(10, 0, 5);
        scene.add(sunLight);

        // ADD BIGGER EARTH WITH COUNTRIES
        const earthGroup = createEarthWithCountries();
        scene.add(earthGroup);
        console.log('Earth with countries created'); // [web:267][web:272]

        // Clear existing asteroids
        Object.values(asteroidMeshes.current).forEach((mesh) => {
            scene.remove(mesh);
            mesh.geometry.dispose();
            if (mesh.material instanceof THREE.Material) {
                mesh.material.dispose();
            }
        });
        asteroidMeshes.current = {};

        // Create BIGGER asteroids
        visibleAsteroids.forEach((asteroid, index) => {
            const distance = Math.max(asteroid.miss_distance_au * 6, 8); // Increased distance multiplier

            // MUCH bigger asteroid sizes
            let size;
            if (asteroid.estimated_diameter_km_max > 10) {
                size = Math.min(Math.log(asteroid.estimated_diameter_km_max) * 0.8, 5); // Increased size
            } else if (asteroid.estimated_diameter_km_max > 1) {
                size = Math.min(asteroid.estimated_diameter_km_max * 0.4, 3); // Increased size
            } else {
                size = Math.max(asteroid.estimated_diameter_km_max * 1.2, 0.3); // Increased size
            }

            // Position asteroids
            const angle = (index / visibleAsteroids.length) * Math.PI * 2;
            const x = Math.cos(angle) * distance;
            const z = Math.sin(angle) * distance;
            const y = (Math.random() - 0.5) * 2;

            // Enhanced materials with glow effects
            let color = 0xaaaaaa;
            let emissive = 0x000000;

            if (asteroid.is_sentry_object) {
                color = 0xff3333;
                emissive = 0x441111;
            } else if (asteroid.is_potentially_hazardous_asteroid) {
                color = 0xff8800;
                emissive = 0x221100;
            } else if (asteroid.estimated_diameter_km_max > 10) {
                color = 0xffdd00;
                emissive = 0x222200;
            } else if (asteroid.estimated_diameter_km_max > 1) {
                color = 0xcccccc;
            }

            const asteroidGeometry = new THREE.SphereGeometry(size, 24, 24); // Higher resolution
            const asteroidMaterial = new THREE.MeshPhongMaterial({
                color,
                emissive,
                shininess: 30,
            });

            const asteroidMesh = new THREE.Mesh(asteroidGeometry, asteroidMaterial) as AsteroidMesh;
            asteroidMesh.position.set(x, y, z);
            asteroidMesh.userData = asteroid;

            scene.add(asteroidMesh);
            asteroidMeshes.current[asteroid.id] = asteroidMesh;

            console.log(
                `Asteroid ${asteroid.name} - Size: ${size.toFixed(2)} at distance: ${distance}`,
            );

            // Create brighter orbit paths
            if (showOrbits) {
                const orbitGeometry = new THREE.RingGeometry(distance - 0.2, distance + 0.2, 64);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color,
                    transparent: true,
                    opacity: 0.4, // More visible orbits
                    side: THREE.DoubleSide,
                });
                const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbitRing.rotation.x = Math.PI / 2;
                scene.add(orbitRing);
            }
        });

        // Camera positioned further back for bigger scene
        const cameraDistance = 25; // Further back to see everything
        camera.position.set(cameraDistance, cameraDistance * 0.4, cameraDistance);
        camera.lookAt(0, 0, 0);

        console.log(`Camera positioned at distance: ${cameraDistance}`);

        // Mouse interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        const onMouseClick = (event: MouseEvent): void => {
            if (!mountRef.current) return;

            const rect = mountRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(Object.values(asteroidMeshes.current));

            if (intersects.length > 0) {
                const selectedMesh = intersects[0].object as AsteroidMesh;
                setSelectedAsteroid(selectedMesh.userData);
                console.log('Selected asteroid:', selectedMesh.userData.name);
            }
        };

        mountRef.current.addEventListener('click', onMouseClick);

        // Animation loop with twinkling stars
        let animationId: number;
        const animate = (): void => {
            animationId = requestAnimationFrame(animate);

            // Rotate Earth group
            earthGroup.rotation.y += 0.01 * animationSpeed;

            // Subtle star twinkling effect
            const starPositions = starField.geometry.attributes.position as THREE.BufferAttribute;
            const time = Date.now() * 0.001;
            starField.material.opacity = 0.8 + Math.sin(time * 0.5) * 0.2;

            // Animate asteroids
            Object.values(asteroidMeshes.current).forEach((mesh, index) => {
                const asteroid = mesh.userData;
                const speed = asteroid.relative_velocity_km_s * 0.0001 * animationSpeed;
                mesh.rotation.y += speed;

                // Orbital movement
                const radius = Math.sqrt(mesh.position.x ** 2 + mesh.position.z ** 2);
                const newAngle = Math.atan2(mesh.position.z, mesh.position.x) + speed;
                mesh.position.x = Math.cos(newAngle) * radius;
                mesh.position.z = Math.sin(newAngle) * radius;

                // Subtle glow animation for important asteroids
                if (asteroid.is_sentry_object || asteroid.is_potentially_hazardous_asteroid) {
                    const material = mesh.material as THREE.MeshPhongMaterial;
                    const glowIntensity = 0.5 + Math.sin(time * 2 + index) * 0.3;
                    material.emissiveIntensity = glowIntensity;
                }
            });

            renderer.render(scene, camera);
        };
        animate();

        // Cleanup
        return () => {
            if (animationId) {
                cancelAnimationFrame(animationId);
            }

            if (mountRef.current && renderer.domElement.parentNode) {
                mountRef.current.removeChild(renderer.domElement);
            }

            mountRef.current?.removeEventListener('click', onMouseClick);

            Object.values(asteroidMeshes.current).forEach((mesh) => {
                mesh.geometry.dispose();
                if (mesh.material instanceof THREE.Material) {
                    mesh.material.dispose();
                }
            });

            renderer.dispose();
        };
    }, [showOrbits, animationSpeed, visibleAsteroids]);

    const getRiskLevel = (asteroid: AsteroidData): string => {
        if (asteroid.is_sentry_object) return 'CRITICAL';
        if (asteroid.is_potentially_hazardous_asteroid) return 'HIGH';
        if (asteroid.importance_score > 6) return 'MODERATE';
        return 'LOW';
    };

    const getRiskColor = (level: string): string => {
        switch (level) {
            case 'CRITICAL':
                return 'text-red-500 bg-red-100';
            case 'HIGH':
                return 'text-orange-500 bg-orange-100';
            case 'MODERATE':
                return 'text-yellow-500 bg-yellow-100';
            default:
                return 'text-green-500 bg-green-100';
        }
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* 3D Visualization */}
            <div className="flex-1 relative">
                <div ref={mountRef} className="w-full h-full" />

                {/* Controls */}
                <div className="absolute top-4 left-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-4 space-y-4">
                    <h3 className="font-bold text-lg">🌍 Asteroid Tracking System</h3>

                    <div className="space-y-3">
                        <label className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                checked={showOrbits}
                                onChange={(e) => setShowOrbits(e.target.checked)}
                                className="form-checkbox rounded"
                            />
                            <span>Show Orbit Paths</span>
                        </label>

                        <div>
                            <label className="block text-sm mb-1">Animation Speed</label>
                            <input
                                type="range"
                                min="0.1"
                                max="3"
                                step="0.1"
                                value={animationSpeed}
                                onChange={(e) =>
                                    setAnimationSpeed(Number.parseFloat(e.target.value))
                                }
                                className="w-full"
                            />
                            <span className="text-xs text-gray-400">
                                {animationSpeed.toFixed(1)}x
                            </span>
                        </div>

                        <div>
                            <label className="block text-sm mb-1">
                                Asteroids Shown: {maxAsteroids} / {ASTEROID_DATA.length}
                                <span className="text-xs text-gray-400 block">
                                    Ranked by importance (Torino Scale)
                                </span>
                            </label>
                            <input
                                type="range"
                                min="1"
                                max={ASTEROID_DATA.length}
                                step="1"
                                value={maxAsteroids}
                                onChange={(e) => setMaxAsteroids(Number.parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-gray-400 mt-1">
                                <span>Most Critical</span>
                                <span>All Objects</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Enhanced Legend */}
                <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-bold mb-2">Legend</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Earth (with continents)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                            <span>Sentry Object (Critical)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Hazardous Asteroid</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Large Asteroid (&gt;10km)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                            <span>Regular Asteroid</span>
                        </div>
                        <div className="text-xs text-gray-400 mt-2 pt-2 border-t border-gray-600">
                            ✨ 15,000 procedural stars
                            <br />
                            🌍 Simplified continent outlines
                            <br />
                            📏 Scaled 3x larger for visibility
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-gray-300">Click on asteroids to view details</p>
                    <p className="text-xs text-gray-400">Space environment with procedural stars</p>
                </div>
            </div>

            {/* Sidebar remains the same but with backdrop blur for space theme */}
            <div className="w-96 bg-gray-800 bg-opacity-95 backdrop-blur-sm p-6 overflow-y-auto">
                <h2 className="text-2xl font-bold mb-4">🚀 Mission Control</h2>

                {selectedAsteroid ? (
                    <div className="space-y-4">
                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h3 className="font-bold text-lg mb-2">{selectedAsteroid.name}</h3>
                            <div className="flex items-center space-x-2 mb-2">
                                <div
                                    className={`inline-block px-2 py-1 rounded text-xs font-bold ${getRiskColor(getRiskLevel(selectedAsteroid))}`}
                                >
                                    {getRiskLevel(selectedAsteroid)} RISK
                                </div>
                                <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-800">
                                    Torino: {selectedAsteroid.torino_scale}
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-xs text-gray-400">Importance Score: </span>
                                <span className="font-mono text-yellow-400">
                                    {selectedAsteroid.importance_score}/10
                                </span>
                            </div>
                            <a
                                href={selectedAsteroid.nasa_jpl_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block mt-2 text-blue-400 hover:text-blue-300 text-xs underline"
                            >
                                View on NASA JPL →
                            </a>
                        </div>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 space-y-3">
                            <h4 className="font-bold">📊 Physical Properties</h4>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Diameter (km):</span>
                                    <p className="font-mono">
                                        {formatNumber(selectedAsteroid.estimated_diameter_km_max)}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Magnitude:</span>
                                    <p className="font-mono">
                                        {selectedAsteroid.absolute_magnitude_h}
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Velocity:</span>
                                    <p className="font-mono">
                                        {formatNumber(selectedAsteroid.relative_velocity_km_s)} km/s
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Distance (AU):</span>
                                    <p className="font-mono">
                                        {formatNumber(selectedAsteroid.miss_distance_au)}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4 space-y-3">
                            <h4 className="font-bold">💥 Impact Analysis</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Potential Energy:</span>
                                    <p className="font-mono text-red-400">
                                        {formatNumber(selectedAsteroid.impact.energy_megatons)}{' '}
                                        Megatons TNT
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Crater Size:</span>
                                    <p className="font-mono">
                                        {formatNumber(selectedAsteroid.impact.crater_km)} km
                                        diameter
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Risk Zones:</span>
                                    <div className="mt-1">
                                        {selectedAsteroid.impact.risk_zones.map((zone, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-red-900 bg-opacity-80 text-red-200 px-2 py-1 rounded text-xs mr-1 mb-1"
                                            >
                                                {zone}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h4 className="font-bold mb-2">🛡️ Mitigation Strategies</h4>
                            <div className="space-y-2">
                                <button
                                    onClick={() =>
                                        alert(
                                            `For ${selectedAsteroid.name}: Kinetic Impactor mission would redirect using spacecraft impact`,
                                        )
                                    }
                                    className="w-full bg-blue-600 bg-opacity-80 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Kinetic Impactor Mission
                                </button>
                                <button
                                    onClick={() =>
                                        alert(
                                            `For ${selectedAsteroid.name}: Gravity Tractor would use gravitational pull to slowly alter orbit`,
                                        )
                                    }
                                    className="w-full bg-purple-600 bg-opacity-80 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Gravity Tractor
                                </button>
                                <button
                                    onClick={() =>
                                        alert(
                                            `For ${selectedAsteroid.name}: Nuclear deflection would use controlled explosion to change trajectory`,
                                        )
                                    }
                                    className="w-full bg-green-600 bg-opacity-80 hover:bg-green-700 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Nuclear Deflection
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-gray-400">
                            Click on an asteroid in the visualization to view detailed analysis
                        </p>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h4 className="font-bold mb-2">📈 System Overview</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Currently Shown:</span>
                                    <span className="font-mono">{maxAsteroids}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Total Tracked:</span>
                                    <span className="font-mono">{ASTEROID_DATA.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sentry Objects:</span>
                                    <span className="font-mono text-red-400">
                                        {visibleAsteroids.filter((a) => a.is_sentry_object).length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Background Stars:</span>
                                    <span className="font-mono text-blue-400">15,000</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h4 className="font-bold mb-2">🌌 Space Environment</h4>
                            <div className="text-xs text-gray-400 space-y-1">
                                <p>• Procedural star field with realistic colors</p>
                                <p>• Earth scaled 3x with continent outlines</p>
                                <p>• Asteroids sized proportionally</p>
                                <p>• Dynamic glow effects for hazardous objects</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
