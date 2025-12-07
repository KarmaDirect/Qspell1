'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Users, Trophy, Sparkles } from 'lucide-react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths, getDay } from 'date-fns'

interface CalendarEvent {
  id: string
  title: string
  date: string
  type: 'coaching_group' | 'tournament' | 'event'
  time?: string
  description?: string
  lane?: string
}

interface CalendarProps {
  className?: string
  compact?: boolean
}

export function Calendar({ className, compact = false }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [currentDate])

  const fetchEvents = async () => {
    try {
      const startDate = startOfMonth(currentDate).toISOString()
      const endDate = endOfMonth(currentDate).toISOString()
      
      const response = await fetch(`/api/events?start=${startDate}&end=${endDate}`)
      const data = await response.json()
      
      if (response.ok) {
        setEvents(data.events || [])
      }
    } catch (error) {
      console.error('Error fetching events:', error)
    } finally {
      setLoading(false)
    }
  }

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd })
  
  // Get first day of week (0 = Sunday, 1 = Monday, etc.)
  const firstDayOfWeek = getDay(monthStart)
  // Adjust for Monday as first day (1 = Monday)
  const adjustedFirstDay = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1

  // Add empty cells for days before month starts
  const emptyDays = Array.from({ length: adjustedFirstDay }, (_, i) => i)

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventDate = new Date(event.date)
      return isSameDay(eventDate, date)
    })
  }

  const getEventColor = (type: string) => {
    switch (type) {
      case 'coaching_group':
        return 'bg-blue-500 text-white'
      case 'tournament':
        return 'bg-yellow-600 text-white'
      case 'event':
        return 'bg-purple-500 text-white'
      case 'custom':
        return 'bg-green-500 text-white'
      default:
        return 'bg-gray-500 text-white'
    }
  }

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'coaching_group':
        return <Users className="h-3 w-3" />
      case 'tournament':
        return <Trophy className="h-3 w-3" />
      case 'event':
      case 'custom':
        return <Sparkles className="h-3 w-3" />
      default:
        return <CalendarIcon className="h-3 w-3" />
    }
  }

  const getEventLabel = (type: string) => {
    switch (type) {
      case 'coaching_group':
        return 'Coaching Groupe'
      case 'tournament':
        return 'Tournoi'
      case 'event':
        return 'Événement'
      case 'custom':
        return 'Personnalisé'
      default:
        return 'Autre'
    }
  }

  const previousMonth = () => setCurrentDate(subMonths(currentDate, 1))
  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const goToToday = () => setCurrentDate(new Date())

  const today = new Date()

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={goToToday}>
              Aujourd&apos;hui
            </Button>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" onClick={previousMonth}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-bold min-w-[180px] text-center capitalize">
                {format(currentDate, 'MMMM yyyy')}
              </h2>
              <Button variant="ghost" size="sm" onClick={nextMonth}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="space-y-2">
          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-muted-foreground py-2">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-1">
            {/* Empty cells for days before month starts */}
            {emptyDays.map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days of the month */}
            {daysInMonth.map((day) => {
              const dayEvents = getEventsForDate(day)
              const isToday = isSameDay(day, today)
              const isSelected = selectedDate && isSameDay(day, selectedDate)

              return (
                <button
                  key={day.toISOString()}
                  onClick={() => setSelectedDate(day)}
                  className={`
                    aspect-square rounded-lg border-2 transition-all
                    ${isToday ? 'border-primary bg-primary/10 font-bold' : 'border-border hover:border-primary/50'}
                    ${isSelected ? 'ring-2 ring-primary ring-offset-2' : ''}
                    ${dayEvents.length > 0 ? 'bg-muted/50' : ''}
                    flex flex-col items-start p-1 text-sm
                  `}
                >
                  <span className={`${isToday ? 'text-primary' : ''} mb-1`}>
                    {format(day, 'd')}
                  </span>
                  {!compact && dayEvents.length > 0 && (
                    <div className="w-full space-y-0.5">
                      {dayEvents.slice(0, 2).map((event) => (
                        <Badge
                          key={event.id}
                          className={`${getEventColor(event.type)} w-full justify-start text-xs px-1 py-0 h-4 truncate`}
                          title={event.title}
                        >
                          <span className="mr-1">{getEventIcon(event.type)}</span>
                          <span className="truncate">{event.title}</span>
                        </Badge>
                      ))}
                      {dayEvents.length > 2 && (
                        <div className="text-xs text-muted-foreground">+{dayEvents.length - 2}</div>
                      )}
                    </div>
                  )}
                  {compact && dayEvents.length > 0 && (
                    <div className="w-full h-1.5 bg-primary rounded mt-auto" />
                  )}
                </button>
              )
            })}
          </div>
        </div>

        {/* Legend */}
        {!compact && (
          <div className="mt-6 pt-6 border-t flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-500 text-white">
                <Users className="h-3 w-3 mr-1" />
                {getEventLabel('coaching_group')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-yellow-600 text-white">
                <Trophy className="h-3 w-3 mr-1" />
                {getEventLabel('tournament')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                {getEventLabel('event')}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-green-500 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                {getEventLabel('custom')}
              </Badge>
            </div>
          </div>
        )}

        {/* Selected Date Details */}
        {selectedDate && !compact && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="font-semibold mb-3 capitalize">
              {format(selectedDate, 'EEEE d MMMM yyyy')}
            </h3>
            {getEventsForDate(selectedDate).length > 0 ? (
              <div className="space-y-2">
                {getEventsForDate(selectedDate).map((event) => (
                  <Card key={event.id} className="p-3">
                    <div className="flex items-start gap-3">
                      <Badge className={`${getEventColor(event.type)} shrink-0`}>
                        {getEventIcon(event.type)}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold">{event.title}</h4>
                        {event.time && (
                          <p className="text-sm text-muted-foreground">{event.time}</p>
                        )}
                        {event.description && (
                          <p className="text-sm text-muted-foreground mt-1">{event.description}</p>
                        )}
                        {event.lane && (
                          <Badge variant="outline" className="mt-2 text-xs">
                            {event.lane.toUpperCase()}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Aucun événement prévu</p>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}

