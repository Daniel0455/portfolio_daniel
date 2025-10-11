"using client"
import NavBar from "@/components/NavBar"
import Profil from "@/components/Profil"
import Background from "@/components/Background"
import Statistique from "@/components/Statistique"
import Projet from "@/components/Projet"
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
            </div>
        </>
    )
}