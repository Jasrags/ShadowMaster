import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST, DELETE } from '../route';
import { NextRequest } from 'next/server';
import * as sessionModule from '@/lib/auth/session';
import * as campaignsStorage from '@/lib/storage/campaigns';
import * as locationsStorage from '@/lib/storage/locations';
import type { Campaign, Location, LocationConnection } from '@/lib/types';

vi.mock('@/lib/auth/session');
vi.mock('@/lib/storage/campaigns');
vi.mock('@/lib/storage/locations');
vi.mock('@/lib/storage/activity');

function createMockRequest(url: string, body?: unknown, method = 'GET'): NextRequest {
    const request = new NextRequest(url, {
        method,
        body: body ? JSON.stringify(body) : undefined,
    });
    if (body) {
        request.json = async () => body;
    }
    return request;
}

describe('Location Connections API', () => {
    const campaignId = 'test-campaign-id';
    const locationId = 'test-location-id';
    const userId = 'test-user-id';
    const mockCampaign = {
        id: campaignId,
        gmId: userId,
        playerIds: [],
    };
    const mockLocation = {
        id: locationId,
        campaignId,
        name: 'Test Location',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(sessionModule.getSession).mockResolvedValue(userId);
        vi.mocked(campaignsStorage.getCampaignsByUserId).mockResolvedValue([mockCampaign as unknown as Campaign]);
        vi.mocked(locationsStorage.getLocation).mockResolvedValue(mockLocation as unknown as Location);
    });

    describe('GET', () => {
        it('should return connections for a location', async () => {
            const mockConnections = [{ id: 'conn-1', fromLocationId: locationId, toLocationId: 'loc-2' }];
            vi.mocked(locationsStorage.getLocationConnections).mockResolvedValue(mockConnections as unknown as LocationConnection[]);

            const request = createMockRequest(`http://localhost/api/locations/${locationId}/connections`);
            const response = await GET(request, { params: Promise.resolve({ id: locationId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(data.connections).toEqual(mockConnections);
        });

        it('should return 401 if not authenticated', async () => {
            vi.mocked(sessionModule.getSession).mockResolvedValue(null);
            const request = createMockRequest(`http://localhost/api/locations/${locationId}/connections`);
            const response = await GET(request, { params: Promise.resolve({ id: locationId }) });
            expect(response.status).toBe(401);
        });
    });

    describe('POST', () => {
        it('should create a connection if user is GM', async () => {
            const body = { toLocationId: 'loc-2', connectionType: 'physical' };
            vi.mocked(locationsStorage.getLocation).mockImplementation(async (_cId, lId) => {
                if (lId === locationId || lId === 'loc-2') return { id: lId, campaignId, name: 'Loc' } as unknown as Location;
                return null;
            });
            vi.mocked(locationsStorage.createLocationConnection).mockResolvedValue({ id: 'conn-1', ...body, fromLocationId: locationId, bidirectional: false } as unknown as LocationConnection);

            const request = createMockRequest(`http://localhost/api/locations/${locationId}/connections`, body, 'POST');
            const response = await POST(request, { params: Promise.resolve({ id: locationId }) });
            const data = await response.json();

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(locationsStorage.createLocationConnection).toHaveBeenCalled();
        });

        it('should return 403 if user is not GM', async () => {
            vi.mocked(campaignsStorage.getCampaignsByUserId).mockResolvedValue([{ ...mockCampaign, gmId: 'other-user' } as unknown as Campaign]);
            const body = { toLocationId: 'loc-2', connectionType: 'physical' };
            
            const request = createMockRequest(`http://localhost/api/locations/${locationId}/connections`, body, 'POST');
            const response = await POST(request, { params: Promise.resolve({ id: locationId }) });
            expect(response.status).toBe(403);
        });
    });

    describe('DELETE', () => {
        it('should delete a connection if user is GM', async () => {
            const request = createMockRequest(`http://localhost/api/locations/${locationId}/connections?connectionId=conn-1`, undefined, 'DELETE');
            const response = await DELETE(request, { params: Promise.resolve({ id: locationId }) });
            const data = await response.json();

            if (response.status !== 200) {
                console.log('DELETE failed:', data);
            }

            expect(response.status).toBe(200);
            expect(data.success).toBe(true);
            expect(locationsStorage.deleteLocationConnection).toHaveBeenCalledWith(campaignId, 'conn-1');
        });
    });
});
