import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the CustomDatePipe pipe.
 *
 * See https://angular.io/api/core/Pipe for more info on Angular Pipes.
 */
@Pipe({
  name: 'customDatePipe',
})
export class CustomDatePipe implements PipeTransform {

/**
*
*/
  transform(value: string, lang = 'fr', separator = ' à ', dateSeparator = "/", timeSeparator = ':') {
  	var splitValue = value.split(' ');
  	var date = splitValue[0].split('-');
  	var time = splitValue[1].split(':');
  	var ret = '';

  	if(lang === 'fr'){
  		ret = date[2]+ dateSeparator + date[1] + separator + time[0] + timeSeparator + time[1];
  	}else{
  		ret = date[1]+ dateSeparator + date[2] + separator + time[0] + timeSeparator + time[1];
  	}

  	return ret;
  }
}
