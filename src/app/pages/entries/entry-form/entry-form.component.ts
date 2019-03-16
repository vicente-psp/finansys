import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { Entry } from '../shared/entry.model';
import { EntryService } from '../shared/entry.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';
import { Category } from '../../categories/shared/category.model';
import { CategoryService } from '../../categories/shared/category.service';

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {

  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();
  categories: Array<Category>;

  imaskConfig = {
    mask: Number,
    scale: 2,
    thousandsSeparator: '',
    padFractionalZeros: true,
    redix: ','
  };

  ptBR = {
    firstDayOfWeek: 0,
    dayNames: ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"],
    dayNamesShort: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sat"],
    dayNamesMin: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sa"],
    monthNames: [
      "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
      "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"],
    monthNamesShort: [ "Jan", "Fev", "Mar", "Abr", "Mai", "Jun","Jul", "Ago", "Set", "Out", "Nov", "Dez" ],
    today: 'Hoje',
    clear: 'Limpar',
    dateFormat: 'dd/mm/yy'
};

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private categoryService: CategoryService
  ) {}

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
    this.loadCategories();
  }

  ngAfterContentChecked(){
    this.setPageTitle();
  }

  submitForm() {
    this.submittingForm = true;

    if (this.currentAction === 'new'){
      this.createEntry();
    } else {
      this.updateEntry();
    }
  }

  get typeOptions(): Array<any>{
    return Object.entries(Entry.types).map(
      ([value, text]) => {
        return {
          text: text,
          value: value
        }
      }
    )
  }


  private setCurrentAction(){
    if (this.route.snapshot.url[0].path === 'new'){
      this.currentAction = 'new';
    } else {      
      this.currentAction = 'edit';
    }
  }

  private buildEntryForm(){
    this.entryForm = this.formBuilder.group({
      id: [null],
      name: [null, [Validators.required, Validators.minLength(2)]],
      description: [null],
      type: ["expense", [Validators.required]],
      amount: [null, [Validators.required]],
      date: [null, [Validators.required]],
      paid: [false, [Validators.required]],
      categoryId: [null, [Validators.required]],
    });
  }

  private loadEntry(){
    if (this.currentAction === 'edit') {
      this.route.paramMap.pipe(
        switchMap(params => this.entryService.getById(+params.get('id')))
      )
      .subscribe(
        (entry) => {
          this.entry = entry;
          this.entryForm.patchValue(this.entry);
        },
        (error) => alert('Ocorreu um erro no servidor')
      )
    }
  }

  private setPageTitle() {
    if (this.currentAction === 'new'){
      this.pageTitle = 'Cadastro de nova entrada';
    } else {
      const entryName = this.entry.name || '';
      this.pageTitle = 'Editando a entrada: ' + entryName;
    }
  }

  private createEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.create(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);

    this.entryService.update(entry).subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }



  private actionsForSuccess(entry: Entry) {
    toastr.success('Solicitação processada com sucesso');

    this.router.navigateByUrl('entries', {skipLocationChange: true}).then(
      () => this.router.navigate(['entries', entry.id, 'edit'])
    )
  }

  private actionsForError(error) {
    toastr.error('Ocorreu um erro ao processar solicitação');
    
    this.submittingForm = false;
    
    if (error.status = 422) {
      // console.log(JSON.parse(error._body));
      this.serverErrorMessages = [error.body.error];
    } else {
      this.serverErrorMessages = ['Falha na comunicação com o servidor, tente mais tarde'];
    }
  }

  private loadCategories(){
    this.categoryService.getAll().subscribe(
      categories => this.categories = categories
    )
  }

}
