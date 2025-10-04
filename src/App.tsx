import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// TypeScript interfaces
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
    originalScale?: number;
    originalColor?: number;
    originalEmissive?: number;
    originalEmissiveIntensity?: number;
    orbitRing?: number;
    orbitRadius?: number;
    orbitSpeed?: number;
    orbitAngle?: number;
    orbitCenter?: THREE.Vector3;
}

// Asteroid data
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
    const starCount = 15000;

    const positions = new Float32Array(starCount * 3);
    const colors = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 4000;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 4000;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 4000;

        const starType = Math.random();
        if (starType < 0.7) {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 1;
        } else if (starType < 0.85) {
            colors[i * 3] = 0.7;
            colors[i * 3 + 1] = 0.8;
            colors[i * 3 + 2] = 1;
        } else if (starType < 0.95) {
            colors[i * 3] = 1;
            colors[i * 3 + 1] = 1;
            colors[i * 3 + 2] = 0.7;
        } else {
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

// Enhanced Earth creation with detailed textures
function createDetailedEarth() {
    const earthGeometry = new THREE.SphereGeometry(6, 128, 128);
    
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthContext = earthCanvas.getContext('2d')!;
    
    // Ocean base
    const oceanGradient = earthContext.createLinearGradient(0, 0, 0, 512);
    oceanGradient.addColorStop(0, '#1a5490');
    oceanGradient.addColorStop(0.5, '#2563eb');
    oceanGradient.addColorStop(1, '#1a5490');
    earthContext.fillStyle = oceanGradient;
    earthContext.fillRect(0, 0, 1024, 512);
    
    // Add depth variation
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const radius = Math.random() * 100 + 20;
        const opacity = Math.random() * 0.3;
        
        const gradient = earthContext.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(30, 100, 150, ${opacity})`);
        gradient.addColorStop(1, 'rgba(30, 100, 150, 0)');
        earthContext.fillStyle = gradient;
        earthContext.beginPath();
        earthContext.arc(x, y, radius, 0, Math.PI * 2);
        earthContext.fill();
    }
    
    // Detailed continent shapes
    const continentColors = ['#228b22', '#32cd32', '#90ee90', '#006400'];
    
    // North America
    earthContext.fillStyle = continentColors[0];
    earthContext.fillRect(80, 60, 120, 90);
    earthContext.fillRect(60, 80, 80, 70);
    earthContext.fillRect(100, 140, 60, 40);
    
    // South America  
    earthContext.fillStyle = continentColors[1];
    earthContext.fillRect(140, 180, 60, 120);
    earthContext.fillRect(120, 220, 40, 100);
    
    // Europe
    earthContext.fillStyle = continentColors[2];
    earthContext.fillRect(400, 80, 80, 60);
    earthContext.fillRect(420, 70, 60, 40);
    
    // Africa
    earthContext.fillStyle = continentColors[0];
    earthContext.fillRect(420, 140, 100, 160);
    earthContext.fillRect(440, 160, 80, 120);
    
    // Asia
    earthContext.fillStyle = continentColors[3];
    earthContext.fillRect(500, 80, 200, 120);
    earthContext.fillRect(520, 120, 160, 80);
    earthContext.fillRect(600, 60, 100, 60);
    
    // Australia
    earthContext.fillStyle = continentColors[1];
    earthContext.fillRect(700, 240, 80, 40);
    
    // Add mountain ranges
    earthContext.fillStyle = '#8b4513';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        earthContext.fillRect(x, y, Math.random() * 20 + 5, Math.random() * 10 + 2);
    }
    
    // Add islands
    earthContext.fillStyle = continentColors[2];
    for (let i = 0; i < 100; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        const size = Math.random() * 15 + 3;
        earthContext.beginPath();
        earthContext.arc(x, y, size, 0, Math.PI * 2);
        earthContext.fill();
    }

    const earthTexture = new THREE.CanvasTexture(earthCanvas);
    
    // Create bump map
    const bumpCanvas = document.createElement('canvas');
    bumpCanvas.width = 512;
    bumpCanvas.height = 256;
    const bumpContext = bumpCanvas.getContext('2d')!;
    
    for (let i = 0; i < 1000; i++) {
        const intensity = Math.random() * 255;
        bumpContext.fillStyle = `rgb(${intensity}, ${intensity}, ${intensity})`;
        const x = Math.random() * 512;
        const y = Math.random() * 256;
        bumpContext.fillRect(x, y, Math.random() * 5 + 1, Math.random() * 5 + 1);
    }
    
    const bumpTexture = new THREE.CanvasTexture(bumpCanvas);

    const earthMaterial = new THREE.MeshPhongMaterial({
        map: earthTexture,
        bumpMap: bumpTexture,
        bumpScale: 0.1,
        shininess: 100,
        transparent: false,
    });

    return new THREE.Mesh(earthGeometry, earthMaterial);
}

// Create detailed asteroid with procedural surface
function createDetailedAsteroid(size: number, color: number) {
    const geometry = new THREE.IcosahedronGeometry(size, 2);
    
    // Deform vertices for irregular shape
    const positionAttribute = geometry.getAttribute('position');
    const positions = positionAttribute.array as Float32Array;
    
    for (let i = 0; i < positions.length; i += 3) {
        const vertex = new THREE.Vector3(positions[i], positions[i + 1], positions[i + 2]);
        const noise = Math.random() * 0.3 + 0.8;
        vertex.multiplyScalar(noise);
        positions[i] = vertex.x;
        positions[i + 1] = vertex.y;
        positions[i + 2] = vertex.z;
    }
    
    positionAttribute.needsUpdate = true;
    geometry.computeVertexNormals();

    // Create detailed surface texture
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;
    
    const baseColor = new THREE.Color(color);
    context.fillStyle = `rgb(${Math.floor(baseColor.r * 255)}, ${Math.floor(baseColor.g * 255)}, ${Math.floor(baseColor.b * 255)})`;
    context.fillRect(0, 0, 256, 256);
    
    // Add craters
    for (let i = 0; i < 50; i++) {
        const x = Math.random() * 256;
        const y = Math.random() * 256;
        const radius = Math.random() * 20 + 5;
        const darkness = Math.random() * 0.5 + 0.3;
        
        const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
        gradient.addColorStop(0, `rgba(0, 0, 0, ${darkness})`);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
        context.fillStyle = gradient;
        context.beginPath();
        context.arc(x, y, radius, 0, Math.PI * 2);
        context.fill();
    }
    
    // Add surface roughness
    for (let i = 0; i < 200; i++) {
        const brightness = Math.random() * 100 - 50;
        context.fillStyle = `rgba(${brightness + 128}, ${brightness + 128}, ${brightness + 128}, 0.3)`;
        context.fillRect(Math.random() * 256, Math.random() * 256, Math.random() * 3 + 1, Math.random() * 3 + 1);
    }

    const texture = new THREE.CanvasTexture(canvas);

    const material = new THREE.MeshPhongMaterial({
        map: texture,
        color: color,
        shininess: 10,
        bumpMap: texture,
        bumpScale: 0.3,
    });

    return new THREE.Mesh(geometry, material);
}

// Create impact trajectory line from asteroid to impact zone
function createImpactTrajectory(asteroidPosition: THREE.Vector3, riskZones: string[]): THREE.Group {
    const trajectoryGroup = new THREE.Group();
    
    // Zone coordinates
    const zoneCoordinates: { [key: string]: { lat: number; lng: number } } = {
        'Pacific Ocean': { lat: 0, lng: -150 },
        'Coastal Japan': { lat: 36, lng: 138 },
        'Atlantic Ocean': { lat: 30, lng: -30 },
        'European Coast': { lat: 50, lng: 10 },
        'African Coast': { lat: 0, lng: 15 },
        'Indian Ocean': { lat: -20, lng: 80 },
        'Southeast Asia': { lat: 10, lng: 110 },
        'Global Impact': { lat: 0, lng: 0 },
        'Mass Extinction Event': { lat: 0, lng: 0 },
        'Continental Devastation': { lat: 40, lng: -100 },
        'Regional Damage': { lat: 35, lng: 25 }
    };

    riskZones.forEach(zone => {
        const coords = zoneCoordinates[zone];
        if (coords) {
            // Convert lat/lng to 3D coordinates on Earth surface
            const phi = (90 - coords.lat) * (Math.PI / 180);
            const theta = (coords.lng + 180) * (Math.PI / 180);
            
            const radius = 6.1;
            const impactX = -(radius * Math.sin(phi) * Math.cos(theta));
            const impactZ = (radius * Math.sin(phi) * Math.sin(theta));
            const impactY = (radius * Math.cos(phi));
            
            const impactPoint = new THREE.Vector3(impactX, impactY, impactZ);
            
            // Create trajectory line from asteroid to impact point
            const trajectoryPoints = [];
            trajectoryPoints.push(asteroidPosition.clone());
            
            // Add intermediate points for curved trajectory
            const midPoint = new THREE.Vector3().lerpVectors(asteroidPosition, impactPoint, 0.5);
            midPoint.y += 3;
            trajectoryPoints.push(midPoint);
            trajectoryPoints.push(impactPoint);
            
            const trajectoryGeometry = new THREE.CatmullRomCurve3(trajectoryPoints);
            const points = trajectoryGeometry.getPoints(50);
            const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
            
            const lineMaterial = new THREE.LineBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.7,
                linewidth: 3
            });
            
            const trajectoryLine = new THREE.Line(lineGeometry, lineMaterial);
            trajectoryGroup.add(trajectoryLine);
            
            // Add impact marker
            const impactGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const impactMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.9,
                emissive: 0x440000
            });
            
            const impactMarker = new THREE.Mesh(impactGeometry, impactMaterial);
            impactMarker.position.copy(impactPoint);
            trajectoryGroup.add(impactMarker);
            
            // Add pulsing ring
            const pulseGeometry = new THREE.RingGeometry(1.2, 2.0, 32);
            const pulseMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide
            });
            
            const pulseRing = new THREE.Mesh(pulseGeometry, pulseMaterial);
            pulseRing.position.copy(impactPoint);
            pulseRing.lookAt(new THREE.Vector3(0, 0, 0));
            trajectoryGroup.add(pulseRing);
        }
    });
    
    return trajectoryGroup;
}

export default function App(): JSX.Element {
    const mountRef = useRef<HTMLDivElement | null>(null);
    const [selectedAsteroid, setSelectedAsteroid] = useState<AsteroidData | null>(null);
    const [hoveredAsteroid, setHoveredAsteroid] = useState<AsteroidData | null>(null);
    const [showOrbits, setShowOrbits] = useState<boolean>(true);
    const [maxAsteroids, setMaxAsteroids] = useState<number>(ASTEROID_DATA.length);
    const [cameraDistance, setCameraDistance] = useState<number>(35);
    
    // Refs to persist through re-renders without causing zoom issues - ZOOM WORKING PERFECTLY
    const asteroidMeshes = useRef<Record<string, AsteroidMesh>>({});
    const currentImpactTrajectory = useRef<THREE.Group | null>(null);
    const sceneRef = useRef<THREE.Scene | null>(null);
    const earthRef = useRef<THREE.Mesh | null>(null);
    const controlsRef = useRef<OrbitControls | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const animationIdRef = useRef<number | null>(null);
    const isInitialized = useRef<boolean>(false);
    const selectedAsteroidRef = useRef<AsteroidData | null>(null);
    

    useEffect(() => {
    selectedAsteroidRef.current = selectedAsteroid;
}, [selectedAsteroid]);
    // Fixed animation speed - no slider needed since we have pause/resume
    const animationSpeed = 1.0;

    const visibleAsteroids = useMemo(() => {
        return ASTEROID_DATA.slice(0, maxAsteroids);
    }, [maxAsteroids]);

    // Function to recreate asteroids when maxAsteroids changes
    const recreateAsteroids = () => {
        if (!sceneRef.current) return;

        const scene = sceneRef.current;

        // Clear existing asteroids
        Object.values(asteroidMeshes.current).forEach((mesh) => {
            scene.remove(mesh);
            mesh.geometry.dispose();
            if (mesh.material instanceof THREE.Material) {
                mesh.material.dispose();
            }
        });
        asteroidMeshes.current = {};

        // Create orbital ring distances
        const orbitDistances = [15, 25, 40];

        // Create asteroids with proper orbital motion
        visibleAsteroids.forEach((asteroid, index) => {
            // Assign to orbital rings
            let orbitRing: number;
            let distance: number;
            
            if (asteroid.is_sentry_object || asteroid.torino_scale >= 3) {
                orbitRing = 0;
                distance = orbitDistances[0];
            } else if (asteroid.is_potentially_hazardous_asteroid || asteroid.torino_scale >= 1) {
                orbitRing = 1;
                distance = orbitDistances[1];
            } else {
                orbitRing = 2;
                distance = orbitDistances[2];
            }
            
            distance += (Math.random() - 0.5) * 4;

            // MUCH BIGGER ASTEROIDS - All clearly visible
            let size;
            const diameterKm = asteroid.estimated_diameter_km_max;

            if (diameterKm > 20) {
                size = Math.min(diameterKm * 0.08, 5);
            } else if (diameterKm > 5) {
                size = Math.max(diameterKm * 0.15, 1.0);
            } else if (diameterKm > 1) {
                size = Math.max(diameterKm * 0.3, 0.8);
            } else {
                size = Math.max(diameterKm * 1.0, 0.8);
            }
            
            // Initial position for orbital motion
            const asteroidsInRing = visibleAsteroids.filter((_, i) => {
                const tempRing = ASTEROID_DATA[i]?.is_sentry_object || ASTEROID_DATA[i]?.torino_scale >= 3 ? 0 :
                                ASTEROID_DATA[i]?.is_potentially_hazardous_asteroid || ASTEROID_DATA[i]?.torino_scale >= 1 ? 1 : 2;
                return tempRing === orbitRing;
            });
            const ringIndex = asteroidsInRing.findIndex(a => a.id === asteroid.id);
            const initialAngle = (ringIndex / asteroidsInRing.length) * Math.PI * 2;
            
            const x = Math.cos(initialAngle) * distance;
            const z = Math.sin(initialAngle) * distance;
            const y = (Math.random() - 0.5) * 1;

            // ENHANCED COLOR - brighter
            let color = 0xdddddd;
            let emissive = 0x111111;

            if (asteroid.is_sentry_object) {
                color = 0xff3333;
                emissive = 0x441111;
            } else if (asteroid.is_potentially_hazardous_asteroid) {
                color = 0xff8800;
                emissive = 0x221100;
            } else if (diameterKm > 10) {
                color = 0xffdd00;
                emissive = 0x222200;
            } else if (diameterKm > 1) {
                color = 0xeeeeee;
                emissive = 0x111111;
            }

            // Create asteroid mesh
            const asteroidMesh = createDetailedAsteroid(size, color) as AsteroidMesh;
            asteroidMesh.position.set(x, y, z);
            asteroidMesh.userData = asteroid;
            asteroidMesh.orbitRing = orbitRing;
            asteroidMesh.orbitRadius = distance;
            asteroidMesh.orbitSpeed = asteroid.relative_velocity_km_s * 0.0001;
            asteroidMesh.orbitAngle = initialAngle;
            asteroidMesh.orbitCenter = new THREE.Vector3(0, y, 0);
            
            // Store original properties
            asteroidMesh.originalScale = size;
            asteroidMesh.originalColor = color;
            asteroidMesh.originalEmissive = emissive;
            asteroidMesh.originalEmissiveIntensity = 0.5;

            // Apply emissive to material
            const material = asteroidMesh.material as THREE.MeshPhongMaterial;
            material.emissive = new THREE.Color(emissive);
            material.emissiveIntensity = 0.5;

            scene.add(asteroidMesh);
            asteroidMeshes.current[asteroid.id] = asteroidMesh;
        });
    };

    // Effect to recreate asteroids when maxAsteroids changes
    useEffect(() => {
        if (isInitialized.current) {
            recreateAsteroids();
        }
    }, [maxAsteroids, visibleAsteroids]);

    useEffect(() => {
        if (!mountRef.current || isInitialized.current) return;
        isInitialized.current = true;

        const scene = new THREE.Scene();
        sceneRef.current = scene;

        const camera = new THREE.PerspectiveCamera(
            75,
            mountRef.current.clientWidth / mountRef.current.clientHeight,
            0.1,
            10000,
        );
        cameraRef.current = camera;

        const renderer = new THREE.WebGLRenderer({
            antialias: true,
            outputColorSpace: THREE.SRGBColorSpace,
        });
        rendererRef.current = renderer;
        renderer.setClearColor(0x000011);
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        // Add star field
        const starField = createStarField();
        scene.add(starField);

        // Enhanced lighting for Earth visibility
        const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
        scene.add(ambientLight);

        // Add hemisphere light for more natural lighting
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x362d1e, 0.6);
        scene.add(hemisphereLight);

        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(15, 0, 10);
        scene.add(sunLight);

        // Add Earth
        const earth = createDetailedEarth();
        scene.add(earth);
        earthRef.current = earth;

        // Set initial camera position ONCE - ZOOM WORKING PERFECTLY, DON'T TOUCH
        camera.position.set(35, 35 * 0.4, 35);
        camera.lookAt(0, 0, 0);

        // ORBIT CONTROLS - ZOOM WORKING PERFECTLY, DON'T TOUCH
        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = false;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.minDistance = 8;
        controls.maxDistance = 150;
        controls.maxPolarAngle = Math.PI;
        controls.autoRotate = false;
        controlsRef.current = controls;

        // Create 3 orbital rings
        const orbitDistances = [15, 25, 40];
        const orbitColors = [0x888888, 0x666666, 0x444444];
        
        if (showOrbits) {
            orbitDistances.forEach((distance, ringIndex) => {
                const orbitGeometry = new THREE.RingGeometry(distance - 0.5, distance + 0.5, 64);
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: orbitColors[ringIndex],
                    transparent: true,
                    opacity: 0.15,
                    side: THREE.DoubleSide,
                });
                const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbitRing.rotation.x = Math.PI / 2;
                scene.add(orbitRing);
            });
        }

        // Create initial asteroids
        recreateAsteroids();

        // Mouse interaction - FIXED drag vs click detection
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let previousHovered: AsteroidMesh | null = null;
        let mouseDownTime = 0;
        let mouseDownPosition = { x: 0, y: 0 };
        let isDragging = false;

        const onMouseDown = (event: MouseEvent): void => {
            mouseDownTime = Date.now();
            mouseDownPosition = { x: event.clientX, y: event.clientY };
            isDragging = false;
        };

        const onMouseMove = (event: MouseEvent): void => {
            if (!mountRef.current) return;

            // Check if we're dragging (mouse moved significantly since mousedown)
            if (mouseDownTime > 0) {
                const dragDistance = Math.sqrt(
                    Math.pow(event.clientX - mouseDownPosition.x, 2) + 
                    Math.pow(event.clientY - mouseDownPosition.y, 2)
                );
                if (dragDistance > 5) { // 5px threshold
                    isDragging = true;
                }
            }

            const rect = mountRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(Object.values(asteroidMeshes.current));

            // Reset previous hover
            if (previousHovered) {
                const material = previousHovered.material as THREE.MeshPhongMaterial;
                material.emissive.setHex(previousHovered.originalEmissive!);
                material.emissiveIntensity = previousHovered.originalEmissiveIntensity!;
                previousHovered.scale.setScalar(1);
                document.body.style.cursor = 'default';
                previousHovered = null;
                setHoveredAsteroid(null);
            }

            // Apply hover effect
            if (intersects.length > 0) {
                const hoveredMesh = intersects[0].object as AsteroidMesh;
                const material = hoveredMesh.material as THREE.MeshPhongMaterial;
                
                material.emissiveIntensity = 2.0;
                hoveredMesh.scale.setScalar(1.3);
                
                document.body.style.cursor = 'pointer';
                previousHovered = hoveredMesh;
                setHoveredAsteroid(hoveredMesh.userData);
            }
        };

        const onMouseUp = (event: MouseEvent): void => {
            if (!mountRef.current) return;

            const clickDuration = Date.now() - mouseDownTime;
            
            // Only process clicks (not drags)
            if (!isDragging && clickDuration < 300) { // Quick click, not drag
                const rect = mountRef.current.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(Object.values(asteroidMeshes.current));

                if (intersects.length > 0) {
                    // ASTEROID CLICKED - SELECT AND PAUSE ANIMATIONS
                    const clickedMesh = intersects[0].object as AsteroidMesh;
                    setSelectedAsteroid(clickedMesh.userData);
                    
                    // Remove previous trajectory
                    if (currentImpactTrajectory.current) {
                        scene.remove(currentImpactTrajectory.current);
                        currentImpactTrajectory.current = null;
                    }
                    
                    // Add impact trajectory from asteroid current position to impact zones
                    const trajectory = createImpactTrajectory(clickedMesh.position, clickedMesh.userData.impact.risk_zones);
                    scene.add(trajectory);
                    currentImpactTrajectory.current = trajectory;
                    
                    // Click feedback
                    const originalScale = clickedMesh.scale.x;
                    clickedMesh.scale.setScalar(originalScale * 0.9);
                    setTimeout(() => {
                        if (clickedMesh.scale) {
                            clickedMesh.scale.setScalar(originalScale);
                        }
                    }, 100);
                    
                    console.log('🎯 Asteroid selected - animations paused:', clickedMesh.userData.name);
                } else {
                    // CLICKED EMPTY SPACE - DESELECT ASTEROID AND RETURN TO MAIN MENU
                    setSelectedAsteroid(null);
                    
                    // Remove trajectory
                    if (currentImpactTrajectory.current) {
                        scene.remove(currentImpactTrajectory.current);
                        currentImpactTrajectory.current = null;
                    }
                    
                    console.log('🔄 Asteroid deselected - back to main menu, animations resumed');
                }
            }

            // Reset tracking variables
            mouseDownTime = 0;
            isDragging = false;
        };

        // Event listeners - UPDATED for drag detection
        mountRef.current.addEventListener('mousedown', onMouseDown);
        mountRef.current.addEventListener('mousemove', onMouseMove);
        mountRef.current.addEventListener('mouseup', onMouseUp);

        // Animation loop - FIXED with proper ref sync via useEffect
let frameCount = 0;
const animate = (): void => {
    if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
    }
    animationIdRef.current = requestAnimationFrame(animate);
    frameCount++;

    // Update OrbitControls
    controls.update();

    // Update distance display very occasionally - ZOOM WORKING PERFECTLY
    if (frameCount % 300 === 0) {
        const currentDistance = camera.position.distanceTo(controls.target);
        const roundedDistance = Math.round(currentDistance * 10) / 10;
        if (Math.abs(roundedDistance - cameraDistance) > 1) {
            setCameraDistance(roundedDistance);
        }
    }

    // PAUSE ANIMATIONS WHEN ASTEROID IS SELECTED - FIXED with ref synced by useEffect
    const isAnimationsPaused = selectedAsteroidRef.current !== null;

    // Earth rotation - paused when asteroid selected
    if (!isAnimationsPaused && earthRef.current) {
        earthRef.current.rotation.y += 0.008 * animationSpeed;
    }

    // Star twinkling (always active)
    const time = Date.now() * 0.001;

    // Asteroid orbital motion and rotation - paused when asteroid selected
    if (!isAnimationsPaused) {
        Object.values(asteroidMeshes.current).forEach((mesh, index) => {
            const asteroid = mesh.userData;
            
            // Asteroid rotation
            const rotSpeed = asteroid.relative_velocity_km_s * 0.0001 * animationSpeed;
            mesh.rotation.x += rotSpeed * 0.5;
            mesh.rotation.y += rotSpeed;

            // Orbital motion around Earth
            if (mesh.orbitRadius && mesh.orbitSpeed !== undefined && mesh.orbitAngle !== undefined && mesh.orbitCenter) {
                mesh.orbitAngle += mesh.orbitSpeed * animationSpeed;
                
                // Update position based on orbital motion
                mesh.position.x = Math.cos(mesh.orbitAngle) * mesh.orbitRadius;
                mesh.position.z = Math.sin(mesh.orbitAngle) * mesh.orbitRadius;
                mesh.position.y = mesh.orbitCenter.y;
            }
        });
    }

    // ALWAYS UPDATE GLOW EFFECTS and handle SELECTED ASTEROID PULSE
    Object.values(asteroidMeshes.current).forEach((mesh, index) => {
        const asteroid = mesh.userData;
        const material = mesh.material as THREE.MeshPhongMaterial;

        // Check if this is the selected asteroid
        const isSelected = selectedAsteroidRef.current && asteroid.id === selectedAsteroidRef.current.id;

        if (isSelected) {
            // VERY SLIGHT pulse for selected asteroid
            const pulseIntensity = 1.0 + Math.sin(time * 3) * 0.05; // Very subtle 5% scale variation
            mesh.scale.setScalar(pulseIntensity);
            
            // Brighter emissive for selected
            material.emissiveIntensity = 1.5 + Math.sin(time * 2) * 0.3;
        } else if ((asteroid.is_sentry_object || asteroid.is_potentially_hazardous_asteroid) && mesh !== previousHovered) {
            // Natural glow for hazardous asteroids (not selected)
            const glowIntensity = 0.5 + Math.sin(time * 1.5 + index) * 0.3;
            material.emissiveIntensity = glowIntensity;
            
            // Reset scale for non-selected asteroids
            if (mesh.scale.x !== 1) {
                mesh.scale.setScalar(1);
            }
        } else {
            // Reset scale and emissive for regular asteroids
            if (mesh.scale.x !== 1) {
                mesh.scale.setScalar(1);
            }
            if (material.emissiveIntensity !== mesh.originalEmissiveIntensity) {
                material.emissiveIntensity = mesh.originalEmissiveIntensity!;
            }
        }
    });

    // Rest of animation code stays the same...
    renderer.render(scene, camera);
};

        animate();

        // Cleanup - UPDATED for all mouse events
        return () => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }

            controls.dispose();

            if (mountRef.current && renderer.domElement.parentNode) {
                mountRef.current.removeChild(renderer.domElement);
            }

            mountRef.current?.removeEventListener('mousedown', onMouseDown);
            mountRef.current?.removeEventListener('mousemove', onMouseMove);
            mountRef.current?.removeEventListener('mouseup', onMouseUp);

            if (currentImpactTrajectory.current) {
                scene.remove(currentImpactTrajectory.current);
            }

            Object.values(asteroidMeshes.current).forEach((mesh) => {
                mesh.geometry.dispose();
                if (mesh.material instanceof THREE.Material) {
                    mesh.material.dispose();
                }
            });

            renderer.dispose();
            isInitialized.current = false;
        };
    }, []); // EMPTY DEPENDENCY ARRAY - ZOOM WORKING PERFECTLY

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
                            <span>Show Orbit Paths (3 rings)</span>
                        </label>

                        <div>
                            <label className="block text-sm mb-1">
                                Asteroids Shown: {maxAsteroids} / {ASTEROID_DATA.length}
                                <span className="text-xs text-gray-400 block">
                                    Slide to control how many asteroids are displayed
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
                                <span>1 Most Critical</span>
                                <span>All {ASTEROID_DATA.length} Objects</span>
                            </div>
                        </div>

                        <div className="text-xs text-gray-400 pt-2 border-t border-gray-600">
                            📏 Distance: {cameraDistance.toFixed(1)} units<br/>
                            🖱️ Left drag: Rotate • Right drag: Pan<br/>
                            🎮 Mouse wheel: Zoom (8-150 units)<br/>
                            {selectedAsteroid ? '⏸️ ANIMATIONS PAUSED' : '▶️ Animations active'}
                        </div>
                    </div>
                </div>

                {/* Enhanced Legend */}
                <div className="absolute top-4 right-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-4">
                    <h4 className="font-bold mb-2">Legend</h4>
                    <div className="space-y-1 text-sm">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                            <span>Earth (drag to orbit around)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-500 rounded-full shadow-lg"></div>
                            <span>Sentry Object (Inner ring)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                            <span>Hazardous (Middle ring)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                            <span>Large Asteroid (&gt;10km)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                            <span>Regular (Outer ring)</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse"></div>
                            <span>Impact Trajectory & Zones</span>
                        </div>
                        
                        {hoveredAsteroid && (
                            <div className="mt-2 pt-2 border-t border-gray-600">
                                <div className="text-xs font-bold text-yellow-400">
                                    HOVERING: {hoveredAsteroid.name}
                                </div>
                                <div className="text-xs text-gray-300">
                                    Ring: {asteroidMeshes.current[hoveredAsteroid.id]?.orbitRing! + 1}/3
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Instructions */}
                <div className="absolute bottom-4 left-4 bg-gray-800 bg-opacity-90 backdrop-blur-sm rounded-lg p-3">
                    <p className="text-sm text-gray-300">🖱️ Click (not drag) asteroids to analyze • Click empty space to return to main menu</p>
                    <p className="text-xs text-gray-400">⚡ Dragging won't deselect • Hover for glow • Selection pauses all motion & adds pulse</p>
                </div>
            </div>

            {/* Enhanced Sidebar */}
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
                                <div className="inline-block px-2 py-1 rounded text-xs font-bold bg-purple-100 text-purple-800">
                                    Ring: {asteroidMeshes.current[selectedAsteroid.id]?.orbitRing! + 1}/3
                                </div>
                            </div>
                            <div className="mb-2">
                                <span className="text-xs text-red-400">⏸️ ANIMATIONS PAUSED - Click empty space to return to main menu</span>
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
                                    <span className="text-gray-400">Scene Size:</span>
                                    <p className="font-mono text-green-400">
                                        0.8+ units
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
                            <h4 className="font-bold">🎯 Impact Trajectory & Analysis</h4>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <span className="text-gray-400">Animation State:</span>
                                    <p className="font-mono text-red-400">
                                        PAUSED - Earth & asteroids frozen for analysis
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Selected Asteroid:</span>
                                    <p className="font-mono text-yellow-400">
                                        Subtle pulse + brighter glow
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Potential Energy:</span>
                                    <p className="font-mono text-red-400">
                                        {formatNumber(selectedAsteroid.impact.energy_megatons)} Megatons TNT
                                    </p>
                                </div>
                                <div>
                                    <span className="text-gray-400">Impact Zones (red markers):</span>
                                    <div className="mt-1">
                                        {selectedAsteroid.impact.risk_zones.map((zone, index) => (
                                            <span
                                                key={index}
                                                className="inline-block bg-red-900 bg-opacity-80 text-red-200 px-2 py-1 rounded text-xs mr-1 mb-1"
                                            >
                                                🎯 {zone}
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
                                            `For ${selectedAsteroid.name}: Kinetic Impactor mission would redirect using spacecraft impact`
                                        )
                                    }
                                    className="w-full bg-blue-600 bg-opacity-80 hover:bg-blue-700 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Kinetic Impactor Mission
                                </button>
                                <button
                                    onClick={() =>
                                        alert(
                                            `For ${selectedAsteroid.name}: Gravity Tractor would use gravitational pull to slowly alter orbit`
                                        )
                                    }
                                    className="w-full bg-purple-600 bg-opacity-80 hover:bg-purple-700 px-4 py-2 rounded text-sm transition-colors"
                                >
                                    Gravity Tractor
                                </button>
                                <button
                                    onClick={() =>
                                        alert(
                                            `For ${selectedAsteroid.name}: Nuclear deflection would use controlled explosion to change trajectory`
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
                    // MAIN MENU - This is what shows when no asteroid is selected
                    <div className="space-y-4">
                        <p className="text-gray-400">
                            🖱️ Drag to look around • Click asteroids to analyze • Use slider above to control how many asteroids are shown
                        </p>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h4 className="font-bold mb-2">🎮 Controls</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Select Asteroid:</span>
                                    <span className="font-mono text-green-400">Click (not drag)</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Return to Menu:</span>
                                    <span className="font-mono text-blue-400">Click Empty Space</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Pause Animations:</span>
                                    <span className="font-mono text-red-400">Auto on Select</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Selected Visual:</span>
                                    <span className="font-mono text-yellow-400">Subtle Pulse</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h4 className="font-bold mb-2">📊 Current Status</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Asteroids Displayed:</span>
                                    <span className="font-mono text-green-400">{maxAsteroids} / {ASTEROID_DATA.length}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Animations:</span>
                                    <span className="font-mono text-green-400">▶️ ACTIVE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Earth Rotation:</span>
                                    <span className="font-mono text-green-400">▶️ ACTIVE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Asteroid Orbits:</span>
                                    <span className="font-mono text-green-400">▶️ ACTIVE</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Camera Zoom:</span>
                                    <span className="font-mono text-green-400">✅ STABLE</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-700 bg-opacity-80 rounded-lg p-4">
                            <h4 className="font-bold mb-2">🛸 Orbital Ring System</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span>Ring 1 (Inner):</span>
                                    <span className="font-mono text-red-400">Critical/Sentry</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ring 2 (Middle):</span>
                                    <span className="font-mono text-orange-400">Hazardous</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Ring 3 (Outer):</span>
                                    <span className="font-mono text-gray-400">Regular</span>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
