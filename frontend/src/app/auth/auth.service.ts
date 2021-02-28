import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { env } from "process";
import { Subject } from "rxjs";
import { environment } from "../../environments/environment";
import { ResponseData } from "../shared/responseData.model";
import { AuthModel, loginModel } from "./auth.model";

@Injectable({ providedIn: "root" })
export class AuthService {
    constructor(private http: HttpClient, private router: Router) { }

    private token: string;
    private tokenTimer: any
    public isAuthenticated = false;
    public authStatusListener = new Subject<boolean>();
    private timeOut: any

    createUser(authModel: AuthModel) {
        return this.http.post<ResponseData>(`${environment.apiUrl}/signup`, authModel);
    }

    setToken(token: string) {
        this.token = token;
    }

    getToken() {
        return this.token;
    }

    getAuthStatusListenerAsObservable() {
        return this.authStatusListener.asObservable();
    }

    getIsAuthenticated() {
        return this.isAuthenticated;
    }

    login(loginModel: loginModel) {
        return this.http.post<{ token: string, success: boolean, messages: [{ msg: string, param: string }], expiresIn: number }>(`${environment.apiUrl}/login`, loginModel);
    }

    autoAuthUser() {
        const authInfo = this.getAuthData();
        if (!authInfo) return;
        const now = new Date();
        // const isInFuture = authInfo.expirationDate > now;
        const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
        if (expiresIn > 0) {
            this.token = authInfo.token;
            this.isAuthenticated = true;
            this.setAuthTimer(expiresIn / 1000);
            this.authStatusListener.next(true);
        }
    }

    logout() {
        this.isAuthenticated = false;
        this.token = null;
        this.authStatusListener.next(false);
        this.clearAuthData();
        this.clearTimeOut();
        this.router.navigate(['/login']);
    }

    setAuthTimer(duration: number) {
        this.timeOut = this.tokenTimer = setTimeout(() => {
            this.logout();
        }, duration * 1000);
    }

    saveAuthData(token: string, expirationDate: Date) {
        localStorage.setItem("token", token);
        localStorage.setItem("expiration", expirationDate.toISOString());

    }
    private clearAuthData() {
        localStorage.removeItem("token");
        localStorage.removeItem("expiration");
    }

    private getAuthData() {
        const token = localStorage.getItem("token");
        const expirationDate = localStorage.getItem("expiration");
        if (!token || !expirationDate) {
            return;
        }
        return {
            token: token,
            expirationDate: new Date(expirationDate)
        }
    }

    clearTimeOut() {
        clearTimeout(this.timeOut);
    }

}