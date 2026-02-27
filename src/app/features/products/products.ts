import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';

import { AnalyticsService, TopProduct } from '../../core/services/analytics';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatFormFieldModule,
    MatIconModule,
    MatChipsModule,
    MatButtonModule,
  ],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit, AfterViewInit {
  @ViewChild(MatSort)      sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  dataSource = new MatTableDataSource<TopProduct>([]);
  displayedColumns = ['rank', 'name', 'category', 'revenue', 'units', 'trend'];

  constructor(private analytics: AnalyticsService) {}

  ngOnInit() {
    this.analytics.getTopProducts().subscribe(products => {
      this.dataSource.data = products;
    });
  }

  ngAfterViewInit() {
    this.dataSource.sort      = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  applyFilter(event: Event) {
    const value = (event.target as HTMLInputElement).value;
    this.dataSource.filter = value.trim().toLowerCase();
  }

  get totalRevenue() {
    return this.dataSource.data.reduce((s, p) => s + p.revenue, 0);
  }

  get totalUnits() {
    return this.dataSource.data.reduce((s, p) => s + p.units, 0);
  }

  get topCategory() {
    const map = new Map<string, number>();
    this.dataSource.data.forEach(p => {
      map.set(p.category, (map.get(p.category) ?? 0) + p.revenue);
    });
    let top = '', max = 0;
    map.forEach((v, k) => { if (v > max) { max = v; top = k; } });
    return top;
  }
}