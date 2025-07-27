import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Video, 
  Camera, 
  Wifi, 
  WifiOff, 
  Circle, 
  Monitor,
  Zap,
  Signal
} from 'lucide-react';

interface DroneCamera {
  id: string;
  name: string;
  type: 'scout' | 'delivery';
  connected: boolean;
  quality: string;
  resolution: string;
  fps: number;
}

const LiveFeedSwitcher: React.FC = () => {
  const [activeFeed, setActiveFeed] = useState<string>('scout-01');
  const [recording, setRecording] = useState(false);
  
  const [cameras] = useState<DroneCamera[]>([
    {
      id: 'scout-01',
      name: 'Alpha Scout',
      type: 'scout',
      connected: true,
      quality: 'HD',
      resolution: '1920x1080',
      fps: 30
    },
    {
      id: 'delivery-01',
      name: 'Beta Delivery',
      type: 'delivery',
      connected: true,
      quality: '4K',
      resolution: '3840x2160',
      fps: 25
    }
  ]);

  const [connectionStatus] = useState({
    scoutDrone: true,
    deliveryDrone: true,
    groundStation: true
  });

  const activeCamera = cameras.find(cam => cam.id === activeFeed);

  return (
    <Card className="h-full bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Video className="w-4 h-4" />
            Live Drone Feed
          </div>
          <div className="flex items-center gap-2">
            {recording && (
              <Badge variant="destructive" className="animate-pulse">
                <Circle className="w-2 h-2 mr-1 fill-current" />
                REC
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {activeCamera?.quality}
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Camera Selection */}
        <div className="grid grid-cols-2 gap-2">
          {cameras.map((camera) => (
            <Button
              key={camera.id}
              variant={activeFeed === camera.id ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveFeed(camera.id)}
              className={`relative ${
                activeFeed === camera.id 
                  ? 'bg-primary text-primary-foreground' 
                  : 'hover:bg-muted'
              }`}
              disabled={!camera.connected}
            >
              <Camera className="w-3 h-3 mr-1" />
              {camera.name}
              {camera.connected ? (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-operational rounded-full animate-pulse" />
              ) : (
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-destructive rounded-full" />
              )}
            </Button>
          ))}
        </div>

        {/* Live Feed Display */}
        <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
          {activeCamera?.connected ? (
            <>
              {/* Simulated live feed - replace with actual RTSP/WebRTC stream */}
              <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <Monitor className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Live Feed: {activeCamera.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {activeCamera.resolution} @ {activeCamera.fps}fps
                  </p>
                </div>
              </div>

              {/* Feed Overlays */}
              <div className="absolute top-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                <p className="text-xs text-foreground font-mono">
                  {activeCamera.name} | Alt: 150m
                </p>
              </div>

              <div className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                <div className="flex items-center gap-1">
                  <Signal className="w-3 h-3 text-operational" />
                  <span className="text-xs text-foreground">95%</span>
                </div>
              </div>

              <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
                <p className="text-xs text-foreground">Zoom: 2.5x</p>
              </div>

              {recording && (
                <div className="absolute bottom-2 right-2 bg-destructive/90 backdrop-blur-sm rounded px-2 py-1">
                  <div className="flex items-center gap-1">
                    <Circle className="w-2 h-2 fill-current animate-pulse" />
                    <span className="text-xs text-destructive-foreground">REC</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="w-full h-full bg-muted/20 flex items-center justify-center">
              <div className="text-center">
                <WifiOff className="w-12 h-12 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Camera Disconnected</p>
              </div>
            </div>
          )}
        </div>

        {/* Feed Controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground">Recording:</span>
            <Switch
              checked={recording}
              onCheckedChange={setRecording}
              disabled={!activeCamera?.connected}
            />
          </div>
          <div className="text-xs text-muted-foreground">
            {activeCamera?.resolution} • H.264
          </div>
        </div>

        {/* Connection Status */}
        <div className="border-t border-border/40 pt-3">
          <h4 className="text-xs font-medium text-muted-foreground mb-2">System Status</h4>
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Scout Drone:</span>
              <div className="flex items-center gap-1">
                {connectionStatus.scoutDrone ? (
                  <>
                    <Wifi className="w-3 h-3 text-operational" />
                    <span className="text-operational">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">Disconnected</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Delivery Drone:</span>
              <div className="flex items-center gap-1">
                {connectionStatus.deliveryDrone ? (
                  <>
                    <Wifi className="w-3 h-3 text-operational" />
                    <span className="text-operational">Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">Disconnected</span>
                  </>
                )}
              </div>
            </div>
            
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Ground Station:</span>
              <div className="flex items-center gap-1">
                {connectionStatus.groundStation ? (
                  <>
                    <Zap className="w-3 h-3 text-operational" />
                    <span className="text-operational">Online</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-3 h-3 text-destructive" />
                    <span className="text-destructive">Offline</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveFeedSwitcher;