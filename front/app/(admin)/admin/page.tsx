'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import {
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  flexRender,
  type ColumnDef,
} from '@tanstack/react-table'
import { useAdminApplications } from '@/hooks/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ProgressBar } from '@/components/ui/progress-bar'
import { 
  Eye, 
  Loader2, 
  Users, 
  FileCheck, 
  Clock,
  CheckCircle2
} from 'lucide-react'
import type { AdminApplication, ApplicationStatus } from '@/types'

const statusConfig: Record<ApplicationStatus, { label: string; color: string; bgColor: string }> = {
  in_progress: {
    label: 'Em andamento',
    color: 'text-amber-600',
    bgColor: 'bg-amber-100',
  },
  completed: {
    label: 'Completo',
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  submitted: {
    label: 'Enviado',
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
}

export default function AdminDashboardPage() {
  const [statusFilter, setStatusFilter] = useState<ApplicationStatus | 'all'>('all')
  const { data: applications, isLoading } = useAdminApplications(
    statusFilter === 'all' ? undefined : statusFilter
  )

  const columns = useMemo<ColumnDef<AdminApplication>[]>(
    () => [
      {
        accessorKey: 'userName',
        header: 'Cliente',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-foreground">{row.original.userName}</p>
            <p className="text-sm text-muted-foreground">{row.original.userEmail}</p>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = row.original.status
          const config = statusConfig[status]
          return (
            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${config.bgColor} ${config.color}`}>
              {config.label}
            </span>
          )
        },
      },
      {
        accessorKey: 'progress',
        header: 'Progresso',
        cell: ({ row }) => (
          <div className="w-32">
            <ProgressBar value={row.original.progress} size="sm" showLabel={false} />
            <span className="text-xs text-muted-foreground">{row.original.progress}%</span>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Data de criação',
        cell: ({ row }) => (
          <span className="text-muted-foreground">
            {new Date(row.original.createdAt).toLocaleDateString('pt-BR')}
          </span>
        ),
      },
      {
        id: 'actions',
        header: '',
        cell: ({ row }) => (
          <Button asChild variant="ghost" size="sm">
            <Link href={`/admin/applications/${row.original.id}`}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalhes
            </Link>
          </Button>
        ),
      },
    ],
    []
  )

  const table = useReactTable({
    data: applications || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  })

  // Estatísticas
  const stats = useMemo(() => {
    if (!applications) return { total: 0, inProgress: 0, completed: 0, submitted: 0 }
    return {
      total: applications.length,
      inProgress: applications.filter(a => a.status === 'in_progress').length,
      completed: applications.filter(a => a.status === 'completed').length,
      submitted: applications.filter(a => a.status === 'submitted').length,
    }
  }, [applications])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard Admin</h1>
        <p className="mt-1 text-muted-foreground">
          Gerencie todas as aplicações do sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="text-2xl font-bold text-foreground">{stats.total}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
              <Clock className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Em andamento</p>
              <p className="text-2xl font-bold text-foreground">{stats.inProgress}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Completos</p>
              <p className="text-2xl font-bold text-foreground">{stats.completed}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="flex items-center gap-4 p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
              <CheckCircle2 className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Enviados</p>
              <p className="text-2xl font-bold text-foreground">{stats.submitted}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Applications Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Aplicações</CardTitle>
          <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as ApplicationStatus | 'all')}>
            <TabsList>
              <TabsTrigger value="all">Todas</TabsTrigger>
              <TabsTrigger value="in_progress">Em andamento</TabsTrigger>
              <TabsTrigger value="completed">Completas</TabsTrigger>
              <TabsTrigger value="submitted">Enviadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          <div className="rounded-xl border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow key={row.id}>
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center text-muted-foreground"
                    >
                      Nenhuma aplicação encontrada
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
