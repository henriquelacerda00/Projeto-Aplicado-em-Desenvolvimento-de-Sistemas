import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import * as ExcelJS from 'exceljs';
import { NotificationService } from './notification.service';




(pdfMake as any).vfs = (pdfFonts as any).vfs;


export interface AnalysisItem {
  tableName?: string;
  [key: string]: any;
}

@Injectable({
  providedIn: 'root',
})

export class ExportFilesService {
  appLogoBase64: string | null = null;

  constructor(private notificationService: NotificationService) {
    this.loadLogo();
  }



  private loadLogo() {
    const logoPath = "/assets/logo2.png";

    fetch(logoPath)
      .then(res => res.blob())
      .then(blob => {
        const reader = new FileReader();
        reader.onload = () => {
          this.appLogoBase64 = reader.result as string;
        };
        reader.readAsDataURL(blob);
      })
      .catch(() => console.error("Erro ao carregar logo fixa em assets."));
  }

  private getColumnLetter(colNumber: number): string {
    let temp = "";
    let letter = "";

    while (colNumber > 0) {
      temp = String.fromCharCode(((colNumber - 1) % 26) + 65);
      letter = temp + letter;
      colNumber = Math.floor((colNumber - 1) / 26);
    }

    return letter;
  }

  // ===================== EXCEL =====================
  // ===================== EXCEL COM APENAS EXCELJS =====================
  async exportToExcel(data: AnalysisItem[], filename: string) {

    if (!data?.length) {
      this.notificationService.error("Sem dados para exportar.");
      return;
    }

    const workbook = new ExcelJS.Workbook();

    // Agrupar itens por tipo
    const grouped = data.reduce((acc, item) => {
      const type = item.tableName || "SemTipo";
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {} as Record<string, AnalysisItem[]>);

    for (const [tableType, items] of Object.entries(grouped)) {

      const worksheet = workbook.addWorksheet(tableType);

      // ===================== LOGO =====================
      let headerOffset = 0;

      if (this.appLogoBase64) {

        const cleanBase64 = this.appLogoBase64.replace(/^data:image\/\w+;base64,/, "");

        const imageId = workbook.addImage({
          base64: cleanBase64,
          extension: "png",
        });

        // Mesclar bloco da logo (4 linhas x 2 colunas)
        worksheet.mergeCells("A1:B4");


        worksheet.getColumn(1).width = 18;
        worksheet.getColumn(2).width = 18;

        // Ajustar altura das linhas da logo
        for (let i = 1; i <= 4; i++) {
          worksheet.getRow(i).height = 20;
        }


        worksheet.addImage(imageId, {
          tl: { col: 0.2, row: 0 },
          ext: { width: 180, height: 85 },
          editAs: "oneCell",
        });

        headerOffset = 4;
      }


      const headers = Object.keys(items[0]).filter(k => k !== "tableType");
      const lastColLetter = this.getColumnLetter(headers.length + 2 + (headerOffset > 0 ? 0 : 2));


      worksheet.mergeCells(`C1:${lastColLetter}4`);

      const titleCell = worksheet.getCell("C1");
      titleCell.value = `Relatório - ${tableType}`;
      titleCell.font = { size: 20, bold: true };
      titleCell.alignment = { horizontal: "left", vertical: "middle" };

      const headerRow = worksheet.addRow(headers);

      headerRow.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: "4CAF50" }
        };
        cell.font = {
          bold: true,
          color: { argb: "FFFFFF" },
          size: 12
        };
        cell.alignment = {
          horizontal: "center",
          vertical: "middle"
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" }
        };
      });

      // ===================== LINHAS DE DADOS =============================
      items.forEach((item) => {
        worksheet.addRow(headers.map(h => item[h] ?? ""));
      });

      // ===================== AUTO AJUSTE DAS COLUNAS =====================
      worksheet.columns.forEach((col: any) => {
        let maxLength = 10;

        col.eachCell((cell: any) => {
          const value = cell.value ? cell.value.toString() : "";
          if (value.length > maxLength) maxLength = value.length;
        });

        col.width = maxLength + 3;
      });
    }

    // ===================== SALVAR O ARQUIVO ==============================
    const buffer = await workbook.xlsx.writeBuffer();

    saveAs(
      new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      }),
      `${filename}.xlsx`
    );
  }


  // ===================== PDF =====================
  exportToPDF(
    data: AnalysisItem[],
    filename: string,
    title = 'Relatório de Análises',
    logoBase64: string | null = null
  ) {
    if (!data?.length) {
      console.warn('Sem dados para exportar.');
      return;
    }

    // Agrupar por tableType
    const groupedData: Record<string, AnalysisItem[]> = data.reduce((acc, item) => {
      const type = item.tableName || 'Sem Tipo';
      if (!acc[type]) acc[type] = [];
      acc[type].push(item);
      return acc;
    }, {} as Record<string, AnalysisItem[]>);

    // Montar conteúdo
    const content: any[] = [];

    // Cabeçalho opcional com logo e data
    const headerColumns: any[] = [];
    if (logoBase64) {
      headerColumns.push({ image: logoBase64, width: 50 });
    }
    headerColumns.push({ text: title, style: 'title', alignment: 'center' });
    headerColumns.push({ text: new Date().toLocaleDateString(), alignment: 'right' });

    content.push({ columns: headerColumns, margin: [0, 0, 0, 10] });

    // Percorrer cada tipo de análise
    (Object.entries(groupedData) as [string, AnalysisItem[]][]).forEach(([tableType, items], groupIndex) => {
      content.push({ text: tableType, style: 'subtitle', margin: [0, 5, 0, 5] });

      items.forEach((item) => {
        const body: any[] = [];

        Object.keys(item).forEach((key) => {
          if (key === 'tableType') return; // ignora repetição
          body.push([{ text: key, bold: true }, { text: item[key] ?? '' }]);
        });

        content.push({
          table: { body, widths: ['auto', '*'] },
          layout: 'lightHorizontalLines',
          margin: [0, 0, 0, 10],
        });
      });

      // Quebra de página entre tipos de análise
      if (groupIndex < Object.keys(groupedData).length - 1) {
        content.push({ text: '', pageBreak: 'after' });
      }
    });

    const docDefinition: any = {
      content,
      styles: {
        title: { fontSize: 18, bold: true },
        subtitle: { fontSize: 14, bold: true, color: '#3f51b5' },
      },
      pageOrientation: 'portrait',
      footer: function (currentPage: number, pageCount: number) {
        return { text: `Página ${currentPage} de ${pageCount}`, alignment: 'center', margin: [0, 5, 0, 0] };
      },
    };

    (pdfMake as any).createPdf(docDefinition).download(`${filename}.pdf`);
  }
}
