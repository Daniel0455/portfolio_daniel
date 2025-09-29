"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import * as faceapi from "face-api.js"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Upload, User, Mail, Lock, Building, GraduationCap, CheckCircle, AlertCircle, Camera } from "lucide-react"

const Inscription = () => {
  const router = useRouter()
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    etab: "",
    mention: "",
    niveau: "",
    email: "",
    mdp: "",
  })
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [faceDetected, setFaceDetected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [detectionStatus, setDetectionStatus] = useState<"idle" | "detecting" | "success" | "error">("idle")
  const [errorMessage, setErrorMessage] = useState("")
  const imageRef = useRef<HTMLImageElement>(null)

  // Chargement des modèles à l'initialisation
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models/tiny_face_detector"
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL)
    }
    loadModels()
  }, [])

  // Détection du visage quand l'image est chargée dans l'aperçu
  const handleImageLoad = async () => {
    if (!imageRef.current) return

    setDetectionStatus("detecting")
    setErrorMessage("")

    try {
      const image = imageRef.current

      const detections = await faceapi.detectAllFaces(image, new faceapi.TinyFaceDetectorOptions())

      if (detections.length !== 1) {
        setFaceDetected(false)
        setDetectionStatus("error")
        setErrorMessage("L'image doit contenir exactement un seul visage.")
        return
      }

      const box = detections[0].box
      const imageWidth = image.naturalWidth
      const imageHeight = image.naturalHeight
      const imageArea = imageWidth * imageHeight

      const faceArea = box.width * box.height
      const ratio = faceArea / imageArea

      // Calcul du centre de l'image
      const imageCenterX = imageWidth / 2
      const imageCenterY = imageHeight / 2

      // Calcul du centre du visage détecté
      const faceCenterX = box.x + box.width / 2
      const faceCenterY = box.y + box.height / 2

      // Distance entre les deux centres
      const distanceX = Math.abs(imageCenterX - faceCenterX)
      const distanceY = Math.abs(imageCenterY - faceCenterY)

      // On accepte un écart max de 15% de la largeur ou hauteur
      const toleranceX = imageWidth * 0.15
      const toleranceY = imageHeight * 0.15

      const isCentered = distanceX < toleranceX && distanceY < toleranceY

      // Conditions : visage de taille correcte OU visage centré même si large
      if (ratio < 0.12) {
        setFaceDetected(false)
        setDetectionStatus("error")
        setErrorMessage("Le visage est trop petit dans l'image.")
        return
      }

      if (ratio > 0.7 && !isCentered) {
        setFaceDetected(false)
        setDetectionStatus("error")
        setErrorMessage("Le visage est trop zoomé et mal cadré. Merci de fournir une photo d'identité bien centrée.")
        return
      }

      setFaceDetected(true)
      setDetectionStatus("success")
    } catch (error) {
      console.error(error)
      setFaceDetected(false)
      setDetectionStatus("error")
      setErrorMessage("Erreur lors de la détection du visage.")
    }
  }

  // Gestion du changement des inputs texte
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  // Gestion du fichier image uploadé
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImageFile(file)

    const reader = new FileReader()
    reader.onloadend = () => setImagePreview(reader.result as string)
    reader.readAsDataURL(file)
    // On reset la détection à false pour obliger la nouvelle détection
    setFaceDetected(false)
    setDetectionStatus("idle")
    setErrorMessage("")
  }

  // Soumission du formulaire
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!imageFile || !faceDetected) {
      setErrorMessage("Photo invalide ou visage non détecté.")
      return
    }

    setIsLoading(true)

    const form = new FormData()
    Object.entries(formData).forEach(([key, value]) => {
      form.append(key, value)
    })
    form.append("photo", imageFile)

    try {
      const res = await fetch("http://localhost:3000/api/stagiaires/inscription", {
        method: "POST",
        body: form,
      })

      if (res.ok) {
        // Reset du formulaire et des états
        setFormData({
          nom: "",
          prenom: "",
          etab: "",
          mention: "",
          niveau: "",
          email: "",
          mdp: "",
        })
        setImageFile(null)
        setImagePreview(null)
        setFaceDetected(false)
        setDetectionStatus("idle")

        router.replace("/")
      } else {
        setErrorMessage("Une erreur est survenue lors de l'inscription.")
      }
    } catch {
      setErrorMessage("Erreur réseau. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  const getFieldIcon = (field: string) => {
    switch (field) {
      case "nom":
      case "prenom":
        return <User className="h-4 w-4" />
      case "email":
        return <Mail className="h-4 w-4" />
      case "mdp":
        return <Lock className="h-4 w-4" />
      case "etab":
        return <Building className="h-4 w-4" />
      case "mention":
      case "niveau":
        return <GraduationCap className="h-4 w-4" />
      default:
        return null
    }
  }

  const getFieldLabel = (field: string) => {
    const labels: Record<string, string> = {
      nom: "Nom",
      prenom: "Prénom",
      etab: "Établissement",
      mention: "Mention",
      niveau: "Niveau",
      email: "Email",
      mdp: "Mot de passe",
    }
    return labels[field] || field
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Inscription Stagiaire</h1>
          <p className="text-gray-600">Créez votre compte pour accéder à la plateforme</p>
        </div>

        <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl text-center">Informations personnelles</CardTitle>
            <CardDescription className="text-center">Veuillez remplir tous les champs requis</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {["nom", "prenom"].map((field) => (
                  <div key={field} className="space-y-2">
                    <Label htmlFor={field} className="text-sm font-medium flex items-center gap-2">
                      {getFieldIcon(field)}
                      {getFieldLabel(field)}
                    </Label>
                    <Input
                      id={field}
                      name={field}
                      type="text"
                      placeholder={`Votre ${getFieldLabel(field).toLowerCase()}`}
                      value={formData[field as keyof typeof formData]}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}
              </div>

              {/* Informations académiques */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations académiques</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {["etab", "mention"].map((field) => (
                    <div key={field} className="space-y-2">
                      <Label htmlFor={field} className="text-sm font-medium flex items-center gap-2">
                        {getFieldIcon(field)}
                        {getFieldLabel(field)}
                      </Label>
                      <Input
                        id={field}
                        name={field}
                        type="text"
                        placeholder={`Votre ${getFieldLabel(field).toLowerCase()}`}
                        value={formData[field as keyof typeof formData]}
                        onChange={handleChange}
                        required
                        className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="niveau" className="text-sm font-medium flex items-center gap-2">
                    {getFieldIcon("niveau")}
                    {getFieldLabel("niveau")}
                  </Label>
                  <Input
                    id="niveau"
                    name="niveau"
                    type="text"
                    placeholder="Votre niveau d'études"
                    value={formData.niveau}
                    onChange={handleChange}
                    required
                    className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              {/* Informations de connexion */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Informations de connexion</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium flex items-center gap-2">
                      {getFieldIcon("email")}
                      {getFieldLabel("email")}
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="votre.email@exemple.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mdp" className="text-sm font-medium flex items-center gap-2">
                      {getFieldIcon("mdp")}
                      {getFieldLabel("mdp")}
                    </Label>
                    <Input
                      id="mdp"
                      name="mdp"
                      type="password"
                      placeholder="Choisissez un mot de passe sécurisé"
                      value={formData.mdp}
                      onChange={handleChange}
                      required
                      className="transition-all duration-200 focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Upload de photo */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">Photo d'identité</h3>
                <div className="space-y-2">
                  <Label htmlFor="photo" className="text-sm font-medium flex items-center gap-2">
                    <Camera className="h-4 w-4" />
                    Photo de profil
                  </Label>
                  <div className="flex items-center justify-center w-full">
                    <label
                      htmlFor="photo"
                      className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-4 text-gray-500" />
                        <p className="mb-2 text-sm text-gray-500">
                          <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                        </p>
                        <p className="text-xs text-gray-500">PNG, JPG ou JPEG</p>
                      </div>
                      <Input
                        id="photo"
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                        required
                      />
                    </label>
                  </div>
                </div>

                {imagePreview && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-gray-700">Aperçu de la photo</h4>
                      {detectionStatus === "success" && (
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Visage détecté
                        </Badge>
                      )}
                      {detectionStatus === "detecting" && <Badge variant="secondary">Détection en cours...</Badge>}
                      {detectionStatus === "error" && (
                        <Badge variant="destructive">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Erreur détectée
                        </Badge>
                      )}
                    </div>
                    <div className="flex justify-center">
                      <div className="relative">
                        <img
                          ref={imageRef}
                          src={imagePreview || "/placeholder.svg"}
                          alt="Aperçu"
                          onLoad={handleImageLoad}
                          className="w-48 h-auto rounded-lg border-2 border-gray-200 shadow-md"
                        />
                        {detectionStatus === "success" && (
                          <div className="absolute -top-2 -right-2 bg-green-500 text-white rounded-full p-1">
                            <CheckCircle className="h-4 w-4" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}
              </div>

              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold transition-all duration-200 transform hover:scale-[1.02]"
                disabled={!faceDetected || isLoading}
                size="lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Inscription en cours...
                  </div>
                ) : (
                  "S'inscrire"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Inscription
