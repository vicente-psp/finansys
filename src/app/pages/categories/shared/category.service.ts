import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { map, catchError, flatMap } from 'rxjs/operators';

import { Category } from './category.model';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  private END_POINT: string = 'api/categories';

  constructor(private httpClient: HttpClient) { }

  getAll(): Observable<Category[]> {
    return this.httpClient.get(this.END_POINT).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategories)
    )
  }

  getById(id: number): Observable<Category> {
    const url = `${this.END_POINT}/${id}`;

    return this.httpClient.get(url).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  create(category: Category): Observable<Category> {
    return this.httpClient.post(this.END_POINT, category).pipe(
      catchError(this.handleError),
      map(this.jsonDataToCategory)
    )
  }

  update(category: Category): Observable<Category> {
    const url = `${this.END_POINT}/${category.id}`;

    return this.httpClient.put(url, category).pipe(
      catchError(this.handleError),
      map(() => category)
    )
  }

  delete(id: number): Observable<any> {
    const url = `${this.END_POINT}/${id}`;

    return this.httpClient.delete(url).pipe(
      catchError(this.handleError),
      map(() => null)
    )
  }


  private jsonDataToCategories(jsonData: any[]): Category[] {
    const categories: Category[] = [];
    jsonData.forEach(element => categories.push(element as Category));
    return categories;
  }

  private jsonDataToCategory(jsonData: any): Category {
    return jsonData as Category;
  }

  private handleError(error: any): Observable<any> {
    console.log('ERRO NA REQUISIÇÃO => ', error);
    return throwError(error);
  }
}
