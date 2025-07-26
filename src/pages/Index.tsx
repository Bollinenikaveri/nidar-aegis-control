import React from 'react';
import MissionHeader from '@/components/MissionHeader';
import KMLUploadWidget from '@/components/KMLUploadWidget';
import MissionMap from '@/components/MissionMap';
import LiveDroneFeed from '@/components/LiveDroneFeed';
import MissionControlCard from '@/components/MissionControlCard';
import AlertsSection from '@/components/AlertsSection';
import DroneLocationsTelemetry from '@/components/DroneLocationsTelemetry';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <MissionHeader />
      
      {/* Main Content */}
      <div className="flex-1 p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-full">
          {/* Left Panel */}
          <div className="lg:col-span-2 space-y-6">
            <KMLUploadWidget />
            <MissionMap />
            <LiveDroneFeed />
          </div>
          
          {/* Right Panel */}
          <div className="lg:col-span-2 grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <MissionControlCard />
              <AlertsSection />
            </div>
            <div className="space-y-6">
              <DroneLocationsTelemetry />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;