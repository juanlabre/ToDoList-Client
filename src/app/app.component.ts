import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import Swal from 'sweetalert2';

import { ToDo } from './models/ToDo';
import { ToDoService } from './services/ToDoList.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'ToDoList-Client';
  titleModal = '';
  dtTrigger: Subject<any> = new Subject<any>();
  dtOptions: DataTables.Settings | any = {};
  toDoList: ToDo[] = [];
  stateList: String[] = ["COMPLETE", "INCOMPLETE"];

  toDoFormGroup: FormGroup = new FormGroup({
    title: new FormControl(null,[Validators.required]),
    description: new FormControl(null,[Validators.required]),
    state: new FormControl(null,[Validators.required])
  });

  searchFormGroup: FormGroup = new FormGroup({
    title: new FormControl(null,[Validators.required])
  });

  constructor(
    private _toDoService: ToDoService
  ) {}

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10,
      info: true,
      processing: true,
      ordering: true,
      responsive: true,
      retrieve: true,
      order: [[3, 'asc']],
      columnDefs: [
        {
          targets: [0, 1, 2],
          orderable: false
        }
      ]
    };
    
    this.list();
  }

  list() {
    this._toDoService.list().subscribe({
      next: (response: any) => {
        this.toDoList = response;
        this.dtTrigger.next('');
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  save() {
    if(this.titleModal === 'Add') {
      this.add();
    } else if(this.titleModal === 'Update') {
      this.update();
    }
  }

  showAdd() {
    this.titleModal = 'Add';
    this.toDoFormGroup.reset();
    ($('#toDoModal') as any).modal('show');
  }

  add() {
    this.toDoFormGroup.markAllAsTouched();
    if(this.toDoFormGroup.valid) {
      this._toDoService.create(this.toDoFormGroup.value).subscribe({
        next: (response: any) => {
          this.toDoList = response;
          this.dtTrigger.next('');
          this.toDoFormGroup.reset();
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
      });
      ($('#toDoModal') as any).modal('hide');
    }
  }

  showUpdate(toDo: ToDo) {
    this.titleModal = 'Update';
    this.toDoFormGroup.patchValue(toDo);
    ($('#toDoModal') as any).modal('show');
  }

  update() {
    this.toDoFormGroup.markAllAsTouched();
    if(this.toDoFormGroup.valid) {
      this._toDoService.update(this.toDoFormGroup.value).subscribe({
        next: (response: any) => {
          this.toDoList = response;
          this.dtTrigger.next('');
          this.toDoFormGroup.reset();
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'OK'
          });
        }
      });
      ($('#toDoModal') as any).modal('hide');
    }
  }

  showDelete(toDo: ToDo) {
    Swal.fire({
      title: 'Are you sure to delete?',
      text: 'You will not be able to recover information.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#0275d8',
      cancelButtonText: 'Cancel'
    }).then((result: any) => {
      if (result.value) {
        this.delete(toDo);
      }
    });
  }

  delete(toDo: ToDo) {
    this._toDoService.delete(toDo).subscribe({
      next: (response: any) => {
        this.toDoList = response;
        this.dtTrigger.next('');
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'OK'
        });
      }
    });
  }

  manageSate(toDo: ToDo) {
    this._toDoService.manageState(toDo).subscribe({
      next: (response: any) => {
        this.toDoList = response;
        this.dtTrigger.next('');
      },
      error: (err: any) => {
        Swal.fire({
          title: 'Error!',
          text: err.message,
          icon: 'error',
          confirmButtonColor: '#3085d6',
          confirmButtonText: 'Aceptar'
        });
      }
    });
  }

  search() {
    this.searchFormGroup.markAllAsTouched();
    if(this.searchFormGroup.valid) {
      this._toDoService.searchByTitle(this.searchFormGroup.controls['title'].value).subscribe({
        next: (response: any) => {
          if(response != null) {
            $('#titleSearch').val(response.title);
            $('#descriptionSearch').val(response.description);
            $('#stateSearch').val(response.state);
          } else {
            $('#titleSearch').val('');
            $('#descriptionSearch').val('');
            $('#stateSearch').val('');
          }
        },
        error: (err: any) => {
          Swal.fire({
            title: 'Error!',
            text: err.message,
            icon: 'error',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Aceptar'
          });
        }
      });
    }
  }
}
