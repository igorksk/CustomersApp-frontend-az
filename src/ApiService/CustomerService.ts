const BASE_URL = "http://localhost:7082/customers";

const customerService = {
  async getAll(search = "", sortBy = "", desc = true, page = 1, pageSize = 10) {
    const url = new URL(BASE_URL);
    url.searchParams.append("desc", desc.toString());
    url.searchParams.append("page", page.toString());
    url.searchParams.append("pageSize", pageSize.toString());

    if (search) url.searchParams.append("search", search);
    if (sortBy) url.searchParams.append("sortBy", sortBy);

    const response = await fetch(url.toString(), {
      method: "GET",
      headers: { "Accept": "application/json" },
    });

    if (!response.ok) throw new Error("Failed to fetch customers");

    return response.json();
  },

  async create(customer: { name: string; email: string }) {
    const response = await fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    if (!response.ok) throw new Error("Failed to create customer");

    return response.json();
  },

  async update(id: number, customer: { name: string; email: string }) {
    const response = await fetch(`${BASE_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(customer),
    });

    if (!response.ok) throw new Error("Failed to update customer");

    return response.json();
  },

  async delete(id: number) {
    const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });

    if (!response.ok) throw new Error("Failed to delete customer");
  },
};

export default customerService;
