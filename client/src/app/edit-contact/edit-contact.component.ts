import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Contact, Country } from '../types/common';
import { ContactService, CountryService } from '../services';
import { MatDialog } from '@angular/material/dialog';
import {
  ResultDialogComponent,
  ResultDialogData,
} from './result-dialog.component';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.scss'],
})
export class EditContactComponent implements OnInit {
  id: number;
  contact: Contact;
  editForm: FormGroup;
  countries: Country[] = [];
  isLoading = false;

  constructor(
    private contactService: ContactService,
    private countryService: CountryService,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.id = +this.route.snapshot.paramMap.get('id');
    this.editForm = this.formBuilder.group({
      id: [null],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      street: [null, Validators.required],
      zip: [null, Validators.required],
      city: [null, Validators.required],
      country: [null, Validators.required],
    });

    this.countryService
      .getCountries()
      .subscribe((countries) => (this.countries = countries));

    this.contactService
      .getContactById(this.id)
      .subscribe((contact) => this.updateContact(contact));
  }

  submit() {
    if (!this.editForm.valid) {
      return;
    }
    this.isLoading = true;

    this.contactService
      .updateContact({
        ...this.editForm.value,
        lastUpdatedAt: new Date().toISOString(),
      })
      .subscribe({
        next: (contact: Contact) => {
          this.isLoading = false;
          this.updateContact(contact);
          this.dialog.open<ResultDialogComponent, ResultDialogData>(
            ResultDialogComponent,
            {
              data: {
                title: 'Success!',
                content: 'Contact data updated',
              },
            }
          );
        },
        error: (err) => {
          console.error(err);
          this.isLoading = false;
          this.editForm.markAsDirty();
          this.dialog.open<ResultDialogComponent, ResultDialogData>(
            ResultDialogComponent,
            {
              data: {
                title: 'Error!',
                content: 'Error updating contact',
              },
            }
          );
        },
      });
  }

  private updateContact(contact: Contact) {
    this.contact = contact;
    this.editForm.reset(contact);
  }
}
