/* eslint-disable react/prop-types */
import { useParams, useNavigate } from 'react-router-dom'
import { useGetServiceById } from '../../../query/queries/serviceQueries'
import { useGetWorklogsByBookingId } from '../../../query/queries/worklogQueries'
import { Button } from '../../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card'
import { Badge } from '../../ui/badge'
import { Separator } from '../../ui/separator'
import {
  ArrowLeft,
  Calendar,
  Car,
  User,
  Wrench,
  FileText,
  IndianRupee,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  ClipboardList,
  CreditCard,
  Ban,
  Phone
} from 'lucide-react'

// Status configuration
const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock,
    color: 'text-yellow-600 bg-yellow-50 border-yellow-200'
  },
  ACCEPTED: {
    label: 'Accepted',
    variant: 'default',
    icon: CheckCircle2,
    color: 'text-blue-600 bg-blue-50 border-blue-200'
  },
  ONGOING: {
    label: 'In Progress',
    variant: 'default',
    icon: Wrench,
    color: 'text-cyan-600 bg-cyan-50 border-cyan-200'
  },
  COMPLETED: {
    label: 'Completed',
    variant: 'default',
    icon: CheckCircle2,
    color: 'text-green-600 bg-green-50 border-green-200'
  },
  CANCELLED: {
    label: 'Cancelled',
    variant: 'destructive',
    icon: XCircle,
    color: 'text-red-600 bg-red-50 border-red-200'
  }
}

const PAYMENT_STATUS_CONFIG = {
  PENDING: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  PAID: { label: 'Paid', color: 'bg-green-100 text-green-800 border-green-300' },
  FAILED: { label: 'Failed', color: 'bg-red-100 text-red-800 border-red-300' }
}

function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING
  const Icon = config.icon

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border font-semibold ${config.color}`}>
      <Icon className="w-4 h-4" />
      <span>{config.label}</span>
    </div>
  )
}

function PaymentBadge({ status }) {
  const config = PAYMENT_STATUS_CONFIG[status] || PAYMENT_STATUS_CONFIG.PENDING

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold ${config.color}`}>
      <CreditCard className="w-3 h-3" />
      {config.label}
    </span>
  )
}

function InfoRow({ icon: Icon, label, value, className = '' }) {
  return (
    <div className={`flex items-start gap-3 ${className}`}>
      <div className="mt-0.5 shrink-0">
        <Icon className="w-5 h-5 text-muted-foreground" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-muted-foreground">{label}</p>
        <p className="text-base font-semibold break-all">{value || 'N/A'}</p>
      </div>
    </div>
  )
}

