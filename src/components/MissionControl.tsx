import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  Play, 
  Square, 
  Clock, 
  Target, 
  Package, 
  AlertTriangle,
  FileText,
  CheckCircle
} from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface MissionControlProps {
  onMissionStart: () => void;
  onMissionAbort: () => void;
  missionActive: boolean;
}

const MissionControl: React.FC<MissionControlProps> = ({
  onMissionStart,
  onMissionAbort,
  missionActive
}) => {
  const [kmlFile, setKmlFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [missionData, setMissionData] = useState({
    id: 'SAR-2024-001',
    progress: 34,
    victimsDetected: 2,
    kitsDelivered: 1,
    elapsedTime: '00:24:16',
    activeDrones: 2,
    avgBattery: 89,
    distanceCovered: 3.2,
    eta: 15
  });

  const { toast } = useToast();

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith('.kml') || file.name.endsWith('.kmz')) {
        setKmlFile(file);
        toast({
          title: "KML File Uploaded",
          description: `${file.name} loaded successfully`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a KML or KMZ file",
          variant: "destructive",
        });
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.name.endsWith('.kml') || file.name.endsWith('.kmz')) {
        setKmlFile(file);
        toast({
          title: "KML File Uploaded",
          description: `${file.name} loaded successfully`,
        });
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please upload a KML or KMZ file",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartMission = () => {
    if (kmlFile) {
      onMissionStart();
      toast({
        title: "Mission Started",
        description: "A* pathfinding initiated, drones deploying to target",
      });
    } else {
      toast({
        title: "KML Required",
        description: "Please upload a KML file before starting mission",
        variant: "destructive",
      });
    }
  };

  const handleAbortMission = () => {
    onMissionAbort();
    toast({
      title: "Mission Aborted",
      description: "All drones returning to base",
      variant: "destructive",
    });
  };

  return (
    <div className="space-y-4">
      {/* KML Upload Section */}
      <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Mission File Upload
          </CardTitle>
        </CardHeader>
        <CardContent>
          {!kmlFile ? (
            <div
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-primary bg-primary/10' 
                  : 'border-border hover:border-primary/50'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <input
                type="file"
                accept=".kml,.kmz"
                onChange={handleFileSelect}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-foreground mb-1">
                Drop KML/KMZ file here or click to browse
              </p>
              <p className="text-xs text-muted-foreground">
                Mission waypoints and search areas
              </p>
            </div>
          ) : (
            <div className="flex items-center justify-between p-3 bg-operational/10 rounded-lg border border-operational/20">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-operational" />
                <span className="text-sm text-foreground">{kmlFile.name}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => setKmlFile(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                Remove
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mission Control Panel */}
      <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-foreground flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4" />
              Mission Control
            </div>
            <Badge 
              variant={missionActive ? "default" : "secondary"}
              className={missionActive ? "bg-operational/20 text-operational border-operational/40" : ""}
            >
              {missionActive ? 'ACTIVE' : 'STANDBY'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Mission Info */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Mission ID</p>
              <p className="text-foreground font-mono">{missionData.id}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Elapsed Time</p>
              <p className="text-foreground font-mono flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {missionData.elapsedTime}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-muted-foreground">Mission Progress</span>
              <span className="text-xs text-foreground">{missionData.progress}%</span>
            </div>
            <Progress value={missionData.progress} className="h-2" />
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-background/50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-operational">
                <Target className="w-3 h-3" />
                <span className="text-xs font-medium">Victims</span>
              </div>
              <p className="text-lg font-bold text-foreground">{missionData.victimsDetected}</p>
            </div>
            <div className="bg-background/50 rounded-lg p-2">
              <div className="flex items-center gap-1 text-primary">
                <Package className="w-3 h-3" />
                <span className="text-xs font-medium">Kits Delivered</span>
              </div>
              <p className="text-lg font-bold text-foreground">{missionData.kitsDelivered}</p>
            </div>
          </div>

          {/* Mission Controls */}
          <div className="space-y-2">
            {!missionActive ? (
              <Button
                onClick={handleStartMission}
                className="w-full bg-operational hover:bg-operational/90 text-background"
                disabled={!kmlFile}
              >
                <Play className="w-4 h-4 mr-2" />
                Start Mission
              </Button>
            ) : (
              <Button
                onClick={handleAbortMission}
                variant="destructive"
                className="w-full"
              >
                <Square className="w-4 h-4 mr-2" />
                Abort Mission
              </Button>
            )}
          </div>

          {/* Drone Stats */}
          <div className="border-t border-border/40 pt-3">
            <h4 className="text-xs font-medium text-muted-foreground mb-2">Drone Statistics</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Active Drones:</span>
                <span className="text-foreground font-medium">{missionData.activeDrones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Avg Battery:</span>
                <span className="text-foreground font-medium">{missionData.avgBattery}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Distance:</span>
                <span className="text-foreground font-medium">{missionData.distanceCovered} km</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">ETA:</span>
                <span className="text-foreground font-medium">{missionData.eta} min</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MissionControl;