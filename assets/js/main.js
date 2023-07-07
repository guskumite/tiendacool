async function getProducts() {
  try {
    const data = await fetch("./data.json");

    const res = await data.json();

    /* como el catálogo de productos viene de json hay que guardarlo en local storage pero volviendolo string */
    window.localStorage.setItem("products", JSON.stringify(res));

    return res;
  } catch (error) {
    console.log(error);
  }
}

function printProductsInCart(db) {
  /* Aquí inicia lo del video 9 para pintar los productos en el carrito */

  const cartProducts = document.querySelector(".cart__products");

  let html = "";
  let total = 0;
  let carrito = "";

  for (let i = 0; i <= db.cart.length - 1; i++) {
    const { quantity, price, name, image, id, amount } = db.cart[i];

    html += `
      <div class="cart__product">
         <div class="cart__product__img">
            <img src="${image}" alt="imagen" />
         </div>
         <div class="cart__product__body">
            <h4>${name} | $${price} </h4>
            <p> Stock: ${quantity}</p>   
            
            <div class="cart__product__body_op" id="${id}">

              <i class='bx bx-minus'></i>
              <span>${amount} units</span>
              <i class='bx bx-plus'></i>
              <i class='bx bx-trash'></i>
            </div>  
         </div>
       </div>   
      `;
    if (db.cart.length === 0 || html.length < 1) total = 0;
    else total += amount;
    carrito = document.getElementById("carrito");
    if (total !== 0) {
      carrito.innerHTML = "<h3>" + total.toString() + "</h3>";
    } else carrito.innerHTML = "<h3></h3>";
  }

  theTotalizer(db);
  cartProducts.innerHTML = html;
}

function printProducts(db) {
  const productsHTML = document.querySelector(".products");

  let html = "";

  for (const product of db.products) {
    if (product.quantity !== 0) {
      html += `
         <div class="product">
            <div class="product__img">
               <img src="${product.image}" alt="imagen" />
            </div>
            <div class="product__info">
               <h4>${product.name} | <span><b>Stock</b>: ${product.quantity}</h4>   
               <h5>${product.price}
                  <i class='bx bx-plus' id='${product.id}'></i>
               </h5>
             </div>  
         </div>
         `;
    } else
      html += `
  <div class="product">
     <div class="product__img">
        <img src="${product.image}" alt="imagen" />
     </div>
     <div class="product__info">
        <h4>${product.name} | <span><b>Stock</b>: ${product.quantity}</h4>   
        <h5>${product.price}
        <span class='soldOut'> Sold Out / Agotado </span>
        </h5>
      </div>  
  </div>
  `;
  }
  productsHTML.innerHTML = html;
}

function handleShowCart() {
  const iconCartHTML =
    document.querySelector(".bx-cart"); /* el icono selector del carrito */
  const cartHTML =
    document.querySelector(
      ".cart"
    ); /* la franja que muestra el carrito de compras */
  const imageHeader = document.getElementById("ini");  

  iconCartHTML.addEventListener("click", function () {
    cartHTML.classList.toggle("cart__show");
    imageHeader.classList.toggle("hide");
  });
}

function adiciona(product, cart, id) {
  let found = 0;
  let large = cart.length;

  let tmpArray = [product];

  for (let i = 0; i <= large - 1; i++) {
    if (cart[i].id === tmpArray[0].id) {
      found = 1;
    }
  }

  if (found === 1) {
    cart.forEach((element) => {
      if (element.id === id) {
        if (element.amount === tmpArray[0].quantity)
          alert("No tenemos más de ese producto en existencia");
        else element.amount++;
      }
    });
  }

  if (found === 0) {
    cart.push(tmpArray[0]);
    cart[large].amount = 1;
  }
}

