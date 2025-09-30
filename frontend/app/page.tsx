"use client"
export default function Home(){
  return(
    <>
    <nav className="navbar">
      <div></div>
      <div className="divBouttonNav">
        <button className="bouttonNav">Accueil</button>
        <button className="bouttonNav">A propos</button>
        <button className="bouttonNav">Porjets</button>
        <button className="bouttonNav">Contact</button>
      </div>
    </nav>
      <section style={{display: "flex", flexWrap: "wrap", alignContent: "left"}}>
        <div className="pdp"></div>
        <div className="containerDroit">
          <b><h1 className="salutation"> 👋Salut, je suis<label className="nom">RAZAFINDRANAIVO Aimé Daniel Johnston</label></h1></b>
          <b><h1 className="profession">Developpeur Front-end Next.JS🧑‍💻</h1></b>
          <h1 className="description">✍️Créatif pour transformer des idées💡 en interface moderne🪄</h1>
        </div>
        <div>
          <button className="boutton"><i className="fas fa-envelope"></i>Me contacter</button>
          <button className="group boutton"><span><i className="fas fa-download"></i></span>Télécharger CV</button>
        </div>
      </section>
      <div className="deco1">

      </div>
      <section>
        <p className="titre">Je suis un développeur Web en Next.JS</p>
        <p className="paragraphe">Spécialisé sur le <label className="souligne">Front-end.</label>Passionné par la création d'interface modernes, performantes et responsives, avec une forte capacité d'adaptation et une volontée constante d'apprendre et innover.</p>
      </section>
      <section>
        <h1 className="titre">Langanges informatiques connus</h1>
        <button className="card">
          <i className="cardImage fas fa-envelope"></i>
        </button>
      </section>
    </>
  )
}