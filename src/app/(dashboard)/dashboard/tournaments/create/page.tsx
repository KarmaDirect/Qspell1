import { TournamentForm } from '@/components/tournament/tournament-form'

export default function CreateTournamentPage() {
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Créer un tournoi</h1>
        <p className="text-muted-foreground">
          Organisez votre propre tournoi communautaire
        </p>
      </div>

      <TournamentForm />
    </div>
  )
}

