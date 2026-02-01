import React from 'react'
import { Card, CardTitle, CardDescription, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useMemo } from 'react'
import { toast } from 'sonner'
import { useGetAdminDashboard } from '@/query/queries/adminQueries'
import { Loader2 } from 'lucide-react'


function Dashboard() {
  const { data: response, isLoading, isError } = useGetAdminDashboard()

  // DEBUG: Log raw response to verify structure
  if (response) {
    console.log("Dashboard API Response:", response)
  }

  // Use memo to safely extract and map data from the backend response
  const dashboardData = useMemo(() => {
    // If response.data exists, use it. Otherwise fall back.
    // The query hook manages data state, so we just map it here.
    const backendData = response?.data || {}

    return {
      summary: backendData.summary || {},
      quickStats: backendData.quickStats || {},
      unassignedRequests: backendData.unassignedRequests || []
    }
  }, [response])

  const summary = useMemo(() => {
    return {
      totalUsers: dashboardData.summary.totalUsers || 0,
      totalBookings: dashboardData.summary.totalBookings || 0,
      ongoingServices: dashboardData.summary.ongoingServices || 0,
      completedServices: dashboardData.summary.completedServices || 0
    }
  }, [dashboardData])

  const quickStats = useMemo(() => {
    return {
      activeMechanics: dashboardData.quickStats.activeMechanics || 0,
      pendingRequests: dashboardData.quickStats.pendingRequests || 0,
      avgRating: dashboardData.quickStats.avgRating || 0
    }
  }, [dashboardData])

  const unassignedRequests = useMemo(() => {
    return (dashboardData.unassignedRequests || []).map(req => ({
      id: req.id,
      customerName: req.customerName,
      serviceType: req.serviceType,
      status: req.status,
      timeAgo: req.timeAgo
    }))
  }, [dashboardData])

  if (isLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    )
  }

  if (isError) {
    return (
      <div className="p-8 text-center text-red-500">
        Failed to load dashboard data. Please refresh lightly.
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6 px-8 py-6">
      {/* Title + subtitle */}
      <div>
        <h1 className="text-2xl font-semibold">Dashboard Overview</h1>
        <p className="text-sm text-slate-500">
          Welcome back! Here's what's happening with your service station today.
        </p>
      </div>

      {/* Top cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <SummaryCard label="Total Users" value={summary.totalUsers} trend="" />
        <SummaryCard label="Total Bookings" value={summary.totalBookings} trend="" />
        <SummaryCard
          label="Ongoing Services"
          value={summary.ongoingServices}
          trend=""
        />
        <SummaryCard
          label="Completed Services"
          value={summary.completedServices}
          trend=""
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
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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
    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
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