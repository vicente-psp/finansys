import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';
import { Entry } from '../../entries/shared/entry.model';
import { EntryService } from '../../entries/shared/entry.service';

import currencyFormatter from 'currency-formatter';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  expenseTotal: any = 0;
  revenueTotal: any = 0;
  balance: any = 0;

  expenseChartData: any;
  revenueChartData: any;

  chartOptions = {
    scales: {
      yAcces: [
        {
          ticks: {
            beginAtZero: true
          }
        }
      ]
    }
  }

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

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => this.categories = categories);
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || !year) {
      alert('Selecione o mês e ano para gerar o relatório!')
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;

    this.calculateBalance();
    this.setChartData();
  }

  private calculateBalance() {
    let expenseTotal = 0;
    let revenueTotal = 0;

    this.entries.forEach(entry => {
      if (entry.type === 'revenue') {
        revenueTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL'});
      } else {
        expenseTotal += currencyFormatter.unformat(entry.amount, { code: 'BRL'});
      }
    })

    this.expenseTotal = currencyFormatter.format(expenseTotal, { code: 'BRL'})
    this.revenueTotal = currencyFormatter.format(revenueTotal, { code: 'BRL'})
    this.balance = currencyFormatter.format(revenueTotal - expenseTotal, { code: 'BRL'})
  }

  private setChartData() {
    this.expenseChartData = this.getChartData('expense', 'Gráfico de Receitas', '#9CCC65');
    this.revenueChartData = this.getChartData('revenue', 'Gráfico de Despesas', '#e03131');
  }

  private getChartData(entryType: string, title: string, color: string) {
    const chartData = [];
    
    this.categories.forEach(category => {
      const filteredEntries = this. entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == entryType)
      );

      if (filteredEntries.length > 0) {
        const totalAmount = filteredEntries.reduce(
          (total, entry) => total + currencyFormatter.unformat(entry.amount, { code: 'BRL'}), 0
        )

        chartData.push({
          categoryName: category.name,
          totalAmount: totalAmount,
        })
      }
    });
      
    return {
      labels: chartData.map(item => item.categoryName),
      datasets: [{
        label: title,
        backgroundColor: color,
        data: chartData.map(item => item.totalAmount)
      }]
    }
  }
}
