import React, { useState, useEffect } from 'react';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableShape, TableStatus, TableArea } from '@/types/tables';
import { ZoomIn, ZoomOut } from 'lucide-react';

interface TableFormProps {
  table?: Table;
  onSubmit: (data: Partial<Table>) => Promise<void>;
  onCancel: () => void;
  existingTables: Table[];
  areas: TableArea[];
}

export function TableForm({ table, onSubmit, onCancel, existingTables, areas }: TableFormProps) {
  const [formData, setFormData] = useState<Partial<Table>>({
    number: table?.number || Math.max(0, ...existingTables.map(t => t.number)) + 1,
    name: table?.name || '',
    capacity: table?.capacity || 4,
    status: table?.status || TableStatus.FREE,
    position: table?.position || { x: 100, y: 100 },
    shape: table?.shape || { type: 'circle', width: 80 },
    area: table?.area || (areas[0]?.name || 'Salão Principal'),
    isActive: table?.isActive ?? true
  });

  const [previewScale, setPreviewScale] = useState(0.5);

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleShapeChange = (type: 'circle' | 'rectangle' | 'square') => {
    setFormData(prev => ({
      ...prev,
      shape: {
        type,
        width: type === 'rectangle' ? 120 : 80,
        height: type === 'rectangle' ? 80 : undefined
      }
    }));
  };

  const renderPreview = () => {
    const { shape, position } = formData;
    if (!shape || !position) return null;

    const width = shape.width;
    const height = shape.type === 'rectangle' ? shape.height || width : width;

    return (
      <div className="relative border rounded-lg h-[300px] bg-grid-pattern">
        <div className="absolute right-2 top-2 flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPreviewScale(prev => Math.max(0.2, prev - 0.1))}
          >
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPreviewScale(prev => Math.min(2, prev + 0.1))}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <div className="bg-background/80 px-2 py-1 rounded text-sm">
            {Math.round(previewScale * 100)}%
          </div>
        </div>

        {/* Outras mesas existentes */}
        {existingTables.map(t => (
          <div
            key={t.id}
            className="absolute bg-gray-400/30 rounded-md flex items-center justify-center"
            style={{
              left: `${t.position.x}px`,
              top: `${t.position.y}px`,
              width: `${t.shape.width}px`,
              height: `${t.shape.type === 'rectangle' ? t.shape.height || t.shape.width : t.shape.width}px`,
              transform: `translate(-50%, -50%) scale(${previewScale})`,
            }}
          >
            <span className="text-xs text-gray-600">{t.number}</span>
          </div>
        ))}

        {/* Mesa sendo editada */}
        <div
          className={`absolute bg-primary flex items-center justify-center ${
            shape.type === 'circle' ? 'rounded-full' : 'rounded-md'
          }`}
          style={{
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: `${width}px`,
            height: `${height}px`,
            transform: `translate(-50%, -50%) scale(${previewScale})`,
          }}
        >
          <div className="text-white font-bold flex flex-col items-center">
            <span>{formData.number}</span>
            <span className="text-xs">{formData.capacity}p</span>
          </div>
        </div>

        {/* Áreas */}
        {areas.map(area => (
          <div
            key={area.id}
            className="absolute border border-dashed border-gray-400/50 rounded-md"
            style={{
              left: `${area.position.x}px`,
              top: `${area.position.y}px`,
              width: `${area.position.width}px`,
              height: `${area.position.height}px`,
              backgroundColor: area.background ? `${area.background}20` : 'transparent',
              transform: `scale(${previewScale})`,
              transformOrigin: '0 0',
            }}
          >
            <div className="absolute top-0 left-0 bg-background/80 px-2 py-1 text-xs">
              {area.name}
            </div>
          </div>
        ))}

        <div className="absolute bottom-2 right-2 bg-white/90 rounded px-2 py-1 text-xs">
          <div>X: {Math.round(position.x)}px</div>
          <div>Y: {Math.round(position.y)}px</div>
          <div>L: {Math.round(width)}px</div>
          {shape.type === 'rectangle' && <div>A: {Math.round(height)}px</div>}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Número</Label>
              <Input
                type="number"
                value={formData.number}
                onChange={(e) => handleChange('number', parseInt(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label>Capacidade</Label>
              <Input
                type="number"
                value={formData.capacity}
                onChange={(e) => handleChange('capacity', parseInt(e.target.value))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Nome</Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Mesa VIP 1"
            />
          </div>

          <div className="space-y-2">
            <Label>Área</Label>
            <Select
              value={formData.area}
              onValueChange={(value) => handleChange('area', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map(area => (
                  <SelectItem key={area.id} value={area.name}>
                    {area.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Formato</Label>
            <Select
              value={formData.shape?.type}
              onValueChange={(value: 'circle' | 'rectangle' | 'square') => handleShapeChange(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o formato" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="circle">Circular</SelectItem>
                <SelectItem value="square">Quadrada</SelectItem>
                <SelectItem value="rectangle">Retangular</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Largura (px)</Label>
              <Input
                type="number"
                value={formData.shape?.width}
                onChange={(e) => handleChange('shape', { ...formData.shape, width: parseInt(e.target.value) })}
              />
            </div>
            {formData.shape?.type === 'rectangle' && (
              <div className="space-y-2">
                <Label>Altura (px)</Label>
                <Input
                  type="number"
                  value={formData.shape?.height}
                  onChange={(e) => handleChange('shape', { ...formData.shape, height: parseInt(e.target.value) })}
                />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Posição X</Label>
              <Input
                type="number"
                value={formData.position?.x}
                onChange={(e) => handleChange('position', { ...formData.position, x: parseInt(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Posição Y</Label>
              <Input
                type="number"
                value={formData.position?.y}
                onChange={(e) => handleChange('position', { ...formData.position, y: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={() => onSubmit(formData)}>
              {table ? 'Salvar Alterações' : 'Criar Mesa'}
            </Button>
          </div>
        </div>

        <div className="space-y-4">
          <Label>Visualização</Label>
          {renderPreview()}
          <p className="text-sm text-muted-foreground">
            Use o zoom para ajustar a visualização. As outras mesas são mostradas em cinza para referência.
          </p>
        </div>
      </div>
    </div>
  );
} 