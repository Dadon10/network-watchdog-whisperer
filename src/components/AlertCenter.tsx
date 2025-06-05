
import { Alert } from "@/hooks/useNetworkMonitoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Check, Clock, WifiOff, AlertCircle } from "lucide-react";

interface AlertCenterProps {
  alerts: Alert[];
  onAcknowledge: (alertId: string) => void;
}

export const AlertCenter = ({ alerts, onAcknowledge }: AlertCenterProps) => {
  const getAlertTypeIcon = (type: string) => {
    switch (type) {
      case "network_down":
        return <WifiOff className="h-4 w-4" />;
      case "high_latency":
        return <Clock className="h-4 w-4" />;
      case "device_offline":
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertTriangle className="h-4 w-4" />;
    }
  };

  const getAlertSeverityClass = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500 text-white border-red-600";
      case "warning":
        return "bg-yellow-500 text-white border-yellow-600";
      case "info":
        return "bg-blue-500 text-white border-blue-600";
      default:
        return "bg-gray-500 text-white border-gray-600";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h2 className="text-xl font-semibold text-white">Active Alerts</h2>
        </div>
        <Badge variant="outline" className="bg-slate-800 border-slate-700 text-slate-300">
          {alerts.filter(a => !a.acknowledged).length} unacknowledged
        </Badge>
      </div>
      
      {alerts.length === 0 ? (
        <Card className="border border-slate-700 bg-slate-800">
          <CardContent className="pt-6 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center mb-3">
              <Check className="h-6 w-6 text-green-500" />
            </div>
            <p className="text-slate-300">No alerts at this time. All systems operational.</p>
          </CardContent>
        </Card>
      ) : (
        alerts.map(alert => (
          <Card key={alert.id} className={`border ${alert.acknowledged ? 'border-slate-700 bg-slate-800/50' : 'border-red-900/50 bg-red-900/10 shadow-md'}`}>
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div className="flex gap-2 items-center">
                  <Badge className={`${getAlertSeverityClass(alert.severity)} flex items-center gap-1 uppercase text-xs font-bold`}>
                    {getAlertTypeIcon(alert.type)} {alert.severity}
                  </Badge>
                  <div className="text-base font-semibold text-white">
                    {alert.departmentName}
                  </div>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatTime(new Date(alert.timestamp))}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="mb-4">
                <p className={`${alert.acknowledged ? 'text-slate-400' : 'text-white'}`}>
                  {alert.message}
                </p>
              </div>
              <div className="flex justify-between">
                {!alert.acknowledged && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="border-slate-700 hover:bg-slate-700"
                    onClick={() => onAcknowledge(alert.id)}
                  >
                    <Check className="h-4 w-4 mr-1" /> Acknowledge
                  </Button>
                )}
                {alert.acknowledged && (
                  <Badge variant="outline" className="bg-slate-700/50 border-slate-600 text-slate-400">
                    Acknowledged
                  </Badge>
                )}
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="border-slate-700 hover:bg-slate-700"
                >
                  Details
                </Button>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
