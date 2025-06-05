
import { Department } from "@/hooks/useNetworkMonitoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PulseAnimation } from "./PulseAnimation";
import { Eye, Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react";

interface NetworkDashboardProps {
  departments: Department[];
}

export const NetworkDashboard = ({ departments }: NetworkDashboardProps) => {
  const getStatusClass = (status: string): string => {
    switch (status) {
      case "online":
        return "bg-green-500 text-white border-green-600";
      case "offline":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "online":
        return <Wifi className="h-5 w-5" />;
      case "offline":
        return <WifiOff className="h-5 w-5" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5" />;
      default:
        return <Eye className="h-5 w-5" />;
    }
  };

  const renderDeviceBar = (department: Department) => {
    const maxDevices = 100; // For visualization
    const percentage = Math.min((department.devicesConnected / maxDevices) * 100, 100);
    
    return (
      <div className="mt-2">
        <div className="flex justify-between text-xs mb-1">
          <span>Connected Devices</span>
          <span className="font-medium">{department.devicesConnected}</span>
        </div>
        <div className="h-2 bg-gray-700 rounded-full">
          <div 
            className="h-2 rounded-full bg-blue-500" 
            style={{ width: `${percentage}%` }} 
          />
        </div>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {departments.map((dept) => (
        <Card key={dept.id} className="border border-slate-700 bg-slate-800 shadow-lg relative overflow-hidden">
          {dept.status === "online" && <PulseAnimation color="rgba(34, 197, 94, 0.2)" />}
          {dept.status === "warning" && <PulseAnimation color="rgba(234, 179, 8, 0.2)" />}
          {dept.status === "offline" && <PulseAnimation color="rgba(239, 68, 68, 0.2)" isQuick={true} />}
          
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white">{dept.name}</CardTitle>
              <Badge className={`${getStatusClass(dept.status)} flex items-center gap-1 uppercase text-xs font-bold`}>
                {getStatusIcon(dept.status)} {dept.status}
              </Badge>
            </div>
          </CardHeader>
          
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-xs text-slate-400 mb-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> Response Time
                </div>
                <div className="text-xl font-mono font-bold">
                  {dept.status === "offline" ? "-- " : dept.responseTime + " "}
                  <span className="text-sm font-normal text-slate-400">ms</span>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-3 rounded-lg">
                <div className="text-xs text-slate-400 mb-1">Uptime</div>
                <div className="text-xl font-mono font-bold">
                  {dept.uptime}
                  <span className="text-sm font-normal text-slate-400">%</span>
                </div>
              </div>
              
              <div className="bg-slate-700/50 p-3 rounded-lg col-span-2">
                <div className="text-xs text-slate-400 mb-1">IP Range</div>
                <div className="text-base font-mono">{dept.ipRange}</div>
              </div>
            </div>
            
            {renderDeviceBar(dept)}
            
            <div className="mt-4 flex justify-between">
              <Button variant="outline" size="sm" className="border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white">
                Details
              </Button>
              {dept.status === "offline" && (
                <Button variant="destructive" size="sm">
                  Restart
                </Button>
              )}
              {dept.status === "warning" && (
                <Button variant="outline" size="sm" className="border-yellow-600 bg-yellow-600/20 text-yellow-400 hover:bg-yellow-600 hover:text-white">
                  Diagnose
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
