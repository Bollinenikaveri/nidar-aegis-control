import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Target, Navigation, Crosshair } from 'lucide-react';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface DronePosition {
  id: string;
  name: string;
  lat: number;
  lng: number;
  battery: number;
  altitude: number;
  status: 'active' | 'returning' | 'standby';
}

interface VictimLocation {
  lat: number;
  lng: number;
  id: string;
  description: string;
}

interface RealTimeMapProps {
  missionActive: boolean;
}

// A* Algorithm implementation for pathfinding
class AStarPathfinder {
  private grid: number[][];
  private rows: number;
  private cols: number;

  constructor(gridSize: number = 100) {
    this.rows = gridSize;
    this.cols = gridSize;
    this.grid = Array(this.rows).fill(null).map(() => Array(this.cols).fill(0));
  }

  private heuristic(a: [number, number], b: [number, number]): number {
    return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]);
  }

  private latLngToGrid(lat: number, lng: number, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }): [number, number] {
    const x = Math.floor(((lat - bounds.minLat) / (bounds.maxLat - bounds.minLat)) * (this.rows - 1));
    const y = Math.floor(((lng - bounds.minLng) / (bounds.maxLng - bounds.minLng)) * (this.cols - 1));
    return [Math.max(0, Math.min(this.rows - 1, x)), Math.max(0, Math.min(this.cols - 1, y))];
  }

  private gridToLatLng(x: number, y: number, bounds: { minLat: number; maxLat: number; minLng: number; maxLng: number }): [number, number] {
    const lat = bounds.minLat + (x / (this.rows - 1)) * (bounds.maxLat - bounds.minLat);
    const lng = bounds.minLng + (y / (this.cols - 1)) * (bounds.maxLng - bounds.minLng);
    return [lat, lng];
  }

  findPath(start: [number, number], end: [number, number]): [number, number][] {
    // Define map bounds for conversion
    const bounds = {
      minLat: 45.40,
      maxLat: 45.44,
      minLng: -75.72,
      maxLng: -75.68
    };

    const startGrid = this.latLngToGrid(start[0], start[1], bounds);
    const endGrid = this.latLngToGrid(end[0], end[1], bounds);

    const openSet: Array<{ pos: [number, number], f: number, g: number, h: number, parent: [number, number] | null }> = [];
    const closedSet: Set<string> = new Set();
    
    openSet.push({
      pos: startGrid,
      f: 0,
      g: 0,
      h: this.heuristic(startGrid, endGrid),
      parent: null
    });

    while (openSet.length > 0) {
      openSet.sort((a, b) => a.f - b.f);
      const current = openSet.shift()!;
      const [x, y] = current.pos;
      
      if (x === endGrid[0] && y === endGrid[1]) {
        // Reconstruct path
        const path: [number, number][] = [];
        let node = current;
        while (node) {
          const latLng = this.gridToLatLng(node.pos[0], node.pos[1], bounds);
          path.unshift(latLng);
          node = openSet.find(n => n.pos[0] === node!.parent?.[0] && n.pos[1] === node!.parent?.[1]) || null;
          if (!node && current.parent) break;
        }
        return path;
      }

      closedSet.add(`${x},${y}`);

      // Check neighbors
      const neighbors = [
        [x-1, y], [x+1, y], [x, y-1], [x, y+1],
        [x-1, y-1], [x-1, y+1], [x+1, y-1], [x+1, y+1]
      ];

      for (const [nx, ny] of neighbors) {
        if (nx < 0 || nx >= this.rows || ny < 0 || ny >= this.cols) continue;
        if (closedSet.has(`${nx},${ny}`)) continue;
        if (this.grid[nx][ny] === 1) continue; // Obstacle

        const g = current.g + Math.sqrt((nx - x) ** 2 + (ny - y) ** 2);
        const h = this.heuristic([nx, ny], endGrid);
        const f = g + h;

        const existing = openSet.find(n => n.pos[0] === nx && n.pos[1] === ny);
        if (!existing) {
          openSet.push({
            pos: [nx, ny],
            f, g, h,
            parent: [x, y]
          });
        } else if (g < existing.g) {
          existing.g = g;
          existing.f = f;
          existing.parent = [x, y];
        }
      }
    }

    // No path found, return direct line
    return [start, end];
  }
}

