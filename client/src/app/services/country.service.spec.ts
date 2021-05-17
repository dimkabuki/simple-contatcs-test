import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { CountryService } from './country.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { config } from '../../localConfig';

describe('CountryService', () => {
  let service: CountryService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CountryService],
    });
    service = TestBed.inject(CountryService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get countries', fakeAsync(() => {
    let response = null;
    const responseObject = ['COUNTRY_1', 'COUNTRY_2'];

    service.getCountries().subscribe(
      (receivedResponse: any) => {
        response = receivedResponse;
      },
      (_: any) => {}
    );

    const requestWrapper = httpMock.expectOne({ url: config.countries.dev });
    requestWrapper.flush(responseObject);

    tick();

    expect(requestWrapper.request.method).toEqual('GET');
    expect(response).toEqual(responseObject);
  }));
});
