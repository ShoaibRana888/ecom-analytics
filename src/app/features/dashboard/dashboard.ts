import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';

import { MatCardModule }         from '@angular/material/card';
import { MatIconModule }         from '@angular/material/icon';
import { MatProgressBarModule }  from '@angular/material/progress-bar';
import { MatTableModule }        from '@angular/material/table';
import { MatChipsModule }        from '@angular/material/chips';
import { MatButtonModule }       from '@angular/material/button';
import { FilterService } from '../../core/services/filter';

import {
  AnalyticsService,
  KpiCard,
  TopProduct,
  FunnelStage,
  SalesTrend,
} from '../../core/services/analytics';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatTableModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class DashboardComponent implements OnInit {
  kpis: KpiCard[]         = [];
  topProducts: TopProduct[] = [];
  funnelStages: FunnelStage[] = [];
  loading = true;

  revenueChartData: ChartData<'line'> = { labels: [], datasets: [] };
  revenueChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: { mode: 'index', intersect: false },
    },
    scales: {
      x: { grid: { display: false } },
      y: {
        grid: { color: 'rgba(0,0,0,.05)' },
        ticks: { callback: (v) => '$' + (+v / 1000).toFixed(0) + 'k' },
      },
    },
    elements: {
      line:  { tension: 0.4 },
      point: { radius: 0, hoverRadius: 6 },
    },
  };

  categoryChartData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  categoryChartOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: { legend: { position: 'right' } },
  };

  displayedColumns = ['rank', 'name', 'category', 'revenue', 'units', 'trend'];

  constructor(private analytics: AnalyticsService, private filter: FilterService) {}

  ngOnInit() {
  this.filter.range$.subscribe(days => {
    this.loading = true;
    forkJoin({
      kpis:       this.analytics.getKpis(),
      trends:     this.analytics.getSalesTrends(days),
      products:   this.analytics.getTopProducts(),
      funnel:     this.analytics.getAcquisitionFunnel(),
      categories: this.analytics.getRevenueByCategory(),
    }).subscribe(({ kpis, trends, products, funnel, categories }) => {
      this.kpis         = kpis;
      this.topProducts  = products;
      this.funnelStages = funnel;
      this.buildRevenueChart(trends);
      this.buildCategoryChart(categories);
      this.loading = false;
    });
  });
}

private buildRevenueChart(trends: SalesTrend[]) {
  this.revenueChartData = {
    labels: trends.map(t => t.date),
    datasets: [{
      data:            trends.map(t => t.revenue),
      borderColor:     '#4f46e5',
      backgroundColor: 'rgba(79,70,229,.08)',
      fill:            true,
      borderWidth:     2,
    }],
  };
}

private buildCategoryChart(categories: { category: string; revenue: number }[]) {
  this.categoryChartData = {
    labels: categories.map(c => c.category),
    datasets: [{
      data:            categories.map(c => c.revenue),
      backgroundColor: ['#4f46e5','#06b6d4','#f59e0b','#10b981','#f97316'],
      borderWidth:     0,
    }],
  };
}
}