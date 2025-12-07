'use client'

import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Search, Shield, Ban, Mail } from 'lucide-react'
import { toast } from 'sonner'

interface User {
  id: string
  username: string
  display_name?: string
  avatar_url?: string
  role: string
  created_at: string
  riot_accounts?: Array<{
    game_name: string
    tag_line: string
  }>
}

export function UsersList() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'admin' | 'user'>('all')

  useEffect(() => {
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users')
      const data = await response.json()
      
      if (response.ok) {
        setUsers(data.users || [])
      }
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Erreur lors du chargement des utilisateurs')
    } finally {
      setLoading(false)
    }
  }

  const filteredUsers = users.filter(user => {
    const matchesSearch = search === '' || 
      user.username.toLowerCase().includes(search.toLowerCase()) ||
      user.display_name?.toLowerCase().includes(search.toLowerCase()) ||
      user.riot_accounts?.some(ra => 
        `${ra.game_name}#${ra.tag_line}`.toLowerCase().includes(search.toLowerCase())
      )
    
    const matchesFilter = filter === 'all' || user.role === filter
    
    return matchesSearch && matchesFilter
  })

  const getRoleBadge = (role: string) => {
    if (role === 'ceo') return <Badge variant="destructive">CEO</Badge>
    if (role === 'admin') return <Badge variant="default">Admin</Badge>
    return <Badge variant="outline">User</Badge>
  }

  if (loading) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des utilisateurs...</p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par pseudo ou compte Riot..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              onClick={() => setFilter('all')}
              size="sm"
            >
              Tous ({users.length})
            </Button>
            <Button
              variant={filter === 'admin' ? 'default' : 'outline'}
              onClick={() => setFilter('admin')}
              size="sm"
            >
              <Shield className="h-4 w-4 mr-2" />
              Admins ({users.filter(u => ['admin', 'ceo'].includes(u.role)).length})
            </Button>
            <Button
              variant={filter === 'user' ? 'default' : 'outline'}
              onClick={() => setFilter('user')}
              size="sm"
            >
              Users ({users.filter(u => u.role === 'user').length})
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b">
              <tr>
                <th className="text-left p-4">Utilisateur</th>
                <th className="text-left p-4">Compte Riot</th>
                <th className="text-left p-4">Rôle</th>
                <th className="text-left p-4">Inscription</th>
                <th className="text-right p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center p-12 text-muted-foreground">
                    Aucun utilisateur trouvé
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="border-b hover:bg-muted/50">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage src={user.avatar_url} />
                          <AvatarFallback>
                            {user.username.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold">{user.display_name || user.username}</div>
                          <div className="text-sm text-muted-foreground">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      {user.riot_accounts && user.riot_accounts.length > 0 ? (
                        <div className="space-y-1">
                          {user.riot_accounts.map((ra, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {ra.game_name}#{ra.tag_line}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <span className="text-sm text-muted-foreground">Aucun compte lié</span>
                      )}
                    </td>
                    <td className="p-4">
                      {getRoleBadge(user.role)}
                    </td>
                    <td className="p-4">
                      <span className="text-sm text-muted-foreground">
                        {new Date(user.created_at).toLocaleDateString('fr-FR')}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="sm">
                          <Mail className="h-4 w-4" />
                        </Button>
                        {user.role === 'user' && (
                          <Button variant="ghost" size="sm" className="text-red-500">
                            <Ban className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

