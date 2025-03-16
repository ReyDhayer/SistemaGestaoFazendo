import React, { useEffect, useRef } from 'react';
import { Table, TableStatus } from '@/types/tables';
import { Check, Edit, Trash2, Users, Calendar, ShoppingCart, CreditCard, Utensils } from 'lucide-react';
import { ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuSeparator, ContextMenuTrigger } from "@/components/ui/context-menu";

interface TableContextMenuProps {
  x: number;
  y: number;
  table: Table;
  onClose: () => void;
  onStatusChange: (tableId: number, status: TableStatus) => Promise<void>;
  onEdit: () => void;
}

export function TableContextMenu({ x, y, table, onClose, onStatusChange, onEdit }: TableContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  const handleStatusChange = async (status: TableStatus) => {
    await onStatusChange(table.id, status);
    onClose();
  };

  return (
    <div
      ref={menuRef}
      className="absolute z-50 min-w-[200px] bg-background border rounded-md shadow-md py-1 animate-in fade-in-0 zoom-in-95"
      style={{
        left: `${x}px`,
        top: `${y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="px-3 py-2 border-b">
        <div className="font-medium">Mesa {table.number}</div>
        <div className="text-sm text-muted-foreground">{table.name}</div>
      </div>

      <div className="py-1">
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={onEdit}
        >
          <Edit className="h-4 w-4" />
          Editar Mesa
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => {}}
        >
          <Users className="h-4 w-4" />
          Alterar Capacidade
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted text-destructive"
          onClick={() => {}}
        >
          <Trash2 className="h-4 w-4" />
          Excluir Mesa
        </button>
      </div>

      <div className="border-t py-1">
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => {}}
        >
          <ShoppingCart className="h-4 w-4" />
          Novo Pedido
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => {}}
        >
          <Calendar className="h-4 w-4" />
          Nova Reserva
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => {}}
        >
          <CreditCard className="h-4 w-4" />
          Pagamento
        </button>
      </div>

      <div className="border-t py-1">
        <div className="px-3 py-1 text-xs font-medium text-muted-foreground">
          Alterar Status
        </div>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => handleStatusChange(TableStatus.FREE)}
          disabled={table.status === TableStatus.FREE}
        >
          {table.status === TableStatus.FREE && <Check className="h-4 w-4" />}
          <span className={table.status === TableStatus.FREE ? 'font-medium' : ''}>
            Livre
          </span>
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => handleStatusChange(TableStatus.OCCUPIED)}
          disabled={table.status === TableStatus.OCCUPIED}
        >
          {table.status === TableStatus.OCCUPIED && <Check className="h-4 w-4" />}
          <span className={table.status === TableStatus.OCCUPIED ? 'font-medium' : ''}>
            Ocupada
          </span>
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => handleStatusChange(TableStatus.RESERVED)}
          disabled={table.status === TableStatus.RESERVED}
        >
          {table.status === TableStatus.RESERVED && <Check className="h-4 w-4" />}
          <span className={table.status === TableStatus.RESERVED ? 'font-medium' : ''}>
            Reservada
          </span>
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => handleStatusChange(TableStatus.WAITING_SERVICE)}
          disabled={table.status === TableStatus.WAITING_SERVICE}
        >
          {table.status === TableStatus.WAITING_SERVICE && <Check className="h-4 w-4" />}
          <span className={table.status === TableStatus.WAITING_SERVICE ? 'font-medium' : ''}>
            Aguardando Atendimento
          </span>
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => handleStatusChange(TableStatus.WAITING_PAYMENT)}
          disabled={table.status === TableStatus.WAITING_PAYMENT}
        >
          {table.status === TableStatus.WAITING_PAYMENT && <Check className="h-4 w-4" />}
          <span className={table.status === TableStatus.WAITING_PAYMENT ? 'font-medium' : ''}>
            Aguardando Pagamento
          </span>
        </button>
        <button
          className="w-full text-left px-3 py-1.5 text-sm flex items-center gap-2 hover:bg-muted"
          onClick={() => handleStatusChange(TableStatus.CLEANING)}
          disabled={table.status === TableStatus.CLEANING}
        >
          {table.status === TableStatus.CLEANING && <Check className="h-4 w-4" />}
          <span className={table.status === TableStatus.CLEANING ? 'font-medium' : ''}>
            Limpeza
          </span>
        </button>
      </div>
    </div>
  );
} 