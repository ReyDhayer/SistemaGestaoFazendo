
// Format currency values
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

// Format date values
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateString));
}

// Format full date with time
export function formatDateTime(dateString: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
}

// Format phone numbers
export function formatPhone(phone: string): string {
  // Assuming US phone format for simplicity, adjust as needed
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
}

// Generate a unique ID 
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Truncate long text
export function truncateText(text: string, maxLength: number = 50): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + '...';
}
