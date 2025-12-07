'use client'

import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import type { Database } from '@/lib/types/database.types'

type Profile = Database['public']['Tables']['profiles']['Row']

interface SocialLinksCardProps {
  profile: Profile
}

const socialPlatforms = [
  {
    name: 'Discord',
    field: 'discord_username' as const,
    icon: '🎮',
    getUrl: (value: string) => null, // Discord usernames don't have URLs
    prefix: '',
  },
  {
    name: 'YouTube',
    field: 'youtube_url' as const,
    icon: '📹',
    getUrl: (value: string) => value,
    prefix: '',
  },
  {
    name: 'Twitch',
    field: 'twitch_url' as const,
    icon: '🎥',
    getUrl: (value: string) => value,
    prefix: '',
  },
  {
    name: 'Twitter',
    field: 'twitter_url' as const,
    icon: '🐦',
    getUrl: (value: string) => value,
    prefix: '@',
  },
  {
    name: 'Instagram',
    field: 'instagram_url' as const,
    icon: '📷',
    getUrl: (value: string) => value,
    prefix: '@',
  },
  {
    name: 'TikTok',
    field: 'tiktok_url' as const,
    icon: '🎵',
    getUrl: (value: string) => value,
    prefix: '@',
  },
]

export function SocialLinksCard({ profile }: SocialLinksCardProps) {
  // Filter only platforms that have values
  const activeSocials = socialPlatforms.filter(
    platform => profile[platform.field]
  )

  if (activeSocials.length === 0) {
    return null
  }

  return (
    <Card className="p-6">
      <h3 className="font-semibold mb-4">Réseaux sociaux</h3>
      
      <div className="space-y-3">
        {activeSocials.map((platform) => {
          const value = profile[platform.field]
          if (!value) return null

          const url = platform.getUrl(value)
          const displayValue = platform.name === 'Discord' 
            ? value 
            : value.split('/').pop() || value

          return (
            <div
              key={platform.field}
              className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{platform.icon}</span>
                <div>
                  <div className="font-medium text-sm">{platform.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {platform.prefix}{displayValue}
                  </div>
                </div>
              </div>
              
              {url && (
                <Button
                  size="sm"
                  variant="ghost"
                  asChild
                  className="gap-2"
                >
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visiter
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </Button>
              )}
            </div>
          )
        })}
      </div>
    </Card>
  )
}