export default function ServiceDetailsPage() {
  const { serviceId } = useParams()
  const navigate = useNavigate()

  const { data: serviceData, isLoading: serviceLoading, error: serviceError } = useGetServiceById(serviceId)
  const { data: worklogsData, isLoading: worklogsLoading } = useGetWorklogsByBookingId(serviceId)

  // Loading state
  if (serviceLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[300px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary/60 mb-3"></div>
        <span className="text-lg text-muted-foreground">Loading service details...</span>
      </div>
    )
  }

  // Error state
  if (serviceError) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <AlertCircle className="w-16 h-16 text-destructive" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Error Loading Service</h2>
                <p className="text-muted-foreground">{serviceError.message || 'Failed to load service details'}</p>
              </div>
              <Button onClick={() => navigate('/customers/myservices')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const service = serviceData?.data

  if (!service) {
    return (
      <div className="max-w-2xl mx-auto p-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center gap-4">
              <FileText className="w-16 h-16 text-muted-foreground" />
              <div>
                <h2 className="text-2xl font-bold mb-2">Service Not Found</h2>
                <p className="text-muted-foreground">The service you&apos;re looking for doesn&apos;t exist.</p>
              </div>
              <Button onClick={() => navigate('/customers/myservices')} variant="outline">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Services
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const worklogs = worklogsData?.data || []

  // Format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch {
      return dateString
    }
  }

  const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    } catch {
      return dateString
    }
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-6">
        <div className="flex items-start flex-col gap-2 sm:gap-3 sm:flex-row sm:items-center sm:justify-start flex-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate('/customers/myservices')}
            className="rounded-full shadow-sm border-neutral-200 hover:bg-accent shrink-0"
            aria-label="Back to My Services"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight leading-tight mt-2 sm:mt-0">
              Service Details
            </h1>
            <p className="text-xs text-muted-foreground font-medium mt-1">
              Service ID: <span className="font-semibold text-card-foreground">#{service.id}</span>
            </p>
          </div>
        </div>
        <div className="mt-2 sm:mt-0 flex items-center">
          <StatusBadge status={service.status} />
        </div>
      </div>

      {/* Service Overview Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wrench className="w-5 h-5" />
            Service Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Service Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InfoRow
              icon={FileText}
              label="Service Type"
              value={service.catalog?.serviceName}
            />
            <InfoRow
              icon={IndianRupee}
              label="Base Price"
              value={service?.totalAmount ? `₹${Number(service.catalog.basePrice).toLocaleString('en-IN')}` : 'N/A'}
            />
            <InfoRow
              icon={Calendar}
              label="Requested On"
              value={formatDate(service.createdOn)}
            />
            <InfoRow
              icon={Calendar}
              label="Booking Date"
              value={formatDate(service.bookingDate)}
            />
            <InfoRow
              icon={Clock}
              label="Last Updated"
              value={formatDateTime(service.lastUpdated)}
            />
          </div>

          <Separator />

          {/* Vehicle and Mechanic Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Vehicle */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Car className="w-4 h-4" />
                Vehicle
              </p>
              {service.vehicle ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Car className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex items-center justify-between w-full gap-2">
                    <h4 className="font-semibold text-base">
                      {service.vehicle.brand} {service.vehicle.model}
                    </h4>
                    {/* <p className="text-sm text-muted-foreground">
                      {service.vehicle.regNumber}
                    </p> */}
                    {service.vehicle.licenseNumber && (
                      <p className="text-sm text-muted-foreground">
                        {service.vehicle.licenseNumber}
                      </p>
                    )}
                    {/* {service.vehicle.year && (
                      <p className="text-xs text-muted-foreground mt-1">
                        Year: {service.vehicle.year}
                      </p>
                    )} */}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                  No vehicle information
                </p>
              )}
            </div>

            {/* Mechanic */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <User className="w-4 h-4" />
                Assigned Mechanic
              </p>
              {service.mechanic ? (
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <User className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex flex-1 items-center justify-between min-w-0">
                    <h4 className="font-semibold text-base">
                      {service.mechanic.name}
                    </h4>
                    {service.mechanic.phone && (
                      <p className="text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <span>
                            <Phone className="inline w-4 h-4 mr-1 text-muted-foreground" />
                          </span>
                          {service.mechanic.phone}
                        </span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/50">
                  No mechanic assigned yet
                </p>
              )}
            </div>
          </div>

          {service.catalog?.description && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Service Description</p>
                <p className="text-sm">{service.catalog.description}</p>
              </div>
            </>
          )}

          {service.customerNotes && (
            <>
              <Separator />
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Your Notes</p>
                <p className="text-sm bg-muted p-3 rounded-lg">{service.customerNotes}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Payment & Pricing - Only show if service is not cancelled */}
      {service.status !== 'CANCELLED' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <IndianRupee className="w-5 h-5" />
              Payment Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Cost Breakdown */}
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Service Charge</span>
                <span className="font-semibold">

                  ₹{service.catalog?.basePrice ? Number(service.catalog.basePrice) : '0.00'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-muted-foreground">Parts & Materials</span>
                <span className="font-semibold">
                  ₹{service.partsTotal != null ? Number(service.partsTotal).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex items-center justify-between py-3 bg-muted/50 px-4 rounded-lg">
                <span className="text-lg font-semibold">Total Amount</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{service.totalAmount != null ? Number(service.totalAmount).toLocaleString('en-IN', { minimumFractionDigits: 2 }) : '0.00'}
                </span>
              </div>
            </div>

            {/* Payment Status & Action */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Status:</span>
                <PaymentBadge status={service.paymentStatus} />
              </div>

              {service.paymentStatus !== 'PAID' && service.status === 'COMPLETED' && (
                <Button
                  onClick={() => navigate('/customers/payment', { state: { serviceId: service.id } })}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CreditCard className="w-4 h-4 mr-2" />
                  Pay Now
                </Button>
              )}
            </div>

            {/* Success Message */}
            {service.paymentStatus === 'PAID' && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span className="text-sm font-medium">Payment completed successfully</span>
              </div>
            )}
          </CardContent>
        </Card>
      )
      }

      {/* Cancellation Information (if cancelled) */}
      {
        service.status === 'CANCELLED' && (
          <Card className="border-destructive/50 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Ban className="w-5 h-5" />
                Cancellation Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InfoRow
                  icon={AlertCircle}
                  label="Cancelled By"
                  value={service.cancelledByAdmin ? 'Admin' : 'System'}
                />
                <InfoRow
                  icon={Calendar}
                  label="Cancelled At"
                  value={formatDateTime(service.cancelledAt)}
                />
                {service.rescheduledDate && (
                  <div className="flex items-center justify-between sm:items-start p-3 bg-muted/50 border rounded-lg md:col-span-2">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground mb-0.5">Proposed Reschedule Date</p>
                      <p className="text-base font-semibold text-foreground">{formatDate(service.rescheduledDate)}</p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => { }}
                      className="shadow-sm"
                    >
                      Accept New Date
                    </Button>
                  </div>
                )}
              </div>
              {service.cancellationReason && (
                <>
                  <Separator />
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-2">Reason</p>
                    <p className="text-sm bg-background p-3 rounded-lg border border-destructive/30">
                      {service.cancellationReason}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        )
      }

      {/* Work Logs */}
      {
        worklogs.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ClipboardList className="w-5 h-5" />
                Work Progress
                <Badge variant="secondary" className="ml-2">{worklogs.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {worklogsLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {worklogs.map((log, index) => (
                    <div
                      key={log.id || index}
                      className="flex gap-4 p-4 rounded-lg border bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="shrink-0">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                          <Wrench className="w-4 h-4 text-primary" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <p className="font-semibold">{log.description || 'Work Update'}</p>
                          <span className="text-xs text-muted-foreground whitespace-nowrap">
                            {formatDateTime(log.createdAt)}
                          </span>
                        </div>
                        {log.notes && (
                          <p className="text-sm text-muted-foreground">{log.notes}</p>
                        )}
                        {log.mechanicName && (
                          <p className="text-xs text-muted-foreground mt-2">
                            By: {log.mechanicName}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        )
      }
    </div >
  )
}
