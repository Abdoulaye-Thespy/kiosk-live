import PDFDocument from "pdfkit"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 as uuidv4 } from "uuid"

// Initialize S3 client
const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
})

export async function generatePdf(contract: any): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({ size: "A4", margin: 50 })

      // Collect PDF chunks
      const chunks: Buffer[] = []
      doc.on("data", (chunk) => chunks.push(chunk))

      // When PDF is done being generated
      doc.on("end", async () => {
        try {
          // Combine chunks into a single buffer
          const pdfBuffer = Buffer.concat(chunks)

          // Generate a unique filename
          const filename = `contracts/${contract.id}/${uuidv4()}.pdf`

          // Upload to S3
          await s3Client.send(
            new PutObjectCommand({
              Bucket: process.env.AWS_S3_BUCKET || "your-bucket-name",
              Key: filename,
              Body: pdfBuffer,
              ContentType: "application/pdf",
            }),
          )

          // Return the URL to the PDF
          const pdfUrl = `https://${process.env.AWS_S3_BUCKET}.s3.amazonaws.com/${filename}`
          resolve(pdfUrl)
        } catch (error) {
          console.error("Error uploading PDF to S3:", error)
          reject(error)
        }
      })

      // Add content to the PDF
      generateContractContent(doc, contract)

      // Finalize the PDF
      doc.end()
    } catch (error) {
      console.error("Error generating PDF:", error)
      reject(error)
    }
  })
}

