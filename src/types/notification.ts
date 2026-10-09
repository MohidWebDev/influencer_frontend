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
  | 'business.new'
  | 'business.code_verified'
  | 'business.otp_locked'
  | 'agreement.disputed_admin'
  | 'agreement.proposed'
  | 'agreement.updated'
  | 'agreement.signed'
  | 'agreement.active'
  | 'agreement.cancelled'
  | 'agreement.delivered'
  | 'agreement.approved'
  | 'agreement.changes_requested'
  | 'agreement.completed'
  | 'agreement.disputed'
  | 'agreement.resolved'
  | 'agreement.reviewed'
  | 'business.code_sent'
  | 'business.approved'
  | 'business.rejected'
  | 'hire.new'
  | 'hire.cancelled'
  | 'hire.accepted'
  | 'hire.declined'

export interface AppNotification {
  _id: string
  type: NotificationType
  data: Record<string, string>
  // Click pe kahan jana hai, jaise /admin/claims/123
  link: string
  readAt: string | null
  createdAt: string
}
