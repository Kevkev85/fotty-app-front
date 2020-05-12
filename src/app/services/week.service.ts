import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { UserResultInfo } from '../interfaces/userResultInfo';
import { WeekInfo } from '../interfaces/weekInfo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class WeekService {
  private baseUrl = environment.apiEndpoint;
  private getLatestResultsUrl: string = `${this.baseUrl}/week/latestResults/`;
  private getCurrentWeekNumberUrl: string = `${this.baseUrl}/week/currentWeekNumber`;
  private getCurrentWeekUrl: string = `${this.baseUrl}/week/getCurrentWeek`;
  private getToTalNumberOfWeeksUrl: string = `${this.baseUrl}/week/total`;
  private createWNewWeekUrl: string = `${this.baseUrl}/week/createNewWeek`;
  private filteredMatchesUrl: string = `${this.baseUrl}/week/filteredMatchesToBePlayed`;
  private getWeekByWeekNumberUrl: string = `${this.baseUrl}/week/getWeekByWeekNumber/`;
  private addResultsUpdateScoreUrl: string = `${this.baseUrl}/week/addResultsUpdateScore`;
  private updateTotalScoreUrl: string = `${this.baseUrl}/week/updateTotalScore/`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private weekNumber$ = new BehaviorSubject<number>(
    parseInt(localStorage.getItem('weekNumber'))
  );

  getLatestResults(): Observable<UserResultInfo[]> {
    return this.authService.userId.pipe(
      switchMap((userId) =>
        this.http.get<UserResultInfo[]>(this.getLatestResultsUrl + userId)
      )
    );
  }

  get weekNumber(): Observable<number> {
    return this.weekNumber$.asObservable();
  }

  updateTotalScore(weekNumber: number): Observable<any> {
    return this.http.put<any>(this.updateTotalScoreUrl + weekNumber, {});
  }

  getCurrentWeekNumber(): Observable<number> {
    return this.http
      .get<number>(this.getCurrentWeekNumberUrl)
      .pipe(tap((no) => this.modifyWeekNumber(no)));
  }

  getFilteredMatches(): Observable<WeekInfo> {
    return this.http.get<WeekInfo>(this.filteredMatchesUrl);
  }
  createNewWeek(weekInfo: any): Observable<WeekInfo> {
    return this.http.post<WeekInfo>(this.createWNewWeekUrl, weekInfo);
  }

  getCurrentWeek(): Observable<WeekInfo> {
    return this.http
      .get<WeekInfo>(this.getCurrentWeekUrl)
      .pipe(tap((wk) => this.modifyWeekNumber(wk.weekNumber)));
  }

  getWeekByWeekNumber(weekNumber: number): Observable<WeekInfo> {
    return this.http.get<WeekInfo>(this.getWeekByWeekNumberUrl + weekNumber);
  }

  getTotalNumberOfWeeks(): Observable<number> {
    return this.http.get<number>(this.getToTalNumberOfWeeksUrl);
  }

  addResultsUpdateScore(weekinfo: WeekInfo): Observable<any> {
    return this.http.post<any>(this.addResultsUpdateScoreUrl, weekinfo);
  }

  private modifyWeekNumber(weekNumber: any) {
    const numb = parseInt(localStorage.getItem('weekNumber'));
    if (numb !== weekNumber) {
      localStorage.setItem('weekNumber', weekNumber);
      this.weekNumber$.next(weekNumber);
    }
  }
}
