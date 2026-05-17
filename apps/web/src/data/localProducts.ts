import type { Product } from "../types/domain";

export const localProducts: Product[] = [
  { id: "local-cappuccino", slug: "cappuccino", name: "Cappuccino", description: "Rich espresso with steamed milk and foam.", imageUrl: "/legacy/assets/images/cuppchino.png", unitPriceCents: 500, category: "ready-to-go", isActive: true },
  { id: "local-frappe-mocha", slug: "frappe-mocha", name: "Frappe Mocha", description: "Blended mocha frappe.", imageUrl: "/legacy/assets/images/frappe.png", unitPriceCents: 750, category: "ready-to-go", isActive: true },
  { id: "local-latte", slug: "latte", name: "Latte", description: "Balanced espresso and steamed milk.", imageUrl: "/legacy/assets/images/lattah.png", unitPriceCents: 1049, category: "ready-to-go", isActive: true }
];
