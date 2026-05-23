# Blogilista

Käynnistä kehitystilassa:

```bash
npm run dev
```

Sovellus käyttää oletuksena paikallista MongoDB:tä osoitteessa `mongodb://localhost/bloglist`.
Voit käyttää MongoDB Atlasta asettamalla yhteysosoitteen ympäristömuuttujaan `MONGODB_URI`.

PowerShell-esimerkki:

```powershell
$env:MONGODB_URI="mongodb+srv://..."
npm run dev
```

Kun palvelin on käynnissä, voit lisätä ja hakea blogeja tiedoston `requests.rest` pyynnöillä.
