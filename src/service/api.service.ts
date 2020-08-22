import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { Observable, of, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators'
import { HttpBackend, HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})

export class ApiService {

    constructor(private http: HttpClient) { }

    postuser(data): Observable<any> {
        return this.http
            .post<any>(`${environment.url}users`, data)
            .pipe(catchError(this.handleErrorObservable))
    }


    getAll(): Observable<any> {
        return this.http
            .get<any>(`${environment.url}users`)
            .pipe(catchError(this.handleErrorObservable))
    }

    getOne(id): Observable<any> {
        return this.http
            .get<any>(`${environment.url}users/${id}`)
            .pipe(catchError(this.handleErrorObservable))
    }

    updateUser(id, data): Observable<any> {
        return this.http
            .patch<any>(`${environment.url}users/${id}`, data)
            .pipe(catchError(this.handleErrorObservable))
    }

    deleteUser(id): Observable<any> {
        return this.http
            .delete<any>(`${environment.url}users/${id}`)
            .pipe(catchError(this.handleErrorObservable))
    }

    //Avatar 
    updateAvatar(id, data): Observable<any> {
        return this.http
            .patch<any>(`${environment.url}users/avatar/${id}`, data)
            .pipe(catchError(this.handleErrorObservable))
    }

    deleteAvatar(id): Observable<any> {
        return this.http
            .delete<any>(`${environment.url}users/avatar/${id}`)
            .pipe(catchError(this.handleErrorObservable))
    }

    getAvatar(id): Observable<any> {
        return this.http
            .get<any>(`${environment.url}users/avatar/${id}`)
            .pipe(catchError(this.handleErrorObservable))
    }

    private handleErrorObservable(error: Response | any) {
        return throwError(error)
    }
}