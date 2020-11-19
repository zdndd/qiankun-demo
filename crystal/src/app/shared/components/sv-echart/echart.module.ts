import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EChartsComponent } from './echart-component';

@NgModule({
  declarations: [EChartsComponent],
  imports: [CommonModule],
  exports: [EChartsComponent],
  entryComponents: [EChartsComponent],
})
export class EchartModule {}
