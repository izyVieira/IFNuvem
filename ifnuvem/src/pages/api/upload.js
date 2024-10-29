import { google } from "googleapis";
import { Readable } from "stream";
import fs from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

const getDriveService = () => {
  const CREDENTIALS_PATH = path.join(process.cwd(), "config", "credentials.json");
  const TOKEN_PATH = path.join(process.cwd(), "config", "token.json");

  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH, "utf-8"));
  const auth = new google.auth.OAuth2(
    credentials.installed.client_id,
    credentials.installed.client_secret,
    credentials.installed.redirect_uris[0]
  );

  const token = JSON.parse(fs.readFileSync(TOKEN_PATH, "utf-8"));
  auth.setCredentials(token);

  return google.drive({ version: "v3", auth });
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  const drive = getDriveService();

  try {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", async () => {
      const buffer = Buffer.concat(chunks);
      const mimeType = req.headers["content-type"];
      const fileName = req.headers["x-file-name"];
      const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;

      const fileMetadata = {
        name: fileName,
        parents: [folderId],
      };

      const media = {
        mimeType: mimeType,
        body: Readable.from(buffer),
      };

      const response = await drive.files.create({
        requestBody: fileMetadata,
        media: media,
        fields: "id",
      });

      res.status(200).json({ message: "Upload realizado com sucesso", fileId: response.data.id });
    });
  } catch (error) {
    console.error("Erro ao fazer o upload:", error);
    res.status(500).json({ error: `Erro ao fazer o upload: ${error.message}` });
  }
}
