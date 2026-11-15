/**
 * Placeholder del futuro agente de ventas por WhatsApp.
 *
 * TODO(agente): webhook de n8n que recibe mensajes de WhatsApp Business, consulta
 * `content/products.ts` (o la DB que lo sustituya) y arma pedidos con `CartLine`.
 * Probable endpoint: app/api/agent/route.ts → reenvía al webhook de n8n.
 */
import type { CartLine } from "@/lib/cart/types";

export interface AgentOrderIntent {
  channel: "whatsapp";
  /** Número del cliente en formato internacional, sin "+". */
  customerPhone: string;
  lines: CartLine[];
  deliveryAddress?: string;
  notes?: string;
  createdAt: string;
}
