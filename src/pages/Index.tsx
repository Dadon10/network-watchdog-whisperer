
import { useState, useEffect } from "react";
import { NetworkDashboard } from "@/components/NetworkDashboard";
import { AlertCenter } from "@/components/AlertCenter";
import { NetworkStats } from "@/components/NetworkStats";
import { useNetworkMonitoring } from "@/hooks/useNetworkMonitoring";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Shield, Network, AlertTriangle } from "lucide-react";

const Index = () => {
  const { departments, alerts, acknowledgeAlert, getActiveAlertsCount } = useNetworkMonitoring();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      {/* Header */}
      <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Network Watchdog</h1>
                <p className="text-slate-400 text-sm">Real-time Network Monitoring System</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white font-mono text-lg">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="text-slate-400 text-sm">
                {currentTime.toLocaleDateString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-slate-800/50 border border-slate-700">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <Network className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="alerts" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Alerts ({getActiveAlertsCount()})
            </TabsTrigger>
            <TabsTrigger value="stats" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Statistics
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            <NetworkDashboard departments={departments} />
          </TabsContent>

          <TabsContent value="alerts" className="space-y-6">
            <AlertCenter alerts={alerts} onAcknowledge={acknowledgeAlert} />
          </TabsContent>

          <TabsContent value="stats" className="space-y-6">
            <NetworkStats departments={departments} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
