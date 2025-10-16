"use client"
export default function Profil() {
    return (
        <div className="containerprofil">
            <div className="cpgauche">
                <div className="cbienvenue">
                    <p className="bienvenue">Bienvenue dans mon univers</p>
                </div>
                <p className="pnoir">Bonjour, je suis <label className="daniel">Daniel</label></p>
                <p className="pgris">Développeur web</p>
                <p className="pgris">
                    Passionné par la création d'expériences web innovantes et élégantes. Je transforme des idées en solutions digitales performantes avec une attention particulière aux détails et à l'expérience utilisateur.
                </p>
                <div>
                    <a href="#contacts"><button className="bprofil contactprofil"><i className="fas fa-envelope"></i> Me contacter</button></a>
                    <a href="/RazafindranaivoAimeDanielJohnstonResume.pdf" download>
                        <button className="bprofil downloadprofil">
                            <i className="fa-solid fa-download"></i> Télécharger CV
                        </button>
                    </a>
                </div>
            </div>
            <div className="cpdroit">
                <div className="pdpprofil">

                </div>
            </div>

            {/*Déco */}
            <div className="decoprofil decorouge"></div>
            <div className="decoprofil decobleu"></div>
            <div className="decoprofil decoviolet"></div>
        </div>
    )
}