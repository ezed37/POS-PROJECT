export function printReceipt({
  cart,
  discount = 0,
  subtotal = 0,
  finalTotal = 0,
  customerCash = "",
  balance = 0,
}) {
  const receiptWindow = window.open("", "PRINT", "height=600,width=400");
  receiptWindow.document.write(`
    <html>
      <head>
        <title>Receipt</title>
        <style>
          body {
            font-family: monospace;
            font-size: 12px;
            width: 80mm;
            margin: 0;
            padding: 5px;
          }
          .center { text-align: center; }
          .line { border-top:1px dashed #000; margin:6px 0; }
          .item-header, .item-row {
            display: grid;
            grid-template-columns: 40% 15% 20% 25%;
            margin: 2px 0;
          }
          .item-header span { font-weight: bold; }
          .item-row span { }
          .item-row span:nth-child(n+2) { text-align: right; } /* Qty, Price, Total right-aligned */
          .total-box, .summary-row {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            padding: 5px 0;
          }
          .summary-row span { text-align: right; }
          hr { border: none; border-top: 1px dashed #000; margin: 5px 0; }
        </style>
      </head>
      <body>
        <h2 class="center">MY STORE</h2>
        <div class="center">${new Date().toLocaleString()}</div>
        <hr>
        <div class="item-header">
          <span>Item</span><span>Qty</span><span>Price</span><span>Total</span>
        </div>
        <hr>
  `);

  cart.forEach((item) => {
    const itemTotal = (item.qty * (item.sellPrice ?? 0)).toFixed(2);
    receiptWindow.document.write(`
      <div class="item-row">
        <span>${item.product_name}</span>
        <span>${item.qty}</span>
        <span>${(item.sellPrice ?? 0).toFixed(2)}</span>
        <span>${itemTotal}</span>
      </div>
    `);
  });

  receiptWindow.document.write(`
    <hr>
    <div class="summary-row"><span>Subtotal:</span><span>Rs. ${subtotal.toFixed(
      2
    )}</span></div>
    <div class="summary-row"><span>Discount:</span><span>${discount}%</span></div>
    <div class="total-box"><span>Total:</span><span>Rs. ${finalTotal.toFixed(
      2
    )}</span></div>
    <div class="summary-row"><span>Cash Given:</span><span>Rs. ${customerCash}</span></div>
    <hr>
    <div class="summary-row"><span>Balance:</span><span>Rs. ${Number(
      balance || 0
    ).toFixed(2)}</span></div>
    <hr>
    <div class="center" style="margin-top:10px;">***** THANK YOU *****</div>
  </body>
  </html>
  `);

  receiptWindow.document.close();
  receiptWindow.focus();
  receiptWindow.print();
  receiptWindow.close();
}
