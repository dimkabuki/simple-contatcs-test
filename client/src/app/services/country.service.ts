import { Injectable } from '@angular/core';
import { config } from '../../localConfig';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Country } from '../types/common';

@Injectable({
  providedIn: 'root',
})
export class CountryService {
  private countryUrl = config.countries.dev;

  constructor(private http: HttpClient) {}

  getCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.countryUrl);
  }
}
