import React, { useState, useEffect } from 'react';
import { Map, Navigation, Target, MapPin, Radio } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import missionMapImage from '@/assets/mission-map.jpg';

interface DroneMarker {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'active' | 'returning' | 'standby';
  heading: number;
}

const MissionMap = () => {
  const [droneMarkers, setDroneMarkers] = useState<DroneMarker[]>([
    { id: 'drone-01', name: 'Alpha', lat: 45.4215, lng: -75.6972, status: 'active', heading: 245 },
    { id: 'drone-02', name: 'Beta', lat: 45.4198, lng: -75.6985, status: 'active', heading: 180 },
    { id: 'drone-03', name: 'Gamma', lat: 45.4187, lng: -75.6954, status: 'returning', heading: 90 },
    { id: 'drone-04', name: 'Delta', lat: 45.4205, lng: -75.6960, status: 'standby', heading: 0 }
  ]);

  useEffect(() => {
    // Simulate real-time drone movement
    const interval = setInterval(() => {
      setDroneMarkers(prevMarkers => 
        prevMarkers.map(marker => ({
          ...marker,
          lat: marker.status === 'active' 
            ? marker.lat + (Math.random() - 0.5) * 0.0001
            : marker.lat,
          lng: marker.status === 'active'
            ? marker.lng + (Math.random() - 0.5) * 0.0001
            : marker.lng,
          heading: marker.status === 'active'
            ? (marker.heading + (Math.random() - 0.5) * 10) % 360
            : marker.heading
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const getMarkerColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-operational';
      case 'returning': return 'text-warning';
      case 'standby': return 'text-muted-foreground';
      default: return 'text-muted-foreground';
    }
  };

  const getMarkerIcon = (status: string) => {
    switch (status) {
      case 'active': return Target;
      case 'returning': return Navigation;
      case 'standby': return Radio;
      default: return MapPin;
    }
  };
  return (
    <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Map className="w-4 h-4" />
          Mission Map
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={missionMapImage} 
            alt="Mission topographic map"
            className="w-full h-64 object-cover"
          />
          
          {/* Map Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
          
          {/* Coordinate Display */}
          <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs font-mono text-foreground">
              Lat: 45.4215° N
            </p>
            <p className="text-xs font-mono text-foreground">
              Lng: 75.6972° W
            </p>
          </div>
          
          {/* Dynamic Drone Markers */}
          {droneMarkers.map((drone, index) => {
            const MarkerIcon = getMarkerIcon(drone.status);
            const positionStyle = {
              top: `${20 + (index * 15)}%`,
              left: `${15 + (index * 20)}%`
            };
            
            return (
              <div 
                key={drone.id}
                className="absolute group"
                style={positionStyle}
              >
                <div className="relative">
                  <MarkerIcon 
                    className={`w-5 h-5 ${getMarkerColor(drone.status)} ${
                      drone.status === 'active' ? 'animate-pulse' : ''
                    }`}
                    style={{ transform: `rotate(${drone.heading}deg)` }}
                  />
                  {drone.status === 'active' && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-operational rounded-full animate-ping" />
                  )}
                  
                  {/* Drone Info Tooltip */}
                  <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/90 backdrop-blur-sm rounded px-2 py-1 text-xs whitespace-nowrap border border-border/40">
                    <p className="font-medium text-foreground">{drone.name}</p>
                    <p className="text-muted-foreground">
                      {drone.lat.toFixed(4)}°, {drone.lng.toFixed(4)}°
                    </p>
                    <p className={`capitalize ${getMarkerColor(drone.status)}`}>
                      {drone.status}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
          
          {/* Mission Waypoints */}
          <div className="absolute top-32 right-8">
            <div className="w-3 h-3 bg-primary rounded-full animate-pulse border-2 border-background" />
            <div className="absolute -top-1 -right-1 w-5 h-5 border-2 border-primary rounded-full animate-ping" />
          </div>
          
          <div className="absolute bottom-32 left-20">
            <div className="w-3 h-3 bg-warning rounded-full border-2 border-background" />
          </div>
          
          {/* Scale */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs text-foreground">Scale: 1:25,000</p>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between items-center text-xs text-muted-foreground">
          <div className="flex items-center space-x-4">
            <span>Coverage: 15.2 km²</span>
            <span>Active Zones: 3</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-operational rounded-full" />
              <span>Active</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-warning rounded-full" />
              <span>Returning</span>
            </div>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-muted-foreground rounded-full" />
              <span>Standby</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionMap;