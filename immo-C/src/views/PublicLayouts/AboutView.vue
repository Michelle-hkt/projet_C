<script setup>
</script>

<template>
  <section class="about">
    <div class="about_banner">
      <div class="container">
        <div class="about_banner_content">
          <h1>À Propos de Notre Entreprise</h1>
          <p class="about_banner_nav">
            <RouterLink to="/home">Accueil</RouterLink> / <span>À propos</span>
          </p>
        </div>
      </div>
    </div>

    <div class="about_content">
      <div class="container">
        <!-- Section About Babomon avec texte + image -->
        <div class="about_company_contain">
          <div class="about_company_contain_left">
            <h2>À Propos de Babomon</h2>
            <p>
              Nous sommes une plateforme immobilière innovante dédiée à faciliter l'achat, la vente
              et la location de biens immobiliers. Notre mission est de rendre le processus
              immobilier simple, transparent et accessible à tous.
            </p>
            <p>
              Avec Babomon, vous bénéficiez d'une expérience utilisateur exceptionnelle grâce à nos
              outils modernes : visites virtuelles, système de paiement sécurisé, et une équipe
              d'agents certifiés prêts à vous accompagner à chaque étape de votre projet immobilier.
            </p>
          </div>
          <div class="about_company_contain_right">
            <img src="@/assets/images/groupe.jpeg" alt="Notre équipe Babomon" />
          </div>
        </div>

        <div class="about_section">
          <h2>Nos Valeurs</h2>
          <div class="about_values_grid">
            <div class="about_values_item">
              <div class="about_values_item_icon">
                <i class="fas fa-shield-alt"></i>
              </div>
              <h3>Confiance</h3>
              <p>
                Nous vérifions chaque annonce et chaque agent pour garantir la sécurité de nos
                utilisateurs.
              </p>
            </div>

            <div class="about_values_item">
              <div class="about_values_item_icon">
                <i class="fas fa-lightbulb"></i>
              </div>
              <h3>Innovation</h3>
              <p>
                Nous utilisons les dernières technologies pour offrir une expérience utilisateur
                exceptionnelle.
              </p>
            </div>

            <div class="about_values_item">
              <div class="about_values_item_icon">
                <i class="fas fa-users"></i>
              </div>
              <h3>Communauté</h3>
              <p>
                Nous rassemblons propriétaires, acheteurs et agents dans une communauté dynamique.
              </p>
            </div>

            <div class="about_values_item">
              <div class="about_values_item_icon">
                <i class="fas fa-star"></i>
              </div>
              <h3>Excellence</h3>
              <p>Nous nous engageons à fournir le meilleur service à nos clients.</p>
            </div>
          </div>
        </div>

        <div class="about_section">
          <h2>Nos Services</h2>
          <div class="about_services_list">
            <div class="about_services_item">
              <i class="fas fa-home"></i>
              <div>
                <h3>Annonces vérifiées</h3>
                <p>Accédez à des milliers d'annonces immobilières vérifiées et actualisées</p>
              </div>
            </div>

            <div class="about_services_item">
              <i class="fas fa-vr-cardboard"></i>
              <div>
                <h3>Visites virtuelles</h3>
                <p>Visitez les biens en ligne grâce à notre technologie de visite virtuelle</p>
              </div>
            </div>

            <div class="about_services_item">
              <i class="fas fa-calendar-check"></i>
              <div>
                <h3>Visites sur site</h3>
                <p>Organisez des visites physiques avec nos agents certifiés</p>
              </div>
            </div>

            <div class="about_services_item">
              <i class="fas fa-wallet"></i>
              <div>
                <h3>Paiement sécurisé</h3>
                <p>Effectuez vos transactions en toute sécurité avec notre système de wallet</p>
              </div>
            </div>
          </div>
        </div>

        <div class="about_section about_contact_section">
          <h2>Contactez-nous</h2>
          <div class="about_contact_info">
            <div class="about_contact_item">
              <i class="fas fa-envelope"></i>
              <p>contact@babomon.com</p>
            </div>
            <div class="about_contact_item">
              <i class="fas fa-phone"></i>
              <p>+229 XX XX XX XX</p>
            </div>
            <div class="about_contact_item">
              <i class="fas fa-map-marker-alt"></i>
              <p>Cotonou, Bénin</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.about_banner {
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url('@/assets/images/salon.jpeg');
  background-size: cover;
  background-position: center;
  padding: 150px 0 80px 0;
  text-align: center;
  color: #fff;
}

