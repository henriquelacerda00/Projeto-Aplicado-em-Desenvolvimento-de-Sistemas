import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { NestedTreeControl } from '@angular/cdk/tree';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { MaterialModule } from '../../../core/material/material.module';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

export interface TreeItem {
  name: string;
  checked?: boolean;
  children?: TreeItem[];
  allowNotes?: boolean;
  notes?: string;
}

@Component({
  selector: 'app-tree-options',
  standalone: true,
  imports: [MaterialModule, CommonModule, FormsModule, ReactiveFormsModule, TranslateModule],
  templateUrl: './tree-options.component.html',
  styleUrls: ['./tree-options.component.scss'],
})
export class TreeOptionsComponent implements OnChanges {
  @Input() treeData: TreeItem[] = [];
  @Output() treeUpdate = new EventEmitter<TreeItem[]>();

  treeControl = new NestedTreeControl<TreeItem>((node) => node.children);
  dataSource = new MatTreeNestedDataSource<TreeItem>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['treeData']) {
      // Verificamos se é a primeira carga ou uma troca de amostra (mudança drástica)
      // Se for apenas uma atualização de checkbox, evitamos resetar o dataSource.data diretamente

      const isNewSample = changes['treeData'].previousValue === undefined ||
        changes['treeData'].currentValue?.length !== changes['treeData'].previousValue?.length;

      if (isNewSample) {
        this.dataSource.data = this.treeData ? [...this.treeData] : [];
        this.expandAllNodes();
      } else {
        // Se for apenas atualização de valores (check), apenas atualizamos a referência interna
        // sem resetar o dataSource, o que mantém a árvore aberta.
        this.dataSource.data = this.treeData;
      }
    }
  }

  private expandAllNodes() {
    if (this.treeControl && this.dataSource.data) {
      this.dataSource.data.forEach(node => {
        if (node.children && node.children.length > 0) {
          this.treeControl.expand(node);
          // Se tiver mais níveis, você pode expandir recursivamente aqui
        }
      });
    }
  }

  hasChild = (_: number, node: TreeItem) =>
    !!node.children && node.children.length > 0;

  findParent(node: TreeItem, treeData: TreeItem[]): TreeItem | null {
    for (const item of treeData) {
      if (item.children) {
        if (item.children.includes(node)) return item;
        const found = this.findParent(node, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  onCheckboxChange(node: TreeItem, event: any) {
    node.checked = event.checked;

    const parent = this.findParent(node, this.dataSource.data);
    const siblings = parent ? parent.children : this.dataSource.data;

    if (node.checked && !node.allowNotes) {
      siblings?.forEach((sibling) => {
        if (sibling !== node && sibling.name !== 'Other') sibling.checked = false;
      });
    }

    this.treeUpdate.emit(this.dataSource.data);
  }
}
