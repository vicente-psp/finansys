import { OnInit } from '@angular/core';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

export abstract class BaseResourceListComponent<T extends BaseResourceModel> implements OnInit {

  resources: T[] = [];

  constructor(private resourcesService: BaseResourceService<T>) { }

  ngOnInit() {
    this.listEntries();
  }

  listEntries(){
    this.resourcesService.getAll().subscribe(
      resources => this.resources = resources.sort((a,b) => b.id - a.id),
      error => alert('Erro ao listar')
    )
  }

  deleteResource(resource: T){
    const confirmDelete = confirm('Deseja remover o registro?');

    if (confirmDelete) {
      this.resourcesService.delete(resource.id).subscribe(
        () => this.resources = this.resources.filter(element => element != resource),
        () => alert('Erro ao remover registro')
      )
    }
  }

}
