import { SearchComponent } from './search.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

@NgModule({
  declarations: [SearchComponent],
  entryComponents: [SearchComponent],
  imports: [CommonModule, IonicModule],
  exports: [SearchComponent]
})
export class SearchComponentModule { }
