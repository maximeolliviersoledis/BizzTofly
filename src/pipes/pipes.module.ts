import { NgModule } from '@angular/core';
import { CurrencyPipe } from './currency/currency';
import { CustomDatePipe } from './custom-date/custom-date';
@NgModule({
	declarations: [CurrencyPipe,
    CustomDatePipe],
	imports: [],
	exports: [CurrencyPipe,
    CustomDatePipe]
})
export class PipesModule {}
