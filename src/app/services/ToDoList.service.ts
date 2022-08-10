import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "src/environments/environment";
import { ToDo } from "../models/ToDo";

@Injectable({
    providedIn: 'root'
})
export class ToDoService {
    private API_URL: string = environment.API_URL;
    httpOptions = {
        headers: new HttpHeaders({
          'Content-Type': 'application/json'
        }),
      };

    constructor(private http: HttpClient) {}

    list(): Observable<ToDo[]> {
        return this.http
            .get<ToDo[]>(
                this.API_URL+"to-do-list", 
                this.httpOptions
            );
    }

    create(toDo: ToDo) {
        return this.http
            .post<ToDo>(
                this.API_URL+"to-do-list",
                JSON.stringify(toDo),
                this.httpOptions
            );
    }

    update(toDo: ToDo) {
        return this.http
            .put<ToDo>(
                this.API_URL+"to-do-list",
                JSON.stringify(toDo),
                this.httpOptions
            );
    }

    delete(toDo: ToDo) {
        this.httpOptions.headers.set('body', JSON.stringify(toDo));
        return this.http
            .delete<ToDo>(
                this.API_URL+"to-do-list",
                this.httpOptions
            );
    }

    manageState(toDo: ToDo) {
        return this.http
            .put<ToDo>(
                this.API_URL+"to-do-list/manage-state/"+toDo.title,
                this.httpOptions
            );
    }

    searchByTitle(title: string): Observable<ToDo> {
        return this.http
            .get<ToDo>(
                this.API_URL+"to-do-list/search/"+title, 
                this.httpOptions
            );
    }
}