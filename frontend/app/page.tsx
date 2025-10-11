"using client"
import NavBar from "@/components/NavBar"
import Profil from "@/components/Profil"
import Background from "@/components/Background"
import Statistique from "@/components/Statistique"
export default function Home(){
    return(
        <>
            <div className="mainContainer">
                <NavBar/>
                <Profil/>
                <hr />
                <Statistique/>
            </div>
        </>
    )
}