function addToCartFromProducts(db) {
  const productsHTML = document.querySelector(".products");

  let mensaje = "";
  productsHTML.addEventListener("click", function (e) {
    if (e.target.classList.contains("bx-plus")) {
      const id = Number(
        e.target.id
      ); /* es la llave de búsqueda para buscar la info del producto */

      let productFind = db.products.find((product) => product.id === id);

      mensaje =
        "Se agrega al carrito: " +
        JSON.stringify(productFind.name) +
        JSON.stringify(productFind.description);
      alert(mensaje);

      /*hay que buscar si el producto ya existía previamente en el carrito */
      /* si ya existe le sumo uno a amount (cantidad), de lo contrario inicializo en 1 */

      adiciona(productFind, db.cart, id);
      db.cart = db.cart.filter(Boolean);

      printProductsInCart(db);

      window.localStorage.setItem("cart", JSON.stringify(db.cart));
    }
  });
}

/* para la funcionalidad de adicionar, quitar o disminuir articulos desde el carrito */

function addDeleteorDiminish(db) {
  const cartProducts = document.querySelector(".cart__products");

  cartProducts.addEventListener("click", function (e) {
    let theKey = Number(e.target.parentElement.id);
    if (e.target.classList.contains("bx-plus")) {
      db.cart.forEach((element) => {
        if (Number(element.id) === theKey) {
          if (element.amount === element.quantity)
            alert("No tenemos más de ese producto en existencia");
          else element.amount++;
        }
      });
      db.cart = db.cart.filter((item) => item.amount !== 0);
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProductsInCart(db);
    }
    if (e.target.classList.contains("bx-minus")) {
      db.cart.forEach((element) => {
        if (Number(element.id) === theKey) {
          if (element.amount > 1) element.amount--;
        }
      });
      db.cart = db.cart.filter((item) => item.amount !== 0);
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProductsInCart(db);
    }
    if (e.target.classList.contains("bx-trash")) {
      const response = confirm("¿Estás seguro de eliminar este producto?");
      if (!response) return;
      db.cart.forEach((element) => {
        if (Number(element.id) === theKey) {
          element.amount = 0;
        }
      });
      db.cart = db.cart.filter((item) => item.amount !== 0);
      window.localStorage.setItem("cart", JSON.stringify(db.cart));
      printProductsInCart(db);
    }
  });
  db.cart = db.cart.filter((item) => item.amount !== 0);
  window.localStorage.setItem("cart", JSON.stringify(db.cart));
  printProductsInCart(db);
}

function theTotalizer(db) {
  const infoTotal = document.getElementById("info__total");
  const infoAmount = document.getElementById("info__amount");

  let totalProducts = 0;
  let totalAmount = 0;

  for (const product in db.cart) {
    const { amount, price } = db.cart[product];

    totalProducts += price * amount;
    totalAmount += amount;

    infoTotal.textContent = "$" + totalProducts.toFixed(2);
    infoAmount.textContent = totalAmount + " units";
  }
}

function theCartCheckOut(db) {
  const btnBuy = document.querySelector(".btn__buy");
  btnBuy.addEventListener("click", function () {
    if (!Object.values(db.cart).length)
      return alert(
        "Recuerda adicionar artículos en el carrito para poder efectuar la compra"
      );
    const response = confirm("¿Seguro que quieres comprar?");
    if (!response) return;

    /* voy a iterar y a restar lo que se compró para disminuir la cantidad en products */

    for (const product of db.products) {
      for (const item of db.cart) {
        if (product.id === item.id) {
          product.quantity = product.quantity - item.amount;
        }
      }
    }

    db.cart = [];

    window.localStorage.setItem("products", JSON.stringify(db.products));
    window.localStorage.setItem("cart", JSON.stringify(db.cart));

    theTotalizer(db);
    printProductsInCart(db);
    printProducts(db);
  });
}

