import React from 'react';
import { Map, Navigation, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import missionMapImage from '@/assets/mission-map.jpg';

const MissionMap = () => {
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
          
          {/* Drone Markers */}
          <div className="absolute top-16 right-12">
            <div className="relative">
              <Target className="w-4 h-4 text-operational animate-pulse" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-operational rounded-full animate-ping" />
            </div>
          </div>
          
          <div className="absolute bottom-20 left-16">
            <div className="relative">
              <Navigation className="w-4 h-4 text-primary" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-primary rounded-full animate-pulse" />
            </div>
          </div>
          
          {/* Scale */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs text-foreground">Scale: 1:25,000</p>
          </div>
        </div>
        
        <div className="mt-3 flex justify-between text-xs text-muted-foreground">
          <span>Coverage: 15.2 km²</span>
          <span>Active Zones: 3</span>
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionMap;