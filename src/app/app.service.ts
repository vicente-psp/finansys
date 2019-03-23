import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AppService {

  months = [
    { value: 1, text: 'Janeiro' },
    { value: 2, text: 'Fevereiro' },
    { value: 3, text: 'Março' },
    { value: 4, text: 'Abril' },
    { value: 5, text: 'Maio' },
    { value: 6, text: 'Junho' },
    { value: 7, text: 'Julho' },
    { value: 8, text: 'Agosto' },
    { value: 9, text: 'Setembro' },
    { value: 10, text: 'Outubro' },
    { value: 11, text: 'Novembro' },
    { value: 12, text: 'Dezembro' }
  ]

  years = [
    { value: 2016, text: '2016'},
    { value: 2017, text: '2017'},
    { value: 2018, text: '2018'},
    { value: 2019, text: '2019'},
    { value: 2020, text: '2020'},
  ]

  constructor() { }
}