function desplazar() {
  window.addEventListener('scroll', function() {
    let nav = document.getElementById('main-nav');
    let headerContent = document.querySelector('.header');
    let ima = document.getElementById('ini');
    let idx4 = document.getElementById('idx4');
    let idx5 = document.getElementById('idx5');
    let idx6 = document.getElementById('idx6');
    let idx7 = document.getElementById('idx7');
    let idx8 = document.getElementById('idx8');
    
    if (window.scrollY > 0) {
        nav.classList.add('scrolled');
        ima.innerHTML = ``;
        idx4.innerHTML = '<p></p>';
        idx5.innerHTML = '<p></p>';
        idx6.innerHTML = '<p></p>';
        idx7.innerHTML = '<p></p>';
        idx8.innerHTML = '<p></p>';
      
    } else {
        nav.classList.remove('scrolled');
        ima.innerHTML = `<img src="./assets/img/sweater2.png" width="340" height="340">`;
        idx4.innerHTML = `<p id="idx4">New Sweatshirt</p>`;
        idx5.innerHTML = `<p id="idx5">COLLECTIONS 2023</p>`;
        idx6.innerHTML = `<p id="idx6">Latest arrival of the new Hanes Midweight Crewneck sweatshirt</p>`;
        idx7.innerHTML = `<p id="idx7">imported from the 2023 series, with a modern design.</p>`; 
        idx8.innerHTML = `<p id="idx8">$14.00</p>`;
        
        
        

      }
});

}


(async () => {
  const db = {
    products:
      JSON.parse(window.localStorage.getItem("products")) ||
      (await getProducts()),
    cart: JSON.parse(window.localStorage.getItem("cart")) || [],
  };

  desplazar();
  printProducts(db);
  handleShowCart();

  addToCartFromProducts(db);

  printProductsInCart(db);

  addDeleteorDiminish(db);

  theTotalizer(db);
  theCartCheckOut(db);
})();

