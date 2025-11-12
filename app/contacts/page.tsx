"use client";

import { useCallback, useEffect, useState } from "react";
import {
  getContacts,
  Contact,
  deleteContact,
} from "@/services/contacts.service";
import { useRouter } from "next/navigation";
import { removeToken } from "@/utils";
import showToast from "@/utils/toast";
import Link from "next/link";

export default function ContactsPage() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [user, setUser] = useState<{
    _id: string;
    username: string;
    email: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

    const handleDelete = async (contactId: string) => {
    try {
        await deleteContact(contactId);
        showToast("Contact deleted successfully!", "success");
        loadContacts();
    } catch (err: any) {
      if (err.response?.status === 401) {
        removeToken();
        router.push("/login");
        return;
      }
      console.error("Failed to delete contact:", err);
    }
  };

  const loadContacts = useCallback(async () => {
    try {
      const data = await getContacts();
      // console.log("Fetched contacts:", data);
      setContacts(data.contacts);
      setUser(data.user);
      showToast("Contacts fetched successfully!", "success");
    } catch (err: any) {
      console.error("Failed to fetch contacts:", err);
      if (err.response?.status === 401) {
        removeToken();
        router.push("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadContacts();
  }, [loadContacts]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading contacts...
      </div>
    );

  return (
    <main className="min-h-screen bg-gray-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Your Contacts</h1>
        <button
          className="px-4 py-2 bg-indigo-500 text-white rounded-md shadow hover:bg-indigo-600 transition cursor-pointer"
          onClick={() => router.push("/contacts/add")}
        >
          + Add Contact
        </button>
      </div>
      <div className="mb-6">
        <h3 className="text-lg text-black mb-5">
          Welcome <span className="text-indigo-600 pr-2">{user?.username}</span>
          !
        </h3>
        <p className="text-black">
          Your Contacts:{" "}
          <span className="font-bold text-black">{contacts.length}</span>
        </p>
      </div>
      {contacts.length === 0 ? (
        <p className="text-gray-600">
          No contacts found. Add some contacts to get started!
        </p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {contacts.map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer"
            >
              <div className="flex items-center justify-between space-x-4 mb-2">
                <div className="flex items-center space-x-4 mb-2">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                    {c.name.charAt(0).toUpperCase()}
                  </div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {c.name}
                  </h2>
                </div>
                <div>
                  <Link href={`/contacts/edit/${c._id}`}>
                    <span className="text-blue-500 hover:underline mr-4 cursor-pointer">
                      Edit
                    </span>
                  </Link>
                  <button
                    className="text-red-500 hover:underline cursor-pointer"
                    onClick={() => handleDelete(c._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              <p className="text-gray-500 text-sm mt-5">{c.email}</p>
              <p className="text-gray-500 text-sm mt-5">{c.phone}</p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
