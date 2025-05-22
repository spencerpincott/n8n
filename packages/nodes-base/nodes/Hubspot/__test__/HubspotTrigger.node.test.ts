import { ILoadOptionsFunctions } from 'n8n-workflow';
import { HubspotTrigger } from '../HubspotTrigger.node';

// Mock the GenericFunctions module
const mockHubspotApiRequest = jest.fn();
jest.mock('../V1/GenericFunctions', () => ({
  ...jest.requireActual('../V1/GenericFunctions'), // Import and retain other exports
  hubspotApiRequest: (...args: any[]) => mockHubspotApiRequest(...args),
}));

describe('HubspotTrigger', () => {
  describe('methods.loadOptions.getTicketProperties', () => {
    // Reset the mock before each test
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should return transformed properties on successful API call', async () => {
      const mockApiResponse = [
        { label: 'Ticket Name', name: 'ticket_name' },
        { label: 'Ticket Status', name: 'ticket_status' },
      ];
      const expectedOutput = [
        { name: 'Ticket Name', value: 'ticket_name' },
        { name: 'Ticket Status', value: 'ticket_status' },
      ];

      mockHubspotApiRequest.mockResolvedValue(mockApiResponse);

      const trigger = new HubspotTrigger();
      const result = await trigger.methods.loadOptions.getTicketProperties.call({} as ILoadOptionsFunctions);

      expect(result).toEqual(expectedOutput);
      expect(mockHubspotApiRequest).toHaveBeenCalledWith('GET', '/properties/v2/tickets/properties', {});
    });

    it('should return an empty array when API returns no properties', async () => {
      const mockApiResponse: any[] = [];
      const expectedOutput: any[] = [];

      mockHubspotApiRequest.mockResolvedValue(mockApiResponse);

      const trigger = new HubspotTrigger();
      const result = await trigger.methods.loadOptions.getTicketProperties.call({} as ILoadOptionsFunctions);

      expect(result).toEqual(expectedOutput);
      expect(mockHubspotApiRequest).toHaveBeenCalledWith('GET', '/properties/v2/tickets/properties', {});
    });

    it('should throw an error when API call fails', async () => {
      const apiError = new Error('API Error');
      mockHubspotApiRequest.mockRejectedValue(apiError);

      const trigger = new HubspotTrigger();

      await expect(trigger.methods.loadOptions.getTicketProperties.call({} as ILoadOptionsFunctions))
        .rejects
        .toThrow(apiError);

      expect(mockHubspotApiRequest).toHaveBeenCalledWith('GET', '/properties/v2/tickets/properties', {});
    });
  });
});
