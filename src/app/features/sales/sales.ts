import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule } from '@angular/forms';

import { AnalyticsService, SalesTrend } from '../../core/services/analytics';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatIconModule,
    MatButtonToggleModule,
    FormsModule,
  ],
  templateUrl: './sales.html',
  styleUrl: './sales.scss',
})
export class Sales implements OnInit {
  selectedRange = '30';
  trends: SalesTrend[] = [];

  lineChartData: ChartData<'line'> = { labels: [], datasets: [] };
  lineChartOptions: ChartConfiguration<'line'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top' },
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

  barChartData: ChartData<'bar'> = { labels: [], datasets: [] };
  barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { position: 'top' } },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(0,0,0,.05)' } },
    },
  };

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() { this.loadData(); }

  loadData() {
    const days = +this.selectedRange;
    this.analytics.getSalesTrends(days).subscribe(trends => {
      this.trends = trends;
      this.buildCharts(trends);
    });
  }

  private buildCharts(trends: SalesTrend[]) {
    const labels = trends.map(t => t.date);

    this.lineChartData = {
      labels,
      datasets: [
        {
          label: 'Revenue',
          data: trends.map(t => t.revenue),
          borderColor: '#4f46e5',
          backgroundColor: 'rgba(79,70,229,.08)',
          fill: true,
          borderWidth: 2,
          yAxisID: 'y',
        },
      ],
    };

    this.barChartData = {
      labels,
      datasets: [
        {
          label: 'Orders',
          data: trends.map(t => t.orders),
          backgroundColor: 'rgba(6,182,212,.8)',
          borderRadius: 4,
        },
      ],
    };
  }

  get totalRevenue() {
    return this.trends.reduce((s, t) => s + t.revenue, 0);
  }

  get totalOrders() {
    return this.trends.reduce((s, t) => s + t.orders, 0);
  }

  get avgRevenue() {
    return this.trends.length ? Math.round(this.totalRevenue / this.trends.length) : 0;
  }
}