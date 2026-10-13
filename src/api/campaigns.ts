import api from './axios'
import { freshParams } from './freshness'
import type { ApiMeta, ApiSuccess } from '../types/api'
import type {
  Campaign,
  CampaignApplication,
  CampaignDetail,
  CampaignInput,
  MyApplication,
} from '../types/campaign'

type One = ApiSuccess<{ campaign: Campaign }>

// Public list (CDN cache; login ho to taaza)
export async function listCampaigns(params: URLSearchParams) {
  const query = new URLSearchParams(params)
  Object.entries(freshParams()).forEach(([key, value]) => query.set(key, value))
  const res = await api.get<ApiSuccess<{ campaigns: Campaign[] }>>('/campaigns', { params: query })
  return { items: res.data.data.campaigns, meta: res.data.meta as ApiMeta }
}

export async function getCampaign(id: string) {
  const res = await api.get<ApiSuccess<CampaignDetail>>(`/campaigns/${id}`)
  return res.data.data
}

// Business
export async function listMyCampaigns() {
  const res =
    await api.get<ApiSuccess<{ campaigns: Campaign[]; canPublish: boolean }>>('/campaigns/mine')
  return res.data.data
}

export async function createCampaign(input: CampaignInput) {
  const res = await api.post<One>('/campaigns', input)
  return res.data.data.campaign
}

export async function updateCampaign(id: string, input: Partial<CampaignInput>) {
  const res = await api.patch<One>(`/campaigns/${id}`, input)
  return res.data.data.campaign
}

export async function deleteCampaign(id: string) {
  await api.delete(`/campaigns/${id}`)
}

export async function listCampaignApplications(id: string) {
  const res = await api.get<
    ApiSuccess<{ campaign: Campaign; applications: CampaignApplication[] }>
  >(`/campaigns/${id}/applications`)
  return res.data.data
}

export async function respondApplication(
  campaignId: string,
  applicationId: string,
  action: 'accept' | 'reject',
) {
  const res = await api.patch<ApiSuccess<{ campaign: Campaign; application: CampaignApplication }>>(
    `/campaigns/${campaignId}/applications/${applicationId}`,
    { action },
  )
  return res.data.data
}

// Talent
export async function applyToCampaign(id: string, pitch: string) {
  await api.post(`/campaigns/${id}/apply`, { pitch })
}

export async function listMyApplications() {
  const res = await api.get<ApiSuccess<{ applications: MyApplication[] }>>(
    '/campaigns/applications/mine',
  )
  return res.data.data.applications
}

export async function withdrawApplication(applicationId: string) {
  await api.post(`/campaigns/applications/${applicationId}/withdraw`)
}