function generateContractContent(doc: PDFKit.PDFDocument, contract: any) {
  // Add header
  doc.fontSize(16).font("Helvetica-Bold").text("CONTRAT CADRE DE LOCATION DES KIOSQUES", { align: "center" })
  doc.moveDown(2)

  // Add parties
  doc.fontSize(12).font("Helvetica-Bold").text("Entre les soussignées :")
  doc.moveDown(0.5)

  doc
    .font("Helvetica")
    .text(
      "ACCENT MEDIA PROJET SA, Société Anonyme avec Conseil d'Administration, au capital de FCFA 10.000.000, " +
        "ayant son siège social à Douala, boîte postale numéro 1937 Douala, République du Cameroun, immatriculée " +
        "au registre du commerce et du crédit mobilier de Douala sous le numéro RC/DLA/2017/2145, représentée par " +
        "Monsieur Jacques NDJAMBA MBELECK, son Directeur Général, dûment habilité,",
    )
  doc.moveDown(0.5)
  doc.text("Ci-après dénommée « L'Équipementier »,")
  doc.moveDown(1)

  doc.text("Et")
  doc.moveDown(0.5)

  // Client information
  const clientInfo = [
    `Madame/monsieur ${contract.clientName},`,
    contract.clientIdNumber ? `N° CNI/RECEPISSE: ${contract.clientIdNumber}` : "",
    contract.clientIdIssuedDate
      ? `Dressée le ${format(new Date(contract.clientIdIssuedDate), "dd/MM/yyyy", { locale: fr })}`
      : "",
    contract.clientIdIssuedPlace ? `à ${contract.clientIdIssuedPlace},` : "",
    contract.clientAddress ? `Domiciliée à ${contract.clientAddress}` : "",
    contract.clientBusinessAddress ? `exerçant son activité professionnelle à ${contract.clientBusinessAddress}` : "",
    contract.clientBusinessQuarter ? `Quartier ${contract.clientBusinessQuarter}` : "",
    contract.clientBusinessLocation ? `lieu-dit ${contract.clientBusinessLocation},` : "",
    contract.clientPhone ? `N° Tél: ${contract.clientPhone},` : "",
    "Dûment habilité.",
  ]
    .filter(Boolean)
    .join(" ")

  doc.text(clientInfo)
  doc.moveDown(0.5)
  doc.text("Ci-après dénommée le « Preneur »,")
  doc.moveDown(0.5)

  doc.text(
    "L'Équipementier et le Preneur sont individuellement désignés une « Partie » et collectivement les « Parties ».",
  )
  doc.moveDown(2)

  // Preamble
  doc.fontSize(12).font("Helvetica-Bold").text("IL EST PREALABLEMENT EXPOSE QUE :", { underline: true })
  doc.moveDown(1)

  doc
    .fontSize(11)
    .font("Helvetica")
    .text(
      "L'Équipementier a signé avec la Communauté Urbaine de Douala (CUD) A la suite d'une dispense à concurrence " +
        "N°B68/C/SG/PM délivrée en date du 22 JUIN 2017 et d'un communiqué d'adjudication N°2006/306 délivrés par le " +
        "Premier Ministre, Chef du Gouvernement, Haute autorité des Contrats de Partenariats Publics-Privés (PPP), " +
        "des contrats de partenariat publics-privés pour l'Équipement de la ville de Douala en Kiosques urbains " +
        "multifonctionnels (les « Kiosques » ou les « Kiosques urbains »), permettant de contribuer à la modernisation " +
        "du cadre d'exercice de certaines activités dans la ville de Douala, à la réduction du désordre urbain et à " +
        "l'embellissement des villes.",
    )
  doc.moveDown(1)

  // Contract details
  doc.fontSize(12).font("Helvetica-Bold").text("IL EST CONVENU CE QUI SUIT :", { underline: true })
  doc.moveDown(1)

  // Article 1: Object
  doc.fontSize(11).font("Helvetica-Bold").text("Article 1: Objet")
  doc.moveDown(0.5)
  doc
    .font("Helvetica")
    .text(
      "Le Présent Contrat a pour objet de fixer les modalités mise à la disposition du Preneur, des Kiosques urbains " +
        "multifonctionnels (les « Kiosques » ou les « Kiosques urbains ») par l'Équipementier et de définir les modalités " +
        "de commande, de réception et d'utilisation par le Preneur de ces Kiosques.",
    )
  doc.moveDown(1)

  // Article 2: Duration
  doc.fontSize(11).font("Helvetica-Bold").text("Article 2: Durée")
  doc.moveDown(0.5)
  doc
    .font("Helvetica")
    .text(
      `Le présent contrat est conclu pour une durée de ${contract.contractDuration} mois à compter de la date de signature.`,
    )
  doc.moveDown(1)

  // Article 3: Payment
  doc.fontSize(11).font("Helvetica-Bold").text("Article 3: Redevance et modalités de paiement")
  doc.moveDown(0.5)
  doc
    .font("Helvetica")
    .text(
      `Le Preneur s'engage à payer une redevance de ${contract.paymentAmount.toLocaleString()} FCFA par ${contract.paymentFrequency.toLowerCase()}. ` +
        `Le montant total du contrat s'élève à ${contract.totalAmount.toLocaleString()} FCFA.`,
    )
  doc.moveDown(1)

  // Article 4: Kiosks
  doc.fontSize(11).font("Helvetica-Bold").text("Article 4: Kiosques concernés")
  doc.moveDown(0.5)
  doc
    .font("Helvetica")
    .text(`Le présent contrat concerne ${contract.kiosks.length} kiosque(s) situé(s) aux emplacements suivants:`)
  doc.moveDown(0.5)

  // List kiosks
  contract.kiosks.forEach((kiosk: any, index: number) => {
    doc.text(`${index + 1}. Kiosque N° ${kiosk.kiosqueNumber} - ${kiosk.location}`)
  })
  doc.moveDown(1)

  // Signatures
  doc.moveDown(4)
  doc.fontSize(11).text("Fait à Douala le " + format(new Date(), "dd/MM/yyyy", { locale: fr }), { align: "center" })
  doc.moveDown(2)

  // Two columns for signatures
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right
  const colWidth = pageWidth / 2

  doc.text("Pour l'Équipementier", doc.page.margins.left, doc.y, { width: colWidth, align: "center" })
  doc.text("Pour le preneur", doc.page.margins.left + colWidth, doc.y, { width: colWidth, align: "center" })
  doc.moveDown(0.5)

  doc.text("(Précédée de la mention manuscrite Lu et approuvé)", doc.page.margins.left, doc.y, {
    width: colWidth,
    align: "center",
  })
  doc.text("(Précédée de la mention Lu et approuvé)", doc.page.margins.left + colWidth, doc.y, {
    width: colWidth,
    align: "center",
  })
  doc.moveDown(3)

  doc.text("Monsieur Jacques NDJAMBA MBELECK", doc.page.margins.left, doc.y, { width: colWidth, align: "center" })
  doc.text(`Madame/Monsieur ${contract.clientName}`, doc.page.margins.left + colWidth, doc.y, {
    width: colWidth,
    align: "center",
  })
}

