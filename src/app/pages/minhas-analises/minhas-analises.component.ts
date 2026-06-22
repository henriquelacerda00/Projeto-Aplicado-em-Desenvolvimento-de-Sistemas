import { ExportFilesService } from './../../core/services/export-files.service';
import { Component, OnInit } from '@angular/core';
import { MaterialModule } from '../../core/material/material.module';
import { ContainerComponent } from '../../components/container/container.component';

import { CommonModule } from '@angular/common';
import { FilterComponent } from '../../components/filter/filter.component';
import {  dataSource } from '../../core/types/type';
import { formatColumnName } from './column-format';
import { LoadingService } from '../../core/services/loading.service';
import { SupabaseService } from '../../core/services/supabase.service';

@Component({
  selector: 'app-minhas-analises',
  standalone: true,
  imports: [MaterialModule, ContainerComponent, CommonModule, FilterComponent],
  templateUrl: './minhas-analises.component.html',
  styleUrl: './minhas-analises.component.scss',
})
export class MinhasAnalisesComponent implements OnInit {
  columnsToDisplay = ['_table', 'name', 'date'];
  columnsToDisplayWithExpand = [...this.columnsToDisplay, 'expand'];
  expandedElement: any | null = null;
  dataSource: dataSource[] = [];
  filteredDataSource: dataSource[] = [];
  formatColumn = formatColumnName;

  constructor(
    private supabaseService: SupabaseService,
    public loading: LoadingService,
    private exportFilesService : ExportFilesService
  ) { }

  async ngOnInit() {
    const userId = await this.supabaseService.getCurrentUserId();
    if (!userId) {
      console.error('Usuário não autenticado.');
      return;
    }

    this.loading.show();

    try {

      const [analyses] = await Promise.all([
        this.supabaseService.getAllAnalysesByUser(),
        new Promise(resolve => setTimeout(resolve, 500)) // Atraso de 500ms
      ]);
      this.dataSource = analyses;
      this.filteredDataSource = this.dataSource;
    } catch (error) {
      console.error('Erro ao buscar análises:', error);
    } finally {
      this.loading.hide();
    }
  }

  objectKeys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }

  getColumns(data: any[]): string[] {
    if (!data || data.length === 0) return [];

    const allKeys = new Set<string>();
    data.forEach((item) => {
      Object.keys(item).forEach((key) => allKeys.add(key));
    });

    return Array.from(allKeys);
  }

  formatColumnName(key: string): string {
    return key
      .replaceAll('_', ' ')
      .split(' ')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  }

  filtrarAnalises(analisesFiltradas: dataSource[]) {
    this.filteredDataSource = analisesFiltradas;
  }

  isExpanded(element: any) {
    return this.expandedElement === element;
  }

  toggle(element: any) {
    this.expandedElement = this.isExpanded(element) ? null : element;
  }

   exportarExcel() {
    const allData = this.flattenData();
    if (!allData.length) return console.warn('Nenhum dado filtrado para exportar.');
    this.exportFilesService.exportToExcel(allData, 'analises_filtradas',);
  }

  exportarPDF() {
    const allData = this.flattenData();
    if (!allData.length) return console.warn('Nenhum dado filtrado para exportar.');
    this.exportFilesService.exportToPDF(allData, 'analises_filtradas', 'Relatório de Análises Filtradas');
  }

  private flattenData(): any[] {
    return this.filteredDataSource.flatMap((t) =>
      t.data.map((item: any) => ({
        tableType: t.tableType,
        ...item,
      }))
    );
  }
}
