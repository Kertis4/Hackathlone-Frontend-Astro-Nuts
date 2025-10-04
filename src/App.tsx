import { useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

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
    // NEW 25 ASTEROIDS FOR SCALING DEMONSTRATION
    {
        id: '2101955',
        name: '101955 Bennu',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2101955',
        absolute_magnitude_h: 20.9,
        estimated_diameter_km_min: 0.49,
        estimated_diameter_km_max: 0.56,
        estimated_diameter_m_min: 490,
        estimated_diameter_m_max: 560,
        estimated_diameter_mi_min: 0.304,
        estimated_diameter_mi_max: 0.348,
        estimated_diameter_ft_min: 1608,
        estimated_diameter_ft_max: 1837,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: true,
        close_approach_date: '2135-09-25',
        close_approach_date_full: '2135-Sep-25 16:24',
        epoch_date_close_approach: 5234567890000,
        relative_velocity_km_s: 11.2,
        relative_velocity_km_h: 40320,
        relative_velocity_mph: 25055.4,
        miss_distance_au: 0.0031,
        miss_distance_lunar: 1.21,
        miss_distance_km: 463000,
        miss_distance_mi: 287658,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 1200,
            crater_km: 15,
            risk_zones: ['North America', 'Canada'],
        },
        torino_scale: 4,
        importance_score: 9,
    },
    {
        id: '2004015',
        name: '4015 Wilson-Harrington',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2004015',
        absolute_magnitude_h: 16.1,
        estimated_diameter_km_min: 2.8,
        estimated_diameter_km_max: 3.2,
        estimated_diameter_m_min: 2800,
        estimated_diameter_m_max: 3200,
        estimated_diameter_mi_min: 1.74,
        estimated_diameter_mi_max: 1.99,
        estimated_diameter_ft_min: 9186,
        estimated_diameter_ft_max: 10499,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2027-11-14',
        close_approach_date_full: '2027-Nov-14 08:15',
        epoch_date_close_approach: 1826123700000,
        relative_velocity_km_s: 15.8,
        relative_velocity_km_h: 56880,
        relative_velocity_mph: 35340.6,
        miss_distance_au: 0.045,
        miss_distance_lunar: 17.5,
        miss_distance_km: 6735000,
        miss_distance_mi: 4184775,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 2500,
            crater_km: 20,
            risk_zones: ['Mediterranean Sea', 'Southern Europe'],
        },
        torino_scale: 1,
        importance_score: 6,
    },
    {
        id: '2162173',
        name: '162173 Ryugu',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2162173',
        absolute_magnitude_h: 19.2,
        estimated_diameter_km_min: 0.87,
        estimated_diameter_km_max: 1.02,
        estimated_diameter_m_min: 870,
        estimated_diameter_m_max: 1020,
        estimated_diameter_mi_min: 0.541,
        estimated_diameter_mi_max: 0.634,
        estimated_diameter_ft_min: 2854,
        estimated_diameter_ft_max: 3346,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2026-12-05',
        close_approach_date_full: '2026-Dec-05 11:42',
        epoch_date_close_approach: 1796678520000,
        relative_velocity_km_s: 13.4,
        relative_velocity_km_h: 48240,
        relative_velocity_mph: 29968.4,
        miss_distance_au: 0.038,
        miss_distance_lunar: 14.8,
        miss_distance_km: 5684000,
        miss_distance_mi: 3531996,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 1800,
            crater_km: 18,
            risk_zones: ['South China Sea', 'Philippines'],
        },
        torino_scale: 1,
        importance_score: 6,
    },
    {
        id: '2001620',
        name: '1620 Geographos',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001620',
        absolute_magnitude_h: 15.6,
        estimated_diameter_km_min: 4.8,
        estimated_diameter_km_max: 5.1,
        estimated_diameter_m_min: 4800,
        estimated_diameter_m_max: 5100,
        estimated_diameter_mi_min: 2.98,
        estimated_diameter_mi_max: 3.17,
        estimated_diameter_ft_min: 15748,
        estimated_diameter_ft_max: 16732,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2030-08-23',
        close_approach_date_full: '2030-Aug-23 14:35',
        epoch_date_close_approach: 1914159300000,
        relative_velocity_km_s: 20.1,
        relative_velocity_km_h: 72360,
        relative_velocity_mph: 44958.1,
        miss_distance_au: 0.052,
        miss_distance_lunar: 20.2,
        miss_distance_km: 7784000,
        miss_distance_mi: 4836016,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 8500,
            crater_km: 35,
            risk_zones: ['Arabian Sea', 'Western India'],
        },
        torino_scale: 0,
        importance_score: 5,
    },
    {
        id: '2002063',
        name: '2063 Bacchus',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2002063',
        absolute_magnitude_h: 19.1,
        estimated_diameter_km_min: 1.1,
        estimated_diameter_km_max: 1.3,
        estimated_diameter_m_min: 1100,
        estimated_diameter_m_max: 1300,
        estimated_diameter_mi_min: 0.68,
        estimated_diameter_mi_max: 0.81,
        estimated_diameter_ft_min: 3609,
        estimated_diameter_ft_max: 4265,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2032-04-17',
        close_approach_date_full: '2032-Apr-17 09:22',
        epoch_date_close_approach: 1965567720000,
        relative_velocity_km_s: 16.7,
        relative_velocity_km_h: 60120,
        relative_velocity_mph: 37344.7,
        miss_distance_au: 0.089,
        miss_distance_lunar: 34.6,
        miss_distance_km: 13317000,
        miss_distance_mi: 8273561,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 950,
            crater_km: 12,
            risk_zones: ['Bay of Bengal'],
        },
        torino_scale: 0,
        importance_score: 3,
    },
    {
        id: '2001566',
        name: '1566 Icarus',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001566',
        absolute_magnitude_h: 16.9,
        estimated_diameter_km_min: 1.4,
        estimated_diameter_km_max: 1.4,
        estimated_diameter_m_min: 1400,
        estimated_diameter_m_max: 1400,
        estimated_diameter_mi_min: 0.87,
        estimated_diameter_mi_max: 0.87,
        estimated_diameter_ft_min: 4593,
        estimated_diameter_ft_max: 4593,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2029-06-16',
        close_approach_date_full: '2029-Jun-16 03:18',
        epoch_date_close_approach: 1876716980000,
        relative_velocity_km_s: 31.2,
        relative_velocity_km_h: 112320,
        relative_velocity_mph: 69784.4,
        miss_distance_au: 0.042,
        miss_distance_lunar: 16.3,
        miss_distance_km: 6286000,
        miss_distance_mi: 3905906,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 420,
            crater_km: 8,
            risk_zones: ['Caribbean Sea'],
        },
        torino_scale: 0,
        importance_score: 2,
    },
    {
        id: '2025143',
        name: '25143 Itokawa',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2025143',
        absolute_magnitude_h: 19.2,
        estimated_diameter_km_min: 0.33,
        estimated_diameter_km_max: 0.33,
        estimated_diameter_m_min: 330,
        estimated_diameter_m_max: 330,
        estimated_diameter_mi_min: 0.205,
        estimated_diameter_mi_max: 0.205,
        estimated_diameter_ft_min: 1083,
        estimated_diameter_ft_max: 1083,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2028-02-11',
        close_approach_date_full: '2028-Feb-11 19:45',
        epoch_date_close_approach: 1833836700000,
        relative_velocity_km_s: 12.8,
        relative_velocity_km_h: 46080,
        relative_velocity_mph: 28627.2,
        miss_distance_au: 0.067,
        miss_distance_lunar: 26.1,
        miss_distance_km: 10024000,
        miss_distance_mi: 6227904,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 65,
            crater_km: 2.8,
            risk_zones: ['North Atlantic'],
        },
        torino_scale: 0,
        importance_score: 1,
    },
    {
        id: '2003122',
        name: '3122 Florence',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2003122',
        absolute_magnitude_h: 14.1,
        estimated_diameter_km_min: 4.35,
        estimated_diameter_km_max: 4.35,
        estimated_diameter_m_min: 4350,
        estimated_diameter_m_max: 4350,
        estimated_diameter_mi_min: 2.7,
        estimated_diameter_mi_max: 2.7,
        estimated_diameter_ft_min: 14272,
        estimated_diameter_ft_max: 14272,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2057-09-02',
        close_approach_date_full: '2057-Sep-02 05:06',
        epoch_date_close_approach: 2765478360000,
        relative_velocity_km_s: 14.0,
        relative_velocity_km_h: 50400,
        relative_velocity_mph: 31317.6,
        miss_distance_au: 0.047,
        miss_distance_lunar: 18.3,
        miss_distance_km: 7033000,
        miss_distance_mi: 4370531,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 6800,
            crater_km: 32,
            risk_zones: ['Central Pacific', 'Hawaiian Islands'],
        },
        torino_scale: 0,
        importance_score: 4,
    },
    {
        id: '2054509',
        name: '54509 YORP',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2054509',
        absolute_magnitude_h: 22.9,
        estimated_diameter_km_min: 0.126,
        estimated_diameter_km_max: 0.126,
        estimated_diameter_m_min: 126,
        estimated_diameter_m_max: 126,
        estimated_diameter_mi_min: 0.078,
        estimated_diameter_mi_max: 0.078,
        estimated_diameter_ft_min: 413,
        estimated_diameter_ft_max: 413,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2033-03-22',
        close_approach_date_full: '2033-Mar-22 16:33',
        epoch_date_close_approach: 1994540780000,
        relative_velocity_km_s: 9.4,
        relative_velocity_km_h: 33840,
        relative_velocity_mph: 21025.4,
        miss_distance_au: 0.078,
        miss_distance_lunar: 30.3,
        miss_distance_km: 11669000,
        miss_distance_mi: 7249869,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 8,
            crater_km: 1.2,
            risk_zones: ['Remote Ocean'],
        },
        torino_scale: 0,
        importance_score: 1,
    },
    {
        id: '2001685',
        name: '1685 Toro',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001685',
        absolute_magnitude_h: 14.3,
        estimated_diameter_km_min: 3.4,
        estimated_diameter_km_max: 5.2,
        estimated_diameter_m_min: 3400,
        estimated_diameter_m_max: 5200,
        estimated_diameter_mi_min: 2.11,
        estimated_diameter_mi_max: 3.23,
        estimated_diameter_ft_min: 11155,
        estimated_diameter_ft_max: 17060,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2096-10-07',
        close_approach_date_full: '2096-Oct-07 22:14',
        epoch_date_close_approach: 4003027640000,
        relative_velocity_km_s: 17.3,
        relative_velocity_km_h: 62280,
        relative_velocity_mph: 38695.2,
        miss_distance_au: 0.041,
        miss_distance_lunar: 15.9,
        miss_distance_km: 6137000,
        miss_distance_mi: 3813343,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 4200,
            crater_km: 28,
            risk_zones: ['South Atlantic', 'Brazilian Coast'],
        },
        torino_scale: 0,
        importance_score: 4,
    },
    {
        id: '2004197',
        name: '4197 Morpheus',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2004197',
        absolute_magnitude_h: 19.8,
        estimated_diameter_km_min: 0.92,
        estimated_diameter_km_max: 0.92,
        estimated_diameter_m_min: 920,
        estimated_diameter_m_max: 920,
        estimated_diameter_mi_min: 0.57,
        estimated_diameter_mi_max: 0.57,
        estimated_diameter_ft_min: 3018,
        estimated_diameter_ft_max: 3018,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: true,
        close_approach_date: '2126-08-11',
        close_approach_date_full: '2126-Aug-11 07:28',
        epoch_date_close_approach: 4948097280000,
        relative_velocity_km_s: 9.8,
        relative_velocity_km_h: 35280,
        relative_velocity_mph: 21920.8,
        miss_distance_au: 0.019,
        miss_distance_lunar: 7.4,
        miss_distance_km: 2843000,
        miss_distance_mi: 1766763,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 1400,
            crater_km: 16,
            risk_zones: ['Northern Pacific', 'Alaska'],
        },
        torino_scale: 3,
        importance_score: 8,
    },
    {
        id: '2001981',
        name: '1981 Midas',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001981',
        absolute_magnitude_h: 15.5,
        estimated_diameter_km_min: 2.0,
        estimated_diameter_km_max: 2.0,
        estimated_diameter_m_min: 2000,
        estimated_diameter_m_max: 2000,
        estimated_diameter_mi_min: 1.24,
        estimated_diameter_mi_max: 1.24,
        estimated_diameter_ft_min: 6562,
        estimated_diameter_ft_max: 6562,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2085-03-15',
        close_approach_date_full: '2085-Mar-15 13:42',
        epoch_date_close_approach: 3635546520000,
        relative_velocity_km_s: 26.5,
        relative_velocity_km_h: 95400,
        relative_velocity_mph: 59289.0,
        miss_distance_au: 0.063,
        miss_distance_lunar: 24.5,
        miss_distance_km: 9426000,
        miss_distance_mi: 5856146,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 2800,
            crater_km: 22,
            risk_zones: ['Red Sea', 'Middle East'],
        },
        torino_scale: 0,
        importance_score: 4,
    },
    {
        id: '2002100',
        name: '2100 Ra-Shalom',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2002100',
        absolute_magnitude_h: 16.3,
        estimated_diameter_km_min: 2.5,
        estimated_diameter_km_max: 2.5,
        estimated_diameter_m_min: 2500,
        estimated_diameter_m_max: 2500,
        estimated_diameter_mi_min: 1.55,
        estimated_diameter_mi_max: 1.55,
        estimated_diameter_ft_min: 8202,
        estimated_diameter_ft_max: 8202,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2034-09-19',
        close_approach_date_full: '2034-Sep-19 20:15',
        epoch_date_close_approach: 2041327500000,
        relative_velocity_km_s: 14.6,
        relative_velocity_km_h: 52560,
        relative_velocity_mph: 32659.6,
        miss_distance_au: 0.092,
        miss_distance_lunar: 35.8,
        miss_distance_km: 13765000,
        miss_distance_mi: 8551785,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 1200,
            crater_km: 15,
            risk_zones: ['Arctic Ocean'],
        },
        torino_scale: 0,
        importance_score: 2,
    },
    {
        id: '2001862',
        name: '1862 Apollo',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001862',
        absolute_magnitude_h: 16.25,
        estimated_diameter_km_min: 1.5,
        estimated_diameter_km_max: 1.5,
        estimated_diameter_m_min: 1500,
        estimated_diameter_m_max: 1500,
        estimated_diameter_mi_min: 0.93,
        estimated_diameter_mi_max: 0.93,
        estimated_diameter_ft_min: 4921,
        estimated_diameter_ft_max: 4921,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2039-11-07',
        close_approach_date_full: '2039-Nov-07 11:33',
        epoch_date_close_approach: 2204717580000,
        relative_velocity_km_s: 21.8,
        relative_velocity_km_h: 78480,
        relative_velocity_mph: 48766.8,
        miss_distance_au: 0.029,
        miss_distance_lunar: 11.3,
        miss_distance_km: 4340000,
        miss_distance_mi: 2696260,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 1600,
            crater_km: 18,
            risk_zones: ['Eastern Pacific', 'South America West Coast'],
        },
        torino_scale: 0,
        importance_score: 5,
    },
    {
        id: '2001627',
        name: '1627 Ivar',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001627',
        absolute_magnitude_h: 12.8,
        estimated_diameter_km_min: 8.1,
        estimated_diameter_km_max: 9.1,
        estimated_diameter_m_min: 8100,
        estimated_diameter_m_max: 9100,
        estimated_diameter_mi_min: 5.03,
        estimated_diameter_mi_max: 5.65,
        estimated_diameter_ft_min: 26575,
        estimated_diameter_ft_max: 29856,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2047-01-12',
        close_approach_date_full: '2047-Jan-12 04:27',
        epoch_date_close_approach: 2430286020000,
        relative_velocity_km_s: 11.9,
        relative_velocity_km_h: 42840,
        relative_velocity_mph: 26626.4,
        miss_distance_au: 0.123,
        miss_distance_lunar: 47.9,
        miss_distance_km: 18404000,
        miss_distance_mi: 11434884,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 18000,
            crater_km: 55,
            risk_zones: ['Global Devastation'],
        },
        torino_scale: 0,
        importance_score: 6,
    },
    {
        id: '2003200',
        name: '3200 Phaethon',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2003200',
        absolute_magnitude_h: 14.6,
        estimated_diameter_km_min: 5.8,
        estimated_diameter_km_max: 5.8,
        estimated_diameter_m_min: 5800,
        estimated_diameter_m_max: 5800,
        estimated_diameter_mi_min: 3.6,
        estimated_diameter_mi_max: 3.6,
        estimated_diameter_ft_min: 19029,
        estimated_diameter_ft_max: 19029,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2093-12-14',
        close_approach_date_full: '2093-Dec-14 20:20',
        epoch_date_close_approach: 3912890400000,
        relative_velocity_km_s: 10.9,
        relative_velocity_km_h: 39240,
        relative_velocity_mph: 24384.6,
        miss_distance_au: 0.019,
        miss_distance_lunar: 7.4,
        miss_distance_km: 2843000,
        miss_distance_mi: 1766763,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 9500,
            crater_km: 42,
            risk_zones: ['Indian Ocean', 'Indonesia'],
        },
        torino_scale: 0,
        importance_score: 6,
    },
    {
        id: '2006489',
        name: '6489 Golevka',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2006489',
        absolute_magnitude_h: 19.2,
        estimated_diameter_km_min: 0.53,
        estimated_diameter_km_max: 0.53,
        estimated_diameter_m_min: 530,
        estimated_diameter_m_max: 530,
        estimated_diameter_mi_min: 0.33,
        estimated_diameter_mi_max: 0.33,
        estimated_diameter_ft_min: 1739,
        estimated_diameter_ft_max: 1739,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2040-07-24',
        close_approach_date_full: '2040-Jul-24 15:19',
        epoch_date_close_approach: 2226485940000,
        relative_velocity_km_s: 18.6,
        relative_velocity_km_h: 66960,
        relative_velocity_mph: 41606.4,
        miss_distance_au: 0.071,
        miss_distance_lunar: 27.6,
        miss_distance_km: 10622000,
        miss_distance_mi: 6599458,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 180,
            crater_km: 5,
            risk_zones: ['North Sea'],
        },
        torino_scale: 0,
        importance_score: 2,
    },
    {
        id: '2001915',
        name: '1915 Quetzalcoatl',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001915',
        absolute_magnitude_h: 18.4,
        estimated_diameter_km_min: 0.82,
        estimated_diameter_km_max: 0.82,
        estimated_diameter_m_min: 820,
        estimated_diameter_m_max: 820,
        estimated_diameter_mi_min: 0.51,
        estimated_diameter_mi_max: 0.51,
        estimated_diameter_ft_min: 2690,
        estimated_diameter_ft_max: 2690,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2036-05-09',
        close_approach_date_full: '2036-May-09 08:42',
        epoch_date_close_approach: 2094114120000,
        relative_velocity_km_s: 13.7,
        relative_velocity_km_h: 49320,
        relative_velocity_mph: 30650.2,
        miss_distance_au: 0.055,
        miss_distance_lunar: 21.4,
        miss_distance_km: 8233000,
        miss_distance_mi: 5114913,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 280,
            crater_km: 6.5,
            risk_zones: ['Gulf of Mexico'],
        },
        torino_scale: 0,
        importance_score: 2,
    },
    {
        id: '2001866',
        name: '1866 Sisyphus',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001866',
        absolute_magnitude_h: 12.4,
        estimated_diameter_km_min: 8.5,
        estimated_diameter_km_max: 8.5,
        estimated_diameter_m_min: 8500,
        estimated_diameter_m_max: 8500,
        estimated_diameter_mi_min: 5.28,
        estimated_diameter_mi_max: 5.28,
        estimated_diameter_ft_min: 27887,
        estimated_diameter_ft_max: 27887,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2071-11-25',
        close_approach_date_full: '2071-Nov-25 12:18',
        epoch_date_close_approach: 3217940280000,
        relative_velocity_km_s: 15.2,
        relative_velocity_km_h: 54720,
        relative_velocity_mph: 33998.4,
        miss_distance_au: 0.187,
        miss_distance_lunar: 72.7,
        miss_distance_km: 27971000,
        miss_distance_mi: 17384171,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 22000,
            crater_km: 60,
            risk_zones: ['Global Mass Extinction'],
        },
        torino_scale: 0,
        importance_score: 7,
    },
    {
        id: '2001580',
        name: '1580 Betulia',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001580',
        absolute_magnitude_h: 15.4,
        estimated_diameter_km_min: 4.6,
        estimated_diameter_km_max: 4.6,
        estimated_diameter_m_min: 4600,
        estimated_diameter_m_max: 4600,
        estimated_diameter_mi_min: 2.86,
        estimated_diameter_mi_max: 2.86,
        estimated_diameter_ft_min: 15092,
        estimated_diameter_ft_max: 15092,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2043-08-06',
        close_approach_date_full: '2043-Aug-06 17:55',
        epoch_date_close_approach: 2322851700000,
        relative_velocity_km_s: 8.3,
        relative_velocity_km_h: 29880,
        relative_velocity_mph: 18566.4,
        miss_distance_au: 0.098,
        miss_distance_lunar: 38.1,
        miss_distance_km: 14662000,
        miss_distance_mi: 9109322,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 4800,
            crater_km: 30,
            risk_zones: ['Southern Ocean'],
        },
        torino_scale: 0,
        importance_score: 3,
    },
    {
        id: '2001943',
        name: '1943 Anteros',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001943',
        absolute_magnitude_h: 15.7,
        estimated_diameter_km_min: 2.0,
        estimated_diameter_km_max: 2.0,
        estimated_diameter_m_min: 2000,
        estimated_diameter_m_max: 2000,
        estimated_diameter_mi_min: 1.24,
        estimated_diameter_mi_max: 1.24,
        estimated_diameter_ft_min: 6562,
        estimated_diameter_ft_max: 6562,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2061-12-30',
        close_approach_date_full: '2061-Dec-30 23:47',
        epoch_date_close_approach: 2903814420000,
        relative_velocity_km_s: 12.1,
        relative_velocity_km_h: 43560,
        relative_velocity_mph: 27073.6,
        miss_distance_au: 0.084,
        miss_distance_lunar: 32.7,
        miss_distance_km: 12569000,
        miss_distance_mi: 7808069,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 1100,
            crater_km: 14,
            risk_zones: ['Tasman Sea'],
        },
        torino_scale: 0,
        importance_score: 3,
    },
    {
        id: '2003362',
        name: '3362 Khufu',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2003362',
        absolute_magnitude_h: 20.1,
        estimated_diameter_km_min: 0.65,
        estimated_diameter_km_max: 0.65,
        estimated_diameter_m_min: 650,
        estimated_diameter_m_max: 650,
        estimated_diameter_mi_min: 0.4,
        estimated_diameter_mi_max: 0.4,
        estimated_diameter_ft_min: 2133,
        estimated_diameter_ft_max: 2133,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2052-08-31',
        close_approach_date_full: '2052-Aug-31 09:14',
        epoch_date_close_approach: 2607930840000,
        relative_velocity_km_s: 23.8,
        relative_velocity_km_h: 85680,
        relative_velocity_mph: 53246.8,
        miss_distance_au: 0.036,
        miss_distance_lunar: 14.0,
        miss_distance_km: 5386000,
        miss_distance_mi: 3346746,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 520,
            crater_km: 9,
            risk_zones: ['Black Sea', 'Eastern Europe'],
        },
        torino_scale: 0,
        importance_score: 4,
    },
    {
        id: '2001036_2',
        name: '1036 Ganymed B',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2001036',
        absolute_magnitude_h: 18.2,
        estimated_diameter_km_min: 0.95,
        estimated_diameter_km_max: 1.1,
        estimated_diameter_m_min: 950,
        estimated_diameter_m_max: 1100,
        estimated_diameter_mi_min: 0.59,
        estimated_diameter_mi_max: 0.68,
        estimated_diameter_ft_min: 3117,
        estimated_diameter_ft_max: 3609,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: true,
        close_approach_date: '2118-03-15',
        close_approach_date_full: '2118-Mar-15 11:30',
        epoch_date_close_approach: 4679785800000,
        relative_velocity_km_s: 8.7,
        relative_velocity_km_h: 31320,
        relative_velocity_mph: 19462.2,
        miss_distance_au: 0.012,
        miss_distance_lunar: 4.7,
        miss_distance_km: 1796000,
        miss_distance_mi: 1115684,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 2200,
            crater_km: 20,
            risk_zones: ['Western Pacific', 'Japan', 'Korea'],
        },
        torino_scale: 4,
        importance_score: 9,
    },
    {
        id: '2002101',
        name: '2101 Adonis',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2002101',
        absolute_magnitude_h: 18.8,
        estimated_diameter_km_min: 1.5,
        estimated_diameter_km_max: 1.5,
        estimated_diameter_m_min: 1500,
        estimated_diameter_m_max: 1500,
        estimated_diameter_mi_min: 0.93,
        estimated_diameter_mi_max: 0.93,
        estimated_diameter_ft_min: 4921,
        estimated_diameter_ft_max: 4921,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2036-02-07',
        close_approach_date_full: '2036-Feb-07 14:22',
        epoch_date_close_approach: 2087146920000,
        relative_velocity_km_s: 25.4,
        relative_velocity_km_h: 91440,
        relative_velocity_mph: 56830.4,
        miss_distance_au: 0.015,
        miss_distance_lunar: 5.8,
        miss_distance_km: 2245000,
        miss_distance_mi: 1394595,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 3200,
            crater_km: 25,
            risk_zones: ['Central Atlantic', 'Western Africa'],
        },
        torino_scale: 1,
        importance_score: 7,
    },
    {
        id: '2004660',
        name: '4660 Nereus',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2004660',
        absolute_magnitude_h: 17.6,
        estimated_diameter_km_min: 0.33,
        estimated_diameter_km_max: 0.33,
        estimated_diameter_m_min: 330,
        estimated_diameter_m_max: 330,
        estimated_diameter_mi_min: 0.205,
        estimated_diameter_mi_max: 0.205,
        estimated_diameter_ft_min: 1083,
        estimated_diameter_ft_max: 1083,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2029-02-14',
        close_approach_date_full: '2029-Feb-14 06:10',
        epoch_date_close_approach: 1865583000000,
        relative_velocity_km_s: 3.9,
        relative_velocity_km_h: 14040,
        relative_velocity_mph: 8724.9,
        miss_distance_au: 0.012,
        miss_distance_lunar: 4.7,
        miss_distance_km: 1796000,
        miss_distance_mi: 1115684,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 45,
            crater_km: 2.2,
            risk_zones: ['Baltic Sea'],
        },
        torino_scale: 0,
        importance_score: 2,
    },
    {
        id: '2000216',
        name: '216 Kleopatra',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2000216',
        absolute_magnitude_h: 7.3,
        estimated_diameter_km_min: 124.0,
        estimated_diameter_km_max: 124.0,
        estimated_diameter_m_min: 124000,
        estimated_diameter_m_max: 124000,
        estimated_diameter_mi_min: 77.05,
        estimated_diameter_mi_max: 77.05,
        estimated_diameter_ft_min: 406824,
        estimated_diameter_ft_max: 406824,
        is_potentially_hazardous_asteroid: false,
        is_sentry_object: false,
        close_approach_date: '2176-09-12',
        close_approach_date_full: '2176-Sep-12 03:47',
        epoch_date_close_approach: 6527394420000,
        relative_velocity_km_s: 18.2,
        relative_velocity_km_h: 65520,
        relative_velocity_mph: 40711.2,
        miss_distance_au: 0.423,
        miss_distance_lunar: 164.5,
        miss_distance_km: 63279000,
        miss_distance_mi: 39308979,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 750000000,
            crater_km: 800,
            risk_zones: ['Global Extinction Event'],
        },
        torino_scale: 0,
        importance_score: 8,
    },
    {
        id: '2065803',
        name: '65803 Didymos',
        nasa_jpl_url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=2065803',
        absolute_magnitude_h: 18.16,
        estimated_diameter_km_min: 0.78,
        estimated_diameter_km_max: 0.78,
        estimated_diameter_m_min: 780,
        estimated_diameter_m_max: 780,
        estimated_diameter_mi_min: 0.48,
        estimated_diameter_mi_max: 0.48,
        estimated_diameter_ft_min: 2559,
        estimated_diameter_ft_max: 2559,
        is_potentially_hazardous_asteroid: true,
        is_sentry_object: false,
        close_approach_date: '2123-09-30',
        close_approach_date_full: '2123-Sep-30 12:18',
        epoch_date_close_approach: 4857031080000,
        relative_velocity_km_s: 4.14,
        relative_velocity_km_h: 14904,
        relative_velocity_mph: 9261.5,
        miss_distance_au: 0.038,
        miss_distance_lunar: 14.8,
        miss_distance_km: 5684000,
        miss_distance_mi: 3531996,
        orbiting_body: 'Earth',
        impact: {
            energy_megatons: 380,
            crater_km: 7.5,
            risk_zones: ['Bering Sea'],
        },
        torino_scale: 0,
        importance_score: 4,
    },
].sort((a, b) => b.importance_score - a.importance_score);

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

