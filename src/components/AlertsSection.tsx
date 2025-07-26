import React from 'react';
import { AlertTriangle, MapPin, Clock, CheckCheck, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface Alert {
  id: string;
  type: 'victim_detected' | 'kit_delivered' | 'low_battery' | 'weather_warning';
  message: string;
  severity: 'high' | 'medium' | 'low';
  timestamp: string;
  coordinates: string;
}

const alerts: Alert[] = [
  {
    id: '1',
    type: 'victim_detected',
    message: 'Victim Detected',
    severity: 'high',
    timestamp: '14:23:45',
    coordinates: '45.4215°N, 75.6972°W'
  },
  {
    id: '2',
    type: 'kit_delivered',
    message: 'Emergency Kit Delivered',
    severity: 'medium',
    timestamp: '14:18:32',
    coordinates: '45.4198°N, 75.6985°W'
  },
  {
    id: '3',
    type: 'low_battery',
    message: 'Drone-03 Low Battery',
    severity: 'high',
    timestamp: '14:15:28',
    coordinates: '45.4187°N, 75.6954°W'
  },
  {
    id: '4',
    type: 'weather_warning',
    message: 'Weather Warning Issued',
    severity: 'medium',
    timestamp: '14:12:15',
    coordinates: 'Sector B'
  }
];

const getSeverityVariant = (severity: string) => {
  switch (severity) {
    case 'high':
      return 'destructive';
    case 'medium':
      return 'secondary';
    case 'low':
      return 'outline';
    default:
      return 'outline';
  }
};

const getAlertIcon = (type: string) => {
  switch (type) {
    case 'victim_detected':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    case 'kit_delivered':
      return <CheckCheck className="w-4 h-4 text-operational" />;
    case 'low_battery':
      return <AlertTriangle className="w-4 h-4 text-critical" />;
    case 'weather_warning':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    default:
      return <AlertTriangle className="w-4 h-4" />;
  }
};

const AlertsSection = () => {
  return (
    <Card className="bg-glass backdrop-blur-glass border-border/20 shadow-glass">
      <CardHeader>
        <CardTitle className="text-lg font-semibold text-foreground flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-warning" />
          Real-time Alerts
          <Badge variant="outline" className="ml-auto">
            {alerts.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Alert Actions */}
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm" className="flex-1">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark all as read
          </Button>
          <Button variant="ghost" size="sm" className="flex-1">
            <Trash2 className="w-4 h-4 mr-2" />
            Clear All
          </Button>
        </div>

        <Separator className="bg-border/40" />

        {/* Alerts List */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.map((alert, index) => (
            <div key={alert.id}>
              <div className="flex items-start space-x-3 p-3 rounded-lg bg-secondary/20 hover:bg-secondary/30 transition-colors">
                <div className="flex-shrink-0 mt-0.5">
                  {getAlertIcon(alert.type)}
                </div>
                
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {alert.message}
                    </p>
                    <Badge 
                      variant={getSeverityVariant(alert.severity) as any}
                      className="text-xs"
                    >
                      {alert.severity.toUpperCase()}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {alert.timestamp}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {alert.coordinates}
                    </span>
                  </div>
                </div>
              </div>
              
              {index < alerts.length - 1 && (
                <Separator className="bg-border/20 my-2" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AlertsSection;