.about_banner h1 {
  font-size: 42px;
  font-weight: 700;
  margin-bottom: 15px;
  font-family: 'Montserrat', sans-serif;
  color: #fff;
}

.about_banner_nav {
  font-size: 16px;
  color: #fff;
}

.about_banner_nav a {
  color: #fff;
  text-decoration: none;
  transition: opacity 0.3s ease;
}

.about_banner_nav a:hover {
  opacity: 0.8;
}

.about_banner_nav span {
  color: #fff;
}

.about_content {
  padding: 100px 0 60px 0;
}

/* Section About Company avec texte + image */
.about_company_contain {
  display: flex;
  gap: 60px;
  align-items: center;
  margin-bottom: 120px;
}

.about_company_contain_left {
  flex: 1;
}

.about_company_contain_left h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 25px;
  color: #0f161c;
  font-family: 'Montserrat', sans-serif;
}

.about_company_contain_left p {
  font-size: 16px;
  line-height: 1.8;
  color: #666;
  margin-bottom: 20px;
}

.about_company_contain_right {
  flex: 1;
  display: flex;
  justify-content: center;
}

.about_company_contain_right img {
  width: 100%;
  max-width: 500px;
  border-radius: 8px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
}

.about_section {
  margin-bottom: 120px;
}

.about_section h2 {
  font-size: 36px;
  font-weight: 700;
  margin-bottom: 50px;
  color: #0f161c;
  text-align: center;
  font-family: 'Montserrat', sans-serif;
}

.about_section > p {
  font-size: 18px;
  line-height: 1.8;
  color: #666;
  text-align: center;
  max-width: 800px;
  margin: 0 auto;
}

.about_values_grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 30px;
  margin-top: 40px;
}

.about_values_item {
  text-align: center;
  padding: 30px 20px;
  background-color: #f5f7fb;
  border-radius: 12px;
  transition: transform 0.3s ease;
}

.about_values_item:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}

.about_values_item_icon {
  width: 80px;
  height: 80px;
  margin: 0 auto 20px;
  background-color: #274abb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.about_values_item_icon i {
  font-size: 35px;
  color: #fff;
}

.about_values_item h3 {
  font-size: 22px;
  font-weight: 600;
  margin-bottom: 15px;
  color: #0f161c;
}

.about_values_item p {
  font-size: 16px;
  line-height: 1.6;
  color: #666;
}

.about_services_list {
  display: flex;
  flex-direction: column;
  gap: 25px;
  max-width: 900px;
  margin: 40px auto 0;
}

.about_services_item {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 25px;
  background-color: #fff;
  border-left: 4px solid #274abb;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
}

.about_services_item:hover {
  transform: translateX(10px);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.about_services_item i {
  font-size: 40px;
  color: #274abb;
  min-width: 50px;
}

.about_services_item h3 {
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 8px;
  color: #0f161c;
}

.about_services_item p {
  font-size: 16px;
  color: #666;
  line-height: 1.5;
}

.about_contact_section {
  background-color: #e8ecfa;
  padding: 50px 30px;
  border-radius: 12px;
  margin-bottom: 0;
}

.about_contact_info {
  display: flex;
  justify-content: center;
  gap: 60px;
  flex-wrap: wrap;
  margin-top: 30px;
}

.about_contact_item {
  display: flex;
  align-items: center;
  gap: 15px;
}

.about_contact_item i {
  font-size: 28px;
  color: #274abb;
}

.about_contact_item p {
  font-size: 18px;
  color: #0f161c;
  font-weight: 500;
}

@media (max-width: 768px) {
  .about_banner h1 {
    font-size: 32px;
  }

  .about_banner_nav {
    font-size: 14px;
  }

  .about_company_contain {
    flex-direction: column;
    gap: 40px;
  }

  .about_company_contain_left h2 {
    font-size: 28px;
  }

  .about_company_contain_left p {
    font-size: 15px;
  }

  .about_section h2 {
    font-size: 28px;
  }

  .about_values_grid {
    grid-template-columns: 1fr;
  }

  .about_contact_info {
    flex-direction: column;
    gap: 25px;
  }
}
</style>


