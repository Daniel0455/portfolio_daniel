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
                <NavBar/>
                <Profil/>
                <hr />
                <Statistique/>
                <hr />
                <Projet/>
                <hr />
                <Outil />
                <hr />
                <Langage />
                <hr />
                <Experience />
                <hr />
                <Contact />
            </div>
        </>
    )
}