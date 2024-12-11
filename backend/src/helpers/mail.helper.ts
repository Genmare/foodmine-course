import { getClient } from "../configs/mail.config";
import { Order } from "../models/order.model";

export const sendEmailReceipt = function (order: any) {
  const mailClient = getClient();

  mailClient.messages
    .create("sandbox9b96449404db4bd8b8dc335dedf8ebcb.mailgun.org", {
      from: "orders@foodmine.com",
      to: order.user.email,
      subject: `Order ${order.id} is being processed`,
      html: getReceiptHtml(order),
    })
    .then(msg => console.log(msg))
    .catch(err => console.log(err));
};

const getReceiptHtml = function (order: Order) {
  return `
  <html>
  <head>
    <style>
      table {
        border-collapse: collapse;
        max-width: 35rem;
        width: 100%;
      }
      th, td {
        text-align: left;
        padding: 8px;
      }
      th {
        border-bottom: 1px solid #dddddd;
      }
    </style>
  </head>
  <body>
    <h1>Order Payment Confirmation</h1>
    <p>Dear ${order.name},</p>
    <p>Thank you for choosing us! Your order has been successfully paid and is now being processed</p>
    <p><strong>Tracking ID:</strong> ${order.id}</p>
    <p><strong>Order Date:<strong> ${order.createdAt
      .toISOString()
      .replace("T", " ")
      .substring(0, 16)}</p>
    <h2> Order Details</h2>
    <table>
    <thead>
    <tr>
    <th>Item</th>
    <th>Unit Price</th>
    <th>Quantity</th>
    <th>Total Price</th>
    </tr>
    </thead>
    <tbody>
    ${order.items
      .map(
        item =>
          `
          <tr>
          <td>${item.food.name}</td>
          <td>$${item.food.price}</td>
          <td>${item.quantity}</td>
          <td>$${item.price.toFixed(2)}</td>
          </tr>
        `
      )
      .join("\n")}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="3"><strong>Total:</strong></td>
    <td>$${order.totalPrice}</td>
    </tr>
    </tfoot>
    </table>
    <p><strong>Shipping Address:</strong> ${order.address}</p>
  </body>
  </html>
  `;
};
