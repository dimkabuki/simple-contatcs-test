import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactsComponent } from './contacts.component';
import { ContactService } from '../services';
import { of } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatTableHarness } from '@angular/material/table/testing';
import { Router } from '@angular/router';

describe('ContactsComponent', () => {
  let component: ContactsComponent;
  let fixture: ComponentFixture<ContactsComponent>;
  let loader: HarnessLoader;
  let getContactsSpy: jasmine.Spy;
  let routerNavigateSpy: jasmine.SpyObj<Router>;
  let contactsData;

  beforeEach(() => {
    contactsData = [
      {
        id: 1,
        firstName: 'firstName 1',
        lastName: 'lastName 1',
      },
      {
        id: 2,
        firstName: 'firstName 2',
        lastName: 'lastName 2',
      },
    ];

    const contactServiceStub = jasmine.createSpyObj('ContactService', [
      'getContacts',
    ]);
    getContactsSpy = contactServiceStub.getContacts.and.returnValue(
      of(contactsData)
    );

    routerNavigateSpy = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [ContactsComponent],
      imports: [MatTableModule],
      providers: [
        { provide: ContactService, useValue: contactServiceStub },
        { provide: Router, useValue: routerNavigateSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsComponent);
    component = fixture.componentInstance;
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call contact service on init', () => {
    expect(getContactsSpy).toHaveBeenCalledTimes(1);
  });

  it('should show table headers', async () => {
    const expectedHeadings = ['First Name', 'Last Name'];
    const table = await loader.getHarness<MatTableHarness>(MatTableHarness);
    const headerRows = await table.getHeaderRows();

    expect(await headerRows[0].getCellTextByIndex()).toEqual(expectedHeadings);
  });

  it('should display two rows with data', async () => {
    const table = await loader.getHarness<MatTableHarness>(MatTableHarness);
    const rows = await table.getRows();

    expect(rows.length).toBe(2);

    const rowText = await table.getCellTextByIndex();

    expect(rowText).toEqual([
      ['firstName 1', 'lastName 1'],
      ['firstName 2', 'lastName 2'],
    ]);
  });

  it('should navigate to edit contact page', async () => {
    const table = await loader.getHarness<MatTableHarness>(MatTableHarness);
    const [firstRow] = await table.getRows();

    const element = await firstRow.host();
    await element.click();

    expect(routerNavigateSpy.navigate).toHaveBeenCalledOnceWith([
      '/contact',
      1,
    ]);
  });
});
