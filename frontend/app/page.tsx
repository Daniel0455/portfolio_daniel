"use client"
import { useEffect } from "react"
import Profil from "@/components/Profil"
import Statistique from "@/components/Statistique"
import Projet from "@/components/Projet"
import Outil from "@/components/Outil"
import Langage from "@/components/Langage"
import Contact from "@/components/contact"
import FuturisticBackground from "@/components/Background"

export default function Home() {

    useEffect(() => {
    const faders = document.querySelectorAll('.fade-in')
    const appearOptions = { threshold: 0.1 }

    const appearOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show')
            observer.unobserve(entry.target)
        }
        })
    }, appearOptions)

    faders.forEach(fader => appearOnScroll.observe(fader))
  }, []) // [] pour exécuter seulement après le rendu

    return (
    <div className="mainContainer">
        <FuturisticBackground />
        <div className="fade-in"><Profil /></div>
        <div className="fade-in"><Statistique /></div>
        <div className="fade-in"><Projet /></div>
        <div className="fade-in"><Outil /></div>
        <div className="fade-in"><Langage /></div>
        <div className="fade-in"><Contact /></div>
    </div>
    )
}
