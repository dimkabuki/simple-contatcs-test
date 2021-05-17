import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { config } from 'src/localConfig';
import { Contact } from '../types/common';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private contactUrl = config.contacts.dev;

  constructor(private http: HttpClient) {}

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.contactUrl);
  }

  getContactById(id: Contact['id']): Observable<Contact> {
    return this.http.get<Contact>(`${this.contactUrl}/${id}`);
  }

  updateContact(data: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.contactUrl}/${data.id}`, data);
  }
}
