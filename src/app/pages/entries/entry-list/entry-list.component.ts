import { Component, OnInit } from '@angular/core';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';
import { error } from 'util';
import { element } from '@angular/core/src/render3/instructions';

@Component({
  selector: 'app-entry-list',
  templateUrl: './entry-list.component.html',
  styleUrls: ['./entry-list.component.css']
})
export class EntryListComponent implements OnInit {

  entries: Entry[] = [];

  constructor(private entryService: EntryService) { }

  ngOnInit() {
    this.listEntries();
  }

  listEntries(){
    this.entryService.getAll().subscribe(
      entries => this.entries = entries.sort((a,b) => b.id - a.id),
      error => alert('Erro ao listar')
    )
  }

  deleteEntry(entry: Entry){
    const confirmDelete = confirm('Deseja remover o registro?');

    if (confirmDelete) {
      this.entryService.delete(entry.id).subscribe(
        () => this.entries = this.entries.filter(element => element != entry),
        () => alert('Erro ao remover registro')
      )
    }
  }

}
