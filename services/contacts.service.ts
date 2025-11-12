// src/services/contacts.service.ts
import api from "@/lib/api";

export type Contact = {
  _id: string;
  name: string;
  email: string;
  phone?: string;
};

export type ContactsResponse = {
    contacts: Contact[];
    user: { _id: string; username: string; email: string };
};

export type ContactResponse = {
    contact: Contact;
};

export const getContacts = async (): Promise<ContactsResponse> => {
  const { data } = await api.get<ContactsResponse>("/contacts");
  return data;
};

export const getContact = async (contactId: string): Promise<ContactResponse> => {
  const { data } = await api.get<ContactResponse>(`/contacts/${contactId}`);
  return data;
};

export const addContact = async (contact: { name: string; email: string; phone?: string; }): Promise<Contact> => {
  const { data } = await api.post<Contact>("/contacts", contact);
  return data;
};

export const deleteContact = async (contactId: string): Promise<void> => {
  await api.delete(`/contacts/${contactId}`);
};

export const updateContact = async (contactId: string, updates: { name?: string; email?: string; phone?: string; }): Promise<Contact> => {
  const { data } = await api.put<Contact>(`/contacts/${contactId}`, updates);
  return data;
};
