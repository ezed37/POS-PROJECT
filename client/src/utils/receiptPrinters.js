export function printReceipt({
  cart,
  discount = 0,
  subtotal = 0,
  finalTotal = 0,
  customerCash = "",
  balance = 0,
  customerTotalProfit,
}) {
  const receiptWindow = window.open("", "PRINT", "height=600,width=400");
  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          @media print {
            
            @page {
              size: 80mm auto;
              margin: 0;
            }
            html, body {
              width: 80mm;
              margin: 0;
              padding: 0;
              font-family: monospace;
              font-size: 12px;
            }
          }

          body {
            font-family: monospace;
            font-size: 12px;
            width: 80mm;
            margin: 0;
            padding: 5px;
          }

          .center { text-align: center; }
          hr { border: none; border-top: 1px dashed #000; margin: 5px 0; }

          /* Flex layout for rows */
          .item-row, .item-header {
            display: flex;
            justify-content: space-between;
            margin: 2px 0;
          }

          .item-header span {
            font-weight: bold;
          }

          .item-row .item-name {
            flex: 2;      
            word-break: break-word;
          }

          .item-row .qty,
          .item-row .price,
          .item-row .total,
          .item-row .actual-price {
            flex: 1;
            text-align: right;
            white-space: nowrap;
          }

          .total-box, .summary-row {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            padding: 5px 0;
          }

          .summary-row1 {
            display: flex;
            justify-content: space-between;
            background-color: #000;
            color: #fff;
            padding: 6px 4px;
            font-weight: bold;
          }

          .summary-row span { text-align: right; }

        </style>
      </head>
      <body>
        <div style="text-align: center;">
            <img
                id="receiptLogo"
                src="/receiptLogo.png"
                style="width: 40mm; height:auto; margin-bottom:5px;"
            >
        </div>
        <h2 class="center">Tharindi Super Mart</h2>
        <h4 class="center">Horathepola, Welipennagahamulla</h4>
        <p class="center">0770072803 - Udaya Kumara</p>
        <div class="center">${new Date().toLocaleString()}</div>
        <hr>
        <div class="item-header">
          <span class="item-name">අයිතම</span>
          <span class="qty">ප්‍රමාණය</span>
          <span class="actual-price">සඳහන් මිල</span>
          <span class="price">අපේ මිල</span>
          <span class="total">මුළු මිල</span>
        </div>
        <hr>
  `);

  cart.forEach((item) => {
    const itemTotal = (item.qty * (item.selling_price ?? 0)).toFixed(2);
    receiptWindow.document.write(`
      <div class="item-row">
        <span class="item-name">${item.product_name}</span>
        <span class="qty">${item.qty}</span>
        <span class="actual-price">${(Number(item.actual_price) || 0).toFixed(
          2
        )}</span>
        <span class="price">${item.selling_price.toFixed(2)}</span>
        <span class="total">${itemTotal}</span>
      </div>
    `);
  });

  receiptWindow.document.write(`
    <hr>
    <div class="summary-row"><span>මුළු මිල:</span><span>Rs. ${subtotal.toFixed(
      2
    )}</span></div>
    <div class="summary-row"><span>වට්ටම්:</span><span>${discount}%</span></div>
    <div class="total-box"><span>අවසන් මිල:</span><span>Rs. ${finalTotal.toFixed(
      2
    )}</span></div>
    <div class="summary-row"><span>ඔබ දුන් මුදල:</span><span>Rs. ${customerCash}</span></div>
    <hr>
    <div class="summary-row"><span>ඉතිරි මුදල:</span><span>Rs. ${Number(
      balance || 0
    ).toFixed(2)}</span></div>
    <hr>
    ${
      customerTotalProfit != 0
        ? `
        <div class="summary-row1">
            <span>ඔබ ලැබූ ලාභය:</span>
            <span>Rs. ${Number(customerTotalProfit).toFixed(2)}</span>
        </div>
        <hr>
        `
        : ``
    }
    <div class="center" style="margin-top:10px;">***** ස්තූතියි! නැවත එන්න... *****</div>
    <div class="center" style="margin-top:10px;"></div>
    <div class="center" style="margin-top:10px;">Software by Tharindu Madhuranga - 0772316449</div>
  </body>
  </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  const logo = receiptWindow.document.getElementById("receiptLogo");

  if (logo.complete) {
    // Image already loaded (from cache)
    receiptWindow.print();
    receiptWindow.close();
  } else {
    // Wait for image
    logo.onload = () => {
      receiptWindow.print();
      receiptWindow.close();
    };

    // Safety fallback (in case image fails)
    logo.onerror = () => {
      receiptWindow.print();
      receiptWindow.close();
    };
  }
}
