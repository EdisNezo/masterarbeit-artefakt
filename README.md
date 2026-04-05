# Masterarbeit Artefakt

Dieses Repository enthält das praktische Artefakt (die Implementierung) im Rahmen meiner Masterarbeit. 
Um die Anwendung lokal zu testen und zu begutachten, gibt es zwei Möglichkeiten: Eine direkte Installation über den Paketmanager `pnpm` oder die isolierte Ausführung via `Docker`.

---

## Vorbereitung: Umgebungsvariablen

Bevor Sie die Anwendung starten (egal ob mit pnpm oder Docker), müssen die nötigen Umgebungsvariablen mit den korrekten API-Keys konfiguriert werden. 

Erstellen Sie dazu eine `.env.local` Datei im Root-Verzeichnis des Projekts und fügen Sie folgende Variablen mit den korrekten Schlüsseln ein:

```env
OPENAI_API_KEY=ihr_openai_api_key
NEXT_PUBLIC_SUPABASE_ANON_KEY=ihr_supabase_anon_key
NEXT_PUBLIC_SUPABASE_URL=ihre_supabase_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=ihr_supabase_publishable_key
PINECONE_API_KEY=ihr_pinecone_api_key
PINECONE_INDEX=technostress
DASHBOARD_PASSWORD=research123
```

*(Hinweis: Die genauen Schlüssel wurden Ihnen separat übermittelt oder sind in den begleitenden Unterlagen zu finden.)*

---

## 1. Lokale Ausführung (mit pnpm)

Für diese Variante müssen [Node.js](https://nodejs.org/) (empfohlen wird v20 oder neuer) und [pnpm](https://pnpm.io/installation) auf Ihrem System installiert sein.

1. **Abhängigkeiten installieren:**
   Führen Sie im Root-Verzeichnis des Projekts folgenden Befehl aus:
   ```bash
   pnpm install
   ```

2. **Entwicklungsserver starten:**
   Starten Sie anschließend die Anwendung mit:
   ```bash
   pnpm dev
   ```

Die Anwendung ist nun in Ihrem Browser unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

## 2. Ausführung mit Docker (Alternative)

Einfach und ohne die Installation lokaler Node.js-Abhängigkeiten können Sie das Projekt vollständig in einem Docker-Container ausführen. Hierfür muss [Docker](https://www.docker.com/) auf Ihrem Computer installiert sein.

1. **Docker-Image erstellen:**
   Führen Sie den folgenden Befehl im Root-Verzeichnis aus, um das Image zu bauen:
   ```bash
   docker build -t masterarbeit-artefakt .
   ```

2. **Docker-Container starten:**
   Starten Sie den Container und leiten Sie Port 3000 weiter:
   ```bash
   docker run -p 3000:3000 masterarbeit-artefakt
   ```

Auch in diesem Fall ist die Anwendung nun in Ihrem Browser unter [http://localhost:3000](http://localhost:3000) erreichbar.

---

Sollten beim Setup oder beim Testen der Anwendung Rückfragen auftreten, können Sie mich jederzeit kontaktieren.
