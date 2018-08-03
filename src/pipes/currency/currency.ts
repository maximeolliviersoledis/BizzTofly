import { Pipe, PipeTransform } from '@angular/core';
/**
 * Generated class for the CurrencyPipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'currencyPipe',
})
export class CurrencyPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
 /* transform(value: string, ...args) {
    return value.toLowerCase();
  }*/

  	/*transform(value: number, currency: any){
		var formattedString = '';
		var floating = (parseFloat(value.toFixed(2)) - parseFloat(value.toFixed(0))).toFixed(currency.decimals);

		switch (currency.format) {
			//Format like : X0,000.00
			case 1:
				formattedString += currency.sign + value.toPrecision(0) + '.' + floating;
				break;
			//Format like : 0 000,00X
			case 2:
				formattedString += value.toPrecision(0) + ',' + floating + currency.sign;			
				break;
			case 3:
				break;
			case 4:
				break;		
			case 5:
				break;	
			default:
				return value;
				break;
		}

		return formattedString;
	}*/
	/**
	* @param value The number to format
	* @param precision The number of number to display after ','. Default is '2'
	* @param currency The currency symbol to display. Default is '€'
	* @param side The side to display the symbol (right or left). Default is 'right'
	* @param space Adding a space between the number and the currency sign. Default is 'true'
	*/
	proccessTransform(value: number, precision:number = 2, currency: string = "€", side: string = "right", space: boolean = true){
		//console.log('value : ', value);
		var formattedString = '';
		var setSpace = space == true ? ' ' : '';
		if(side == "right"){
			formattedString += value.toFixed(2) + setSpace + currency;
		}else{
			formattedString += currency + setSpace + value.toFixed(2);
		}
		return formattedString;
	}

	transform(value:number, vars: any = null){
		/*console.log('value : ', value);
		console.log(typeof value);*/
		if(typeof value == 'string')
			value = parseFloat(value);
		

		if(value == null)
			value = 0;

		if(vars){
			//console.log('vars not null');
			var side = vars.format == 1 || vars.format == 3 ? 'left' : 'right';
			return this.proccessTransform(value, vars.decimals, vars.sign, side, vars.blank == '1' ? true : false);
		}else{
			//console.log('vars null');
			return this.proccessTransform(value);
		}
	}
}
