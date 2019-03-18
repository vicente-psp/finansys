import { OnInit, AfterContentChecked, Injector } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { BaseResourceModel } from '../../models/base-resource.model';
import { BaseResourceService } from '../../services/base-resource.service';

import { switchMap } from 'rxjs/operators';

import toastr from 'toastr';

export abstract class BaseResourceFormComponent<T extends BaseResourceModel> implements OnInit, AfterContentChecked {

    currentAction: string;
    resourceForm: FormGroup;
    pageTitle: string;
    serverErrorMessages: string[] = null;
    submittingForm: boolean = false;

    protected route: ActivatedRoute;
    protected router: Router;
    protected formBuilder: FormBuilder;

    constructor(
        protected injector: Injector,
        public resource: T,
        protected resourceService: BaseResourceService<T>,
        protected jsonDataToResourcefn: (jsonData) => T
    ) {
       this.route = this.injector.get(ActivatedRoute);
       this.router = this.injector.get(Router);
       this.formBuilder = this.injector.get(FormBuilder);
    }

    ngOnInit() {
        this.setCurrentAction();
        this.buildResourceForm();
        this.loadResource();
    }

    ngAfterContentChecked() {
        this.setPageTitle();
    }

    submitForm() {
        this.submittingForm = true;

        if (this.currentAction === 'new') {
            this.createResource();
        } else {
            this.updateResource();
        }
    }


    protected setCurrentAction() {
        if (this.route.snapshot.url[0].path === 'new') {
            this.currentAction = 'new';
        } else {
            this.currentAction = 'edit';
        }
    }

    protected loadResource() {
        if (this.currentAction === 'edit') {
            this.route.paramMap.pipe(
                switchMap(params => this.resourceService.getById(+params.get('id')))
            )
                .subscribe(
                    (resource) => {
                        this.resource = resource;
                        this.resourceForm.patchValue(this.resource);
                    },
                    (error) => alert('Ocorreu um erro no servidor')
                )
        }
    }

    protected setPageTitle() {
        if (this.currentAction === 'new') {
            this.pageTitle = this.createPageTitle();
        } else {
            this.pageTitle = this.editionPageTitle();
        }
    }

    protected createResource() {
        const resource: T = this.jsonDataToResourcefn(this.resourceForm.value);
        this.resourceService.create(resource).subscribe(
            resource => this.actionsForSuccess(resource),
            error => this.actionsForError(error)
        )
    }

    protected updateResource() {
        const resource: T = this.jsonDataToResourcefn(this.resourceForm.value);
        this.resourceService.update(resource).subscribe(
            resource => this.actionsForSuccess(resource),
            error => this.actionsForError(error)
        )
    }



    protected actionsForSuccess(resource: T) {
        toastr.success('Solicitação processada com sucesso');

        const baseComponentPath: string = this.route.snapshot.parent.url[0].path;
        this.router.navigateByUrl(baseComponentPath, { skipLocationChange: true }).then(
            () => this.router.navigate([baseComponentPath, resource.id, 'edit'])
        )
    }

    protected actionsForError(error) {
        toastr.error('Ocorreu um erro ao processar solicitação');

        this.submittingForm = false;

        if (error.status = 422) {
            // console.log(JSON.parse(error._body));
            this.serverErrorMessages = [error.body.error];
        } else {
            this.serverErrorMessages = ['Falha na comunicação com o servidor, tente mais tarde'];
        }
    }

    protected createPageTitle(): string {
        return 'Novo';
    }

    protected editionPageTitle(): string {
        return 'Edição';
    }

    protected abstract buildResourceForm(): void;
}