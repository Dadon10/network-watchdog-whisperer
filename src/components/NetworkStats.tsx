
import { Department } from "@/hooks/useNetworkMonitoring";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

interface NetworkStatsProps {
  departments: Department[];
}

export const NetworkStats = ({ departments }: NetworkStatsProps) => {
  // Generate mock historical data for the charts
  const generateMockData = (department: Department) => {
    const data = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const time = new Date(now.getTime() - i * 5 * 60000); // 5 minutes intervals
      let responseTime = 0;
      
      if (department.status === "offline" && i < 2) {
        responseTime = 0; // Last 10 minutes offline
      } else if (department.status === "warning" && i < 2) {
        responseTime = 35 + Math.random() * 20; // Last 10 minutes high latency
      } else {
        responseTime = 10 + Math.random() * 15; // Normal operation
      }
      
      data.push({
        time: time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        responseTime: Math.round(responseTime)
      });
    }
    
    return data;
  };

  // Calculate summary statistics
  const getOverallStatus = () => {
    const offline = departments.filter(d => d.status === "offline").length;
    const warning = departments.filter(d => d.status === "warning").length;
    const online = departments.filter(d => d.status === "online").length;
    
    if (offline > 0) {
      return {
        label: "Critical",
        description: `${offline} department${offline > 1 ? 's' : ''} offline`,
        class: "bg-red-500 text-white"
      };
    } else if (warning > 0) {
      return {
        label: "Warning",
        description: `${warning} department${warning > 1 ? 's' : ''} with issues`,
        class: "bg-yellow-500 text-white"
      };
    } else {
      return {
        label: "Healthy",
        description: "All systems operational",
        class: "bg-green-500 text-white"
      };
    }
  };

  const overallStatus = getOverallStatus();
  
  const totalDevices = departments.reduce((acc, dept) => acc + dept.devicesConnected, 0);

  const averageResponseTime = departments
    .filter(d => d.status !== "offline")
    .reduce((acc, dept, i, arr) => acc + dept.responseTime / arr.length, 0)
    .toFixed(1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border border-slate-700 bg-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">NETWORK STATUS</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <Badge className={`${overallStatus.class} px-3 py-1`}>
                {overallStatus.label}
              </Badge>
              <span className="text-sm text-slate-300">{overallStatus.description}</span>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-700 bg-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">CONNECTED DEVICES</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{totalDevices}</div>
            <div className="text-xs text-slate-400 mt-1">Across all departments</div>
          </CardContent>
        </Card>
        
        <Card className="border border-slate-700 bg-slate-800">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-400">AVG RESPONSE TIME</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white">{averageResponseTime}<span className="text-base font-normal text-slate-400 ml-1">ms</span></div>
            <div className="text-xs text-slate-400 mt-1">For online departments</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {departments.map(dept => (
          <Card key={dept.id} className="border border-slate-700 bg-slate-800">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-white">{dept.name}</CardTitle>
                <Badge className={`${dept.status === 'online' ? 'bg-green-500' : dept.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'} text-white`}>
                  {dept.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="h-[180px] w-full mt-2">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={generateMockData(dept)}>
                    <XAxis 
                      dataKey="time" 
                      stroke="#475569" 
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      stroke="#475569"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      domain={['dataMin - 5', 'dataMax + 5']}
                      tickFormatter={(value) => `${value}ms`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#1e293b',
                        border: '1px solid #334155',
                        borderRadius: '4px',
                      }}
                      labelStyle={{ color: '#f8fafc' }}
                      itemStyle={{ color: '#60a5fa' }}
                      formatter={(value) => [`${value}ms`, 'Response Time']}
                      labelFormatter={(label) => `Time: ${label}`}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="responseTime" 
                      stroke="#60a5fa" 
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
