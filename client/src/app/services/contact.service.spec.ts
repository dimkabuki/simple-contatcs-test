import { fakeAsync, TestBed, tick } from '@angular/core/testing';

import { ContactService } from './contact.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { config } from '../../localConfig';
import { Contact } from '../types/common';

describe('ContactService', () => {
  let service: ContactService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ContactService],
    });

    service = TestBed.inject(ContactService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get contacts', fakeAsync(() => {
    let response = null;
    const responseObject = ['CONTACT_1', 'CONTACT_2'];

    service.getContacts().subscribe(
      (receivedResponse: any) => {
        response = receivedResponse;
      },
      (_: any) => {}
    );

    const requestWrapper = httpMock.expectOne({ url: config.contacts.dev });
    requestWrapper.flush(responseObject);

    tick();

    expect(requestWrapper.request.method).toEqual('GET');
    expect(response).toEqual(responseObject);
  }));

  it('should get contact by id', fakeAsync(() => {
    let response = null;
    const responseObject = 'CONTACT_BY_ID';
    const contactId = 42;

    service.getContactById(contactId).subscribe(
      (receivedResponse: any) => {
        response = receivedResponse;
      },
      (_: any) => {}
    );

    const requestWrapper = httpMock.expectOne({
      url: `${config.contacts.dev}/${contactId}`,
    });
    requestWrapper.flush(responseObject);

    tick();

    expect(requestWrapper.request.method).toEqual('GET');
    expect(response).toEqual(responseObject);
  }));

  it('should update contact', fakeAsync(() => {
    let response = null;
    const contact: Contact = {
      id: 42,
      firstName: 'firstName',
      lastName: 'lastName',
      street: 'street',
      zip: '1220',
      city: 'Vienna',
      country: 2,
      lastUpdatedAt: 'lastUpdatedAt',
    };
    const responseObject: Contact = { ...contact, city: 'Linz' };

    service.updateContact(contact).subscribe(
      (receivedResponse: any) => {
        response = receivedResponse;
      },
      (_: any) => {}
    );

    const requestWrapper = httpMock.expectOne({
      url: `${config.contacts.dev}/${contact.id}`,
    });
    requestWrapper.flush(responseObject);

    tick();

    expect(requestWrapper.request.method).toEqual('PUT');
    expect(response).toEqual(responseObject);
  }));
});
