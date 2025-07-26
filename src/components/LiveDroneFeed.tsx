import React from 'react';
import { Video, Signal, Camera } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import droneFeedImage from '@/assets/drone-feed.jpg';

const LiveDroneFeed = () => {
  return (
    <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader>
        <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
          <Video className="w-4 h-4" />
          Live Drone Feed
          <Badge variant="outline" className="ml-auto">
            <div className="w-2 h-2 bg-operational rounded-full mr-1 animate-pulse" />
            LIVE
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-lg overflow-hidden">
          <img 
            src={droneFeedImage} 
            alt="Live drone camera feed"
            className="w-full h-48 object-cover"
          />
          
          {/* Video Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/30 to-transparent" />
          
          {/* Recording Indicator */}
          <div className="absolute top-2 left-2 flex items-center space-x-2">
            <div className="w-3 h-3 bg-critical rounded-full animate-pulse" />
            <span className="text-xs font-medium text-critical">REC</span>
          </div>
          
          {/* Signal Strength */}
          <div className="absolute top-2 right-2 flex items-center space-x-1 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <Signal className="w-3 h-3 text-operational" />
            <span className="text-xs text-operational font-medium">95%</span>
          </div>
          
          {/* Camera Info */}
          <div className="absolute bottom-2 left-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs font-mono text-foreground">
              Drone-01 | Alt: 150m
            </p>
          </div>
          
          {/* Zoom Level */}
          <div className="absolute bottom-2 right-2 bg-background/80 backdrop-blur-sm rounded px-2 py-1">
            <p className="text-xs font-mono text-foreground">2.5x</p>
          </div>
        </div>
        
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Camera className="w-3 h-3" />
              4K@30fps
            </span>
            <span>H.264</span>
          </div>
          <div className="text-xs text-muted-foreground">
            Quality: High
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LiveDroneFeed;