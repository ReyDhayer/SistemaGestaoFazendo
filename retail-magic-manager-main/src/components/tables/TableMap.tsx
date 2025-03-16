import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableArea, TableLayout, TableStatus } from '@/types/tables';
import { TableDetailsPanel } from './TableDetailsPanel';
import { TableContextMenu } from './TableContextMenu';
import { Loader2, ZoomIn, ZoomOut, RefreshCw, Lock, Unlock, Plus, GripHorizontal } from 'lucide-react';
import { tableService } from '@/services/table';
import { cn } from '@/lib/utils';
import { TableForm } from './TableForm';

interface TableMapProps {
  tables: Table[];
  areas: TableArea[];
  layout: TableLayout | null;
  onStatusChange: (tableId: number, status: TableStatus) => Promise<void>;
  isLoading: boolean;
  onRefresh?: () => void;
}

export function TableMap({ tables: initialTables, areas, layout, onStatusChange, isLoading, onRefresh }: TableMapProps) {
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [selectedTable, setSelectedTable] = useState<Table | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; table: Table } | null>(null);
  const [draggingTable, setDraggingTable] = useState<Table | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [resizingTable, setResizingTable] = useState<{ table: Table, direction: string } | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  const [showGrid, setShowGrid] = useState(true);
  const [isAddingTable, setIsAddingTable] = useState(false);
  const [editingTable, setEditingTable] = useState<Table | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [tables, setTables] = useState<Table[]>(initialTables);
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTables(initialTables);
  }, [initialTables]);

  useEffect(() => {
    if (layout) {
      setScale(layout.scale || 1);
    }
  }, [layout]);

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // Left click
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!mapRef.current) return;

    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    const rect = mapRef.current.getBoundingClientRect();
    const newX = (e.clientX - rect.left - position.x) / scale;
    const newY = (e.clientY - rect.top - position.y) / scale;

    setMousePosition({ x: newX, y: newY });

    if (draggingTable) {
      e.preventDefault();
      e.stopPropagation();
      setTables(prevTables => prevTables.map(t => {
        if (t.id === draggingTable.id) {
          return {
            ...t,
            position: { 
              x: newX + dragOffset.x,
              y: newY + dragOffset.y
            }
          };
        }
        return t;
      }));
    }

    if (resizingTable) {
      const { table, direction } = resizingTable;
      const minSize = 40;
      let newWidth = table.shape.width;
      let newHeight = table.shape.type === 'rectangle' ? table.shape.height || table.shape.width : table.shape.width;

      if (direction.includes('e')) {
        newWidth = Math.max(minSize, newX - table.position.x);
      }
      if (direction.includes('w')) {
        const deltaX = table.position.x - newX;
        newWidth = Math.max(minSize, table.shape.width + deltaX);
      }
      if (direction.includes('s')) {
        newHeight = Math.max(minSize, newY - table.position.y);
      }
      if (direction.includes('n')) {
        const deltaY = table.position.y - newY;
        newHeight = Math.max(minSize, (table.shape.height || table.shape.width) + deltaY);
      }

      const updatedTables = tables.map(t => {
        if (t.id === table.id) {
          return {
            ...t,
            shape: {
              ...t.shape,
              width: newWidth,
              height: t.shape.type === 'rectangle' ? newHeight : undefined
            }
          };
        }
        return t;
      });
      // Atualizar estado local
      setTables(updatedTables);
    }
  };

  const handleMouseUp = async (e: React.MouseEvent) => {
    setIsDragging(false);
    
    if (draggingTable) {
      try {
        const currentTable = tables.find(t => t.id === draggingTable.id);
        if (currentTable) {
          await tableService.updateTablePosition(draggingTable.id, currentTable.position);
          if (onRefresh) onRefresh();
        }
      } catch (error) {
        console.error('Erro ao atualizar posição da mesa:', error);
      }
      setDraggingTable(null);
    }

    if (resizingTable) {
      try {
        const currentTable = tables.find(t => t.id === resizingTable.table.id);
        if (currentTable) {
          await tableService.updateTableShape(currentTable.id, currentTable.shape);
          if (onRefresh) onRefresh();
        }
      } catch (error) {
        console.error('Erro ao atualizar dimensões da mesa:', error);
      }
      setResizingTable(null);
    }
  };

  const handleTableClick = (table: Table) => {
    setSelectedTable(table);
  };

  const handleContextMenu = (e: React.MouseEvent, table: Table) => {
    e.preventDefault();
    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      table
    });
  };

  const closeContextMenu = () => {
    setContextMenu(null);
  };

  const getStatusColor = (status: TableStatus) => {
    switch (status) {
      case TableStatus.FREE:
        return 'bg-green-500';
      case TableStatus.OCCUPIED:
        return 'bg-red-500';
      case TableStatus.RESERVED:
        return 'bg-blue-500';
      case TableStatus.WAITING_SERVICE:
        return 'bg-yellow-500';
      case TableStatus.WAITING_PAYMENT:
        return 'bg-purple-500';
      case TableStatus.CLEANING:
        return 'bg-gray-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getStatusText = (status: TableStatus) => {
    switch (status) {
      case TableStatus.FREE:
        return 'Livre';
      case TableStatus.OCCUPIED:
        return 'Ocupada';
      case TableStatus.RESERVED:
        return 'Reservada';
      case TableStatus.WAITING_SERVICE:
        return 'Aguardando Atendimento';
      case TableStatus.WAITING_PAYMENT:
        return 'Aguardando Pagamento';
      case TableStatus.CLEANING:
        return 'Limpeza';
      default:
        return 'Desconhecido';
    }
  };

  const handleTableMouseDown = (e: React.MouseEvent, table: Table) => {
    if (isLocked) return;
    
    if (e.button === 2) { // Botão direito para iniciar arrasto
      e.preventDefault();
      e.stopPropagation();
      const rect = mapRef.current?.getBoundingClientRect();
      if (rect) {
        const mouseX = (e.clientX - rect.left - position.x) / scale;
        const mouseY = (e.clientY - rect.top - position.y) / scale;
        setDragOffset({
          x: table.position.x - mouseX,
          y: table.position.y - mouseY
        });
        setDraggingTable(table);
        setSelectedTable(table);
      }
    }
  };

  const handleAddTable = async (data: Partial<Table>) => {
    try {
      await tableService.create(data);
      if (onRefresh) onRefresh();
      setIsAddingTable(false);
    } catch (error) {
      console.error('Erro ao criar mesa:', error);
    }
  };

  const handleEditTable = async (data: Partial<Table>) => {
    if (!editingTable) return;
    try {
      await tableService.update(editingTable.id, data);
      if (onRefresh) onRefresh();
      setEditingTable(null);
    } catch (error) {
      console.error('Erro ao atualizar mesa:', error);
    }
  };

  const renderTable = (table: Table) => {
    const isSelected = selectedTable?.id === table.id;
    const isDragging = draggingTable?.id === table.id;
    const isResizing = resizingTable?.table.id === table.id;
    const statusColor = getStatusColor(table.status);
    
    const tableStyle = {
      left: `${table.position.x}px`,
      top: `${table.position.y}px`,
      width: `${table.shape.width}px`,
      height: `${table.shape.type === 'rectangle' ? table.shape.height || table.shape.width : table.shape.width}px`,
      transform: 'translate(-50%, -50%)',
      cursor: isDragging ? 'grabbing' : 'grab',
      opacity: isDragging ? 0.7 : 1,
      zIndex: isDragging || isResizing ? 1000 : 1,
      pointerEvents: isDragging ? 'none' : 'auto'
    };

    const resizeHandles = !isLocked && (
      <>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full cursor-n-resize" 
             onMouseDown={(e) => {
               e.stopPropagation();
               setResizingTable({ table, direction: 'n' });
             }} />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-3 h-3 bg-primary rounded-full cursor-s-resize"
             onMouseDown={(e) => {
               e.stopPropagation();
               setResizingTable({ table, direction: 's' });
             }} />
        <div className="absolute left-0 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full cursor-w-resize"
             onMouseDown={(e) => {
               e.stopPropagation();
               setResizingTable({ table, direction: 'w' });
             }} />
        <div className="absolute right-0 top-1/2 translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-primary rounded-full cursor-e-resize"
             onMouseDown={(e) => {
               e.stopPropagation();
               setResizingTable({ table, direction: 'e' });
             }} />
      </>
    );

    return (
      <div
        key={table.id}
        className={cn(
          "absolute flex items-center justify-center",
          table.shape.type === 'circle' ? 'rounded-full' : 'rounded-md',
          statusColor,
          isSelected && 'ring-4 ring-primary',
          isDragging && 'ring-4 ring-primary-500'
        )}
        style={tableStyle}
        onMouseDown={(e) => handleTableMouseDown(e, table)}
        onClick={(e) => {
          if (!isDragging) {
            e.stopPropagation();
            handleTableClick(table);
          }
        }}
        onContextMenu={(e) => handleContextMenu(e, table)}
      >
        <div className="text-white font-bold flex flex-col items-center">
          <span>{table.number}</span>
          <span className="text-xs">{table.capacity}p</span>
        </div>
        {(isSelected || isDragging) && !isLocked && resizeHandles}
        {isDragging && (
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black/75 text-white px-2 py-1 rounded text-sm whitespace-nowrap">
            Arrastando Mesa {table.number}
          </div>
        )}
      </div>
    );
  };

  const renderArea = (area: TableArea) => {
    return (
      <div
        key={area.id}
        className="absolute border border-dashed border-gray-400 rounded-md"
        style={{
          left: `${area.position.x}px`,
          top: `${area.position.y}px`,
          width: `${area.position.width}px`,
          height: `${area.position.height}px`,
          backgroundColor: area.background || 'transparent',
        }}
      >
        <div className="absolute top-0 left-0 bg-background/80 px-2 py-1 text-xs font-medium rounded-br-md">
          {area.name}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-6 min-h-[500px]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="overflow-hidden">
        <CardContent className="p-0 relative">
          <div className="flex items-center justify-between p-4 border-b">
            <div className="flex gap-2">
              {Object.values(TableStatus).map((status) => (
                <Badge key={status} variant="outline" className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-full ${getStatusColor(status)}`} />
                  <span>{getStatusText(status)}</span>
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" onClick={() => setIsLocked(!isLocked)}>
                {isLocked ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
              </Button>
              <Button variant="outline" size="icon" onClick={() => setShowGrid(!showGrid)}>
                <GripHorizontal className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsAddingTable(true)}>
                <Plus className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <Slider
                value={[scale * 100]}
                min={50}
                max={200}
                step={10}
                className="w-32"
                onValueChange={(value) => setScale(value[0] / 100)}
              />
              <Button variant="outline" size="icon" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setPosition({ x: 0, y: 0 })}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div 
            ref={mapRef}
            className={cn(
              "relative overflow-hidden min-h-[500px]",
              showGrid && "bg-grid-pattern"
            )}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onClick={handleMouseUp}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div 
              className="absolute"
              style={{
                transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
                transformOrigin: '0 0',
                width: layout?.width || 800,
                height: layout?.height || 600,
                transition: isDragging || draggingTable ? 'none' : 'transform 0.2s ease-out',
              }}
              onMouseMove={handleMouseMove}
            >
              {areas.map(renderArea)}
              {tables.map(renderTable)}
              {isAddingTable && (
                <div
                  className="absolute bg-primary/50 rounded-full w-20 h-20"
                  style={{
                    left: `${mousePosition.x}px`,
                    top: `${mousePosition.y}px`,
                    transform: 'translate(-50%, -50%)'
                  }}
                />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddingTable} onOpenChange={setIsAddingTable}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Mesa</DialogTitle>
            <DialogDescription>
              Preencha os detalhes da nova mesa. A visualização ao lado mostra como a mesa ficará no mapa.
              As outras mesas são mostradas em cinza para referência.
            </DialogDescription>
          </DialogHeader>
          <TableForm
            existingTables={tables}
            areas={areas}
            onSubmit={handleAddTable}
            onCancel={() => setIsAddingTable(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingTable} onOpenChange={(open) => !open && setEditingTable(null)}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Editar Mesa {editingTable?.number}</DialogTitle>
            <DialogDescription>
              Modifique os detalhes da mesa. A visualização ao lado mostra como a mesa ficará no mapa.
              As outras mesas são mostradas em cinza para referência.
            </DialogDescription>
          </DialogHeader>
          {editingTable && (
            <TableForm
              table={editingTable}
              existingTables={tables.filter(t => t.id !== editingTable.id)}
              areas={areas}
              onSubmit={handleEditTable}
              onCancel={() => setEditingTable(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      {selectedTable && (
        <TableDetailsPanel 
          table={selectedTable}
          onClose={() => setSelectedTable(null)}
          onStatusChange={onStatusChange}
          onEdit={() => {
            setEditingTable(selectedTable);
            setSelectedTable(null);
          }}
        />
      )}

      {contextMenu && (
        <TableContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          table={contextMenu.table}
          onClose={closeContextMenu}
          onStatusChange={onStatusChange}
          onEdit={() => {
            setEditingTable(contextMenu.table);
            closeContextMenu();
          }}
        />
      )}
    </>
  );
} 