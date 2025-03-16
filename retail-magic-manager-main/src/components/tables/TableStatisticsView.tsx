import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Loader2, BarChart2 } from 'lucide-react';
import { Table as TableType, TableStatistics } from '@/types/tables';

interface TableStatisticsViewProps {
  tables: TableType[];
  statistics?: TableStatistics;
  isLoading?: boolean;
}

export function TableStatisticsView({ tables, statistics, isLoading = false }: TableStatisticsViewProps) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const totalTables = tables.length;
  const occupiedTables = tables.filter(table => 
    table.status === 'occupied' || 
    table.status === 'waiting_service' || 
    table.status === 'waiting_payment'
  ).length;
  const occupancyRate = totalTables > 0 ? (occupiedTables / totalTables) * 100 : 0;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-4 w-4" />
            Ocupação Atual
          </CardTitle>
          <CardDescription>
            Visão geral da ocupação das mesas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Taxa de Ocupação</span>
              <span className="text-2xl font-bold">{occupancyRate.toFixed(1)}%</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Mesas Ocupadas</span>
                <span className="font-medium">{occupiedTables} de {totalTables}</span>
              </div>
              <div className="h-2 rounded-full bg-secondary">
                <div
                  className="h-2 rounded-full bg-primary"
                  style={{ width: `${occupancyRate}%` }}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {statistics && (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Tempo Médio</CardTitle>
              <CardDescription>
                Estatísticas de tempo de ocupação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Ocupação Média</span>
                  <span className="text-2xl font-bold">
                    {Math.round(statistics.averageOccupationTime)} min
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Taxa de Rotatividade</span>
                    <span className="font-medium">
                      {statistics.turnoverRate.toFixed(1)}x/dia
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horários Populares</CardTitle>
              <CardDescription>
                Períodos com maior movimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Horário</TableHead>
                    <TableHead className="text-right">Ocupação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statistics.popularHours.slice(0, 5).map(({ hour, count }) => (
                    <TableRow key={hour}>
                      <TableCell>{hour}:00</TableCell>
                      <TableCell className="text-right">{count}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dias Mais Movimentados</CardTitle>
              <CardDescription>
                Dias da semana com maior movimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Dia</TableHead>
                    <TableHead className="text-right">Ocupação</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {statistics.popularDays.map(({ day, count }) => (
                    <TableRow key={day}>
                      <TableCell>{day}</TableCell>
                      <TableCell className="text-right">{count}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Receita</CardTitle>
              <CardDescription>
                Faturamento e média por mesa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Gerado</span>
                  <span className="text-2xl font-bold">
                    R$ {statistics.revenueGenerated.toFixed(2)}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Média por Mesa</span>
                    <span className="font-medium">
                      R$ {(statistics.revenueGenerated / totalTables).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tamanho dos Grupos</CardTitle>
              <CardDescription>
                Média de pessoas por mesa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Média de Pessoas</span>
                  <span className="text-2xl font-bold">
                    {statistics.averagePartySize.toFixed(1)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
} 