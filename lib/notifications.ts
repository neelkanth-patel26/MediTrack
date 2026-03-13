import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function createNotification({
  userId,
  title,
  message,
  type,
  priority = 'medium',
  entityType,
  entityId,
  actionUrl
}: {
  userId: string
  title: string
  message: string
  type: 'lab_report' | 'appointment' | 'prescription' | 'message' | 'system' | 'admin'
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  entityType?: string
  entityId?: string
  actionUrl?: string
}) {
  try {
    const { data, error } = await supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title,
        message,
        type,
        priority,
        entity_type: entityType,
        entity_id: entityId,
        action_url: actionUrl
      })
      .select()

    if (error) throw error
    return data[0]
  } catch (error) {
    console.error('Error creating notification:', error)
    return null
  }
}

export async function notifyLabReport(doctorUserId: string, patientName: string, reportType: string, reportId: string) {
  return createNotification({
    userId: doctorUserId,
    title: 'New Lab Report Available',
    message: `Lab report for ${patientName} (${reportType}) is ready for review`,
    type: 'lab_report',
    priority: 'high',
    entityType: 'lab_report',
    entityId: reportId,
    actionUrl: `/doctor/lab-reports?reportId=${reportId}`
  })
}

export async function notifyAppointmentUpdate(userId: string, patientName: string, status: string, appointmentId: string) {
  const statusMessages = {
    confirmed: 'confirmed',
    cancelled: 'cancelled',
    completed: 'completed',
    rescheduled: 'rescheduled'
  }
  
  return createNotification({
    userId,
    title: 'Appointment Update',
    message: `Appointment with ${patientName} has been ${statusMessages[status as keyof typeof statusMessages] || 'updated'}`,
    type: 'appointment',
    priority: status === 'cancelled' ? 'high' : 'medium',
    entityType: 'appointment',
    entityId: appointmentId,
    actionUrl: `/doctor/appointments?appointmentId=${appointmentId}`
  })
}

export async function notifyPrescriptionRefill(doctorUserId: string, patientName: string, medicationName: string, prescriptionId: string) {
  return createNotification({
    userId: doctorUserId,
    title: 'Prescription Refill Request',
    message: `${patientName} has requested a refill for ${medicationName}`,
    type: 'prescription',
    priority: 'medium',
    entityType: 'prescription',
    entityId: prescriptionId,
    actionUrl: `/doctor/prescriptions?prescriptionId=${prescriptionId}`
  })
}

export async function notifyNewMessage(userId: string, senderName: string, subject: string, messageId: string) {
  return createNotification({
    userId,
    title: 'New Message',
    message: `New message from ${senderName}: ${subject}`,
    type: 'message',
    priority: 'medium',
    entityType: 'message',
    entityId: messageId,
    actionUrl: `/doctor/messages?messageId=${messageId}`
  })
}

export async function notifySystemUpdate(userId: string, title: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') {
  return createNotification({
    userId,
    title,
    message,
    type: 'system',
    priority,
    entityType: 'system',
    actionUrl: '/announcements'
  })
}

export async function notifyAdminUpdate(userId: string, title: string, message: string, priority: 'low' | 'medium' | 'high' | 'urgent' = 'medium') {
  return createNotification({
    userId,
    title,
    message,
    type: 'admin',
    priority,
    entityType: 'admin',
    actionUrl: '/announcements'
  })
}