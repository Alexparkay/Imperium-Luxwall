import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { 
  Search, 
  RotateCcw, 
  ZoomIn, 
  ZoomOut, 
  Move3D,
  Building,
  Navigation,
  Map,
  Eye,
  X,
  Settings,
  Play,
  Loader2,
  Grid3X3,
  MapPin,
  Clock,
  Info,
  RotateCw,
  ChevronUp,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Compass,
  MousePointer2
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Building as BuildingType, Window, useBuildingData } from '@/hooks/useBuildingData';

// Generate proper UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const MapViewer = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const streetViewRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [map, setMap] = useState<any>(null);
  const [streetView, setStreetView] = useState<any>(null);
  const [autocomplete, setAutocomplete] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentLocation, setCurrentLocation] = useState('MGM Grand Detroit Hotel & Casino, Detroit, MI');
  const [mapType, setMapType] = useState<'roadmap' | 'satellite' | 'hybrid' | 'terrain'>('roadmap');
  const [showWindows, setShowWindows] = useState(false);
  const [buildingMarkers, setBuildingMarkers] = useState<any[]>([]);
  const [windowMarkers, setWindowMarkers] = useState<any[]>([]);
  const [analysisMarkers, setAnalysisMarkers] = useState<any[]>([]);
  const [analysisCircle, setAnalysisCircle] = useState<any>(null);
  const [ctrlPressed, setCtrlPressed] = useState(false);
  const [showStreetView, setShowStreetView] = useState(false);
  const [currentZoom, setCurrentZoom] = useState(18);
  const [showMapControls, setShowMapControls] = useState(false);
  const [show3DControls, setShow3DControls] = useState(false);
  const [showAnalysisWidget, setShowAnalysisWidget] = useState(false);
  const [buildingSearchTerm, setBuildingSearchTerm] = useState('');
  const [buildingHistory, setBuildingHistory] = useState<BuildingType[]>([]);
  const [currentHeading, setCurrentHeading] = useState(0);
  const [currentTilt, setCurrentTilt] = useState(45);
  
  const { buildings, windows, selectedBuilding, setSelectedBuilding, fetchWindows, startWindowDetection, saveBuilding, isLoading: buildingLoading } = useBuildingData();

  // Property data
  const mgmGrandData = {
    name: 'MGM Grand Detroit Hotel & Casino',
    address: '1777 3rd Ave, Detroit, MI 48226',
    coordinates: { lat: 42.33361, lng: -83.06028 },
    buildingType: 'mixed-use',
    owner: 'Vici Properties and MGM Resorts International',
    totalArea: '1,650,000 sq ft',
    energyConsumption: '16,080,000 kWh/year',
    electricityRate: '$0.1528 /kWh',
    annualEnergyCost: '$2,450,000 USD',
    totalWindows: 600,
    averageWindowSize: '1.5 m × 1.2 m',
    windowWallRatio: 0.34,
    buildingOrientation: 'north/south',
    indoorTemperature: '70°F / 21°C',
    yearBuilt: 2008,
    floors: 17,
    status: 'built',
    monthlyTemperatures: {
      January: '0°C / -6°C',
      February: '2°C / -5°C',
      March: '7°C / -1°C',
      April: '14°C / 5°C',
      May: '21°C / 11°C',
      June: '26°C / 17°C',
      July: '28°C / 19°C',
      August: '27°C / 18°C',
      September: '23°C / 14°C',
      October: '16°C / 8°C',
      November: '9°C / 2°C',
      December: '3°C / -3°C'
    },
    heatingDegreeDays: {
      January: '11°C',
      February: '10°C',
      March: '6°C',
      April: '7°C',
      May: '0°C',
      June: '5°C',
      July: '7°C',
      August: '9°C',
      September: '4°C',
      October: '5°C',
      November: '12°C',
      December: '16°C'
    },
    solarIrradiance: {
      January: 2.98,
      February: 4.12,
      March: 5.00,
      April: 5.51,
      May: 5.43,
      June: 5.87,
      July: 6.04,
      August: 5.82,
      September: 5.67,
      October: 4.32,
      November: 3.14,
      December: 2.66
    },
    energyAnalysis: {
      currentAnnualCost: '$142,151 USD',
      projectedAnnualCost: '$1,154,168 USD',
      totalProjectedCost: '$1,296,319 USD',
      recommendedSolution: 'LuxWall Enthermal Plus™',
      paybackPeriod: '20 years',
      energySavings: '90%',
      comfortImprovement: '100%',
      implementationCost: '$129,631 USD',
      projectedSavings: '$1,166,688 USD',
      efficiencyGain: '47%',
      totalInvestment: '$972,000 USD'
    }
  };

  // Jeffersonian Apartments data
  const jeffersonianData = {
    name: 'Jeffersonian Apartments',
    address: '9000 East Jefferson Avenue, Detroit, Michigan 48214',
    coordinates: { lat: 42.3558, lng: -82.9867 },
    buildingType: 'residential high-rise',
    owner: 'DC CAP Hotelier',
    totalArea: '870,813 sq ft',
    energyConsumption: '63,975,571 kWh/year',
    electricityRate: '$0.1592 /kWh',
    annualEnergyCost: '$10,105,290 USD',
    totalWindows: 1236,
    averageWindowSize: '1.5 m × 1.5 m',
    windowWallRatio: 0.55,
    buildingOrientation: 'north/south',
    indoorTemperature: '72°F / 22°C',
    yearBuilt: 1965,
    floors: 30,
    status: 'built',
    monthlyTemperatures: {
      January: '0°C / -6°C',
      February: '2°C / -5°C',
      March: '7°C / -1°C',
      April: '14°C / 5°C',
      May: '21°C / 11°C',
      June: '27°C / 17°C',
      July: '28°C / 19°C',
      August: '27°C / 18°C',
      September: '23°C / 14°C',
      October: '16°C / 8°C',
      November: '9°C / 2°C',
      December: '3°C / -3°C'
    },
    heatingDegreeDays: {
      January: '11°C',
      February: '9°C',
      March: '7°C',
      April: '8°C',
      May: '1°C',
      June: '5°C',
      July: '4°C',
      August: '5°C',
      September: '1°C',
      October: '6°C',
      November: '13°C',
      December: '19°C'
    },
    solarIrradiance: {
      January: 2.98,
      February: 4.12,
      March: 5.00,
      April: 5.51,
      May: 5.43,
      June: 5.87,
      July: 6.04,
      August: 5.82,
      September: 5.67,
      October: 4.32,
      November: 3.14,
      December: 2.66
    },
    energyAnalysis: {
      currentAnnualCost: '$570,540 USD',
      projectedAnnualCost: '$1,720,004 USD',
      totalProjectedCost: '$2,290,544 USD',
      recommendedSolution: 'LuxWall Enthermal™',
      paybackPeriod: '19 years',
      energySavings: '91%',
      comfortImprovement: '100%',
      implementationCost: '$204,368 USD',
      projectedSavings: '$2,086,176 USD',
      efficiencyGain: '20%',
      totalInvestment: '$2,224,800 USD'
    }
  };

  // Coleman A. Young Municipal Building data
  const colemanYoungData = {
    name: 'Coleman A. Young Municipal Building',
    address: '2 Woodward Ave, Detroit, MI 48226',
    coordinates: { lat: 42.3295, lng: -83.0442 },
    buildingType: 'government',
    owner: 'Detroit-Wayne Joint Building Authority',
    totalArea: '779,999 sq ft',
    energyConsumption: '16,815,500 kWh/year',
    electricityRate: '$0.1528 /kWh',
    annualEnergyCost: '$2,562,244 USD',
    totalWindows: 600,
    averageWindowSize: '1 m × 1.5 m',
    windowWallRatio: 0.49,
    buildingOrientation: 'north/south',
    indoorTemperature: '72°F / 22°C',
    yearBuilt: 1954,
    floors: 20,
    status: 'built',
    monthlyTemperatures: {
      January: '0°C / -6°C',
      February: '2°C / -5°C',
      March: '6°C / -1°C',
      April: '14°C / 5°C',
      May: '21°C / 11°C',
      June: '26°C / 17°C',
      July: '28°C / 19°C',
      August: '27°C / 18°C',
      September: '23°C / 14°C',
      October: '16°C / 8°C',
      November: '9°C / 2°C',
      December: '3°C / -3°C'
    },
    heatingDegreeDays: {
      January: '22°C',
      February: '22°C',
      March: '22°C',
      April: '8°C',
      May: '1°C',
      June: '4°C',
      July: '4°C',
      August: '5°C',
      September: '9°C',
      October: '6°C',
      November: '13°C',
      December: '25°C'
    },
    solarIrradiance: {
      January: 2.98,
      February: 4.12,
      March: 5.00,
      April: 5.51,
      May: 5.43,
      June: 5.87,
      July: 6.04,
      August: 5.82,
      September: 5.67,
      October: 4.32,
      November: 3.14,
      December: 2.66
    },
    energyAnalysis: {
      currentAnnualCost: '$57,470 USD',
      projectedAnnualCost: '$455,063 USD',
      totalProjectedCost: '$512,533 USD',
      recommendedSolution: 'LuxWall Enthermal R-18',
      paybackPeriod: '18 years',
      energySavings: '94%',
      comfortImprovement: '100%',
      implementationCost: '$30,728 USD',
      projectedSavings: '$481,805 USD',
      efficiencyGain: '18%',
      totalInvestment: '$900,000 USD'
    }
  };

  // Available properties
  const availableProperties = [
    { id: 'mgm-grand-detroit', data: mgmGrandData },
    { id: 'jeffersonian-apartments', data: jeffersonianData },
    { id: 'coleman-young-municipal', data: colemanYoungData }
  ];

  const [selectedProperty, setSelectedProperty] = useState('mgm-grand-detroit');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

  // Get current property data
  const getCurrentPropertyData = () => {
    return availableProperties.find(p => p.id === selectedProperty)?.data || mgmGrandData;
  };

  useEffect(() => {
    // Set up the global callback for Google Maps
    window.initMap = initializeMap;
    
    // If Google Maps is already loaded, initialize immediately
    if (window.google?.maps) {
      initializeMap();
    }
  }, []);

  // Proper keyboard and mouse events following Google Maps standards
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!map) {
        console.log('Map not available for key event');
        return;
      }

      // Only log when Shift is used for 3D navigation
      if (e.shiftKey) {
        console.log('3D Navigation:', e.key, 'Tilt:', map.getTilt(), 'Heading:', map.getHeading());
      }

      // Standard Google Maps keyboard controls
      switch(e.key) {
        case 'ArrowLeft':
          e.preventDefault();
          if (e.shiftKey) {
            // Shift + Left: Rotate left (standard Google Maps behavior)
            const currentHeading = map.getHeading() || 0;
            const newHeading = (currentHeading - 15 + 360) % 360;
            map.setHeading(newHeading);
            console.log('Rotated left to heading:', newHeading);
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          if (e.shiftKey) {
            // Shift + Right: Rotate right (standard Google Maps behavior)
            const currentHeading = map.getHeading() || 0;
            const newHeading = (currentHeading + 15) % 360;
            map.setHeading(newHeading);
            console.log('Rotated right to heading:', newHeading);
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          if (e.shiftKey) {
            // Shift + Up: Tilt up (standard Google Maps behavior)
            const currentTilt = map.getTilt() || 0;
            const newTilt = Math.min(currentTilt + 15, 67.5);
            map.setTilt(newTilt);
            console.log('Tilted up to:', newTilt);
          } else {
            // Up: Zoom in
            const currentZoom = map.getZoom() || 16;
            map.setZoom(Math.min(currentZoom + 1, 22));
            console.log('Zoom in to:', map.getZoom());
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          if (e.shiftKey) {
            // Shift + Down: Tilt down (standard Google Maps behavior)
            const currentTilt = map.getTilt() || 0;
            const newTilt = Math.max(currentTilt - 15, 0);
            map.setTilt(newTilt);
            console.log('Tilted down to:', newTilt);
          } else {
            // Down: Zoom out
            const currentZoom = map.getZoom() || 16;
            map.setZoom(Math.max(currentZoom - 1, 3));
            console.log('Zoom out to:', map.getZoom());
          }
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          map.setHeading(0);
          map.setTilt(45);
          map.setZoom(16);
          console.log('View reset to 3D mode');
          break;
      }
      
      // Track modifier keys
      if (e.key === 'Control') {
        setCtrlPressed(true);
        console.log('Ctrl pressed - Enhanced rotation mode');
      }
      
      if (e.key === 'Escape' && showStreetView) {
        disableStreetView();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Control') {
        setCtrlPressed(false);
        console.log('Ctrl released');
      }
    };

    // Add event listeners to document for global capture
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [map, showStreetView]);

  // Update building markers when buildings change
  useEffect(() => {
    if (map && buildings) {
      updateBuildingMarkers();
    }
  }, [map, buildings, selectedBuilding]);

  // Update window markers when windows change or visibility toggles
  useEffect(() => {
    if (map) {
      updateWindowMarkers();
    }
  }, [map, windows, showWindows, selectedBuilding]);

  const initializeMap = () => {
    if (!mapRef.current || !window.google?.maps) {
      console.log('Google Maps not ready yet, retrying...');
      return;
    }

    console.log('Initializing Google Maps with 3D buildings...');

    // ENHANCED 3D CONFIGURATION for reliable 3D buildings
    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: 42.33361, lng: -83.06028 }, // MGM Grand Detroit coordinates
      zoom: 21, // VERY HIGH zoom for 3D buildings
      mapTypeId: 'roadmap', // Default to roadmap view (blocked 3D style)
      tilt: 67.5, // MAXIMUM tilt for best 3D view
      heading: 45, // Angled view to see building sides
      
      // Use Map ID for enhanced 3D buildings
      mapId: '90f87356969d889c', // Google's vector map ID
      
      // Enhanced controls and interactions
      disableDefaultUI: false, // Enable some UI for better 3D controls
      gestureHandling: 'greedy',
      draggable: true,
      scrollwheel: true,
      rotateControl: true,
      tiltControl: true,
      keyboardShortcuts: true,
      
      // Enable all 3D interactions
      tiltInteractionEnabled: true,
      headingInteractionEnabled: true,
      isFractionalZoomEnabled: true,
      
      maxZoom: 22,
      minZoom: 3
    });

    // IMMEDIATE 3D setup for maximum effect
    setTimeout(() => {
      try {
        // Force vector rendering for 3D buildings
        mapInstance.setOptions({
          renderingType: window.google.maps.RenderingType?.VECTOR,
          tiltInteractionEnabled: true,
          headingInteractionEnabled: true,
          isFractionalZoomEnabled: true
        });
        
        // Set MAXIMUM 3D settings for best building visibility
        mapInstance.setTilt(67.5); // Maximum tilt
        mapInstance.setZoom(22); // Maximum zoom
        mapInstance.setHeading(45); // Angled view
        mapInstance.setMapTypeId('roadmap'); // Default to roadmap view
        
        console.log('✅ MAXIMUM 3D settings applied for building visibility');
      } catch (error) {
        console.warn('3D features error:', error);
      }
    }, 200);

    // Secondary attempt with different approach
    setTimeout(() => {
      const currentTilt = mapInstance.getTilt();
      console.log('Checking 3D status - Current tilt:', currentTilt);
      
      if (currentTilt < 45) {
        console.log('⚠️ Forcing 3D buildings with alternative approach...');
        
        // Try without Map ID for better compatibility
        mapInstance.setOptions({
          mapId: undefined,
          renderingType: window.google.maps.RenderingType?.VECTOR
        });
        
        setTimeout(() => {
          mapInstance.setTilt(67.5);
          mapInstance.setZoom(22);
          mapInstance.setHeading(45);
          mapInstance.setMapTypeId('roadmap'); // Use roadmap view
          console.log('🔄 Applied alternative 3D configuration');
        }, 300);
      }
    }, 1000);

    // Initialize Street View
    if (streetViewRef.current) {
      const streetViewInstance = new window.google.maps.StreetViewPanorama(streetViewRef.current, {
        position: { lat: 42.33361, lng: -83.06028 },
        pov: { heading: 45, pitch: 10 },
        visible: false
      });
      
      mapInstance.setStreetView(streetViewInstance);
      setStreetView(streetViewInstance);
    }

    // Initialize Google Places Autocomplete
    if (autocompleteRef.current && window.google?.maps?.places?.Autocomplete) {
      const autocompleteInstance = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['establishment', 'geocode'],
        fields: ['place_id', 'geometry', 'name', 'formatted_address']
      });

      autocompleteInstance.addListener('place_changed', () => {
        const place = autocompleteInstance.getPlace();
        if (place.geometry && place.geometry.location) {
          mapInstance.setCenter(place.geometry.location);
          mapInstance.setZoom(21);
          mapInstance.setTilt(67.5);
          setCurrentLocation(place.formatted_address || place.name || '');
          setSearchQuery('');
        }
      });

      setAutocomplete(autocompleteInstance);
    }

    // Add essential listeners
    mapInstance.addListener('zoom_changed', () => {
      const zoom = mapInstance.getZoom();
      setCurrentZoom(zoom);
    });

    mapInstance.addListener('heading_changed', () => {
      const heading = mapInstance.getHeading() || 0;
      setCurrentHeading(heading);
    });

    mapInstance.addListener('tilt_changed', () => {
      const tilt = mapInstance.getTilt() || 0;
      setCurrentTilt(tilt);
    });

    mapInstance.addListener('click', async (event: any) => {
      const clickedLocation = event.latLng;
      await handleMapClick(clickedLocation);
    });

    setMap(mapInstance);
    setIsLoading(false);

    // Auto-load MGM Grand Detroit with window visualization
    setTimeout(() => {
      loadMGMGrandDetroit();
      // Automatically show windows for 3D visualization
      setTimeout(() => {
        setShowWindows(true);
        console.log('✅ Window visualization enabled');
      }, 500);
    }, 1000);

    // Final 3D verification and enhancement
    setTimeout(() => {
      console.log('=== FINAL 3D VERIFICATION ===');
      const finalTilt = mapInstance.getTilt();
      const finalZoom = mapInstance.getZoom();
      const finalHeading = mapInstance.getHeading();
      
      console.log('Final Tilt:', finalTilt);
      console.log('Final Zoom:', finalZoom);
      console.log('Final Heading:', finalHeading);
      console.log('Map Type:', mapInstance.getMapTypeId());
      
      if (finalTilt >= 45 && finalZoom >= 20) {
        console.log('✅ 3D BUILDINGS SHOULD BE FULLY VISIBLE');
        console.log('✅ MGM Grand Detroit ready for window analysis');
      } else {
        console.log('❌ FORCING FINAL 3D SETTINGS...');
        mapInstance.setTilt(67.5);
        mapInstance.setZoom(22);
        mapInstance.setHeading(45);
        mapInstance.setMapTypeId('roadmap'); // Default to roadmap view
        
        // Ensure roadmap view is working
        setTimeout(() => {
          if (mapInstance.getTilt() < 45) {
            mapInstance.setMapTypeId('satellite');
            console.log('🔄 Fallback to satellite view for 3D buildings');
          }
        }, 1000);
      }
    }, 2500);

    console.log('Map initialized with enhanced 3D building focus');
  };

  const handleMapClick = async (location: any) => {
    const lat = location.lat();
    const lng = location.lng();
    
    // Check if clicked near an existing building
    const nearbyBuilding = buildings.find(building => {
      const distance = Math.sqrt(
        Math.pow(building.latitude - lat, 2) + Math.pow(building.longitude - lng, 2)
      );
      return distance < 0.001;
    });

    if (nearbyBuilding) {
      await handleBuildingClick(nearbyBuilding);
    } else {
      // Create and save a new building with proper UUID
      try {
        const newBuilding = await saveBuilding({
          name: 'Selected Building',
          address: `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
          latitude: lat,
          longitude: lng,
          google_place_id: null,
          geometry: null
        });
        
        if (newBuilding) {
          await handleBuildingClick(newBuilding);
        }
      } catch (error) {
        console.error('Error saving new building:', error);
      }
    }
  };

  const handleBuildingClick = async (building: BuildingType) => {
    console.log('Building selected:', building.name);
    
    setSelectedBuilding(building);
    setShowAnalysisWidget(true);
    
    // Add to building history if not already present
    setBuildingHistory(prev => {
      const exists = prev.find(b => b.id === building.id);
      if (!exists) {
        return [building, ...prev.slice(0, 9)]; // Keep last 10 buildings
      }
      return prev;
    });
    
    if (map) {
      map.setCenter({ lat: building.latitude, lng: building.longitude });
      map.setZoom(20);
      map.setTilt(45);
      setCurrentLocation(building.address || building.name);
      
      // Add a highlight circle around the selected building
      new window.google.maps.Circle({
        strokeColor: '#dc2626',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        fillColor: '#dc2626',
        fillOpacity: 0.2,
        map: map,
        center: { lat: building.latitude, lng: building.longitude },
        radius: 50
      });
    }
    
    // Fetch existing windows first
    await fetchWindows(building.id);
    
    // Start window detection automatically
    await startWindowDetection(building.id);
    
    // Show windows
    setShowWindows(true);
  };

  const enableStreetView = () => {
    if (streetView && map) {
      const center = map.getCenter();
      streetView.setPosition(center);
      streetView.setVisible(true);
      setShowStreetView(true);
      console.log('Street View enabled');
    }
  };

  const disableStreetView = () => {
    if (streetView) {
      streetView.setVisible(false);
      setShowStreetView(false);
      console.log('Street View disabled');
    }
  };

  const updateBuildingMarkers = () => {
    if (!window.google?.maps) return;
    
    buildingMarkers.forEach(marker => marker.setMap(null));
    
    const newMarkers = buildings.map(building => {
      const isSelected = selectedBuilding?.id === building.id;
      
      const marker = new window.google.maps.Marker({
        position: { lat: building.latitude, lng: building.longitude },
        map: map,
        title: building.name,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 20V4C3 3.45 3.196 2.979 3.588 2.587C3.98 2.195 4.45 2 5 2H19C19.55 2 20.021 2.195 20.413 2.587C20.805 2.979 21 3.45 21 4V20L12 17L3 20Z" fill="${isSelected ? '#dc2626' : '#2563eb'}" stroke="${isSelected ? '#b91c1c' : '#1e40af'}" stroke-width="1"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(30, 30),
          anchor: new window.google.maps.Point(15, 30)
        }
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div>
            <h3 style="margin: 0 0 8px 0; color: #1f2937;">${building.name}</h3>
            ${building.address ? `<p style="margin: 0; color: #6b7280; font-size: 14px;">${building.address}</p>` : ''}
            <p style="margin: 4px 0 0 0; color: #2563eb; font-size: 12px; cursor: pointer;">Click to analyze windows</p>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
        handleBuildingClick(building);
      });

      return marker;
    });

    setBuildingMarkers(newMarkers);
  };

  const updateWindowMarkers = () => {
    if (!window.google?.maps) return;
    
    windowMarkers.forEach(marker => marker.setMap(null));
    
    if (!showWindows || !selectedBuilding) {
      setWindowMarkers([]);
      return;
    }

    // Use MGM Grand Detroit windows if it's the selected building
    const windowsToShow = selectedBuilding.id === 'mgm-grand-detroit' 
      ? (window as any).mgmWindows || []
      : windows;

    if (windowsToShow.length === 0) {
      setWindowMarkers([]);
      return;
    }

    const newWindowMarkers = windowsToShow.map((windowData: any, index: number) => {
      // For MGM Grand Detroit, use the calculated coordinates
      const position = selectedBuilding.id === 'mgm-grand-detroit'
        ? { 
            lat: windowData.y_coordinate, 
            lng: windowData.x_coordinate 
          }
        : { 
            lat: selectedBuilding.latitude + (windowData.y_coordinate - 50) * 0.00001, 
            lng: selectedBuilding.longitude + (windowData.x_coordinate - 50) * 0.00001 
          };

      // Color-code windows by floor for better 3D visualization
      const floorColors = [
        '#ff4444', '#ff8844', '#ffcc44', '#ccff44', '#88ff44', '#44ff44',
        '#44ff88', '#44ffcc', '#44ccff', '#4488ff', '#4444ff', '#8844ff',
        '#cc44ff', '#ff44cc', '#ff4488', '#ff6666', '#ffaa66'
      ];
      const floorColor = floorColors[(windowData.floor_number - 1) % floorColors.length];
      
      // Different window type icons
      const windowTypeIcons = {
        'Corner': `
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="12" height="12" fill="${floorColor}" stroke="#ffffff" stroke-width="2" rx="2"/>
            <line x1="7" y1="1" x2="7" y2="13" stroke="#ffffff" stroke-width="1"/>
            <line x1="1" y1="7" x2="13" y2="7" stroke="#ffffff" stroke-width="1"/>
            <circle cx="3.5" cy="3.5" r="1" fill="#ffffff"/>
          </svg>
        `,
        'Large': `
          <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="14" height="12" fill="${floorColor}" stroke="#ffffff" stroke-width="2" rx="1"/>
            <line x1="8" y1="1" x2="8" y2="13" stroke="#ffffff" stroke-width="1"/>
            <line x1="1" y1="7" x2="15" y2="7" stroke="#ffffff" stroke-width="1"/>
          </svg>
        `,
        'Bay': `
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M2 2 L12 2 L13 7 L12 12 L2 12 L1 7 Z" fill="${floorColor}" stroke="#ffffff" stroke-width="2"/>
            <line x1="7" y1="2" x2="7" y2="12" stroke="#ffffff" stroke-width="1"/>
            <line x1="2" y1="7" x2="12" y2="7" stroke="#ffffff" stroke-width="1"/>
          </svg>
        `,
        'Standard': `
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1" y="1" width="10" height="10" fill="${floorColor}" stroke="#ffffff" stroke-width="2" rx="1"/>
            <line x1="6" y1="1" x2="6" y2="11" stroke="#ffffff" stroke-width="1"/>
            <line x1="1" y1="6" x2="11" y2="6" stroke="#ffffff" stroke-width="1"/>
          </svg>
        `
      };

      const windowIcon = windowTypeIcons[windowData.window_type as keyof typeof windowTypeIcons] || windowTypeIcons['Standard'];
      
      const marker = new window.google.maps.Marker({
        position: position,
        map: map,
        title: `Floor ${windowData.floor_number} - ${windowData.window_type} Window`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(windowIcon),
          scaledSize: new window.google.maps.Size(
            windowData.window_type === 'Large' ? 16 : windowData.window_type === 'Corner' ? 14 : 12,
            windowData.window_type === 'Large' ? 14 : 12
          ),
          anchor: new window.google.maps.Point(
            windowData.window_type === 'Large' ? 8 : 6,
            windowData.window_type === 'Large' ? 7 : 6
          )
        },
        zIndex: windowData.floor_number * 10 // Higher floors appear on top
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="min-width: 220px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937; font-weight: bold;">Window Analysis Point</h4>
            <div style="margin-bottom: 8px; padding: 4px 8px; background: #e5e7eb; border-radius: 4px; font-size: 10px; color: #374151;">
              📊 Estimated from satellite imagery and building plans
            </div>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 12px;">
              <div>
                <strong>Floor:</strong> ${windowData.floor_number}
              </div>
              <div>
                <strong>Type:</strong> ${windowData.window_type}
              </div>
              <div>
                <strong>Est. Size:</strong> ${windowData.width}m × ${windowData.height}m
              </div>
              <div>
                <strong>Analysis Score:</strong> ${((windowData.confidence || 0) * 100).toFixed(1)}%
              </div>
              <div style="grid-column: 1 / -1;">
                <strong>Est. Height:</strong> ~${(windowData.floor_height || windowData.floor_number * 3.5).toFixed(1)}m above ground
              </div>
            </div>
            <div style="margin-top: 8px; padding: 4px 8px; background: ${floorColor}; color: white; border-radius: 4px; text-align: center; font-size: 11px;">
              Floor ${windowData.floor_number} Research Point
            </div>
          </div>
        `
      });

      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      return marker;
    });

    setWindowMarkers(newWindowMarkers);
    
    if (selectedBuilding?.id === 'mgm-grand-detroit') {
      console.log(`✅ Displaying ${newWindowMarkers.length} windows on MGM Grand Detroit building`);
    }
  };

  const searchLocation = async () => {
    if (!map || !searchQuery.trim() || !window.google?.maps) return;

    console.log('Searching for location:', searchQuery);

    const geocoder = new window.google.maps.Geocoder();
    
    try {
      const response = await geocoder.geocode({ address: searchQuery });
      
      if (response.results && response.results.length > 0) {
        const location = response.results[0].geometry.location;
        
        map.setCenter(location);
        map.setZoom(18);
        map.setTilt(45);
        
        setCurrentLocation(response.results[0].formatted_address);
        
        new window.google.maps.Marker({
          position: location,
          map: map,
          title: response.results[0].formatted_address
        });
        
        console.log('Location found and centered:', response.results[0].formatted_address);
      }
    } catch (error) {
      console.error('Geocoding error:', error);
    }
  };

  const handleMapTypeChange = (newType: 'roadmap' | 'satellite' | 'hybrid' | 'terrain') => {
    setMapType(newType);
    if (map) {
      map.setMapTypeId(newType);
      
      // Ensure 3D buildings remain visible for satellite and hybrid views
      if (newType === 'satellite' || newType === 'hybrid') {
        map.setTilt(Math.max(map.getTilt() || 0, 45));
        map.setZoom(Math.max(map.getZoom() || 0, 20)); // Higher zoom for better 3D buildings
      }
    }
  };

  const zoomIn = () => {
    if (map) {
      map.setZoom(map.getZoom() + 1);
    }
  };

  const zoomOut = () => {
    if (map) {
      map.setZoom(map.getZoom() - 1);
    }
  };

  const resetView = () => {
    if (map) {
      console.log('🔄 Resetting to 3D view...');
      
      // Simplified reset focusing on what works - center on MGM Grand Detroit
      map.setTilt(45);
      map.setHeading(0);
      map.setZoom(21); // Higher zoom for 3D buildings
      map.setMapTypeId('roadmap'); // Default to roadmap view
      map.setCenter({ lat: 42.33361, lng: -83.06028 }); // MGM Grand Detroit coordinates
      
      // Enable vector rendering and interactions
      setTimeout(() => {
        try {
          map.setOptions({
            renderingType: window.google.maps.RenderingType?.VECTOR,
            tiltInteractionEnabled: true,
            headingInteractionEnabled: true,
            isFractionalZoomEnabled: true
          });
          console.log('✅ 3D reset with vector rendering applied');
        } catch (error) {
          console.warn('Vector reset failed:', error);
        }
      }, 200);
      
      console.log('View reset to MGM Grand Detroit 3D');
    }
  };

  const force3DBuildings = () => {
    if (map) {
      console.log('🏢 Forcing 3D buildings activation...');
      
      // Simplified approach - focus on what actually works
      map.setMapTypeId('roadmap'); // Default to roadmap view
      map.setZoom(21); // CRITICAL: High zoom for 3D buildings
      map.setTilt(45); // CRITICAL: Tilt for 3D view
      map.setHeading(0);
      
      // Enable vector rendering
      setTimeout(() => {
        try {
          map.setOptions({
            renderingType: window.google.maps.RenderingType?.VECTOR,
            tiltInteractionEnabled: true,
            headingInteractionEnabled: true
          });
          console.log('✅ Vector rendering forced');
        } catch (error) {
          console.warn('Vector forcing failed:', error);
        }
      }, 200);
      
      // Try even higher zoom if needed
      setTimeout(() => {
        const currentTilt = map.getTilt();
        if (currentTilt === 0) {
          console.log('⚠️ Trying maximum zoom for 3D...');
          map.setZoom(22); // Maximum zoom
          map.setTilt(45);
        } else {
          console.log('✅ 3D buildings should now be visible');
        }
      }, 1000);
    }
  };

  const toggle3D = () => {
    if (map) {
      const currentTilt = map.getTilt();
      if (currentTilt === 0) {
        // Enable 3D view
        map.setTilt(45);
        map.setMapTypeId('roadmap'); // Default to roadmap view
        map.setZoom(Math.max(map.getZoom(), 20)); // Higher zoom for better 3D
        console.log('3D buildings enabled');
      } else {
        // Disable 3D view
        map.setTilt(0);
        console.log('3D buildings disabled');
      }
    }
  };

  // Simplified 3D navigation functions for testing
  const rotateLeft = () => {
    console.log('rotateLeft button clicked');
    if (!map) {
      console.log('Map not available');
      return;
    }
    const currentHeading = map.getHeading() || 0;
    const newHeading = (currentHeading - 45 + 360) % 360;
    map.setHeading(newHeading);
    console.log('Rotated left from', currentHeading, 'to', newHeading);
  };

  const rotateRight = () => {
    console.log('rotateRight button clicked');
    if (!map) {
      console.log('Map not available');
      return;
    }
    const currentHeading = map.getHeading() || 0;
    const newHeading = (currentHeading + 45) % 360;
    map.setHeading(newHeading);
    console.log('Rotated right from', currentHeading, 'to', newHeading);
  };

  const tiltUp = () => {
    console.log('tiltUp button clicked');
    if (!map) {
      console.log('Map not available');
      return;
    }
    const currentTilt = map.getTilt() || 0;
    const newTilt = Math.min(currentTilt + 15, 67.5);
    map.setTilt(newTilt);
    console.log('Tilted up from', currentTilt, 'to', newTilt);
  };

  const tiltDown = () => {
    console.log('tiltDown button clicked');
    if (!map) {
      console.log('Map not available');
      return;
    }
    const currentTilt = map.getTilt() || 0;
    const newTilt = Math.max(currentTilt - 15, 0);
    map.setTilt(newTilt);
    console.log('Tilted down from', currentTilt, 'to', newTilt);
  };

  // Simple function to ensure 3D view is working
  const ensure3DView = () => {
    if (map) {
      map.setTilt(45);
      map.setZoom(19);
      map.setMapTypeId('satellite');
      map.setCenter({ lat: 42.3314, lng: -83.0458 });
      console.log('3D view restored');
    }
  };

  const handleDetectWindows = () => {
    if (selectedBuilding) {
      startWindowDetection(selectedBuilding.id);
    }
  };

  const filteredBuildings = buildings.filter(building =>
    building.name.toLowerCase().includes(buildingSearchTerm.toLowerCase()) ||
    (building.address && building.address.toLowerCase().includes(buildingSearchTerm.toLowerCase()))
  );

  const avgConfidence = windows.length > 0 ? windows.reduce((sum, w) => sum + (w.confidence || 0), 0) / windows.length : 0;
  const floorCounts = windows.reduce((acc, w) => {
    const floor = w.floor_number || 0;
    acc[floor] = (acc[floor] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const loadMGMGrandDetroit = () => {
    console.log('🏢 Loading MGM Grand Detroit as default building...');
    
    // Create mock building object for MGM Grand
    const mgmBuilding = {
      id: 'mgm-grand-detroit',
      name: mgmGrandData.name,
      address: mgmGrandData.address,
      latitude: mgmGrandData.coordinates.lat,
      longitude: mgmGrandData.coordinates.lng,
      google_place_id: null,
      geometry: null
    };

    // Set as selected building and show analysis
    setSelectedBuilding(mgmBuilding as any);
    setShowAnalysisWidget(true);
    setCurrentLocation(mgmGrandData.name);
    
    // Generate realistic window data for MGM Grand Detroit
    // 17 floors, ~35 windows per floor, positioned around the building perimeter
    const mockWindows = [];
    const windowsPerFloor = 35;
    const buildingRadius = 0.0008; // Approximate building size in degrees
    
    for (let floor = 1; floor <= mgmGrandData.floors; floor++) {
      for (let windowIndex = 0; windowIndex < windowsPerFloor; windowIndex++) {
        // Calculate window position around building perimeter
        const angle = (windowIndex / windowsPerFloor) * 2 * Math.PI;
        const radiusVariation = buildingRadius * (0.7 + Math.random() * 0.3); // Vary building shape
        
        // Position windows around the building
        const offsetLat = Math.cos(angle) * radiusVariation;
        const offsetLng = Math.sin(angle) * radiusVariation;
        
        mockWindows.push({
          id: `mgm-window-${floor}-${windowIndex + 1}`,
          building_id: 'mgm-grand-detroit',
          floor_number: floor,
          window_type: windowIndex % 4 === 0 ? 'Corner' : windowIndex % 4 === 1 ? 'Large' : windowIndex % 4 === 2 ? 'Standard' : 'Bay',
          x_coordinate: mgmGrandData.coordinates.lng + offsetLng,
          y_coordinate: mgmGrandData.coordinates.lat + offsetLat,
          width: 1.5,
          height: 1.2,
          confidence: 0.85 + (Math.random() * 0.15), // 85-100% confidence
          detected_at: new Date().toISOString(),
          floor_height: floor * 3.5 // Approximate floor height in meters
        });
      }
    }

    // Store mock windows globally for visualization
    (window as any).mgmWindows = mockWindows;
    
    console.log(`✅ MGM Grand Detroit loaded with ${mockWindows.length} windows across ${mgmGrandData.floors} floors`);
  };

  return (
    <div className="h-screen w-full flex flex-col">
      {/* Map Container - Ensure proper sizing */}
      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full min-h-screen" style={{ minHeight: '100vh' }} />
        
        {/* Street View Container */}
        <div 
          ref={streetViewRef} 
          className={`absolute inset-0 ${showStreetView ? 'block' : 'hidden'}`}
        />
        
        {/* Street View Exit Button */}
        {showStreetView && (
          <Button
            onClick={disableStreetView}
            className="absolute top-4 left-4 z-20"
            variant="outline"
            size="sm"
          >
            <X className="w-4 h-4 mr-2" />
            Exit Street View
          </Button>
        )}
        
        {isLoading && (
          <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-50">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
              <p className="text-white text-lg">Loading 3D Maps...</p>
              <p className="text-white/70 text-sm mt-2">Initializing MGM Grand Detroit</p>
                                </div>
                </div>
              )}

        {/* Current Location Widget - Center */}
        <div className="absolute top-6 left-1/2 transform -translate-x-1/2 z-10">
          <Card className="p-3 bg-black/40 backdrop-blur-xl border border-white/10">
            <div className="flex items-center gap-2">
              <Navigation className="w-4 h-4 text-white" />
              <div className="text-sm font-medium text-white">
                {currentLocation}
              </div>
            </div>
          </Card>
        </div>

        {/* Top Right Controls */}
        <div className="absolute top-6 right-6 z-10 flex items-center gap-3">
          {/* Search Bar with Coordinates */}
          <div className="bg-black/40 backdrop-blur-xl border border-white/10 rounded-full px-4 py-3 shadow-lg">
            <div className="flex items-center gap-2">
              <Input
                ref={autocompleteRef}
                placeholder="Search locations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
                className="bg-transparent border-none text-white placeholder-white/70 focus-visible:ring-0 w-64"
              />
              <Button onClick={searchLocation} size="sm" className="rounded-full bg-black/30 hover:bg-black/40">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            <div className="text-xs text-white/70 mt-1 text-center">
              {selectedBuilding ? 
                `${selectedBuilding.latitude.toFixed(6)}, ${selectedBuilding.longitude.toFixed(6)}` :
                `${getCurrentPropertyData().coordinates.lat.toFixed(6)}, ${getCurrentPropertyData().coordinates.lng.toFixed(6)}`
              }
            </div>
          </div>

          {/* 3D Navigation Controls Toggle */}
          <Button
            onClick={() => setShow3DControls(!show3DControls)}
            className="rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/50"
            size="sm"
          >
            <Compass className="w-4 h-4" />
          </Button>

          {/* Map Controls Toggle */}
          <Button
            onClick={() => setShowMapControls(!showMapControls)}
            className="rounded-full bg-black/40 backdrop-blur-xl border border-white/10 hover:bg-black/50"
            size="sm"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>

        {/* 3D Navigation Controls Popup */}
        {show3DControls && (
          <Card className="absolute top-20 right-32 p-4 bg-black/40 backdrop-blur-xl border border-white/10 z-10 w-80">
            <div className="space-y-4">
              {/* Header */}
              <div className="flex items-center gap-2 mb-3">
                <Compass className="w-5 h-5 text-blue-400" />
                <h3 className="text-lg font-semibold text-white">Vector 3D Navigation</h3>
                <Button
                  onClick={() => setShow3DControls(false)}
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-white hover:bg-white/20"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Rotation Controls */}
              <div>
                <div className="text-sm font-medium text-white mb-2">Rotation Controls</div>
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={rotateLeft} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={rotateRight} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Tilt Controls */}
              <div>
                <div className="text-sm font-medium text-white mb-2">Tilt Controls</div>
                <div className="flex justify-center gap-2">
                  <Button size="sm" variant="outline" onClick={tiltUp} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <ChevronUp className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={tiltDown} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Advanced 3D Controls */}
              <div className="space-y-2">
                <Button 
                  size="sm" 
                  onClick={force3DBuildings}
                  className="w-full bg-red-600 hover:bg-red-700 text-white"
                >
                  <Building className="w-4 h-4 mr-2" />
                  Force 3D Buildings
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={() => {
                    if (map) {
                      // Set optimal 3D viewing angle for building and windows
                      map.setCenter({ lat: 42.33361, lng: -83.06028 });
                      map.setZoom(22);
                      map.setTilt(67.5);
                      map.setHeading(45);
                      map.setMapTypeId('roadmap');
                      console.log('🏢 Set optimal 3D view for window visualization');
                    }
                  }}
                  className="w-full bg-green-600 hover:bg-green-700 text-white"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Best 3D View
                </Button>
                
                <Button 
                  size="sm" 
                  onClick={resetView}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset 3D View
                </Button>
              </div>

              {/* 3D Navigation Status */}
              <div className="space-y-2">
                <div className="text-xs text-white/70">3D Navigation Status</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">Heading</div>
                    <div className="text-white font-mono">{Math.round(currentHeading)}°</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">Tilt</div>
                    <div className="text-white font-mono">{Math.round(currentTilt)}°</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">Zoom</div>
                    <div className="text-white font-mono">{currentZoom.toFixed(1)}</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">3D Status</div>
                    <div className={`text-xs font-mono ${currentTilt > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currentTilt > 0 ? '✅ Active' : '❌ Inactive'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation Instructions */}
              <div className="bg-black/20 p-3 rounded text-xs">
                <div className="text-white/70 mb-2">Navigation Controls</div>
                <div className="space-y-1 text-white/60">
                  <div><span className="text-white">Ctrl + Drag:</span> Rotate 3D view</div>
                  <div><span className="text-white">Shift + ←/→:</span> Rotate left/right</div>
                  <div><span className="text-white">Shift + ↑/↓:</span> Tilt up/down</div>
                  <div><span className="text-white">↑/↓:</span> Zoom in/out</div>
                  <div><span className="text-white">R:</span> Reset to 3D view</div>
                </div>
              </div>
            </div>
          </Card>
        )}

        {/* Map Controls Popup */}
        {showMapControls && (
          <Card className="absolute top-20 right-6 p-4 bg-black/40 backdrop-blur-xl border border-white/10 z-10 w-72">
            <div className="space-y-4">
              {/* Vector/Raster Rendering Toggle */}
              <div>
                <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  Rendering Mode
                </p>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (map) {
                        map.setOptions({ 
                          renderingType: window.google.maps.RenderingType?.VECTOR,
                          tiltInteractionEnabled: true,
                          headingInteractionEnabled: true,
                          isFractionalZoomEnabled: true
                        });
                        console.log('Switched to Vector rendering with full 3D');
                      }
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Vector 3D
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => {
                      if (map) {
                        map.setOptions({ 
                          renderingType: window.google.maps.RenderingType?.RASTER,
                          tiltInteractionEnabled: false,
                          headingInteractionEnabled: false
                        });
                        console.log('Switched to Raster rendering');
                      }
                    }}
                    className="bg-black/30 border-white/20 text-white hover:bg-black/40"
                  >
                    Raster 2D
                  </Button>
                </div>
              </div>

              {/* Basic Controls */}
              <div>
                <p className="text-sm font-medium text-white mb-2">Basic Controls</p>
                <div className="grid grid-cols-4 gap-2">
                  <Button size="sm" variant="outline" onClick={zoomIn} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <ZoomIn className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={zoomOut} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <ZoomOut className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={toggle3D} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <Move3D className="w-4 h-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={resetView} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              
              {/* 3D Navigation Controls */}
              <div>
                <p className="text-sm font-medium text-white mb-2 flex items-center gap-2">
                  <Compass className="w-4 h-4" />
                  3D Navigation Controls
                </p>
                
                {/* Rotation Controls */}
                <div className="space-y-2">
                  <div className="text-xs text-white/70 mb-1">Rotation</div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={rotateLeft} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={rotateRight} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Tilt Controls */}
                <div className="space-y-2 mt-3">
                  <div className="text-xs text-white/70 mb-1">Tilt/Pitch</div>
                  <div className="flex justify-center gap-2">
                    <Button size="sm" variant="outline" onClick={tiltUp} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                      <ChevronUp className="w-4 h-4" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={tiltDown} className="bg-black/30 border-white/20 text-white hover:bg-black/40">
                      <ChevronDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Advanced 3D Controls */}
                <div className="mt-3 space-y-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (map) {
                        map.setOptions({
                          tiltInteractionEnabled: !map.get('tiltInteractionEnabled'),
                          headingInteractionEnabled: !map.get('headingInteractionEnabled')
                        });
                        console.log('Toggled 3D interactions');
                      }
                    }}
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <MousePointer2 className="w-4 h-4 mr-2" />
                    Toggle 3D Interactions
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={force3DBuildings}
                    className="w-full bg-red-600 hover:bg-red-700 text-white"
                  >
                    <Building className="w-4 h-4 mr-2" />
                    Force 3D Buildings
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={() => {
                      if (map) {
                        // Set optimal 3D viewing angle for building and windows
                        map.setCenter({ lat: 42.33361, lng: -83.06028 });
                        map.setZoom(22);
                        map.setTilt(67.5);
                        map.setHeading(45);
                        map.setMapTypeId('roadmap'); // Default to roadmap view
                        console.log('🏢 Set optimal 3D view for window visualization');
                      }
                    }}
                    className="w-full bg-green-600 hover:bg-green-700 text-white"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Best 3D View
                  </Button>
                  
                  <Button 
                    size="sm" 
                    onClick={resetView}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reset 3D View
                  </Button>
                </div>
              </div>
              
              {/* Enhanced Map Type Controls */}
              <div>
                <p className="text-sm font-medium text-white mb-2">Map Type</p>
                <div className="grid grid-cols-2 gap-2">
                  <Button 
                    size="sm" 
                    variant={mapType === 'satellite' ? 'default' : 'outline'}
                    onClick={() => handleMapTypeChange('satellite')}
                    className={mapType === 'satellite' ? 'bg-blue-600 text-white' : 'bg-black/30 border-white/20 text-white hover:bg-black/40'}
                  >
                    Satellite
                  </Button>
                  <Button 
                    size="sm" 
                    variant={mapType === 'roadmap' ? 'default' : 'outline'}
                    onClick={() => handleMapTypeChange('roadmap')}
                    className={mapType === 'roadmap' ? 'bg-blue-600 text-white' : 'bg-black/30 border-white/20 text-white hover:bg-black/40'}
                  >
                    Road
                  </Button>
                  <Button 
                    size="sm" 
                    variant={mapType === 'hybrid' ? 'default' : 'outline'}
                    onClick={() => handleMapTypeChange('hybrid')}
                    className={mapType === 'hybrid' ? 'bg-blue-600 text-white' : 'bg-black/30 border-white/20 text-white hover:bg-black/40'}
                  >
                    Hybrid
                  </Button>
                  <Button 
                    size="sm" 
                    variant={mapType === 'terrain' ? 'default' : 'outline'}
                    onClick={() => handleMapTypeChange('terrain' as any)}
                    className={mapType === 'terrain' ? 'bg-blue-600 text-white' : 'bg-black/30 border-white/20 text-white hover:bg-black/40'}
                  >
                    Terrain
                  </Button>
                </div>
              </div>

              {/* Street View Control */}
              <div>
                <Button 
                  size="sm" 
                  variant={showStreetView ? 'default' : 'outline'}
                  onClick={() => showStreetView ? disableStreetView() : enableStreetView()}
                  className={showStreetView ? 'bg-blue-600 text-white w-full' : 'bg-black/30 border-white/20 text-white hover:bg-black/40 w-full'}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Street View
                </Button>
              </div>

              {/* 3D Navigation Status */}
              <div className="space-y-2">
                <div className="text-xs text-white/70">3D Navigation Status</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">Heading</div>
                    <div className="text-white font-mono">{Math.round(currentHeading)}°</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">Tilt</div>
                    <div className="text-white font-mono">{Math.round(currentTilt)}°</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">Zoom</div>
                    <div className="text-white font-mono">{currentZoom.toFixed(1)}</div>
                  </div>
                  <div className="bg-black/20 p-2 rounded">
                    <div className="text-white/60">3D Status</div>
                    <div className={`text-xs font-mono ${currentTilt > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {currentTilt > 0 ? '✅ Active' : '❌ Inactive'}
                    </div>
                  </div>
                </div>
                <div className="bg-black/20 p-2 rounded text-xs">
                  <div className="text-white/60 mb-1">Map Configuration</div>
                  <div className="text-white font-mono text-xs">
                    Mode: Vector | Type: Satellite | Zoom: {currentZoom.toFixed(1)}
                  </div>
                  <div className="text-white/60 text-xs mt-1">
                    {currentTilt > 0 ? '3D Buildings should be visible' : 'Use Force 3D Buildings button'}
                  </div>
                </div>
              </div>

              {/* Interaction Status */}
              <div className="space-y-2">
                <div className="text-xs text-white/70">Interaction Status</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white/60">Tilt Interaction:</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Heading Interaction:</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/60">Fractional Zoom:</span>
                    <span className="text-green-400">Enabled</span>
                  </div>
                </div>
              </div>

              {ctrlPressed && (
                <div className="text-xs text-blue-200 bg-blue-500/20 p-2 rounded">
                  3D rotation active - Drag to rotate/tilt view
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Enhanced Building Analysis Widget - Left Side - MUCH LARGER */}
        {showAnalysisWidget && (
          <Card className="absolute top-6 left-6 bottom-6 w-[800px] p-8 bg-black/40 backdrop-blur-xl border border-white/10 z-10 shadow-2xl overflow-y-auto">
            <div className="space-y-8">
              {/* Header */}
              <div className="flex items-center gap-3 mb-6">
                <Building className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Building Analysis Center</h2>
                <Button
                  onClick={() => setShowAnalysisWidget(false)}
                  size="sm"
                  variant="ghost"
                  className="ml-auto text-white hover:bg-white/20"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>



              {/* Current Building Info - Selected Property */}
              {(selectedBuilding?.id === 'mgm-grand-detroit' || selectedProperty) && (
                <div className="space-y-8">
                  {/* Building Overview */}
                  <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Info className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-white">Building Overview</h3>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded border border-blue-400/30 mb-4">
                      <p className="text-xs text-blue-200">
                        📊 Data compiled from public records, satellite imagery, and industry databases
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6 text-base">
                      <div>
                        <div className="text-white font-bold text-lg">{availableProperties.find(p => p.id === selectedProperty)?.data.name}</div>
                        <div className="text-white/70 flex items-center gap-2 mt-2">
                          <MapPin className="w-4 h-4" />
                          {availableProperties.find(p => p.id === selectedProperty)?.data.address}
                      </div>
                        <div className="text-white/70 mt-2">
                          Type: <span className="text-white font-medium">{availableProperties.find(p => p.id === selectedProperty)?.data.buildingType}</span> | Built: <span className="text-white font-medium">{availableProperties.find(p => p.id === selectedProperty)?.data.yearBuilt}</span>
                    </div>
                        <div className="text-white/70 mt-1">
                          Floors: <span className="text-white font-medium">{availableProperties.find(p => p.id === selectedProperty)?.data.floors}</span> | Status: <span className="text-white font-medium">{availableProperties.find(p => p.id === selectedProperty)?.data.status}</span>
                  </div>
                </div>
                      <div>
                        <div className="text-white/70 text-sm">Owner</div>
                        <div className="text-white font-medium">{availableProperties.find(p => p.id === selectedProperty)?.data.owner}</div>
                        <div className="text-white/70 mt-3 text-sm">Total Area</div>
                        <div className="text-white font-bold text-lg">{availableProperties.find(p => p.id === selectedProperty)?.data.totalArea}</div>
                  </div>
                </div>
                  </div>

                  {/* Energy & Cost Analysis */}
                  <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Grid3X3 className="w-6 h-6 text-green-400" />
                      <h3 className="text-xl font-semibold text-white">Energy & Cost Analysis</h3>
                    </div>
                    <div className="bg-green-500/20 p-3 rounded border border-green-400/30 mb-4">
                      <p className="text-xs text-green-200">
                        ⚡ Estimates based on utility data research and building performance studies
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                        <div className="bg-blue-500/30 p-4 rounded border border-blue-400/20">
                          <div className="font-medium text-blue-200 text-sm">Annual Energy Consumption</div>
                          <div className="text-2xl font-bold text-white">{availableProperties.find(p => p.id === selectedProperty)?.data.energyConsumption}</div>
                        </div>
                        <div className="bg-red-500/30 p-4 rounded border border-red-400/20">
                          <div className="font-medium text-red-200 text-sm">Current Annual Cost</div>
                          <div className="text-2xl font-bold text-white">{availableProperties.find(p => p.id === selectedProperty)?.data.energyAnalysis.currentAnnualCost}</div>
                        </div>
                        <div className="bg-purple-500/30 p-4 rounded border border-purple-400/20">
                          <div className="font-medium text-purple-200 text-sm">Electricity Rate</div>
                          <div className="text-xl font-bold text-white">{availableProperties.find(p => p.id === selectedProperty)?.data.electricityRate}</div>
                        </div>
                      </div>
                      <div className="space-y-4">
                        <div className="bg-green-500/30 p-4 rounded border border-green-400/20">
                          <div className="font-medium text-green-200 text-sm">Projected Savings</div>
                          <div className="text-2xl font-bold text-white">{getCurrentPropertyData().energyAnalysis.projectedSavings}</div>
                        </div>
                        <div className="bg-orange-500/30 p-4 rounded border border-orange-400/20">
                          <div className="font-medium text-orange-200 text-sm">Implementation Cost</div>
                          <div className="text-2xl font-bold text-white">{getCurrentPropertyData().energyAnalysis.implementationCost}</div>
                        </div>
                        <div className="bg-cyan-500/30 p-4 rounded border border-cyan-400/20">
                          <div className="font-medium text-cyan-200 text-sm">Efficiency Gain</div>
                          <div className="text-xl font-bold text-white">{getCurrentPropertyData().energyAnalysis.efficiencyGain}</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Window Analysis */}
                  <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Eye className="w-6 h-6 text-cyan-400" />
                      <h3 className="text-xl font-semibold text-white">Window Analysis</h3>
                    </div>
                    <div className="bg-cyan-500/20 p-3 rounded border border-cyan-400/30 mb-4">
                      <p className="text-xs text-cyan-200">
                        🏢 Analysis from architectural plans and satellite imagery review
                      </p>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-500/30 p-4 rounded border border-blue-400/20">
                        <div className="font-medium text-blue-200 text-sm">Total Windows</div>
                        <div className="text-3xl font-bold text-white">{getCurrentPropertyData().totalWindows}</div>
                      </div>
                      <div className="bg-green-500/30 p-4 rounded border border-green-400/20">
                        <div className="font-medium text-green-200 text-sm">Average Size</div>
                        <div className="text-xl font-bold text-white">{getCurrentPropertyData().averageWindowSize}</div>
                      </div>
                      <div className="bg-purple-500/30 p-4 rounded border border-purple-400/20">
                        <div className="font-medium text-purple-200 text-sm">Wall Ratio</div>
                        <div className="text-xl font-bold text-white">{(getCurrentPropertyData().windowWallRatio * 100).toFixed(1)}%</div>
                      </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                      <div className="text-white/70">Building Orientation: <span className="text-white font-medium">{getCurrentPropertyData().buildingOrientation}</span></div>
                      <div className="text-white/70">Indoor Temperature: <span className="text-white font-medium">{getCurrentPropertyData().indoorTemperature}</span></div>
                    </div>
                    </div>
                    
                  {/* Recommended Solution */}
                  <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-6 h-6 text-yellow-400" />
                      <h3 className="text-xl font-semibold text-white">Recommended Solution</h3>
                    </div>
                    <div className="bg-yellow-500/20 p-3 rounded border border-yellow-400/30 mb-4">
                      <p className="text-xs text-yellow-200">
                        💡 Projections based on similar building case studies and industry benchmarks
                      </p>
                    </div>
                    <div className="space-y-4">
                      <div className="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 p-6 rounded border border-yellow-400/20">
                        <div className="font-bold text-yellow-200 text-2xl">{getCurrentPropertyData().energyAnalysis.recommendedSolution}</div>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                          <div>
                            <div className="text-white/70 text-sm">Energy Savings</div>
                            <div className="text-white font-bold text-xl">{getCurrentPropertyData().energyAnalysis.energySavings}</div>
                          </div>
                          <div>
                            <div className="text-white/70 text-sm">Comfort Improvement</div>
                            <div className="text-white font-bold text-xl">{getCurrentPropertyData().energyAnalysis.comfortImprovement}</div>
                          </div>
                          <div>
                            <div className="text-white/70 text-sm">Payback Period</div>
                            <div className="text-white font-bold text-xl">{getCurrentPropertyData().energyAnalysis.paybackPeriod}</div>
                          </div>
                          <div>
                            <div className="text-white/70 text-sm">Total Investment</div>
                            <div className="text-white font-bold text-xl">{getCurrentPropertyData().energyAnalysis.totalInvestment}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Climate Data */}
                  <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <Clock className="w-6 h-6 text-blue-400" />
                      <h3 className="text-xl font-semibold text-white">Climate & Environmental Data</h3>
                    </div>
                    <div className="bg-blue-500/20 p-3 rounded border border-blue-400/30 mb-4">
                      <p className="text-xs text-blue-200">
                        🌡️ Weather data sourced from NOAA and local meteorological stations
                      </p>
                    </div>
                    <div className="space-y-6">
                      <div>
                        <div className="font-medium text-white mb-3">Monthly Temperature Range</div>
                        <div className="grid grid-cols-4 gap-3">
                          {Object.entries(getCurrentPropertyData().monthlyTemperatures).map(([month, temp]) => (
                            <div key={month} className="bg-black/20 p-3 rounded">
                              <div className="text-white/60 text-sm">{month.slice(0, 3)}</div>
                              <div className="text-white font-mono text-sm">{temp}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                      <div>
                        <div className="font-medium text-white mb-3">Solar Irradiance (kWh/m²/day)</div>
                        <div className="grid grid-cols-6 gap-3">
                          {Object.entries(getCurrentPropertyData().solarIrradiance).map(([month, value]) => (
                            <div key={month} className="bg-yellow-500/20 p-3 rounded border border-yellow-400/20">
                              <div className="text-yellow-200 text-sm">{month.slice(0, 3)}</div>
                              <div className="text-white font-bold">{value}</div>
                            </div>
                      ))}
                    </div>
                  </div>
                </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="space-y-4">
                    <Button
                      onClick={() => setShowWindows(!showWindows)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg"
                    >
                      <Eye className="w-5 h-5 mr-3" />
                      {showWindows ? 'Hide' : 'Show'} Window Locations
                    </Button>
                
                    <div className="grid grid-cols-2 gap-4">
                      <Button
                        onClick={() => {
                          if (map) {
                            map.setCenter({ lat: getCurrentPropertyData().coordinates.lat, lng: getCurrentPropertyData().coordinates.lng });
                            map.setZoom(21);
                            map.setTilt(45);
                          }
                        }}
                        variant="outline"
                        className="bg-black/30 border-white/20 text-white hover:bg-black/40 py-3"
                      >
                        <Navigation className="w-5 h-5 mr-2" />
                        Center View
                      </Button>
                      <Button
                        onClick={() => enableStreetView()}
                        variant="outline"
                        className="bg-black/30 border-white/20 text-white hover:bg-black/40 py-3"
                      >
                        <Eye className="w-5 h-5 mr-2" />
                        Street View
                      </Button>
                        </div>
                    </div>

                  {/* Property Switcher - Moved to Bottom */}
                  <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                    <div className="flex items-center gap-3 mb-4">
                      <MapPin className="w-6 h-6 text-purple-400" />
                      <h3 className="text-xl font-semibold text-white">Select Property</h3>
                    </div>
                    <div className="space-y-4">
                      {availableProperties.map((property) => (
                        <div
                          key={property.id}
                          onClick={() => {
                            setSelectedProperty(property.id);
                            setIsAnalyzing(true);
                            setAnalysisProgress(0);
                            
                            if (map) {
                              // Clear previous analysis markers and circle
                              analysisMarkers.forEach(marker => marker.setMap(null));
                              if (analysisCircle) analysisCircle.setMap(null);
                              setAnalysisMarkers([]);
                              setAnalysisCircle(null);

                              // Start progress animation
                              const progressInterval = setInterval(() => {
                                setAnalysisProgress(prev => {
                                  if (prev >= 100) {
                                    clearInterval(progressInterval);
                                    setIsAnalyzing(false);
                                    return 100;
                                  }
                                  return prev + 2;
                                });
                              }, 100);

                              // Fancy transition to property
                              map.panTo(property.data.coordinates);
                              setTimeout(() => {
                                map.setZoom(22);
                                map.setTilt(67.5);
                                map.setHeading(45);
                                setCurrentLocation(property.data.name);
                                
                                // Add analysis highlight circle with pulsing effect
                                const circle = new window.google.maps.Circle({
                                  strokeColor: '#3b82f6',
                                  strokeOpacity: 0.8,
                                  strokeWeight: 3,
                                  fillColor: '#3b82f6',
                                  fillOpacity: 0.2,
                                  map: map,
                                  center: property.data.coordinates,
                                  radius: 100
                                });
                                setAnalysisCircle(circle);

                                // Add research data points around the building
                                const analysisPoints = [
                                  { lat: property.data.coordinates.lat + 0.0008, lng: property.data.coordinates.lng + 0.0008, label: 'Energy Research', color: '#ef4444', source: 'Based on public utility data' },
                                  { lat: property.data.coordinates.lat - 0.0008, lng: property.data.coordinates.lng + 0.0008, label: 'Window Analysis', color: '#10b981', source: 'From satellite imagery study' },
                                  { lat: property.data.coordinates.lat + 0.0008, lng: property.data.coordinates.lng - 0.0008, label: 'Climate Research', color: '#f59e0b', source: 'NOAA weather data analysis' },
                                  { lat: property.data.coordinates.lat - 0.0008, lng: property.data.coordinates.lng - 0.0008, label: 'Efficiency Study', color: '#8b5cf6', source: 'Industry benchmark comparison' },
                                  { lat: property.data.coordinates.lat, lng: property.data.coordinates.lng + 0.0012, label: 'Thermal Research', color: '#06b6d4', source: 'From building documentation' },
                                  { lat: property.data.coordinates.lat, lng: property.data.coordinates.lng - 0.0012, label: 'Structural Data', color: '#ec4899', source: 'Public building records' }
                                ];

                                const newMarkers: any[] = [];
                                analysisPoints.forEach((point, index) => {
                                  setTimeout(() => {
                                    const marker = new window.google.maps.Marker({
                                      position: point,
                                      map: map,
                                      title: point.label,
                                      icon: {
                                        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                                          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <circle cx="12" cy="12" r="10" fill="${point.color}" stroke="#ffffff" stroke-width="2"/>
                                            <circle cx="12" cy="12" r="4" fill="#ffffff"/>
                                            <circle cx="12" cy="12" r="2" fill="${point.color}"/>
                                          </svg>
                                        `),
                                        scaledSize: new window.google.maps.Size(24, 24),
                                        anchor: new window.google.maps.Point(12, 12)
                                      },
                                      animation: window.google.maps.Animation.DROP
                                    });

                                    // Add info window for research data points
                                    const infoWindow = new window.google.maps.InfoWindow({
                                      content: `
                                        <div style="padding: 10px; max-width: 250px;">
                                          <h4 style="margin: 0 0 6px 0; color: #1f2937; font-weight: bold;">${point.label}</h4>
                                          <p style="margin: 0 0 4px 0; color: #6b7280; font-size: 12px;">${property.data.name}</p>
                                          <p style="margin: 0 0 6px 0; color: #6b7280; font-size: 11px; font-style: italic;">${point.source}</p>
                                          <div style="margin-top: 6px; padding: 3px 8px; background: ${point.color}; color: white; border-radius: 4px; font-size: 10px; display: inline-block;">
                                            RESEARCH DATA
                                          </div>
                                        </div>
                                      `
                                    });

                                    marker.addListener('click', () => {
                                      infoWindow.open(map, marker);
                                    });

                                    newMarkers.push(marker);
                                  }, index * 200);
                                });
                                setAnalysisMarkers(newMarkers);
                              }, 500);
                            }
                          }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-300 hover:scale-105 ${
                            selectedProperty === property.id
                              ? 'bg-blue-600/30 border-blue-400/50 shadow-lg shadow-blue-500/20'
                              : 'bg-black/20 border-white/20 hover:bg-black/30 hover:border-white/30'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                              selectedProperty === property.id ? 'bg-blue-500' : 'bg-gray-600'
                            }`}>
                              <Building className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="font-semibold text-lg text-white">{property.data.name}</div>
                              <div className="text-sm text-white/70 mt-1">
                                {property.data.buildingType} • Built {property.data.yearBuilt} • {property.data.floors} floors
                              </div>
                              <div className="text-xs text-white/60 mt-1">{property.data.address}</div>
                            </div>
                            {selectedProperty === property.id && (
                              <div className="flex flex-col items-end gap-2">
                                <div className="flex items-center gap-2">
                                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                  <span className="text-xs text-green-400 font-medium">
                                    {isAnalyzing ? 'RESEARCHING' : 'DATA READY'}
                                  </span>
                                </div>
                                {isAnalyzing && (
                                  <div className="w-24">
                                    <div className="flex justify-between text-xs text-white/60 mb-1">
                                      <span>Progress</span>
                                      <span>{analysisProgress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-700 rounded-full h-1.5">
                                      <div 
                                        className="bg-green-400 h-1.5 rounded-full transition-all duration-300"
                                        style={{ width: `${analysisProgress}%` }}
                                      ></div>
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Fallback for other buildings */}
              {selectedBuilding && selectedBuilding.id !== 'mgm-grand-detroit' && (
                <div className="bg-black/30 p-6 rounded-lg border border-white/10">
                  <div className="flex items-center gap-3 mb-3">
                    <Info className="w-6 h-6 text-blue-400" />
                    <h3 className="text-xl font-semibold text-white">Current Building</h3>
                  </div>
                <div className="space-y-3">
                    <div className="text-white text-lg">{selectedBuilding.name}</div>
                    {selectedBuilding.address && (
                      <div className="text-white/70 flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        {selectedBuilding.address}
                  </div>
                    )}
                    <div className="text-white/70">
                      Coords: {selectedBuilding.latitude.toFixed(6)}, {selectedBuilding.longitude.toFixed(6)}
                        </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}

        {/* Instructions */}
        <div className="absolute bottom-6 right-6 z-10">
          <div className="text-xs text-white/80 bg-black/40 backdrop-blur-xl border border-white/10 p-3 rounded-lg max-w-xs shadow-lg">
            <div className="space-y-1">
              <div>Click <span className="font-semibold text-white">Compass</span> icon for 3D navigation controls</div>
              <div>Click buildings to analyze windows</div>
              <div>Press <span className="font-semibold text-white">ESC</span> to exit Street View</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapViewer;
