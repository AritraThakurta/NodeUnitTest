export interface FrontendLowFareRequest {
    passengers?: {
      types?: { type: string; count: string }[];
      residentCountry?: string;
    };
    criteria?: {
      stations?: {
        originStationCodes?: string[];
        destinationStationCodes?: string[];
      };
      dates?: { beginDate?: string };
    }[];
    codes?: { currencyCode?: string };
  }
  
  export interface NavitaireLowFareRequest {
    byPassCache: boolean;
    codes: { currency: string };
    criteria: {
      beginDate: string;
      endDate: string;
      originStationCodes: string[];
      destinationStationCodes: string[];
    }[];
    getAllDetails: boolean;
    includeTaxesAndFees: boolean;
    passengers: {
      residentCountry: string;
      types: { type: string; count: number }[];
    };
  }
  
  function parseDDMMYYYY(dateStr: string): Date {
    const [day, month, year] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  }
  
  function formatToDDMMYYYY(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }
  
  export function mapToNavitaireRequest(
    frontendRequest: FrontendLowFareRequest | null | undefined
  ): NavitaireLowFareRequest {
    if (!frontendRequest) {
      throw new Error("FrontendLowFareRequest is required");
    }
  
    const currency = frontendRequest.codes?.currencyCode?.trim() ?? 'USD';
  
    const criteria = Array.isArray(frontendRequest.criteria)
      ? frontendRequest.criteria.map((c, idx) => {
          if (!c?.dates?.beginDate) {
            throw new Error(`beginDate is required in criteria at index ${idx}`);
          }
  
          const begin = parseDDMMYYYY(c.dates.beginDate);
          if (isNaN(begin.getTime())) {
            throw new Error(`Invalid beginDate format in criteria at index ${idx}: ${c.dates.beginDate}`);
          }
  
          const end = new Date(begin);
          end.setDate(end.getDate() + 10);
  
          return {
            beginDate: formatToDDMMYYYY(begin),
            endDate: formatToDDMMYYYY(end),
            originStationCodes: c.stations?.originStationCodes || [],
            destinationStationCodes: c.stations?.destinationStationCodes || [],
          };
        })
      : [];
  
    const passengers = {
      residentCountry: frontendRequest.passengers?.residentCountry?.trim() || '',
      types: Array.isArray(frontendRequest.passengers?.types)
        ? frontendRequest.passengers.types.map((p) => ({
            type: p?.type || '',
            count: p?.count ? parseInt(p.count, 10) || 0 : 0,
          }))
        : [],
    };
  
    return {
      byPassCache: false,
      codes: { currency },
      criteria,
      getAllDetails: true,
      includeTaxesAndFees: true,
      passengers,
    };
  }
  