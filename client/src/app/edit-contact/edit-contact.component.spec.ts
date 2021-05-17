import {
  ComponentFixture,
  TestBed,
} from '@angular/core/testing';

import { EditContactComponent } from './edit-contact.component';
import { HarnessLoader } from '@angular/cdk/testing';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { ContactService, CountryService } from '../services';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';

describe('EditContactComponent', () => {
  let component: EditContactComponent;
  let fixture: ComponentFixture<EditContactComponent>;

  let loader: HarnessLoader;

  let getContactByIdSpy: jasmine.Spy;
  let updateContactSpy: jasmine.Spy;
  let contactData;

  let getCountriesSpy: jasmine.Spy;
  let countriesData;

  let openDialogSpy: jasmine.Spy;

  beforeEach(async () => {
    contactData = {
      id: 42,
      firstName: 'First name',
      lastName: 'Last Name',
      street: 'Street',
      zip: '1001',
      city: 'City',
      country: 1,
      lastUpdatedAt: '2021-05-16T22:29:21.485Z',
    };

    countriesData = [
      { id: 1, name: 'Austria' },
      { id: 2, name: 'Germany' },
      { id: 3, name: 'Switzerland' },
    ];

    jasmine.clock().install();
    jasmine.clock().mockDate(new Date(contactData.lastUpdatedAt));

    const contactServiceStub = jasmine.createSpyObj('ContactService', [
      'getContactById',
      'updateContact',
    ]);
    getContactByIdSpy = contactServiceStub.getContactById.and.returnValue(
      of(contactData)
    );
    updateContactSpy = contactServiceStub.updateContact.and.returnValue(
      of(contactData)
    );

    const countryServiceStub = jasmine.createSpyObj('CountryService', [
      'getCountries',
    ]);
    getCountriesSpy = countryServiceStub.getCountries.and.returnValue(
      of(countriesData)
    );

    openDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);

    await TestBed.configureTestingModule({
      declarations: [EditContactComponent],
      imports: [
        RouterTestingModule,
        RouterModule,
        BrowserAnimationsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatProgressSpinnerModule,
        MatDialogModule,
        MatButtonModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ContactService, useValue: contactServiceStub },
        { provide: CountryService, useValue: countryServiceStub },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { paramMap: { get: () => '42' } },
          },
        },
        { provide: FormBuilder },
        {
          provide: MatDialog,
          useValue: openDialogSpy,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(EditContactComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show form with contact data', () => {
    expect(component.editForm.value).toEqual({
      id: 42,
      firstName: 'First name',
      lastName: 'Last Name',
      street: 'Street',
      zip: '1001',
      city: 'City',
      country: 1,
    });
  });

  it('should show last updated at date value', () => {
    const element = fixture.nativeElement.querySelector(
      '[aria-label="last updated at date"]'
    );

    expect(element.innerText).toBe('May 17, 2021, 12:29:21 AM');
  });

  it('should update form data', () => {
    component.editForm.controls.firstName.setValue('New First Name');
    component.editForm.controls.lastName.setValue('New Last Name');
    component.editForm.controls.street.setValue('New Street');
    component.editForm.controls.zip.setValue('2002');
    component.editForm.controls.city.setValue('New City');
    component.editForm.controls.country.setValue(2);

    expect(component.editForm.value).toEqual({
      id: 42,
      firstName: 'New First Name',
      lastName: 'New Last Name',
      street: 'New Street',
      zip: '2002',
      city: 'New City',
      country: 2,
    });
  });

  it('should invalidate form on any empty value', () => {
    Object.values(component.editForm.controls).forEach((control) => {
      const value = control.value;
      control.setValue(undefined);
      expect(component.editForm.invalid).toBeTruthy();

      // turn value back
      control.setValue(value);
    });
  });

  it('should send data for update', () => {
    const submitButton = fixture.nativeElement.querySelector(
      'button[type=submit]'
    );

    expect(submitButton.disabled).toBeTruthy();

    component.editForm.controls.city.setValue('New City');

    // can't find why pristine status won't update, so faking it
    component.editForm.markAsDirty();
    fixture.detectChanges();

    expect(submitButton.disabled).toBeFalsy();

    submitButton.click();

    expect(updateContactSpy).toHaveBeenCalledOnceWith({
      ...contactData,
      city: 'New City',
    });
  });
});
