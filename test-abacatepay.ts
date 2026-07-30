import { AbacatePay } from "@abacatepay/sdk";

async function run() {
  try {
    const client = new AbacatePay("abc_dev_mRpGtBDsaj6EAZecUJZzrqex");
    const checkout = await client.billing.create({
      products: [
        {
          externalId: "RECHARGE",
          name: "Recarga de Saldo",
          quantity: 1,
          price: 1500, // R$ 15,00
          description: "Adição de saldo na plataforma"
        }
      ],
      returnUrl: "http://localhost:3000/dashboard",
      completionUrl: "http://localhost:3000/dashboard",
      customerId: "user_test_123"
    });
    console.log(JSON.stringify(checkout, null, 2));
  } catch(e) {
    console.error(e);
  }
}

run();
