import { Component, OnInit } from '@angular/core';

import { Category } from '../shared/category.model';
import { CategoryService } from '../shared/category.service';
import { error } from 'util';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.css']
})
export class CategoryListComponent implements OnInit {

  categories: Category[] = [];

  constructor(private categoryService: CategoryService) { }

  ngOnInit() {
    this.listCategories();
  }

  listCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories,
      error => alert('Erro ao listar')
    )
  }

  deleteCategory(category: Category){
    const confirmDelete = confirm('Deseja remover o registro?');

    if (confirmDelete) {
      this.categoryService.delete(category.id).subscribe(
        () => this.categories = this.categories.filter(element => element != category),
        () => alert('Erro ao remover registro')
      )
    }
  }

}