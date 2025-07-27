import React, { useState } from 'react';
import MissionHeader from '@/components/MissionHeader';
import RealTimeMap from '@/components/RealTimeMap';
import MissionControl from '@/components/MissionControl';
import LiveFeedSwitcher from '@/components/LiveFeedSwitcher';
import AlertsSection from '@/components/AlertsSection';
import DroneLocationsTelemetry from '@/components/DroneLocationsTelemetry';

const Index = () => {
  const [missionActive, setMissionActive] = useState(false);

  const handleMissionStart = () => {
    setMissionActive(true);
  };

  const handleMissionAbort = () => {
    setMissionActive(false);
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      {/* Header */}
      <MissionHeader />
      
      {/* Fixed Dashboard Layout */}
      <div className="flex-1 p-4 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0">
        {/* Left Panel - Mission Controls */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto">
          <MissionControl 
            onMissionStart={handleMissionStart}
            onMissionAbort={handleMissionAbort}
            missionActive={missionActive}
          />
          <AlertsSection />
        </div>
        
        {/* Center Panel - Real-Time Map */}
        <div className="lg:col-span-6 min-h-0">
          <RealTimeMap missionActive={missionActive} />
        </div>
        
        {/* Right Panel - Live Feed & Telemetry */}
        <div className="lg:col-span-3 space-y-4 overflow-y-auto">
          <LiveFeedSwitcher />
          <DroneLocationsTelemetry />
        </div>
      </div>
    </div>
  );
};

export default Index;