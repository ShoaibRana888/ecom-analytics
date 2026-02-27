import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartData } from 'chart.js';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';

import { AnalyticsService, FunnelStage } from '../../core/services/analytics';

@Component({
  selector: 'app-customers',
  standalone: true,
  imports: [
    CommonModule,
    BaseChartDirective,
    MatProgressBarModule,
    MatIconModule,
  ],
  templateUrl: './customers.html',
  styleUrl: './customers.scss',
})
export class Customers implements OnInit {
  funnelStages: FunnelStage[] = [];

  horizontalBarData: ChartData<'bar'> = { labels: [], datasets: [] };
  horizontalBarOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    plugins: { legend: { display: false } },
    scales: {
      x: {
        grid: { color: 'rgba(0,0,0,.05)' },
        ticks: { callback: (v) => v.toLocaleString() },
      },
      y: { grid: { display: false } },
    },
  };

  doughnutData: ChartData<'doughnut'> = { labels: [], datasets: [] };
  doughnutOptions: ChartConfiguration<'doughnut'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%',
    plugins: { legend: { position: 'bottom' } },
  };

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.getAcquisitionFunnel().subscribe(stages => {
      this.funnelStages = stages;
      this.buildCharts(stages);
    });
  }

  private buildCharts(stages: FunnelStage[]) {
    this.horizontalBarData = {
      labels: stages.map(s => s.stage),
      datasets: [{
        data: stages.map(s => s.count),
        backgroundColor: [
          'rgba(79,70,229,.85)',
          'rgba(79,70,229,.70)',
          'rgba(79,70,229,.55)',
          'rgba(79,70,229,.40)',
          'rgba(79,70,229,.25)',
        ],
        borderRadius: 4,
      }],
    };

    this.doughnutData = {
      labels: ['Converted', 'Dropped Off'],
      datasets: [{
        data: [stages[stages.length - 1].count, stages[0].count - stages[stages.length - 1].count],
        backgroundColor: ['#4f46e5', '#e5e7eb'],
        borderWidth: 0,
      }],
    };
  }

  get conversionRate() {
    if (!this.funnelStages.length) return 0;
    const first = this.funnelStages[0].count;
    const last  = this.funnelStages[this.funnelStages.length - 1].count;
    return ((last / first) * 100).toFixed(1);
  }

  dropOff(index: number): number {
    if (index === 0) return 0;
    const prev = this.funnelStages[index - 1].count;
    const curr = this.funnelStages[index].count;
    return Math.round(((prev - curr) / prev) * 100);
  }
}