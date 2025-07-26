import React, { useState, useEffect } from 'react';
import { Shield, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const MissionHeader = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <header className="bg-glass backdrop-blur-glass border-b border-border/20 shadow-glass">
      <div className="px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Title Section */}
            <div>
              <h1 className="text-2xl font-bold text-foreground">NIDAR Mission Control</h1>
              <p className="text-sm text-muted-foreground">Search and Rescue Operations</p>
            </div>
            
            {/* Status Indicators */}
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-operational rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-operational">OPERATIONAL</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4 text-secure" />
                <span className="text-sm font-medium text-secure">SECURED</span>
              </div>
            </div>
          </div>

          {/* Real-time Clock */}
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className="text-lg font-mono text-foreground">{formatTime(currentTime)}</span>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(currentTime)}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default MissionHeader;