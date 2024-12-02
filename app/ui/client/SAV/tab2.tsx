import DataTable from './tab2Table'

const data = [
  {
    id: 1,
    intervention: "Maintenance",
    kiosque: "Kiosque A",
    numeroDemande: "DEM-001",
    dateHeure: "01/02/2024 10:30",
    priorite: "Urgent",
    status: "En cours",
  },
  {
    id: 2,
    intervention: "Réclamation",
    kiosque: "Kiosque B",
    numeroDemande: "DEM-002",
    dateHeure: "01/02/2024 11:45",
    priorite: "Normal",
    status: "En attente",
  },
  {
    id: 3,
    intervention: "Maintenance",
    kiosque: "Kiosque C",
    numeroDemande: "DEM-003",
    dateHeure: "01/02/2024 14:15",
    priorite: "Urgent",
    status: "Fermé",
  },
  {
    id: 4,
    intervention: "Réclamation",
    kiosque: "Kiosque D",
    numeroDemande: "DEM-004",
    dateHeure: "01/02/2024 16:00",
    priorite: "Normal",
    status: "En cours",
  },
  {
    id: 5,
    intervention: "Maintenance",
    kiosque: "Kiosque E",
    numeroDemande: "DEM-005",
    dateHeure: "02/02/2024 09:30",
    priorite: "Urgent",
    status: "En attente",
  },
  {
    id: 6,
    intervention: "Réclamation",
    kiosque: "Kiosque F",
    numeroDemande: "DEM-006",
    dateHeure: "02/02/2024 11:00",
    priorite: "Normal",
    status: "Fermé",
  },
  {
    id: 7,
    intervention: "Maintenance",
    kiosque: "Kiosque G",
    numeroDemande: "DEM-007",
    dateHeure: "02/02/2024 13:45",
    priorite: "Urgent",
    status: "En cours",
  },
] as const

export default function Page() {
  return (
    <div className="container mx-auto py-10">
      <DataTable data={data} />
    </div>
  )
}