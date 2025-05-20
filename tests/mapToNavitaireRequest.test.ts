import { mapToNavitaireRequest } from '../src/mapToNavitaireRequest';

describe('mapToNavitaireRequest', () => {
  it('should map a valid request correctly', () => {
    const input = {
      passengers: {
        residentCountry: 'IN',
        types: [{ type: 'ADT', count: '2' }]
      },
      codes: { currencyCode: 'INR' },
      criteria: [{
        dates: { beginDate: '01-06-2025' },
        stations: {
          originStationCodes: ['DEL'],
          destinationStationCodes: ['BOM']
        }
      }]
    };

    const result = mapToNavitaireRequest(input);
    expect(result.codes.currency).toBe('INR');
    expect(result.criteria[0].beginDate).toBe('01-06-2025');
    expect(result.criteria[0].endDate).toBe('11-06-2025');
    expect(result.passengers.types[0]).toEqual({ type: 'ADT', count: 2 });
  });

  it('should throw error when beginDate is missing', () => {
    const input = {
      criteria: [{}]
    } as any;

    expect(() => mapToNavitaireRequest(input)).toThrow(
      'beginDate is required in criteria at index 0'
    );
  });
});
