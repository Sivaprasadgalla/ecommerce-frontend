"use client";

import { getContact, updateContact } from "@/services/contacts.service";
import showToast from "@/utils/toast";
import { useRouter } from "next/dist/client/components/navigation";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

const EditContact = () => {
  const router = useRouter();
  const params = useParams();
  const id = String(params.id); // get contact id from URL
  console.log(id);

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [serverError, setServerError] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    else if (form.name.length < 3)
      newErrors.name = "Name must be at least 3 characters";

    if (!form.email.trim()) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email format";

    if (!form.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^[\d\s()+-]+$/.test(form.phone))
      newErrors.phone = "Invalid phone format";
    else if (form.phone.length < 10)
      newErrors.phone = "Phone must be at least 10 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear field error
  };

  const getContactDetails = useCallback(
    async (contactId: string) => {
      setLoading(true);
      try {
        const res = await getContact(contactId); // assuming getContact is defined
        if (!res) showToast("Contact not found", "error");
        console.log(res);
        setForm({
          name: res.contact.name ?? "", // Ensure default value
          email: res.contact.email ?? "", // Ensure default value
          phone: res.contact.phone ?? "", // Ensure default value
        });
        setLoading(false);
      } catch (err: any) {
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
        }
        console.error(err);
      }
      finally {
        setLoading(false);
      }
    },
    [router]
  );

  useEffect(() => {
    if (id) {
      getContactDetails(id); // Fetch contact details if `id` is available
    }
  }, [id, getContactDetails]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!validate()) return; // Stop if invalid

    setLoading(true);
    try {
      await updateContact(id, form); // assuming updateContact is defined
      showToast("Contact updated successfully!", "success");
      router.push("/contacts");
    } catch (err: any) {
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        router.push("/login");
      }
      setServerError(err.response?.data?.message || "Updating contact failed");
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-gray-500">
        Loading contact...
      </div>
    );

  return (
    <div className="isolate bg-gray-900 px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center mb-10">
        <Link
          href="/contacts"
          className="rounded-md border border-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        >
          Back
        </Link>
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl">
          Edit the Contact
        </h2>
      </div>
      <form
        onSubmit={handleSubmit}
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label
              htmlFor="name"
              className="block text-sm/6 font-semibold text-white"
            >
              Name
            </label>
            <div className="mt-2.5">
              <input
                id="name"
                type="text"
                name="name"
                value={form.name} // Always has a value
                onChange={handleChange}
                autoComplete="given-name"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
              {errors.name && <p className="text-red-500">{errors.name}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="email"
              className="block text-sm/6 font-semibold text-white"
            >
              Email
            </label>
            <div className="mt-2.5">
              <input
                id="email"
                type="email"
                name="email"
                value={form.email} // Always has a value
                onChange={handleChange}
                autoComplete="email"
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
              {errors.email && <p className="text-red-500">{errors.email}</p>}
            </div>
          </div>

          <div className="sm:col-span-2">
            <label
              htmlFor="phone"
              className="block text-sm/6 font-semibold text-white"
            >
              Phone
            </label>
            <div className="mt-2.5">
              <input
                id="phone"
                type="text"
                name="phone"
                value={form.phone} // Always has a value
                onChange={handleChange}
                className="block w-full rounded-md bg-white/5 px-3.5 py-2 text-base text-white outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500"
              />
              {errors.phone && <p className="text-red-500">{errors.phone}</p>}
            </div>
          </div>
        </div>

        <div className="mt-10">
          <button
            disabled={loading}
            className="block w-full rounded-md bg-indigo-500 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          >
            {loading ? "Updating Contact..." : "Update Contact"}
          </button>
        </div>
      </form>

      {serverError && (
        <p className="text-red-500 text-center text-sm mt-5">{serverError}</p>
      )}
    </div>
  );
};

export default EditContact;