/* let products = [
  {
    id: 1,
    name: "Camiseta de manga corta con cuello redondo",
    price: 10,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/shirt1_prckre.png",
    category: "shirt",
    quantity: 5,
    description:
      "Esta camiseta básica presenta un corte regular y un cuello redondo clásico. Es ideal para el uso diario y se puede combinar con una amplia variedad de looks.",
  },
  {
    id: 2,
    name: "Camiseta de manga larga con estampado gráfico",
    price: 15,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/shirt2_av4jld.png",
    category: "shirt",
    quantity: 3,
    description:
      "Perfecta para un look casual, esta camiseta de manga larga presenta un estampado gráfico llamativo en el pecho. Su ajuste regular y suave tejido de algodón la hacen cómoda y fácil de usar.",
  },
  {
    id: 3,
    name: "Camiseta con detalle de encaje",
    price: 12,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/shirt3_wlm0h3.png",
    category: "shirt",
    quantity: 2,
    description:
      "Esta camiseta presenta un detalle de encaje en el escote y mangas. Su ajuste regular y tela suave la hacen cómoda y fácil de usar para cualquier ocasión.",
  },
  {
    id: 4,
    name: "Camiseta de tirantes con espalda cruzada",
    price: 8,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/shirt4_cypl6n.png",
    category: "shirt",
    quantity: 10,
    description:
      "Con un toque de estilo femenino, esta camiseta de tirantes presenta una espalda cruzada con detalle de encaje. El ajuste es regular y la tela suave y cómoda.",
  },
  {
    id: 5,
    name: "Camiseta con hombros descubiertos",
    price: 12,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/shirt5_cnwq0w.png",
    category: "shirt",
    quantity: 6,
    description:
      "Con un toque femenino y coqueto, esta camiseta presenta hombros descubiertos y un ajuste regular. Su tela suave y transpirable la hace ideal para los días calurosos.",
  },
  {
    id: 6,
    name: "Camiseta con cuello alto y manga larga",
    price: 18,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270465/eCommerce/shirt6_pnwws6.png",
    category: "shirt",
    quantity: 4,
    description:
      "Esta camiseta de manga larga presenta un cuello alto y ajuste regular. Es ideal para un look elegante y cómodo.",
  },
  {
    id: 7,
    name: "Camiseta con cuello en V y manga corta",
    price: 9,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270450/eCommerce/shirt7_ofhlzd.png",
    category: "shirt",
    quantity: 8,
    description:
      "Esta camiseta clásica presenta un corte regular, cuello en V y mangas cortas. Es fácil de usar y combinar con diferentes looks.",
  },
  {
    id: 8,
    name: "Hoddie con estampado de leopardo",
    price: 20,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270465/eCommerce/hoddie4_wvwaiv.png",
    category: "hoddie",
    quantity: 8,
    description:
      "Este hoddie presenta un estampado de leopardo y está hecho de una mezcla suave de algodón y poliéster. Es ideal para un look casual y cómodo.",
  },
  {
    id: 9,
    name: "Hoddie con cremallera",
    price: 25,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270465/eCommerce/hoddie3_xboa0e.png",
    category: "hoddie",
    quantity: 10,
    description:
      "Este hoddie presenta una cremallera frontal y bolsillos laterales. Está hecho de una mezcla de algodón y poliéster para mayor comodidad y durabilidad.",
  },
  {
    id: 10,
    name: "Hoddie con capucha y cordón ajustable",
    price: 30,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270465/eCommerce/hoddie2_utnolh.png",
    category: "hoddie",
    quantity: 6,
    description:
      "Este hoddie presenta una capucha con cordón ajustable y un corte holgado para mayor comodidad. Está hecho de una mezcla suave de algodón y poliéster.",
  },
  {
    id: 11,
    name: "Hoddie con estampado de marca",
    price: 35,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270465/eCommerce/hoddie1_sxv2ce.png",
    category: "hoddie",
    quantity: 4,
    description:
      "Este hoddie presenta un estampado de marca en la parte delantera y está hecho de una mezcla suave de algodón y poliéster. Es ideal para un look casual y moderno.",
  },
  {
    id: 12,
    name: "Hoddie con cierre de botones",
    price: 40,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/hoddie5_sqnwic.png",
    category: "hoddie",
    quantity: 3,
    description:
      "Este hoddie presenta un cierre de botones en la parte delantera y bolsillos laterales. Está hecho de una mezcla suave de algodón y poliéster para mayor comodidad y durabilidad.",
  },
  {
    id: 13,
    name: "Hoddie con estampado de camuflaje",
    price: 45,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270464/eCommerce/hoddie6_i7gdrl.png",
    category: "hoddie",
    quantity: 7,
    description:
      "Este hoddie presenta un estampado de camuflaje y está hecho de una mezcla suave de algodón y poliéster. Es ideal para un look casual y moderno.",
  },
  {
    id: 14,
    name: "Sweater de punto grueso",
    price: 10,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270450/eCommerce/sweater1_o8qh0p.png",
    category: "sweater",
    quantity: 5,
    description:
      "Este sweater de punto grueso es ideal para los días fríos. Está hecho de una mezcla suave de lana y acrílico para mayor comodidad y calidez.",
  },
  {
    id: 15,
    name: "Sweater de cuello alto",
    price: 15,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270450/eCommerce/sweater2_y7yzqs.png",
    category: "sweater",
    quantity: 7,
    description:
      "Este sweater de cuello alto está hecho de una mezcla suave de lana y acrílico para mayor comodidad y calidez. Es ideal para un look elegante y cálido.",
  },
  {
    id: 16,
    name: "Sweater de tejido fino",
    price: 20,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270450/eCommerce/sweater3_nnfctl.png",
    category: "sweater",
    quantity: 3,
    description:
      "Este sweater de tejido fino es ideal para los días frescos. Está hecho de una mezcla suave de lana y acrílico para mayor comodidad y calidez.",
  },
  {
    id: 17,
    name: "Sweater con estampado de rayas",
    price: 25,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270450/eCommerce/sweater4_kxcvab.png",
    category: "sweater",
    quantity: 6,
    description:
      "Este sweater presenta un estampado de rayas en la parte delantera y está hecho de una mezcla suave de lana y acrílico para mayor comodidad y calidez. Es ideal para un look casual y moderno.",
  },
  {
    id: 18,
    name: "Sweater con cuello redondo",
    price: 30,
    image:
      "https://res.cloudinary.com/duu1imwxs/image/upload/v1677270450/eCommerce/sweater5_hj94db.png",
    category: "sweater",
    quantity: 4,
    description:
      "Este sweater con cuello redondo está hecho de una mezcla suave de lana y acrílico para mayor comodidad y calidez. Es ideal para un look casual y cómodo.",
  },
];

*/
