// API service for connecting to Tradle AI backend

const API_BASE_URL = 'http://localhost:8000';

export interface ProductQuery {
  description: string;
}

export interface ProductRequest {
  description: string;
  export_country: string;
  import_country: string;
  weight_kg: number;
  shipping_mode: 'Air' | 'Sea' | 'Land';
  bom: Array<{
    hs_code: string;
    value: number;
    origin_country: string;
    is_originating: boolean;
  }>;
}

export interface HSCodeResult {
  code: string;
  description: string;
  confidence: number;
  dutyRate: number;
}

export interface HSAnalysis {
  predicted_code: string;
  confidence: number;
  reasoning: string;
  alternatives: Array<{
    code: string;
    description: string;
    confidence: number;
  }>;
}

export interface OriginResult {
  is_eligible: boolean;
  agreement: string;
  rvc_percentage: number;
  required_rvc: number;
  potential_savings: number;
}

export interface DutyBreakdown {
  base_duty: number;
  fta_duty: number;
  total_duty: number;
  shipping_cost: number;
  insurance_cost: number;
  handling_fees: number;
  total_landed_cost: number;
}

export interface Optimization {
  suggested_route: string;
  potential_savings: number;
  savings_percentage: number;
  reasoning: string;
}

export interface TradeResponse {
  hs_analysis: {
    predicted_code: string;
    confidence: number;
    alternatives: Array<{
      code: string;
      description: string;
      confidence: number;
    }>;
    reasoning: string;
  };
  origin_result: {
    is_eligible: boolean;
    applied_fta?: string;
    rvc_score: number;
    tariff_shift_met: boolean;
  };
  duty_breakdown: {
    customs_value: number;
    base_duty_amount: number;
    vat_amount: number;
    shipping_cost: number;
    total_landed_cost: number;
  };
  optimization?: {
    strategy_type: string;
    estimated_savings: number;
    actionable_advice: string;
  };
}

class ApiService {
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    console.log('Request body:', options.body);

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('API Error Response:', errorData);
        throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('API Success Response:', data);
      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async classifyProduct(query: ProductQuery): Promise<HSAnalysis> {
    return this.request<HSAnalysis>('/api/v1/classify/', {
      method: 'POST',
      body: JSON.stringify(query),
    });
  }

  async calculateTrade(request: ProductRequest): Promise<TradeResponse> {
    return this.request<TradeResponse>('/api/v1/trade/calculate', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async healthCheck(): Promise<{ status: string; service: string; version: string }> {
    return this.request('/');
  }

  async testConnection(): Promise<{ status: string; message: string; timestamp: string }> {
    return this.request('/api/v1/test/test');
  }
}

export const apiService = new ApiService();
