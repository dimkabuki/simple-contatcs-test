export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  street: string;
  zip: string;
  city: string;
  country: number;
  lastUpdatedAt: string;
}

export interface Country {
  id: number;
  name: string;
}
