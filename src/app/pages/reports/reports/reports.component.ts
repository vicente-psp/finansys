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

  expenseCharData: any;
  revenueCharData: any;

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

  categories: Category[] = [];
  entries: Entry[] = [];

  @ViewChild('month') month: ElementRef = null;
  @ViewChild('year') year: ElementRef = null;

  constructor(private entryService: EntryService, private categoryService: CategoryService) { }

  ngOnInit() {
    this.categoryService.getAll().subscribe(categories => this.balance.categories = categories);
  }

  generateReports() {
    const month = this.month.nativeElement.value;
    const year = this.year.nativeElement.value;

    if (!month || year) {
      alert('Selecione')
    } else {
      this.entryService.getByMonthAndYear(month, year).subscribe(this.setValues.bind(this))
    }
  }

  private setValues(entries: Entry[]) {
    this.entries = entries;

    this.calculateBalance();
    this.setCharData();
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

    this.expenseTotal = currencyFormatter.formatter(expenseTotal, { code: 'BRL'})
    this.revenueTotal = currencyFormatter.formatter(revenueTotal, { code: 'BRL'})
    this.balance = currencyFormatter.formatter(revenueTotal - expenseTotal, { code: 'BRL'})
  }

  private setCharData() {
    const chartData = [];
    this.categories.forEach(category => {
      const filteredEntries = this. entries.filter(
        entry => (entry.categoryId == category.id) && (entry.type == 'revenue')
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
      this.revenueCharData = {
        labels: chartData.map(item => item.categoryName),
        datasets: [{
          label: 'Gráfico de Receitas',
          backgroundColor: '#9CCC65'
        }]
      }
    })
  }


}
