import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface KpiCard {
  label:   string;
  value:   string;
  change:  number;
  icon:    string;
}

export interface SalesTrend {
  date:    string;
  revenue: number;
  orders:  number;
}

export interface TopProduct {
  rank:     number;
  name:     string;
  category: string;
  revenue:  number;
  units:    number;
  trend:    number;
}

export interface FunnelStage {
  stage:      string;
  count:      number;
  percentage: number;
}

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private base = 'http://localhost:8000/api';

  constructor(private http: HttpClient) {}

  getKpis(): Observable<KpiCard[]> {
    return this.http.get<KpiCard[]>(`${this.base}/kpis`);
  }

  getSalesTrends(days = 30): Observable<SalesTrend[]> {
    return this.http.get<SalesTrend[]>(`${this.base}/trends?days=${days}`);
  }

  getTopProducts(): Observable<TopProduct[]> {
    return this.http.get<TopProduct[]>(`${this.base}/products`);
  }

  getAcquisitionFunnel(): Observable<FunnelStage[]> {
    return this.http.get<FunnelStage[]>(`${this.base}/funnel`);
  }

  getRevenueByCategory(): Observable<{ category: string; revenue: number }[]> {
    return this.http.get<{ category: string; revenue: number }[]>(`${this.base}/categories`);
  }
}