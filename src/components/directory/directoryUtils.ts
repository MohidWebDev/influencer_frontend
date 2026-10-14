import type { ReviewItemData } from '../agreements/PublicReviews'
import type { DirectoryReview } from '../../types/directory'

// "https://www.acme.com/about" -> "acme.com"
export const hostOf = (url: string) => {
  try {
    return new URL(url).hostname.replace(/^www\./, '')
  } catch {
    return url
  }
}

// Talent ki likhi review -> reviews ki aam shakal (naam pe talent ka profile)
export const fromTalent = (review: DirectoryReview): ReviewItemData => ({
  _id: review._id,
  rating: review.rating,
  comment: review.comment,
  createdAt: review.createdAt,
  name: review.reviewer,
  href: review.reviewerSlug ? `/people/${review.reviewerSlug}` : undefined,
  photoUrl: review.reviewerPhoto,
})

// Card / page pe tasveer: business ka logo, manager ki photo
export const imageOf = (entry: object) =>
  ('logoUrl' in entry ? (entry.logoUrl as string | undefined) : undefined) ??
  ('photoUrl' in entry ? (entry.photoUrl as string | undefined) : undefined)
