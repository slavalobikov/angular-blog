import {Injectable} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IFireBaseAuthResponse, IUser} from "../../../shared/interfaces";
import {catchError, Observable, Subject, tap, throwError} from "rxjs";
import {environment} from "../../../../environments/environment";

@Injectable()
export class AuthServices {

  public error$: Subject<string> = new Subject<string>()
  constructor(private http: HttpClient) {
  }

  get token():string | null {
    const fbTokenExp = localStorage.getItem('fb-token-exp');

    if (!fbTokenExp) {
      this.logout()
      return null
    }

    const expDate = new Date(fbTokenExp)

    if (new Date() > expDate) {
      this.logout()
      return null
    }
    return localStorage.getItem('fb-token')
  }

  private setToken(response: Object | null) {
    if (response) {
      const authResponse = response as IFireBaseAuthResponse;
      const expDate = new Date( new Date().getTime() + +authResponse.expiresIn * 1000)
      localStorage.setItem('fb-token', authResponse.idToken)
      localStorage.setItem('fb-token-exp', expDate.toString())
    } else {
      localStorage.removeItem('fb-token')
      localStorage.removeItem('fb-token-exp')
    }
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error
    console.log('message', message)

    switch (message) {
      case 'INVALID_LOGIN_CREDENTIALS':
        this.error$.next('Invalid login credentials!')
        break
      case 'INVALID_EMAIL':
        this.error$.next('Invalid login credentials')
        break
    }

    return throwError(error)
  }

  login(user: IUser):Observable<any> {
    user.returnSecureToken = true
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, user).pipe(
      tap(this.setToken),
      catchError(this.handleError.bind(this))
    )
  }

  logout() {
    this.setToken(null)
  }

  isAuth():boolean {
    return !!this.token
  }


}
