const { Plugins, CameraResultType, CameraSource } = capacitorExports;
const { Camera, Storage } = Plugins;

const ionicContent = document.querySelector("ion-content");
let news = [];
let image;
fetch("https://devfest-nantes-2018-api.cleverapps.io/blog").then(response => {
  response.json().then(body => {
    body.sort(function(a, b) {
      const c = new Date(a.date);
      const d = new Date(b.date);
      return c - d;
    });

    this.createFromLocal();
    body.forEach(element => {
      createCard(element);
    });
  });
});

async function createFromLocal() {
  const cards = await Storage.get({ key: "cards" });
  const value = JSON.parse(cards.value) ? JSON.parse(cards.value) : [];
  value.forEach(news => createCard(news, true));
}

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
function createCard(news, local = false) {
  let imgSrc = `data:image/jpeg;base64, ${news.image}`;
  if (!local) {
    imgSrc = `https://devfest2018.gdgnantes.com/${news.image}`;
  }
  ionicContent.innerHTML += `
    <ion-card>
        <img src="${imgSrc}">
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

async function takePicture() {
  image = await Plugins.Camera.getPhoto({
    quality: 100,
    allowEditing: false,
    resultType: CameraResultType.Base64,
    source: CameraSource.Camera
  });
  this.presentModal();
}

customElements.define(
  "modal-page",
  class extends HTMLElement {
    connectedCallback() {
      this.innerHTML = `
                        <ion-header>
                        <ion-toolbar>
                            <ion-title>Création d'un article privé</ion-title>
                            <ion-buttons slot="primary">
                            <ion-button onClick="dismissModal()">
                                <ion-icon slot="icon-only" name="close"></ion-icon>
                            </ion-button>
                            </ion-buttons>
                        </ion-toolbar>
                        </ion-header>
                        <ion-content class="ion-padding">
                        <form padding-right>
                            <ion-item>
                                <ion-label>Titre*</ion-label>
                                <ion-input name="title" required="true"></ion-input>
                            </ion-item>
                            <ion-item>
                                <ion-label>Description</ion-label>
                                <ion-input name="brief"></ion-input>
                            </ion-item>

                            <ion-button 
                            color="primary" 
                            expand="block"
                            onClick="onSave()">Enregistrer</ion-button>
                        </form>
                        </ion-content>`;
    }
  }
);

function presentModal() {
  // create the modal with the `modal-page` component
  const modalElement = document.createElement("ion-modal");
  modalElement.component = "modal-page";

  // present the modal
  document.body.appendChild(modalElement);
  return modalElement.present();
}

function dismissModal() {
  document.body.removeChild(document.querySelector("ion-modal"));
}

function onSave() {
  const formData = new FormData(document.querySelector("form"));
  // Now you can use formData.get('foo'), for example.
  // Don't forget e.preventDefault() if you want to stop normal form .submission
  if (formData.get("title")) {
    const item = {
      id: news.length,
      title: formData.get("title"),
      posted: new Date().toLocaleString(),
      brief: formData.get("brief"),
      image: image.base64String
    };
    news.push(item);
    this.createCard(item, true);
    this.setItem(item);
    this.dismissModal();
  }
}

async function setItem(item) {
  let raw = await Storage.get({ key: "cards" });
  let previousLocals = [];
  if (raw && raw.value) {
    previousLocals = JSON.parse(raw.value);
  }
  previousLocals.push(item);

  await Storage.set({
    key: "cards",
    value: JSON.stringify(previousLocals)
  });
}
