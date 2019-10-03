const ionicContent = document.querySelector("ion-content");
let news = "";

fetch("https://devfest-nantes-2018-api.cleverapps.io/blog").then(response => {
  response.json().then(body => {
    body.sort(function(a, b) {
      const c = new Date(a.date);
      const d = new Date(b.date);
      return c - d;
    });
    body.forEach(element => {
      createCard(element);
    });
  });
});

/**
 *
 * @param {id : string,
 * title : string,
 * posted: string,
 * brief : string,
 * image: string,
 * primaryColor: string,
 * secondaryColor: string
 * } news
 * 
 * 
 * <ion-card>
  <ion-card-header>
    <ion-card-subtitle>Card Subtitle</ion-card-subtitle>
    <ion-card-title>Card Title</ion-card-title>
  </ion-card-header>

  <ion-card-content>
    Keep close to Nature's heart... and break clear away, once in awhile,
    and climb a mountain or spend a week in the woods. Wash your spirit clean.
  </ion-card-content>
</ion-card>
 */
function createCard(news) {
  ionicContent.innerHTML += `
    <ion-card>
        <img src="https://devfest2018.gdgnantes.com/${news.image}">
        <ion-card-header>
            <ion-card-title>
                ${news.title}
            </ion-card-title>
        </ion-card-header>
        <ion-card-content>
            ${news.brief}
        </ion-card-content>
    </ion-card>`;
}