const RealTimeMap: React.FC<RealTimeMapProps> = ({ missionActive }) => {
  const [drones, setDrones] = useState<DronePosition[]>([
    { id: 'drone-01', name: 'Alpha Scout', lat: 45.4215, lng: -75.6972, battery: 87, altitude: 150, status: 'active' },
    { id: 'drone-02', name: 'Beta Delivery', lat: 45.4198, lng: -75.6985, battery: 92, altitude: 120, status: 'active' },
  ]);

  const [victimLocation, setVictimLocation] = useState<VictimLocation>({
    lat: 45.4187,
    lng: -75.6954,
    id: 'victim-01',
    description: 'Detected via thermal imaging'
  });

  const [pathToVictim, setPathToVictim] = useState<[number, number][]>([]);
  const pathfinderRef = useRef(new AStarPathfinder());

  useEffect(() => {
    // Simulate real-time drone movement
    const interval = setInterval(() => {
      if (missionActive) {
        setDrones(prevDrones => 
          prevDrones.map(drone => ({
            ...drone,
            lat: drone.lat + (Math.random() - 0.5) * 0.0003,
            lng: drone.lng + (Math.random() - 0.5) * 0.0003,
            battery: Math.max(0, drone.battery - Math.random() * 0.1),
          }))
        );
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [missionActive]);

  useEffect(() => {
    // Calculate A* path when mission is active
    if (missionActive && drones.length > 0) {
      const activeDrone = drones.find(d => d.status === 'active') || drones[0];
      const path = pathfinderRef.current.findPath(
        [activeDrone.lat, activeDrone.lng],
        [victimLocation.lat, victimLocation.lng]
      );
      setPathToVictim(path);
    } else {
      setPathToVictim([]);
    }
  }, [missionActive, drones, victimLocation]);

  // Create custom icons
  const droneIcon = (status: string) => new L.DivIcon({
    html: `<div class="w-6 h-6 rounded-full ${
      status === 'active' ? 'bg-operational animate-pulse' : 'bg-warning'
    } border-2 border-background flex items-center justify-center">
      <div class="w-2 h-2 bg-background rounded-full"></div>
    </div>`,
    className: 'custom-drone-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });

  const victimIcon = new L.DivIcon({
    html: `<div class="w-8 h-8 rounded-full bg-destructive border-2 border-background flex items-center justify-center animate-pulse">
      <div class="w-3 h-3 bg-background rounded-full"></div>
    </div>`,
    className: 'custom-victim-icon',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  const calculateDistance = (drone: DronePosition): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (victimLocation.lat - drone.lat) * Math.PI / 180;
    const dLng = (victimLocation.lng - drone.lng) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(drone.lat * Math.PI / 180) * Math.cos(victimLocation.lat * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  return (
    <Card className="h-full bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Real-Time Mission Map
          </div>
          <div className="flex items-center gap-2">
            {missionActive && (
              <Badge variant="default" className="bg-operational/20 text-operational border-operational/40">
                <Target className="w-3 h-3 mr-1" />
                Mission Active
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              A* Pathfinding
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-4rem)]">
        <div className="relative h-full rounded-lg overflow-hidden">
          <MapContainer
            center={[45.4215, -75.6972]}
            zoom={16}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Drone Markers */}
            {drones.map((drone) => (
              <Marker
                key={drone.id}
                position={[drone.lat, drone.lng]}
                icon={droneIcon(drone.status)}
              >
                <Popup>
                  <div className="text-sm">
                    <h3 className="font-medium text-foreground">{drone.name}</h3>
                    <p className="text-muted-foreground">ID: {drone.id}</p>
                    <p className="text-muted-foreground">
                      Battery: <span className={drone.battery > 20 ? 'text-operational' : 'text-destructive'}>
                        {drone.battery.toFixed(1)}%
                      </span>
                    </p>
                    <p className="text-muted-foreground">Altitude: {drone.altitude}m</p>
                    <p className="text-muted-foreground">
                      Distance to target: {calculateDistance(drone).toFixed(2)} km
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Victim Location */}
            <Marker
              position={[victimLocation.lat, victimLocation.lng]}
              icon={victimIcon}
            >
              <Popup>
                <div className="text-sm">
                  <h3 className="font-medium text-foreground flex items-center gap-1">
                    <Crosshair className="w-4 h-4 text-destructive" />
                    Victim Located
                  </h3>
                  <p className="text-muted-foreground">{victimLocation.description}</p>
                  <p className="text-muted-foreground">
                    Coordinates: {victimLocation.lat.toFixed(6)}, {victimLocation.lng.toFixed(6)}
                  </p>
                </div>
              </Popup>
            </Marker>

            {/* A* Path */}
            {pathToVictim.length > 1 && missionActive && (
              <Polyline
                positions={pathToVictim}
                pathOptions={{
                  color: '#3b82f6',
                  weight: 3,
                  opacity: 0.8,
                  dashArray: '10, 10'
                }}
              />
            )}
          </MapContainer>
        </div>
        
        {missionActive && (
          <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded px-3 py-2 text-xs">
            <p className="text-foreground font-medium">A* Path Active</p>
            <p className="text-muted-foreground">
              {pathToVictim.length > 1 ? `${pathToVictim.length} waypoints` : 'Direct route'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RealTimeMap;