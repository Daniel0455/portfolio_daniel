"use client"
import { useState } from "react";
import { useEffect } from "react";
export default function Nav(){
    const [actu, setActu] = useState("");
    const [burgeractivevalue, setBurgeractivevalue] = useState("");
    useEffect(() =>{
        let actusaved = localStorage.getItem('actu');
        let burgeractivereel = localStorage.getItem('burgeractive')
        if(actusaved)
        {
            setActu(actusaved);
        }
        else
        {
            setActu('accueil')
            localStorage.setItem('actu', 'accueil')
        }
        if(burgeractivereel)
        {
            setBurgeractivevalue(burgeractivereel)
        }
        else
        {
            localStorage.setItem('burgeractive', 'nonactive')
        }
    },[]);
    useEffect(() =>{
        let ciblereel = document.getElementById(actu);
        if(ciblereel)
        {
            ciblereel.scrollIntoView({behavior: "smooth"})
        }
    }, [actu])
    let boutons = [
        {
            label: "Accueil",
            cible: "accueil"
        },
        {
            label: "A propos",
            cible: 'propos'
        },
        {
            label: "Projets",
            cible: "projet"
        },
        {
            label: "Outils",
            cible: "outil"
        },
        {
            label: "Langages",
            cible: "langage"
        },
        {
            label: "Contact",
            cible: "contact"
        }
    ]
    return(
        <div>
            <div className="gardemarge"></div>
            <nav className="nav">
                {boutons.map((bouton)=>(
                    <button
                        key={bouton.label}
                        className={`btnnav ${bouton.cible === actu ? "active" : ""}`}
                        onClick={() =>
                        {
                            setActu(bouton.cible);
                            localStorage.setItem('actu', bouton.cible)
                        }
                        }
                    >
                        {bouton.label}
                    </button>
                ))}
            </nav>
            {/*Burgger */}
            <div className="containerburgger">
                <label className="burger">
                <input type="checkbox" id="burger"/>
                <span></span>
                <span></span>
                <span></span>
                </label>
            </div>
        </div>
    )
}