function createDetailedEarth() {
    const earthGeometry = new THREE.SphereGeometry(6, 128, 128);
    const earthCanvas = document.createElement('canvas');
    earthCanvas.width = 1024;
    earthCanvas.height = 512;
    const earthContext = earthCanvas.getContext('2d')!;

    const oceanGradient = earthContext.createLinearGradient(0, 0, 0, 512);
    oceanGradient.addColorStop(0, '#1a5490');
    oceanGradient.addColorStop(0.5, '#2563eb');
    oceanGradient.addColorStop(1, '#1a5490');
    earthContext.fillStyle = oceanGradient;
    earthContext.fillRect(0, 0, 1024, 512);

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

    const continentColors = ['#228b22', '#32cd32', '#90ee90', '#006400'];

    earthContext.fillStyle = continentColors[0];
    earthContext.fillRect(80, 60, 120, 90);
    earthContext.fillRect(60, 80, 80, 70);
    earthContext.fillRect(100, 140, 60, 40);

    earthContext.fillStyle = continentColors[1];
    earthContext.fillRect(140, 180, 60, 120);
    earthContext.fillRect(120, 220, 40, 100);

    earthContext.fillStyle = continentColors[2];
    earthContext.fillRect(400, 80, 80, 60);
    earthContext.fillRect(420, 70, 60, 40);

    earthContext.fillStyle = continentColors[0];
    earthContext.fillRect(420, 140, 100, 160);
    earthContext.fillRect(440, 160, 80, 120);

    earthContext.fillStyle = continentColors[3];
    earthContext.fillRect(500, 80, 200, 120);
    earthContext.fillRect(520, 120, 160, 80);
    earthContext.fillRect(600, 60, 100, 60);

    earthContext.fillStyle = continentColors[1];
    earthContext.fillRect(700, 240, 80, 40);

    earthContext.fillStyle = '#8b4513';
    for (let i = 0; i < 30; i++) {
        const x = Math.random() * 1024;
        const y = Math.random() * 512;
        earthContext.fillRect(x, y, Math.random() * 20 + 5, Math.random() * 10 + 2);
    }

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

function createDetailedAsteroid(size: number, color: number) {
    const geometry = new THREE.IcosahedronGeometry(size, 2);
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

    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d')!;

    const baseColor = new THREE.Color(color);
    context.fillStyle = `rgb(${Math.floor(baseColor.r * 255)}, ${Math.floor(baseColor.g * 255)}, ${Math.floor(baseColor.b * 255)})`;
    context.fillRect(0, 0, 256, 256);

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

    for (let i = 0; i < 200; i++) {
        const brightness = Math.random() * 100 - 50;
        context.fillStyle = `rgba(${brightness + 128}, ${brightness + 128}, ${brightness + 128}, 0.3)`;
        context.fillRect(
            Math.random() * 256,
            Math.random() * 256,
            Math.random() * 3 + 1,
            Math.random() * 3 + 1,
        );
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshPhongMaterial({
        map: texture,
        color,
        shininess: 10,
        bumpMap: texture,
        bumpScale: 0.3,
    });

    return new THREE.Mesh(geometry, material);
}

function createImpactTrajectory(asteroidPosition: THREE.Vector3, riskZones: string[]): THREE.Group {
    const trajectoryGroup = new THREE.Group();
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
        'Regional Damage': { lat: 35, lng: 25 },
        'Mediterranean Sea': { lat: 35, lng: 18 },
        'Southern Europe': { lat: 45, lng: 15 },
        'South China Sea': { lat: 15, lng: 115 },
        Philippines: { lat: 12, lng: 122 },
        'Arabian Sea': { lat: 18, lng: 65 },
        'Western India': { lat: 20, lng: 75 },
        'Bay of Bengal': { lat: 15, lng: 90 },
        'Caribbean Sea': { lat: 15, lng: -75 },
        'North Atlantic': { lat: 45, lng: -30 },
        'Central Pacific': { lat: 5, lng: -160 },
        'Hawaiian Islands': { lat: 21, lng: -157 },
        'Remote Ocean': { lat: -30, lng: 150 },
        'Northern Pacific': { lat: 50, lng: -160 },
        Alaska: { lat: 64, lng: -153 },
        'South Atlantic': { lat: -30, lng: -15 },
        'Brazilian Coast': { lat: -15, lng: -45 },
        'Arctic Ocean': { lat: 80, lng: 0 },
        'Red Sea': { lat: 20, lng: 38 },
        'Middle East': { lat: 28, lng: 47 },
        'Eastern Pacific': { lat: -10, lng: -120 },
        'South America West Coast': { lat: -20, lng: -75 },
        'Global Devastation': { lat: 0, lng: 0 },
        Indonesia: { lat: -2, lng: 118 },
        'North Sea': { lat: 56, lng: 3 },
        'Gulf of Mexico': { lat: 25, lng: -90 },
        'Southern Ocean': { lat: -50, lng: 0 },
        'Tasman Sea': { lat: -35, lng: 160 },
        'Black Sea': { lat: 43, lng: 35 },
        'Eastern Europe': { lat: 50, lng: 30 },
        'Western Pacific': { lat: 25, lng: 140 },
        Japan: { lat: 36, lng: 138 },
        Korea: { lat: 37, lng: 127 },
        'Central Atlantic': { lat: 10, lng: -25 },
        'Western Africa': { lat: 10, lng: -10 },
        'Baltic Sea': { lat: 58, lng: 20 },
        'Global Extinction Event': { lat: 0, lng: 0 },
        'Bering Sea': { lat: 58, lng: -175 },
        'North America': { lat: 45, lng: -100 },
        Canada: { lat: 60, lng: -110 },
    };

    riskZones.forEach((zone) => {
        const coords = zoneCoordinates[zone];
        if (coords) {
            const phi = (90 - coords.lat) * (Math.PI / 180);
            const theta = (coords.lng + 180) * (Math.PI / 180);
            const radius = 6.1;
            const impactX = -(radius * Math.sin(phi) * Math.cos(theta));
            const impactZ = radius * Math.sin(phi) * Math.sin(theta);
            const impactY = radius * Math.cos(phi);
            const impactPoint = new THREE.Vector3(impactX, impactY, impactZ);

            const trajectoryPoints = [];
            trajectoryPoints.push(asteroidPosition.clone());
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
                linewidth: 3,
            });

            const trajectoryLine = new THREE.Line(lineGeometry, lineMaterial);
            trajectoryGroup.add(trajectoryLine);

            const impactGeometry = new THREE.SphereGeometry(0.8, 16, 16);
            const impactMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.9,
            });

            const impactMarker = new THREE.Mesh(impactGeometry, impactMaterial);
            impactMarker.position.copy(impactPoint);
            trajectoryGroup.add(impactMarker);

            const pulseGeometry = new THREE.RingGeometry(1.2, 2.0, 32);
            const pulseMaterial = new THREE.MeshBasicMaterial({
                color: 0xff0000,
                transparent: true,
                opacity: 0.4,
                side: THREE.DoubleSide,
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
    const [isGeneratingReport, setIsGeneratingReport] = useState<boolean>(false);
    const [expandedPanels, setExpandedPanels] = useState<{
        asteroidMonitor: boolean;
        legend: boolean;
        analysis: boolean;
    }>({
        asteroidMonitor: true,
        legend: true,
        analysis: true,
    });

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

    const animationSpeed = 1.0;
    const visibleAsteroids = useMemo(() => {
        return ASTEROID_DATA.slice(0, maxAsteroids);
    }, [maxAsteroids]);

    // Multi-asteroid report function (for main menu)
    const generateAIReport = async () => {
        setIsGeneratingReport(true);
        try {
            const asteroidIds = visibleAsteroids.map((asteroid) => asteroid.id);
            const response = await fetch('/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asteroidIds,
                    requestedAt: new Date().toISOString(),
                    totalAsteroids: asteroidIds.length,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('AI Report generated:', result);
                alert(
                    `✅ AI Report generated successfully! Report ID: ${result.reportId || 'Generated'}`,
                );
            } else {
                console.error('Failed to generate report:', response.statusText);
                alert('❌ Failed to generate AI report. Please try again.');
            }
        } catch (error) {
            console.error('Error generating report:', error);
            alert('❌ Network error while generating AI report. Please check your connection.');
        } finally {
            setIsGeneratingReport(false);
        }
    };

    // Single asteroid report function (for selected asteroid)
    const generateSingleAsteroidReport = async () => {
        if (!selectedAsteroid) return;

        setIsGeneratingReport(true);
        try {
            const response = await fetch('/reports', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    asteroidIds: [selectedAsteroid.id],
                    requestedAt: new Date().toISOString(),
                    totalAsteroids: 1,
                }),
            });

            if (response.ok) {
                const result = await response.json();
                console.log('Single Asteroid Report generated:', result);
                alert(
                    `✅ Report for ${selectedAsteroid.name} generated successfully! Report ID: ${result.reportId || 'Generated'}`,
                );
            } else {
                console.error('Failed to generate single asteroid report:', response.statusText);
                alert('❌ Failed to generate asteroid report. Please try again.');
            }
        } catch (error) {
            console.error('Error generating single asteroid report:', error);
            alert(
                '❌ Network error while generating asteroid report. Please check your connection.',
            );
        } finally {
            setIsGeneratingReport(false);
        }
    };

    const togglePanel = (panel: keyof typeof expandedPanels) => {
        setExpandedPanels((prev) => ({
            ...prev,
            [panel]: !prev[panel],
        }));
    };

    // DYNAMIC RING CREATION SYSTEM - Creates as many rings as needed
    const recreateAsteroids = () => {
        if (!sceneRef.current) return;
        const scene = sceneRef.current;

        Object.values(asteroidMeshes.current).forEach((mesh) => {
            scene.remove(mesh);
            mesh.geometry.dispose();
            if (mesh.material instanceof THREE.Material) {
                mesh.material.dispose();
            }
        });
        asteroidMeshes.current = {};

        // DYNAMIC RING SYSTEM - Creates as many rings as needed
        const calculateDynamicRings = () => {
            const maxAsteroidsPerRing = 5; // Max asteroids per ring before creating new ring
            const baseDistance = 15; // Starting distance for first ring
            const ringGap = 12; // INCREASED gap between rings for better spacing

            // Categorize asteroids by priority
            const criticalAsteroids = visibleAsteroids.filter(
                (a) => a.is_sentry_object || a.torino_scale >= 3,
            );
            const hazardousAsteroids = visibleAsteroids.filter(
                (a) =>
                    !criticalAsteroids.includes(a) &&
                    (a.is_potentially_hazardous_asteroid || a.torino_scale >= 1),
            );
            const regularAsteroids = visibleAsteroids.filter(
                (a) => !criticalAsteroids.includes(a) && !hazardousAsteroids.includes(a),
            );

            // Calculate how many rings we need for each category
            const criticalRings = Math.max(
                1,
                Math.ceil(criticalAsteroids.length / maxAsteroidsPerRing),
            );
            const hazardousRings = Math.max(
                0,
                Math.ceil(hazardousAsteroids.length / maxAsteroidsPerRing),
            );
            const regularRings = Math.max(
                0,
                Math.ceil(regularAsteroids.length / maxAsteroidsPerRing),
            );

            // Create ring configuration
            const rings = [];
            let currentDistance = baseDistance;

            // Critical rings (innermost)
            for (let i = 0; i < criticalRings; i++) {
                rings.push({
                    distance: currentDistance,
                    type: 'critical',
                    color: 0xff4444,
                    opacity: 0.2,
                });
                currentDistance += ringGap;
            }

            // Hazardous rings (middle)
            for (let i = 0; i < hazardousRings; i++) {
                rings.push({
                    distance: currentDistance,
                    type: 'hazardous',
                    color: 0xff8844,
                    opacity: 0.15,
                });
                currentDistance += ringGap;
            }

            // Regular rings (outermost)
            for (let i = 0; i < regularRings; i++) {
                rings.push({
                    distance: currentDistance,
                    type: 'regular',
                    color: 0x888888,
                    opacity: 0.1,
                });
                currentDistance += ringGap;
            }

            return {
                rings,
                criticalAsteroids,
                hazardousAsteroids,
                regularAsteroids,
                maxAsteroidsPerRing,
            };
        };

        const {
            rings,
            criticalAsteroids,
            hazardousAsteroids,
            regularAsteroids,
            maxAsteroidsPerRing,
        } = calculateDynamicRings();

        // Distribute asteroids across rings
        const hazardousRingIndex =
            criticalAsteroids.length > 0
                ? Math.ceil(criticalAsteroids.length / maxAsteroidsPerRing)
                : 0;
        const regularRingIndex =
            hazardousRingIndex +
            (hazardousAsteroids.length > 0
                ? Math.ceil(hazardousAsteroids.length / maxAsteroidsPerRing)
                : 0);

        visibleAsteroids.forEach((asteroid, index) => {
            let ringIndex, ringType, asteroidList, localIndex;

            // Determine which ring this asteroid belongs to
            if (criticalAsteroids.includes(asteroid)) {
                ringIndex = Math.floor(criticalAsteroids.indexOf(asteroid) / maxAsteroidsPerRing);
                ringType = 'critical';
                asteroidList = criticalAsteroids;
                localIndex = criticalAsteroids.indexOf(asteroid);
            } else if (hazardousAsteroids.includes(asteroid)) {
                ringIndex =
                    hazardousRingIndex +
                    Math.floor(hazardousAsteroids.indexOf(asteroid) / maxAsteroidsPerRing);
                ringType = 'hazardous';
                asteroidList = hazardousAsteroids;
                localIndex = hazardousAsteroids.indexOf(asteroid);
            } else {
                ringIndex =
                    regularRingIndex +
                    Math.floor(regularAsteroids.indexOf(asteroid) / maxAsteroidsPerRing);
                ringType = 'regular';
                asteroidList = regularAsteroids;
                localIndex = regularAsteroids.indexOf(asteroid);
            }

            const ring = rings[ringIndex];
            if (!ring) return; // Safety check

            let distance = ring.distance;
            // SLIGHTLY INCREASED random variation for better spacing
            distance += (Math.random() - 0.5) * 3;

            // ENHANCED SIZE CALCULATION
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

            // OPTIMAL POSITIONING within ring - max 5 per ring
            const asteroidIndexInRing = localIndex % maxAsteroidsPerRing;
            const totalInThisRing = Math.min(
                maxAsteroidsPerRing,
                asteroidList.length -
                    Math.floor(localIndex / maxAsteroidsPerRing) * maxAsteroidsPerRing,
            );

            let initialAngle;
            if (totalInThisRing === 1) {
                initialAngle = 0;
            } else {
                // Evenly distribute around the ring
                initialAngle = (asteroidIndexInRing / totalInThisRing) * Math.PI * 2;
            }

            const x = Math.cos(initialAngle) * distance;
            const z = Math.sin(initialAngle) * distance;
            const y = (Math.random() - 0.5) * 1;

            // ENHANCED COLOR CODING based on type
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
            const asteroidMesh = createDetailedAsteroid(size, color);
            asteroidMesh.userData = asteroid;
            const typedMesh = asteroidMesh as unknown as AsteroidMesh;

            typedMesh.position.set(x, y, z);
            typedMesh.orbitRing = ringIndex;
            typedMesh.orbitRadius = distance;
            typedMesh.orbitSpeed = asteroid.relative_velocity_km_s * 0.0001;
            typedMesh.orbitAngle = initialAngle;
            typedMesh.orbitCenter = new THREE.Vector3(0, y, 0);
            typedMesh.originalScale = size;
            typedMesh.originalColor = color;
            typedMesh.originalEmissive = emissive;
            typedMesh.originalEmissiveIntensity = 0.5;

            const material = typedMesh.material as THREE.MeshPhongMaterial;
            material.emissive = new THREE.Color(emissive);
            material.emissiveIntensity = 0.5;

            scene.add(typedMesh);
            asteroidMeshes.current[asteroid.id] = typedMesh;
        });

        // CREATE VISUAL RINGS
        if (showOrbits) {
            // Remove old rings
            const oldRings = scene.children.filter((child) => child.userData?.isOrbitRing);
            oldRings.forEach((ring) => scene.remove(ring));

            // Create new dynamic rings
            rings.forEach((ring, ringIndex) => {
                const orbitGeometry = new THREE.RingGeometry(
                    ring.distance - 0.5,
                    ring.distance + 0.5,
                    64,
                );
                const orbitMaterial = new THREE.MeshBasicMaterial({
                    color: ring.color,
                    transparent: true,
                    opacity: ring.opacity,
                    side: THREE.DoubleSide,
                });
                const orbitRing = new THREE.Mesh(orbitGeometry, orbitMaterial);
                orbitRing.rotation.x = Math.PI / 2;
                orbitRing.userData = {
                    isOrbitRing: true,
                    ringType: ring.type,
                    ringIndex,
                };
                scene.add(orbitRing);
            });
        }

        console.log(
            `🛰️ Created ${rings.length} dynamic rings:`,
            `Critical: ${rings.filter((r) => r.type === 'critical').length}, `,
            `Hazardous: ${rings.filter((r) => r.type === 'hazardous').length}, `,
            `Regular: ${rings.filter((r) => r.type === 'regular').length}`,
        );
    };

    useEffect(() => {
        if (isInitialized.current) {
            recreateAsteroids();
        }
    }, [maxAsteroids, visibleAsteroids]);

    // Handle orbit visibility toggle
    useEffect(() => {
        if (isInitialized.current && sceneRef.current) {
            const scene = sceneRef.current;

            // Remove all orbit rings
            const oldRings = scene.children.filter((child) => child.userData?.isOrbitRing);
            oldRings.forEach((ring) => scene.remove(ring));

            if (showOrbits) {
                // Recreate with current dynamic distances
                recreateAsteroids();
            }
        }
    }, [showOrbits]);

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

        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.outputColorSpace = THREE.SRGBColorSpace;
        rendererRef.current = renderer;
        renderer.setClearColor(0x000011);
        renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
        mountRef.current.appendChild(renderer.domElement);

        const starField = createStarField();
        scene.add(starField);

        const ambientLight = new THREE.AmbientLight(0x404040, 1.2);
        scene.add(ambientLight);
        const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0x362d1e, 0.6);
        scene.add(hemisphereLight);
        const sunLight = new THREE.DirectionalLight(0xffffff, 1.2);
        sunLight.position.set(15, 0, 10);
        scene.add(sunLight);

        const earth = createDetailedEarth();
        scene.add(earth);
        earthRef.current = earth;

        camera.position.set(35, 35 * 0.4, 35);
        camera.lookAt(0, 0, 0);

        const controls = new OrbitControls(camera, renderer.domElement);
        controls.target.set(0, 0, 0);
        controls.enableDamping = false;
        controls.enableZoom = true;
        controls.enableRotate = true;
        controls.enablePan = true;
        controls.minDistance = 8;
        controls.maxDistance = 200; // INCREASED maximum zoom distance
        controls.maxPolarAngle = Math.PI;
        controls.autoRotate = false;
        controlsRef.current = controls;

        // Initial orbit rings will be created by recreateAsteroids() function
        recreateAsteroids();

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

            if (mouseDownTime > 0) {
                const dragDistance = Math.sqrt(
                    (event.clientX - mouseDownPosition.x) ** 2 +
                        (event.clientY - mouseDownPosition.y) ** 2,
                );
                if (dragDistance > 5) {
                    isDragging = true;
                }
            }

            const rect = mountRef.current.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(Object.values(asteroidMeshes.current));

            if (previousHovered) {
                const material = previousHovered.material as THREE.MeshPhongMaterial;
                material.emissive.setHex(previousHovered.originalEmissive!);
                material.emissiveIntensity = previousHovered.originalEmissiveIntensity!;
                previousHovered.scale.setScalar(1);
                document.body.style.cursor = 'default';
                previousHovered = null;
                setHoveredAsteroid(null);
            }

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

            if (!isDragging && clickDuration < 300) {
                const rect = mountRef.current.getBoundingClientRect();
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                raycaster.setFromCamera(mouse, camera);
                const intersects = raycaster.intersectObjects(
                    Object.values(asteroidMeshes.current),
                );

                if (intersects.length > 0) {
                    const clickedMesh = intersects[0].object as AsteroidMesh;
                    setSelectedAsteroid(clickedMesh.userData);

                    if (currentImpactTrajectory.current) {
                        scene.remove(currentImpactTrajectory.current);
                        currentImpactTrajectory.current = null;
                    }

                    const trajectory = createImpactTrajectory(
                        clickedMesh.position,
                        clickedMesh.userData.impact.risk_zones,
                    );
                    scene.add(trajectory);
                    currentImpactTrajectory.current = trajectory;

                    const originalScale = clickedMesh.scale.x;
                    clickedMesh.scale.setScalar(originalScale * 0.9);
                    setTimeout(() => {
                        if (clickedMesh.scale) {
                            clickedMesh.scale.setScalar(originalScale);
                        }
                    }, 100);
                } else {
                    setSelectedAsteroid(null);
                    if (currentImpactTrajectory.current) {
                        scene.remove(currentImpactTrajectory.current);
                        currentImpactTrajectory.current = null;
                    }
                }
            }
            mouseDownTime = 0;
            isDragging = false;
        };

        mountRef.current.addEventListener('mousedown', onMouseDown);
        mountRef.current.addEventListener('mousemove', onMouseMove);
        mountRef.current.addEventListener('mouseup', onMouseUp);

        let frameCount = 0;
        const animate = (): void => {
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
            }
            animationIdRef.current = requestAnimationFrame(animate);
            frameCount++;

            controls.update();

            if (frameCount % 300 === 0) {
                const currentDistance = camera.position.distanceTo(controls.target);
                const roundedDistance = Math.round(currentDistance * 10) / 10;
                if (Math.abs(roundedDistance - cameraDistance) > 1) {
                    setCameraDistance(roundedDistance);
                }
            }

            const isAnimationsPaused = selectedAsteroidRef.current !== null;

            if (!isAnimationsPaused && earthRef.current) {
                earthRef.current.rotation.y += 0.008 * animationSpeed;
            }

            const time = Date.now() * 0.001;

            // FIXED: Ensure all asteroids orbit properly around Earth
            if (!isAnimationsPaused) {
                Object.values(asteroidMeshes.current).forEach((mesh) => {
                    const asteroid = mesh.userData;
                    const rotSpeed = asteroid.relative_velocity_km_s * 0.0001 * animationSpeed;
                    mesh.rotation.x += rotSpeed * 0.5;
                    mesh.rotation.y += rotSpeed;

                    // ENSURE ORBITAL MOTION - All asteroids orbit around Earth at center (0,0,0)
                    if (
                        mesh.orbitRadius &&
                        mesh.orbitSpeed !== undefined &&
                        mesh.orbitAngle !== undefined &&
                        mesh.orbitCenter
                    ) {
                        mesh.orbitAngle += mesh.orbitSpeed * animationSpeed;
                        // FIXED: All orbits centered on Earth (0,0,0)
                        mesh.position.x = Math.cos(mesh.orbitAngle) * mesh.orbitRadius;
                        mesh.position.z = Math.sin(mesh.orbitAngle) * mesh.orbitRadius;
                        mesh.position.y = mesh.orbitCenter.y; // Maintain slight Y variation
                    }
                });
            }

            Object.values(asteroidMeshes.current).forEach((mesh) => {
                const asteroid = mesh.userData;
                const material = mesh.material as THREE.MeshPhongMaterial;
                const isSelected =
                    selectedAsteroidRef.current && asteroid.id === selectedAsteroidRef.current.id;

                if (isSelected) {
                    const pulseIntensity = 1.0 + Math.sin(time * 3) * 0.05;
                    mesh.scale.setScalar(pulseIntensity);
                    material.emissiveIntensity = 1.5 + Math.sin(time * 2) * 0.3;
                } else if (
                    (asteroid.is_sentry_object || asteroid.is_potentially_hazardous_asteroid) &&
                    mesh !== previousHovered
                ) {
                    const glowIntensity = 0.5 + Math.sin(time * 1.5) * 0.3;
                    material.emissiveIntensity = glowIntensity;
                    if (mesh.scale.x !== 1) {
                        mesh.scale.setScalar(1);
                    }
                } else {
                    if (mesh.scale.x !== 1) {
                        mesh.scale.setScalar(1);
                    }
                    if (material.emissiveIntensity !== mesh.originalEmissiveIntensity) {
                        material.emissiveIntensity = mesh.originalEmissiveIntensity!;
                    }
                }
            });

            if (currentImpactTrajectory.current) {
                currentImpactTrajectory.current.children.forEach((child, childIndex) => {
                    if (child.type === 'Mesh' && childIndex % 3 === 2) {
                        const scale = 1 + Math.sin(time * 3 + childIndex) * 0.3;
                        child.scale.setScalar(scale);
                        const material = (child as THREE.Mesh).material as THREE.MeshBasicMaterial;
                        material.opacity = 0.4 + Math.sin(time * 2 + childIndex) * 0.2;
                    }
                });
            }

            renderer.render(scene, camera);
        };
        animate();

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
    }, []);

    const getRiskLevel = (asteroid: AsteroidData): string => {
        if (asteroid.is_sentry_object) return 'CRITICAL';
        if (asteroid.is_potentially_hazardous_asteroid) return 'HIGH';
        if (asteroid.importance_score > 6) return 'MODERATE';
        return 'LOW';
    };

    const getRiskColor = (level: string): string => {
        switch (level) {
            case 'CRITICAL':
                return 'text-red-100 bg-red-900';
            case 'HIGH':
                return 'text-orange-100 bg-orange-900';
            case 'MODERATE':
                return 'text-yellow-100 bg-yellow-900';
            default:
                return 'text-emerald-100 bg-emerald-900';
        }
    };

    const formatNumber = (num: number): string => {
        return num.toLocaleString('en-US', { maximumFractionDigits: 2 });
    };

    return (
        <div className="flex h-screen" style={{ backgroundColor: '#051622', color: '#deb992' }}>
            <div className="flex-1 relative">
                <div ref={mountRef} className="w-full h-full" />

                {/* Simplified Controls */}
                <div
                    className="absolute top-6 left-6 backdrop-blur-lg rounded-2xl p-6"
                    style={{
                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                        border: '1px solid rgba(222, 185, 146, 0.2)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => togglePanel('asteroidMonitor')}
                        className="w-full text-left px-4 py-2 focus:outline-none flex justify-between items-center"
                    >
                        <h3
                            className="text-2xl font-light tracking-wide mb-6"
                            style={{ color: '#1ba098' }}
                        >
                            Asteroid Monitor
                        </h3>
                        <span>{expandedPanels.asteroidMonitor ? '▲' : '▼'}</span>
                    </button>
                    {expandedPanels.asteroidMonitor && (
                        <div className="px-4 py-2 space-y-2">
                            <div className="space-y-4">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={showOrbits}
                                        onChange={(e) => setShowOrbits(e.target.checked)}
                                        className="w-5 h-5 rounded"
                                        style={{ accentColor: '#1ba098' }}
                                    />
                                    <span className="text-sm font-medium">Orbital Paths</span>
                                </label>

                                <div className="space-y-2">
                                    <label className="block text-sm font-medium">
                                        Objects: {maxAsteroids} / {ASTEROID_DATA.length}
                                    </label>
                                    <input
                                        type="range"
                                        min="1"
                                        max={ASTEROID_DATA.length}
                                        step="1"
                                        value={maxAsteroids}
                                        onChange={(e) =>
                                            setMaxAsteroids(Number.parseInt(e.target.value))
                                        }
                                        className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                        style={{
                                            background: 'rgba(222, 185, 146, 0.2)',
                                            accentColor: '#1ba098',
                                        }}
                                    />
                                </div>

                                <div
                                    className="text-xs opacity-70 pt-3 border-t"
                                    style={{ borderColor: 'rgba(222, 185, 146, 0.2)' }}
                                >
                                    Distance: {cameraDistance.toFixed(1)} units
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Simplified Legend */}
                <div
                    className="absolute top-6 backdrop-blur-lg rounded-2xl p-6 transition-all duration-500"
                    style={{
                        right: expandedPanels.analysis ? '21rem' : '5rem', // shifts left when sidebar open
                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                        border: '1px solid rgba(222, 185, 146, 0.2)',
                    }}
                >
                    <button
                        type="button"
                        onClick={() => togglePanel('legend')}
                        className="w-full text-left px-4 py-2 focus:outline-none flex justify-between items-center"
                    >
                        <h4 className="text-lg font-light mb-4" style={{ color: '#1ba098' }}>
                            Legend
                        </h4>
                        <span>{expandedPanels.legend ? '▲' : '▼'}</span>
                    </button>
                    {expandedPanels.legend && (
                        <div className="px-4 py-2 space-y-2 text-sm">
                            <div className="space-y-3 text-sm">
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                    <span>Earth</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                                    <span>Critical Risk</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                                    <span>High Risk</span>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                    <span>Large Objects</span>
                                </div>

                                {hoveredAsteroid && (
                                    <div
                                        className="mt-4 pt-4 border-t"
                                        style={{ borderColor: 'rgba(222, 185, 146, 0.2)' }}
                                    >
                                        <div
                                            className="text-sm font-semibold"
                                            style={{ color: '#1ba098' }}
                                        >
                                            {hoveredAsteroid.name}
                                        </div>
                                        <div className="text-xs opacity-70">
                                            Ring{' '}
                                            {asteroidMeshes.current[hoveredAsteroid.id]
                                                ?.orbitRing! + 1}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Compact Sidebar - NO SCROLLING */}
            <div
                className={`
      h-screen flex flex-col transition-all duration-500 ease-in-out
      absolute right-0 top-0 overflow-hidden
      ${expandedPanels.analysis ? 'w-80' : 'w-12'}
    `}
                style={{
                    backgroundColor: 'rgba(5, 22, 34, 0.95)',
                    borderLeft: '1px solid rgba(222, 185, 146, 0.2)',
                }}
            >
                <button
                    type="button"
                    onClick={() => togglePanel('analysis')}
                    className="w-full text-left px-4 py-2 focus:outline-none flex justify-between items-center"
                >
                    <h2
                        className="text-3xl font-light tracking-wide mb-6"
                        style={{ color: '#1ba098' }}
                    >
                        Analysis
                    </h2>
                    <span>{expandedPanels.analysis ? '◀' : '▶'}</span>
                </button>
                {expandedPanels.analysis && (
                    <div className="px-4 py-2 space-y-2 text-sm">
                        {selectedAsteroid ? (
                            /* SELECTED ASTEROID VIEW - COMPACT, NO SCROLL */
                            <div className="space-y-4 flex-1 flex flex-col">
                                {/* Header */}
                                <div
                                    className="p-4 rounded-2xl flex-shrink-0"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <h3
                                        className="text-lg font-medium mb-2"
                                        style={{ color: '#deb992' }}
                                    >
                                        {selectedAsteroid.name}
                                    </h3>
                                    <div className="flex flex-wrap gap-2 mb-2">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(getRiskLevel(selectedAsteroid))}`}
                                        >
                                            {getRiskLevel(selectedAsteroid)}
                                        </span>
                                        <span
                                            className="px-2 py-1 rounded-full text-xs font-medium"
                                            style={{
                                                backgroundColor: 'rgba(27, 160, 152, 0.2)',
                                                color: '#1ba098',
                                            }}
                                        >
                                            Torino {selectedAsteroid.torino_scale}
                                        </span>
                                    </div>
                                    <a
                                        href={selectedAsteroid.nasa_jpl_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-xs underline opacity-70 hover:opacity-100 transition-opacity"
                                        style={{ color: '#1ba098' }}
                                    >
                                        NASA JPL Data
                                    </a>
                                </div>

                                {/* Properties */}
                                <div
                                    className="p-4 rounded-2xl flex-shrink-0"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <h4 className="font-medium mb-3" style={{ color: '#1ba098' }}>
                                        Properties
                                    </h4>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="opacity-70 text-xs">Diameter</span>
                                            <p className="font-mono" style={{ color: '#deb992' }}>
                                                {formatNumber(
                                                    selectedAsteroid.estimated_diameter_km_max,
                                                )}{' '}
                                                km
                                            </p>
                                        </div>
                                        <div>
                                            <span className="opacity-70 text-xs">Velocity</span>
                                            <p className="font-mono" style={{ color: '#deb992' }}>
                                                {formatNumber(
                                                    selectedAsteroid.relative_velocity_km_s,
                                                )}{' '}
                                                km/s
                                            </p>
                                        </div>
                                        <div>
                                            <span className="opacity-70 text-xs">Distance</span>
                                            <p className="font-mono" style={{ color: '#deb992' }}>
                                                {formatNumber(selectedAsteroid.miss_distance_au)} AU
                                            </p>
                                        </div>
                                        <div>
                                            <span className="opacity-70 text-xs">
                                                Impact Energy
                                            </span>
                                            <p className="font-mono text-red-400">
                                                {formatNumber(
                                                    selectedAsteroid.impact.energy_megatons,
                                                )}{' '}
                                                Mt
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Risk Zones */}
                                <div
                                    className="p-4 rounded-2xl flex-shrink-0"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <h4 className="font-medium mb-3" style={{ color: '#1ba098' }}>
                                        Risk Zones
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {selectedAsteroid.impact.risk_zones.map((zone, index) => (
                                            <span
                                                key={index}
                                                className="px-2 py-1 rounded-full text-xs font-medium bg-red-900 text-red-100"
                                            >
                                                {zone}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                {/* Generate Report Button */}
                                <div
                                    className="p-4 rounded-2xl flex-shrink-0"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <button
                                        type="button"
                                        onClick={generateSingleAsteroidReport}
                                        disabled={isGeneratingReport}
                                        className={`w-full p-3 rounded-xl font-medium transition-all ${
                                            isGeneratingReport
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:scale-105'
                                        }`}
                                        style={{
                                            background: 'linear-gradient(135deg, #1ba098, #0d7377)',
                                            color: '#051622',
                                        }}
                                    >
                                        {isGeneratingReport ? (
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                <span>Analyzing...</span>
                                            </div>
                                        ) : (
                                            'Generate Report'
                                        )}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            /* MAIN MENU VIEW */
                            <div className="space-y-6 flex-1">
                                {/* AI Analysis */}
                                <div
                                    className="p-5 rounded-2xl"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <h4 className="font-medium mb-4" style={{ color: '#1ba098' }}>
                                        AI Analysis
                                    </h4>
                                    <div className="space-y-3 mb-4 text-sm">
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Objects</span>
                                            <span style={{ color: '#1ba098' }}>{maxAsteroids}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="opacity-70">Type</span>
                                            <span style={{ color: '#1ba098' }}>Comprehensive</span>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={generateAIReport}
                                        disabled={isGeneratingReport}
                                        className={`w-full p-4 rounded-xl font-medium transition-all ${
                                            isGeneratingReport
                                                ? 'opacity-50 cursor-not-allowed'
                                                : 'hover:scale-105'
                                        }`}
                                        style={{
                                            background: 'linear-gradient(135deg, #1ba098, #0d7377)',
                                            color: '#051622',
                                        }}
                                    >
                                        {isGeneratingReport ? (
                                            <div className="flex items-center justify-center space-x-3">
                                                <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                                                <span>Analyzing...</span>
                                            </div>
                                        ) : (
                                            'Generate Report'
                                        )}
                                    </button>
                                </div>

                                {/* Ring System */}
                                <div
                                    className="p-5 rounded-2xl"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <h4 className="font-medium mb-4" style={{ color: '#1ba098' }}>
                                        Dynamic Rings
                                    </h4>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between">
                                            <span>Max per Ring</span>
                                            <span style={{ color: '#1ba098' }}>5 Objects</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Ring Spacing</span>
                                            <span style={{ color: '#1ba098' }}>12 Units</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Auto-Creation</span>
                                            <span className="text-green-400">Enabled</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Instructions */}
                                <div
                                    className="p-5 rounded-2xl"
                                    style={{
                                        backgroundColor: 'rgba(27, 160, 152, 0.1)',
                                        border: '1px solid rgba(222, 185, 146, 0.2)',
                                    }}
                                >
                                    <p className="text-sm opacity-70">
                                        Click asteroids to analyze • Drag to navigate • Scroll to
                                        zoom
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
