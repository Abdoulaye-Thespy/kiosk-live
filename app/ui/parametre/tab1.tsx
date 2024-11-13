import React from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { PhotoIcon } from "@heroicons/react/24/outline"

export default function TabOneParametre() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-lg font-medium">Général</h2>
          <p className="text-sm text-gray-500">Mettez en place et gérez votre entreprise.</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">Annuler</Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            Enregistrer les changements
          </Button>
        </div>
      </div>

      <div className="max-w-3xl space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label className="text-sm font-medium">Avatar</label>
          </div>
          <div className="w-2/3 flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center">
              <PhotoIcon className="h-8 w-8 text-gray-400" />
            </div>
            <Button variant="outline">Choisissez</Button>
            <span className="text-sm text-gray-500">JPG ou PNG, 1MB maximum</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="company-name" className="text-sm font-medium">Nom de l&apos;entreprise*</label>
          </div>
          <div className="w-2/3">
            <Input id="company-name" defaultValue="Agence Unpixel" />
          </div>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="email" className="text-sm font-medium">E-mail*</label>
          </div>
          <div className="w-2/3">
            <Input id="email" defaultValue="unpixelagency@design.com" />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="w-1/3">
            <label htmlFor="industry" className="text-sm font-medium">Industrie</label>
          </div>
          <div className="w-2/3">
            <Select defaultValue="tech">
              <SelectTrigger id="industry">
                <SelectValue placeholder="Sélectionnez une industrie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="tech">Technologie de l&apos;information</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="healthcare">Santé</SelectItem>
                <SelectItem value="education">Education</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}