import React from 'react'
import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'


function Dashboard() {
  // Top cards data
  const summary = {
    totalUsers: 25,
    totalBookings: 120,
    ongoingServices: 5,
    completedServices: 115,
  };

  // Quick stats data
  const quickStats = {
    activeMechanics: 8,
    pendingRequests: 12,
    avgRating: 4.7,
  };

  // Unassigned service requests (dummy data for now)
  const unassignedRequests = [
    {
      id: "REQ-009",
      customerName: "Alice Cooper",
      serviceType: "Annual Service",
      status: "New",
      timeAgo: "30m ago",
    },
    {
      id: "REQ-010",
      customerName: "Bob Williams",
      serviceType: "Suspension",
      status: "awaiting assignment",
      timeAgo: "1h ago",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Title + subtitle */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Welcome back! Here's what's happening with your service station today.
        </p>
      </div>

      {/* Top cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Users" value={summary.totalUsers} trend="+12%" />
        <SummaryCard label="Total Bookings" value={summary.totalBookings} trend="+23%" />
        <SummaryCard
          label="Ongoing Services"
          value={summary.ongoingServices}
          trend="-2"
        />
        <SummaryCard
          label="Completed Services"
          value={summary.completedServices}
          trend="+18%"
        />
      </div>

      {/* Quick Stats card */}
      <div className="grid gap-6 md:grid-cols-2">
        <QuickStatsCard stats={quickStats} />
        <UnassignedRequestsCard requests={unassignedRequests} />
      </div>
    </div>
  );
}

/* ===== helper components in same file ===== */

function SummaryCard({ label, value, trend }) {
  return (
    <Card>
      <CardContent className="py-4 flex flex-col gap-2">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">
          {label}
        </span>
        <span className="text-2xl font-semibold">{value}</span>
        <span className="text-xs rounded-full px-2 py-0.5 bg-emerald-50 text-emerald-700 w-fit">
          {trend}
        </span>
      </CardContent>
    </Card>
  );
}

function QuickStatsCard({ stats }) {
  const { activeMechanics, pendingRequests, avgRating } = stats;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Quick Stats</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <Row label="Active Mechanics" value={activeMechanics} />
        <Row
          label="Pending Requests"
          value={pendingRequests}
          valueClass="text-amber-600"
        />
        <Row label="Average Rating" value={`${avgRating} ★`} />
      </CardContent>
    </Card>
  );
}

function UnassignedRequestsCard({ requests }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unassigned Service Requests </CardTitle>
      </CardHeader>
      <CardContent>
        {requests.length === 0 && (
          <p className="text-sm text-slate-500">No pending unassigned requests.</p>
        )}
        {
          requests.map((req) => (
            <div key={req.id} className='flex items-center justify-between rounded-lg border px-3 py-2 text-sm'>
              {/* left side: name + info */}
              <div>
                <div className='font-medium'> {req.customerName}</div>
                <div className='text-xs text-slate-500'>
                  {req.id} • {req.serviceType}
                </div>
              </div>
              {/* right side:  */}
              <div className='flex items-center gap-3'>
                <Badge className='text-xs border-purple-200 bg-purple-50 text-purple-700'>
                  {req.status}
                </Badge>
                <span className='text-xs text-slate-400'>{req.timeAgo}</span>
              </div>

            </div>
          ))
        }
      </CardContent>
    </Card>
  )
}

function Row({ label, value, valueClass = "" }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-600">{label}</span>
      <span className={`font-medium ${valueClass}`}>{value}</span>
    </div>
  );
}

export default Dashboard