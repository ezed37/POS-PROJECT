import PDFDocument from "pdfkit";
import moment from "moment";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const generateSalesReport = (sales, res) => {
  const doc = new PDFDocument({
    size: "A4",
    layout: "landscape",
    margin: 40,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "inline; filename=daily-sales-report.pdf"
  );

  doc.pipe(res);

  /* ================= FONT ================= */
  const fontPath = path.join(
    __dirname,
    "../assets/fonts/NotoSansSinhala-Regular.ttf"
  );

  doc.font(fontPath);

  /* ================= LOGO ================= */
  const logoPath = path.join(process.cwd(), "assets", "shopLogo.png");
  if (fs.existsSync(logoPath)) {
    doc.image(logoPath, 40, 30, { width: 100 });
  }

  /* ================= SHOP DETAILS ================= */
  doc
    .fontSize(16)
    .text("TSM | Tharindi Super Mart", 160, 35)
    .fontSize(10)
    .text("Address: Horathepola, Welipennagahamulla")
    .text("Phone: 0770072803");

  /* ================= DATE ================= */
  doc
    .fontSize(10)
    .text(`Date & Time: ${moment().format("YYYY-MM-DD HH:mm:ss")}`, 600, 40);

  doc.moveDown(3);

  /* ================= TABLE HEADER ================= */
  const tableTop = 160;
  let y = tableTop;

  doc
    .fontSize(10)
    .text(
      "No.   Item Name        Qty   Unit Cost   Unit Sell   Tot Cost   Tot Received   Revenue",
      40,
      y
    );

  doc
    .moveTo(40, y + 15)
    .lineTo(800, y + 15)
    .stroke();

  y += 25;

  /* ================= TABLE DATA ================= */
  let index = 1;
  let totalCost = 0;
  let totalReceived = 0;
  let totalRevenue = 0;

  sales.forEach((sale) => {
    sale.items.forEach((item) => {
      const cost = item.cost_price * item.qty;
      const received = item.selling_price * item.qty;
      const revenue = received - cost;

      totalCost += cost;
      totalReceived += received;
      totalRevenue += revenue;

      doc.text(
        `${index}    ${item.product_name}    ${item.qty}    ${item.cost_price}    ${item.selling_price}    ${cost}    ${received}    ${revenue}`,
        40,
        y
      );

      y += 20;
      index++;
    });
  });

  /* ================= TOTALS ================= */
  doc.moveTo(40, y).lineTo(800, y).stroke();
  y += 10;

  doc.fontSize(11).text(`Total Cost: Rs ${totalCost}`, 40, y);
  doc.text(`Total Received: Rs ${totalReceived}`, 300, y);
  doc.text(`Total Revenue: Rs ${totalRevenue}`, 580, y);

  /* ================= SIGNATURE ================= */
  y += 60;
  doc.text("Checked by:", 40, y);
  doc.text("....................................................", 120, y);

  doc.end();
};

export default generateSalesReport;
