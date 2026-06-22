import { Injectable } from '@angular/core';
import { PhysicalDefect } from '../../pages/physical-assessments/table-physical/table-physical.component';


@Injectable({
  providedIn: 'root'
})
export class CobTypeService {

  calcularTGD300g(dataSource: PhysicalDefect[]): number {
    const total = dataSource.reduce((acc, item) => acc + item.fullDefectCount, 0);
    return +(total * (300 / 350)).toFixed(2);
  }

  getCobType(dataSource: PhysicalDefect[]): string {
    const getDefect = (name: string): number =>
      dataSource.find(d => d.name === name)?.fullDefectCount || 0;

    const totalGreenDefects = this.calcularTGD300g(dataSource);

    const fullBlack = getDefect('Full Black');
    const fullSour = getDefect('Full Sour');
    const fungusDamage = getDefect('Fungus Damage');
    const brokenChipped = getDefect('Broken / Chipped / Cut');
    const floater = getDefect('Floater');
    const slightInsectDamage = getDefect('Slight Insect Damage');

    const sumFullSourFungus = fullSour + fungusDamage;
    const subtraction = totalGreenDefects - brokenChipped - floater - slightInsectDamage;

    if (
      totalGreenDefects > 360 ||
      fullBlack > 50 ||
      sumFullSourFungus > 100 ||
      subtraction > 300
    ) return 'Off-grade';
    else if (totalGreenDefects <= 4) return ' 2';
    else if (totalGreenDefects <= 12) return ' 3';
    else if (totalGreenDefects <= 26) return ' 4';
    else if (totalGreenDefects <= 46) return ' 5';
    else if (totalGreenDefects <= 86) return ' 6';
    else if (totalGreenDefects <= 160) return ' 7';
    else if (totalGreenDefects <= 360) return ' 8';
    
    return 'Undefined';
  }
}
