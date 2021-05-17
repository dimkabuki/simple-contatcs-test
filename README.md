# Simple Contacts

## Introduction

The goal of this challenge is to create an Angular application which allows us to show a list of contacts and to select / edit a single contact.

The server-side part is already done. It's a very simple REST API which supports all operations necessary for this challenge.

## The simple Contacts application

When entering the application root all contacts returned by the API should be rendered in some kind of list / table.

Within this list / table a single contact can be clicked. When clicked then another page is opened which gives us the possibility to edit the selected contact. The URL for this editing page should be `contact/<contact-id>` (eg `contact/1`).

Editing should follow state-of-the art UX patterns (eg validation).

The following image shows some mockups of the application to be developed.

## Requirements

- [List Page] The first name and the last name of all contacts returned by the API are listed.
- [List Page] A contact can be selected by clicking on it.
- [List Page] When a contact is selected then the application navigates to the contact's edit pPage.
- [Edit Page] The page is available via the URL `contact/<contact-id>`
- [Edit Page] The page shows the selected contact as returned by the API initially
- [Edit Page] Selectable countries are those returned by the REST API (see below).
- [Edit Page] The last updated at date should be properly formatted (see mockup).
- [Edit Page] The Save button is disabled as long as the form is pristine (no changes done).
- [Edit Page] All attributes are required (non-empty strings).
- [Edit Page] The user should not be allowed to submit an invalid contact.
- [Edit Page] A contact is updated on the server by hitting the Save button.
- [Edit Page] After a successful update, the user stays on the edit page. All attributes are updated according to the result of the update as returned by the API (this is especially true for the last updated at attribute).
- [Edit Page] After a successful update, the Save button should be disabled again.
- [Edit Page] After an erronous update, a message is shown to the user (`windows.alert` is fine). The save button should stay enabled, the input stays as defined by the user before hitting the Save button.
- [Edit Page] The edit page renders a link which can be used to navigate back to the list of contacts.

## JSON REST API

`GET /contacts`

Returns a list of contacts. A single `contact` is defined like this:

```
{
    id: number              // mandatory, identifier, unique across all contacts
    firstName: string       // mandatory
    lastName: string        // mandatory
    street: string          // mandatory
    zip: string             // mandatory
    city: string            // mandatory
    country: number         // mandatory, identifier, references a country
    lastUpdatedAt: string   // mandatory, ISO8601 date/time
}
```

`GET /contacts/<contact-id>`

Returns the `contact` identified by the given `contact-id`.  
Returns a status of `404` if the given contact does not exist.

`PUT /contacts/<contact-id>`

Updates the contact with the given `contact-id`. The request body must contain the `contact` update. It's shape may contain both an `id` and a `lastUpdatedAt` attribute. However, they will be ignored upon update (the contact to be updated is defined by the URL parameter, `lastUpdatedAt` is calculated by the server-side).

Returns a status of `201` and the updated `contact` if the update was successful.  
Returns a status of `404` if the given contact does not exist.  
Returns a status of `400` if the given contact update is invalid.

`GET /countries`

Returns a list of countries. A single `country` is defined like this:

```
{
    id: number              // mandatory, identifier, unique across all countries
    name: string            // mandatory, string
}
```

## Your tasks

- Implement the listing and editing of contacts according to the requirements.
- Write as many specs as possible. We are test-infected and appreciate quality-assured work.

## Rules

- The client-side application has to be implemented in Angular.
- You can use whatever 3rd party libraries you want (eg css / component libraries, support for state management).
- Please do not touch the server implementation. The problems have to be solved purely on the client side.
- We really appreciate well designed and nice looking applications. However it is not the focus of this challenge. This challenge is about implementing functionality.

## Environment

### Server

The server is based on nodejs / express (Nodejs 10). Please install all its dependencies (`npm install`) and run it using `npm start`.

The server will listen on http://localhost:3001

GET http://localhost:3001/contacts for a list of contacts  
GET a single contact from http://localhost:3001/contacts/:contact-id  
GET http://localhost:3001/countries for a list of supported countries  
PUT a contact to http://localhost:3001/contacts/:contact-id in order to update a contact

### Client

The client is an Angular 8 application based on `angular-cli`. Please install all its dependencies (`npm install`) and run it using `npm start`.  
Nothing is implemented yet - the application was just generated using `ng new`.
