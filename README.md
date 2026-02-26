# Blog Dashboard

Questo è uno dei progetti del corso JavaScript.
Dovrai creare un mini-blog con **due pagine**: una per visualizzare i post e una per crearne di nuovi, usando l'API locale (`server-api`).

## Funzionalità da implementare

Le funzionalità sono divise in 3 fasi:

### Fase 1 — Visualizzare i Post
1. **Recuperare i post** — `GET /api/posts` per ottenere tutti i post
2. **Recuperare gli utenti** — `GET /api/users` per mostrare il nome dell'autore accanto a ogni post
3. **Mostrare i post in una tabella** — con autore, titolo, contenuto (troncato), likes, data

### Fase 2 — Filtri
4. **Ricerca per titolo** — un input per cercare post per titolo
5. **Filtro per autore** — un dropdown per mostrare solo i post di un certo autore
6. I filtri devono lavorare **insieme**

### Fase 3 — Creare ed Eliminare
7. **Pagina "Nuovo Post"** — Form con titolo, contenuto e autore (dropdown) + validazione
8. **Creare un post** — `POST /api/posts` per salvare il nuovo post
9. **Eliminare un post** — `DELETE /api/posts/:id` con conferma


## Struttura del Progetto

```
blog/
├── index.html      ← Pagina lista post (con filtri e pulsante elimina)
├── index.js        ← JS per la pagina lista (GET + DELETE + filtri)
├── nuovo.html      ← Pagina creazione nuovo post (form)
├── nuovo.js        ← JS per la pagina creazione (GET utenti + POST)
├── style.css       ← CSS condiviso tra le due pagine
└── README.md       ← Questo file
```


## Come Iniziare

### Prerequisiti
1. Assicurati che il `server-api` sia in esecuzione: dalla cartella `server-api`, esegui `npm start`
2. Oppure chiedi al docente di avviare il server
3. Verifica che l'API risponda: apri `http://localhost:5000/api` o il link del docente nel browser

### Setup del Progetto
1. Crea una nuova repository `BlogDashboard` su GitHub
2. Clona la repo e apri la cartella in VSCode
3. Copia tutti i file del progetto nella repo
4. Fai il primo commit: `"Setup iniziale progetto Blog Dashboard"`

Oppure fai una fork del progetto già creato dal docente e clonalo, così avrai già tutto pronto e potrai concentrarti solo sul codice.
Il link del progetto del docente lo si può trovare su [GitHub](https://github.com/CerseoWeb/BlogDashboard)

### Workflow Git
Dopo **ogni funzionalità**, fai un commit:
```
"Fase 1: caricamento e visualizzazione post in tabella"
"Fase 1: aggiunto nome autore con join utenti"
"Fase 2: aggiunto filtro ricerca per titolo"
"Fase 2: aggiunto filtro dropdown per autore"
"Fase 3: form creazione nuovo post con validazione"
"Fase 3: implementata eliminazione post"
```


## API Reference

### URL Base
```
http://localhost:5000/api
```

### Posts — `/api/posts`
| Metodo | URL | Descrizione |
|--------|-----|-------------|
| `GET` | `/api/posts` | Tutti i post |
| `POST` | `/api/posts` | Crea un nuovo post |
| `DELETE` | `/api/posts/:id` | Elimina un post |

**Struttura di un post:**
```json
{
  "id": 1,
  "userId": 3,
  "titolo": "Titolo del Post",
  "contenuto": "Il contenuto completo del post...",
  "likes": 12,
  "data": "2024-01-15"
}
```

### Users — `/api/users`
| Metodo | URL | Descrizione |
|--------|-----|-------------|
| `GET` | `/api/users` | Tutti gli utenti |

**Struttura di un utente:**
```json
{
  "id": 1,
  "nome": "Mario",
  "cognome": "Rossi",
  "avatar": "https://ui-avatars.com/api/?name=Mario+Rossi&..."
}
```


## Esempi di Codice

### Fetch GET (leggere dati)
```javascript
const response = await fetch("http://localhost:5000/api/posts");
const posts = await response.json();
console.log(posts);  // array di oggetti post
```

### Fetch POST (creare un post)
```javascript
const nuovoPost = {
  userId: 3,
  titolo: "Il mio primo post",
  contenuto: "Ciao mondo!",
  likes: 0,
  data: new Date().toISOString().split("T")[0]
};

const response = await fetch("http://localhost:5000/api/posts", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(nuovoPost)
});

const postCreato = await response.json();
```

### Fetch DELETE (eliminare un post)
```javascript
const response = await fetch("http://localhost:5000/api/posts/1", {
  method: "DELETE"
});
```

### Trovare il nome dell'autore (join)
```javascript
const autore = utenti.find(u => u.id === post.userId);
const nomeAutore = autore ? autore.nome + " " + autore.cognome : "Sconosciuto";
```

### Troncare il testo
```javascript
const testoCorto = post.contenuto.substring(0, 50) + "...";
```

### Filtrare un array
```javascript
const risultati = posts.filter(post => {
  return post.titolo.toLowerCase().includes(testoCercato.toLowerCase());
});
```


## 💡 Suggerimenti

1. **Ordine di lavoro nella Fase 1**: prima carica gli utenti, poi i post. Ti servono gli utenti già pronti in memoria per poter mostrare il nome dell'autore quando crei le righe della tabella.

2. **Variabili globali**: salva utenti e post in variabili `let` globali. Così puoi riusarli nelle funzioni di filtro senza ricaricarli.

3. **Il dropdown autore (Fase 2)**: il `value` di una `<option>` è sempre una **stringa**. Ma `userId` nel post è un **numero**. Per confrontarli devi convertire uno dei due (es. `Number(dropdown.value)` oppure `post.userId.toString()`).

4. **Validazione form (Fase 3)**: controlla i campi PRIMA di fare il fetch. Non mandare dati vuoti all'API.

5. **Dopo la POST**: resetta il form con `form.reset()` e mostra un messaggio di conferma per far capire all'utente che il post è stato creato.


## 🐛 Debug

### I post non si vedono
- Apri la Console (F12) e cerca errori
- Prova l'URL nel browser: `http://localhost:5000/api/posts`
- Controlla che il server sia avviato

### Il nome autore non appare
- Hai caricato gli utenti PRIMA dei post?
- Controlla che `userId` del post corrisponda a un `id` nella lista utenti

### La POST non funziona
- Hai messo `method: "POST"`?
- Hai l'header `"Content-Type": "application/json"`?
- Hai usato `JSON.stringify()` nel body?
- Controlla la tab **Network** in DevTools per vedere la richiesta
