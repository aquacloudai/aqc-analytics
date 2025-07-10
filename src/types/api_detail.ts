export interface ApiDetail {
  title: string;                         // Human-readable label, e.g. "Kategori (per uke)"
  url: string;                           // Endpoint URL (base or with query params as you wish)
  params?: Record<string, any>;          // Optional: Query params (object, shown as JSON)
}
