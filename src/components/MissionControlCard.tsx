import React from 'react';
import { Play, Users, Package, Battery, MapPin, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';

const MissionControlCard = () => {
  return (
    <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <Play className="w-5 h-5 text-operational" />
          Mission Control
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mission Info */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Mission ID:</span>
            <span className="text-sm font-mono text-foreground">SAR-2024-001</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Elapsed Time:</span>
            <span className="text-sm font-mono text-foreground">02:34:15</span>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge variant="outline" className="bg-operational/10 text-operational border-operational/20">
              Active
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Progress:</span>
            <span className="text-sm font-medium text-foreground">67%</span>
          </div>
          <Progress value={67} className="h-2" />
        </div>

        <Separator className="bg-border/40" />

        {/* Mission Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-warning">
              <Users className="w-4 h-4" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground">Victims Detected</p>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center space-x-1 text-operational">
              <Package className="w-4 h-4" />
              <span className="text-2xl font-bold">2</span>
            </div>
            <p className="text-xs text-muted-foreground">Kits Delivered</p>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Drone Stats */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-foreground">Drone Statistics</h4>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Active Drones:</span>
              <span className="font-medium text-operational">4</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Battery className="w-3 h-3" />
                Avg Battery:
              </span>
              <span className="font-medium text-warning">78%</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                Distance:
              </span>
              <span className="font-medium text-foreground">12.4 km</span>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3" />
                ETA:
              </span>
              <span className="font-medium text-foreground">18 min</span>
            </div>
          </div>
        </div>

        <Separator className="bg-border/40" />

        {/* Action Button */}
        <Button 
          variant="critical" 
          className="w-full"
          size="lg"
        >
          Abort Mission
        </Button>
      </CardContent>
    </Card>
  );
};

export default MissionControlCard;