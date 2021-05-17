import { Component, OnInit } from '@angular/core';
import { ContactService } from '../services';
import { Contact } from '../types/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contacts',
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})
export class ContactsComponent implements OnInit {
  displayedColumns: string[] = ['firstName', 'lastName'];
  dataSource: Contact[] = [];

  constructor(private router: Router, private contactService: ContactService) {}

  ngOnInit(): void {
    this.getContacts();
  }

  getContacts(): void {
    this.contactService
      .getContacts()
      .subscribe((contacts) => (this.dataSource = contacts));
  }

  editContact(id: number) {
    this.router.navigate(['/contact', id]);
  }
}
