import React, { useState, useEffect } from 'react';
import { Plane, Navigation2, Gauge, Battery, Wifi, Thermometer } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

interface DroneData {
  id: string;
  name: string;
  status: 'active' | 'returning' | 'standby';
  location: {
    lat: number;
    lng: number;
    altitude: number;
  };
  telemetry: {
    battery: number;
    speed: number;
    heading: number;
    signal: number;
    temperature: number;
    flightTime: string;
  };
}

const mockDroneData: DroneData[] = [
  {
    id: 'drone-01',
    name: 'Scout Alpha',
    status: 'active',
    location: { lat: 45.4215, lng: -75.6972, altitude: 150 },
    telemetry: { battery: 78, speed: 12.5, heading: 245, signal: 95, temperature: -2, flightTime: '01:23:45' }
  },
  {
    id: 'drone-02',
    name: 'Scout Beta',
    status: 'active',
    location: { lat: 45.4198, lng: -75.6985, altitude: 165 },
    telemetry: { battery: 82, speed: 8.3, heading: 180, signal: 87, temperature: -1, flightTime: '01:18:22' }
  },
  {
    id: 'drone-03',
    name: 'Rescue Gamma',
    status: 'returning',
    location: { lat: 45.4187, lng: -75.6954, altitude: 120 },
    telemetry: { battery: 34, speed: 15.2, heading: 90, signal: 72, temperature: -3, flightTime: '02:05:11' }
  },
  {
    id: 'drone-04',
    name: 'Scout Delta',
    status: 'standby',
    location: { lat: 45.4205, lng: -75.6960, altitude: 0 },
    telemetry: { battery: 100, speed: 0, heading: 0, signal: 100, temperature: 5, flightTime: '00:00:00' }
  }
];

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'operational';
    case 'returning': return 'warning';
    case 'standby': return 'secondary';
    default: return 'secondary';
  }
};

const getBatteryColor = (level: number) => {
  if (level > 50) return 'text-operational';
  if (level > 20) return 'text-warning';
  return 'text-critical';
};

const DroneLocationsTelemetry = () => {
  const [droneData, setDroneData] = useState<DroneData[]>(mockDroneData);
  const [selectedDrone, setSelectedDrone] = useState<string>(droneData[0]?.id || '');

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setDroneData(prevData => 
        prevData.map(drone => ({
          ...drone,
          location: {
            ...drone.location,
            // Simulate slight movement for active drones
            lat: drone.status === 'active' 
              ? drone.location.lat + (Math.random() - 0.5) * 0.0001
              : drone.location.lat,
            lng: drone.status === 'active'
              ? drone.location.lng + (Math.random() - 0.5) * 0.0001
              : drone.location.lng,
            altitude: drone.status === 'active'
              ? Math.max(100, Math.min(200, drone.location.altitude + (Math.random() - 0.5) * 5))
              : drone.location.altitude
          },
          telemetry: {
            ...drone.telemetry,
            // Simulate telemetry changes
            battery: drone.status === 'active' && drone.telemetry.battery > 0
              ? Math.max(0, drone.telemetry.battery - 0.1)
              : drone.telemetry.battery,
            speed: drone.status === 'active'
              ? Math.max(0, drone.telemetry.speed + (Math.random() - 0.5) * 2)
              : 0,
            heading: drone.status === 'active'
              ? (drone.telemetry.heading + (Math.random() - 0.5) * 10) % 360
              : drone.telemetry.heading,
            signal: Math.max(50, Math.min(100, drone.telemetry.signal + (Math.random() - 0.5) * 5)),
            temperature: drone.telemetry.temperature + (Math.random() - 0.5) * 0.5
          }
        }))
      );
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const selectedDroneData = droneData.find(drone => drone.id === selectedDrone);

  return (
    <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Plane className="w-5 h-5 text-primary" />
          Drone Locations & Telemetry
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Drone Selection */}
        <div className="grid grid-cols-2 gap-2">
          {droneData.map((drone) => (
            <button
              key={drone.id}
              onClick={() => setSelectedDrone(drone.id)}
              className={`p-2 rounded-lg border text-left transition-colors ${
                selectedDrone === drone.id
                  ? 'bg-primary/10 border-primary text-primary'
                  : 'bg-secondary/20 border-border/40 hover:bg-secondary/30'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium">{drone.name}</span>
                <Badge 
                  variant="outline" 
                  className={`text-xs bg-${getStatusColor(drone.status)}/10 text-${getStatusColor(drone.status)} border-${getStatusColor(drone.status)}/20`}
                >
                  {drone.status}
                </Badge>
              </div>
            </button>
          ))}
        </div>

        <Separator className="bg-border/40" />

        {/* Selected Drone Details */}
        {selectedDroneData && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-foreground">{selectedDroneData.name}</h4>
              <Badge variant="outline" className="bg-operational/10 text-operational border-operational/20">
                CONNECTED
              </Badge>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Current Location</h5>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground">Latitude:</span>
                  <p className="font-mono text-foreground">{selectedDroneData.location.lat.toFixed(6)}°</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Longitude:</span>
                  <p className="font-mono text-foreground">{selectedDroneData.location.lng.toFixed(6)}°</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Altitude:</span>
                  <p className="font-mono text-foreground">{selectedDroneData.location.altitude.toFixed(1)}m</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Flight Time:</span>
                  <p className="font-mono text-foreground">{selectedDroneData.telemetry.flightTime}</p>
                </div>
              </div>
            </div>

            <Separator className="bg-border/20" />

            {/* Telemetry */}
            <div className="space-y-3">
              <h5 className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Real-time Telemetry</h5>
              
              {/* Battery */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Battery className="w-3 h-3" />
                    Battery Level
                  </span>
                  <span className={`text-xs font-medium ${getBatteryColor(selectedDroneData.telemetry.battery)}`}>
                    {selectedDroneData.telemetry.battery.toFixed(1)}%
                  </span>
                </div>
                <Progress value={selectedDroneData.telemetry.battery} className="h-2" />
              </div>

              {/* Signal Strength */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Wifi className="w-3 h-3" />
                    Signal Strength
                  </span>
                  <span className="text-xs font-medium text-operational">
                    {selectedDroneData.telemetry.signal.toFixed(0)}%
                  </span>
                </div>
                <Progress value={selectedDroneData.telemetry.signal} className="h-2" />
              </div>

              {/* Other Telemetry */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Gauge className="w-3 h-3" />
                    Speed:
                  </span>
                  <p className="font-mono text-foreground">{selectedDroneData.telemetry.speed.toFixed(1)} m/s</p>
                </div>
                <div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Navigation2 className="w-3 h-3" />
                    Heading:
                  </span>
                  <p className="font-mono text-foreground">{selectedDroneData.telemetry.heading.toFixed(0)}°</p>
                </div>
                <div>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Thermometer className="w-3 h-3" />
                    Temperature:
                  </span>
                  <p className="font-mono text-foreground">{selectedDroneData.telemetry.temperature.toFixed(1)}°C</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className={`font-medium capitalize text-${getStatusColor(selectedDroneData.status)}`}>
                    {selectedDroneData.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DroneLocationsTelemetry;
