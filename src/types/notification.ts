// Backend jo notification bhejta hai. Jumla frontend pe type + data se banta hai
export type NotificationType =
  | 'claim.new'
  | 'claim.new_profile'
  | 'claim.code_verified'
  | 'claim.otp_locked'
  | 'report.new'
  | 'claim.code_sent'
  | 'claim.approved'
  | 'claim.rejected'

export interface AppNotification {
  _id: string
  type: NotificationType
  data: Record<string, string>
  // Click pe kahan jana hai, jaise /admin/claims/123
  link: string
  readAt: string | null
  createdAt: string
}
