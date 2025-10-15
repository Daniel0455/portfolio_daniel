"using client"
import NavBar from "@/components/NavBar"
import Profil from "@/components/Profil"
// import Background from "@/components/Background"
import Statistique from "@/components/Statistique"
import Projet from "@/components/Projet"
import Outil from "@/components/Outil"
import Langage from "@/components/Langage"
import Experience from "@/components/experience"
import Contact from "@/components/contact"
export default function Home(){
    return(
        <>
            <div className="mainContainer">
                <Profil/>
            </div>
        </>
    )
}