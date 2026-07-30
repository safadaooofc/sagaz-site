async function run() {
  const apiKey = "abc_dev_mRpGtBDsaj6EAZecUJZzrqex";
  
  try {
    // 1. Criar ou Obter o Produto de 1 Real
    const prodRes = await fetch("https://api.abacatepay.com/v2/products/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        externalId: "RECHARGE_UNIT",
        name: "Crédito na Plataforma",
        description: "1 Real de Crédito",
        price: 100 // R$ 1,00
      })
    });
    
    let prodData = await prodRes.json();
    console.log("Product:", JSON.stringify(prodData));
    
    // Se o produto já existir, precisaremos pegar o ID dele pela lista.
    // Assumindo que deu certo por agora:
    if (!prodData.data?.id) {
       console.log("Não consegui pegar o ID do produto");
       return;
    }

    const productId = prodData.data.id;

    // 2. Criar Checkout de 50 Reais (quantity = 50)
    const checkRes = await fetch("https://api.abacatepay.com/v2/checkouts/create", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
      body: JSON.stringify({
        items: [{ id: productId, quantity: 50 }],
        frequency: "ONE_TIME",
        methods: ["PIX"],
        returnUrl: "http://localhost:3000/dashboard",
        completionUrl: "http://localhost:3000/dashboard"
      })
    });

    const checkData = await checkRes.json();
    console.log("Checkout:", JSON.stringify(checkData, null, 2));

  } catch(e) {
    console.error("Error:", e);
  }
}

run();
