"use client"

import { useState } from "react"
import { Search, Plus, MoreVertical, LogOut, Copy } from "lucide-react"
import { Button } from "@workspace/ui/components/button"
import { Card } from "@workspace/ui/components/card"
import { Input } from "@workspace/ui/components/input"
import { Avatar, AvatarImage, AvatarFallback } from "@workspace/ui/components/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@workspace/ui/components/dropdown-menu"
import { cn } from "@workspace/ui/lib/utils"

// === Dados reais com foto, nome, username, data e ID ===
type ConnectedAccount = {
  platform: "tiktok" | "youtube" | "facebook"
  profilePicture: string
  name: string
  username: string
  connectedAt: string
  accountId: string
}

type Profile = {
  id: string
  name: string
  description: string
  accounts: ConnectedAccount[]
}

const mockProfiles: Profile[] = [
  {
    id: "1",
    name: "Default Profile",
    description: "Perfil principal – posts diários",
    accounts: [
      {
        platform: "tiktok",
        profilePicture: "https://p16-sign-va.tiktokcdn.com/tos-maliva-avt-0068/1234567890~c5_100x100.jpeg",
        name: "João Vitor",
        username: "@joao_vitor5151",
        connectedAt: "11/17/2025",
        accountId: "691b3c9dd2fc0ecada1e",
      },
      {
        platform: "youtube",
        profilePicture: "https://yt3.ggpht.com/abc123",
        name: "João Vitor",
        username: "João Vitor",
        connectedAt: "10/05/2025",
        accountId: "UC_x5kx9k2j3LmN",
      },
    ],
  },
  {
    id: "2",
    name: "Campanha Black Friday",
    description: "Perfil temporário",
    accounts: [],
  },
]

const platformIcons = {
  tiktok: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.38 6.793c-1.27-.986-2.068-2.542-2.14-4.14-.008-.18-.013-.36-.015-.54h-4.04v15.48c-.024 1.284-.627 2.462-1.62 3.18-1.572 1.134-3.78.867-4.92-.6-.72-.924-.996-2.094-.78-3.24.288-2.436 2.556-4.08 4.98-3.78v2.22c-.792-.288-1.644-.24-2.4.12-.996.48-1.56 1.56-1.32 2.64.216 1.008 1.14 1.74 2.22 1.74 1.296 0 2.34-1.044 2.34-2.34V9.913c1.008.72 2.22 1.14 3.48 1.14V6.913c-.792 0-1.5-.36-2.04-.96z" />
    </svg>
  ),
  youtube: () => (
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  facebook: () => (
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
}

export default function ProfilesPage() {
  const [profiles] = useState(mockProfiles)
  const [selectedProfile, setSelectedProfile] = useState<Profile | null>(profiles[0]!)
  const [searchQuery, setSearchQuery] = useState("")

  const filteredProfiles = profiles.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-6 py-10 max-w-7xl">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-4xl font-bold tracking-tight">Perfis</h1>
          <p className="text-gray-500 mt-2">Gerencie seus perfis e contas conectadas</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Lista de Perfis (Lateral) */}
          <aside className="lg:col-span-1">
            <div className="flex items-center justify-between mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar perfil"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-600"
                />
              </div>
            </div>

            <Button className="w-full mb-6 bg-yellow-500 text-black hover:bg-yellow-400 font-medium">
              <Plus className="h-4 w-4 mr-2" />
              Novo perfil
            </Button>

            <div className="space-y-3">
              {filteredProfiles.map((profile) => (
                <button
                  key={profile.id}
                  onClick={() => setSelectedProfile(profile)}
                  className={cn(
                    "w-full p-4 rounded-xl text-left transition-all border",
                    selectedProfile?.id === profile.id
                      ? "bg-zinc-900 border-yellow-500/40 shadow-lg shadow-yellow-500/10"
                      : "bg-zinc-950/50 border-transparent hover:bg-zinc-900/60"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-600 text-black text-sm font-bold">
                        {profile.name.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{profile.name}</p>
                      <p className="text-xs text-gray-500">
                        {profile.accounts.length} conta{profile.accounts.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </aside>

          {/* Detalhes do Perfil Selecionado */}
          <main className="lg:col-span-3">
            {selectedProfile && (
              <>
                {/* Cabeçalho do Perfil */}
                <Card className="bg-zinc-900/70 border-zinc-800 rounded-2xl p-6 mb-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <Avatar className="h-16 w-16 ring-4 ring-yellow-500/30">
                        <AvatarFallback className="bg-gradient-to-br from-yellow-400 to-amber-600 text-black text-2xl font-bold">
                          {selectedProfile.name.slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h2 className="text-2xl font-bold">{selectedProfile.name}</h2>
                        <p className="text-gray-400 text-sm mt-1">{selectedProfile.description}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                        <DropdownMenuItem>Editar perfil</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-400">Excluir perfil</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>

                {/* Contas Conectadas */}
                <div className="mb-6">
                  <h3 className="text-xl font-semibold mb-4">
                    Plataformas para <span className="text-yellow-500">{selectedProfile.name}</span>
                  </h3>
                  <div className="space-y-4">
                    {selectedProfile.accounts.map((account, i) => {
                      const Icon = platformIcons[account.platform]
                      return (
                        <Card key={i} className="bg-zinc-900/60 border-zinc-800 rounded-2xl p-5">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12">
                                <AvatarImage src={account.profilePicture} />
                                <AvatarFallback>
                                  <Icon />
                                </AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium">{account.name}</span>
                                  <Icon />
                                  <span className="text-sm text-gray-400">{account.platform}</span>
                                </div>
                                <p className="text-lg font-medium text-yellow-500">
                                  {account.username}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                                  <span>{account.connectedAt}</span>
                                  <code className="bg-zinc-800 px-2 py-1 rounded">
                                    id: {account.accountId.slice(0, 12)}...
                                  </code>
                                  <button>
                                    <Copy className="h-3 w-3" />
                                  </button>
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" className="text-red-400 hover:bg-red-900/20">
                              disconnect
                            </Button>
                          </div>
                        </Card>
                      )
                    })}

                    {/* Conta não conectada */}
                    {["tiktok", "youtube", "facebook"].map((plat) => {
                      const exists = selectedProfile.accounts.some(a => a.platform === plat)
                      if (exists) return null
                      const Icon = platformIcons[plat as keyof typeof platformIcons]
                      return (
                        <Card key={plat} className="bg-zinc-900/40 border-dashed border-zinc-700 rounded-2xl p-8 text-center">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-zinc-800 flex items-center justify-center">
                            <Icon />
                          </div>
                          <p className="text-gray-400 mb-4">Conectar {plat}</p>
                          <Button className="bg-yellow-500 text-black hover:bg-yellow-400">
                            Conectar {plat.charAt(0).toUpperCase() + plat.slice(1)}
                          </Button>
                        </Card>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
    </div>
  )
}

