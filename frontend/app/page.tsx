"use client"
export default function Home(){
  return(
    <>
    <nav className="navbar">
      <div></div>
      <div className="divBouttonNav">
        <button className="bouttonNav">Accueil</button>
        <button className="bouttonNav">A propos</button>
        <button className="bouttonNav">Projets</button>
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
      <section className="titre">
        <h1>A propos de moi</h1>
        <p className="paragraphe">
          👋Bonjour, Je m’appelle <label className="souligne">RAZAFINDRANAIVO Aimé Daniel Johnston</label>, et je suis un <label className="souligne">développeur web frontend</label> passionné par la <u>création de solutions numériques modernes et efficaces</u>💡. <br />
          ⌛Pendant mes études et mon stage dans le poste de dévéloppeur web, j’ai acquis de <label className="souligne">l’expérience</label> en travaillant avec les technologies <label className="souligne">Next.js, Node.js</label>. <br />
          Je suis particulièrement intéressé par <label className="souligne">le développement d’interfaces intuitives</label> 🧑‍💻, et j’aime relever des défis techniques en cherchant toujours <label className="souligne">des solutions élégantes🪄</label>. <br />
          Curieux et créatif✍️, j’apprends en continu et je suis convaincu que <u>la collaboration est essentielle </u>pour <label className="souligne">créer des projets de qualité.</label>
        </p>
        <h1 className="titre">Langanges informatiques connus</h1>
        <div className="containerCard">
          <div className="card">
            <div className="divLogo">
              <i className="fab fa-html5 tech-icon"></i>
              <i className="fab fa-css3-alt tech-icon"></i>
            </div>

            <p className="heading">HTML&CSS</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>5/6</p>
          </div>
          <div className="card">
            <div className="divLogo">
              <i className="fab fa-js tech-icon"></i>
            </div>
            <p className="heading">JavaScript</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>5/6</p>
          </div>
          <div className="card">
            <div className="divLogo">
              <i className="fab fa-php tech-icon"></i>
            </div>
            <p className="heading">PHP</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>4/6</p>
          </div>
          <div className="card">
            <div className="divLogo">
              <i className="fas fa-terminal"></i>
            </div>
            <p className="heading">Java</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>4/6</p>
          </div>
          <div className="card">
            <div className="divLogo">
              <i className="fab fa-python tech-icon"></i>
            </div>
            <p className="heading">Python</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>3/6</p>
          </div>
          <div className="card">
            <div className="divLogo">
              <i className="fas fa-database tech-icon"></i>
            </div>
            <p className="heading">MySQL</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>4/6</p>
          </div>
          <div className="card">
            <div className="divLogo">
              <i className="fas fa-database tech-icon"></i>
            </div>
            <p className="heading">PostgreSQL</p>
            <p>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
              <i className="fas fa-star" style={{color: "rgb(255, 238, 0, 0.15)"}}></i>
            </p>
            <p>4/6</p>
          </div>
        </div>
      </section>
      <section>
        <h1 className="titre">Outils de développements</h1>
        <div className="containerCard">
          <div className="cardoutil">
              <h2>CARD</h2>
          </div>
          <div className="cardoutil">
              <h2>CARD</h2>
          </div>
          <div className="cardoutil">
              <h2>CARD</h2>
          </div>
          <div className="cardoutil">
              <h2>CARD</h2>
          </div>
          <div className="cardoutil">
              <h2>CARD</h2>
          </div>
        </div>
      </section>
      <section>
        <h1 className="titre">Autres compétences</h1>
      </section>
      <section>
        <h1 className="titre">Mes projets</h1>
        <div>
          <div>
            <img src="../img" alt="" />
          </div>
        </div>
      </section>
      <section>
        <h1 className="titre">Me contacter</h1>
        
      </section>

    </>
  )
}