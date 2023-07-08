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

function printProducts(db, dbfilter) {
  const productsHTML = document.querySelector(".products");

  let html = "";
  
  for (const product of db.products) {
    if (dbfilter === "all") {
       if (product.quantity !== 0) {
          html += `
             <div class="product">
             <div class="product__img">
                <img src="${product.image}" alt="imagen" />
             </div>
             <div class="product__info">
                 <h4 class="producto" id="${product.id}">${product.name} | <span><b>Stock</b>: ${product.quantity}</h4>   
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
                   <h4 class="producto" id="${product.id}">${product.name} | <span><b>Stock</b>: ${product.quantity}</h4>   
                   <h5>${product.price}
                      <span class='soldOut'> Sold Out / Agotado </span>
                   </h5>
                </div>  
              </div>
  `;
  } else
    if (product.category === dbfilter) {
      if (product.quantity !== 0) {
        html += `
           <div class="product">
           <div class="product__img">
              <img src="${product.image}" alt="imagen" />
           </div>
           <div class="product__info">
               <h4 class="producto" id="${product.id}">${product.name} | <span><b>Stock</b>: ${product.quantity}</h4>   
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
                 <h4 class="producto" id="${product.id}">${product.name} | <span><b>Stock</b>: ${product.quantity}</h4>   
                 <h5>${product.price}
                    <span class='soldOut'> Sold Out / Agotado </span>
                 </h5>
              </div>  
            </div>
`;  
    }  
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
  const imageHeader = document.querySelector('.ini'); 

  iconCartHTML.addEventListener("click", function () {
    cartHTML.classList.toggle("cart__show");
    if (oculto === 0)
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
    printProducts(db,productFilter);
  });
}

function desplazar() {
  window.addEventListener('scroll', function() {
    let nav = document.getElementById('main-nav');
    let headerContent = document.querySelector('.header');
    let ima = document.querySelector('.ini');
    let bot = document.querySelector('.more');
    let fltA = document.querySelector('.filterA');
    let fltB = document.querySelector('.filterB');
    let fltC = document.querySelector('.filterC');
    let fltD = document.querySelector('.filterD');
    let idx4 = document.getElementById('idx4');
    let idx5 = document.getElementById('idx5');
    let idx6 = document.getElementById('idx6');
    let idx7 = document.getElementById('idx7');
    let idx8 = document.getElementById('idx8');
    
    if (window.scrollY > 0) {
        nav.classList.add('scrolled');
        ima.classList.add('hide');
        oculto = 1;
        bot.classList.add('hide');
        fltA.classList.add('hide');
        fltB.classList.add('hide');
        fltC.classList.add('hide');
        fltD.classList.add('hide');
        idx4.innerHTML = '<p></p>';
        idx5.innerHTML = '<p></p>';
        idx6.innerHTML = '<p></p>';
        idx7.innerHTML = '<p></p>';
        idx8.innerHTML = '<p></p>';
      
    } else {
        nav.classList.remove('scrolled');
        ima.classList.remove('hide');
        oculto = 0;
        bot.classList.remove('hide');
        fltA.classList.remove('hide');
        fltB.classList.remove('hide');
        fltC.classList.remove('hide');
        fltD.classList.remove('hide');
        idx4.innerHTML = `<p id="idx4">New Sweatshirt</p>`;
        idx5.innerHTML = `<p id="idx5">COLLECTIONS 2023</p>`;
        idx6.innerHTML = `<p id="idx6">Latest arrival of the new Hanes Midweight Crewneck sweatshirt</p>`;
        idx7.innerHTML = `<p id="idx7">imported from the 2023 series, with a modern design.</p>`; 
        idx8.innerHTML = `<p id="idx8">$14.00</p>`;
        
        
        

      }
});

}

function Statistics(db) {

    let shirts = 0;
     let hoddies = 0;
     let sweaters = 0;

     let htmlfilterB = "";
     let htmlfilterC = "";
     let htmlfilterD = "";

     const HTMLfltB = document.querySelector('.filterB');
     const HTMLfltC = document.querySelector('.filterC');
     const HTMLfltD = document.querySelector('.filterD');

     for (product of db.products) {
        if (product.category === "shirt") {
           shirts++;
        }
        if (product.category === "hoddie") {
           hoddies++;
        }
        if (product.category === "sweater") {
           sweaters++;
        }

      }  

      htmlfilterB = `Shirts <br> ${shirts} products`;
      htmlfilterC = `Hoddies <br> ${hoddies} products`;
      htmlfilterD = `Sweaters <br> ${sweaters} products`;
      
      HTMLfltB.innerHTML = htmlfilterB;
      HTMLfltC.innerHTML = htmlfilterC;
      HTMLfltD.innerHTML = htmlfilterD;
}

function infoProducto(id, productos) {
    for (producto of productos) {
       if (producto.id === Number(id)) {
          return alert(producto.name + ". "+ producto.description); 
       }
    }
}

(async () => {
  const db = {
    products:
      JSON.parse(window.localStorage.getItem("products")) ||
      (await getProducts()),
    cart: JSON.parse(window.localStorage.getItem("cart")) || [],
  };

  let productFilter = "all";
  let oculto = 0;

  desplazar();
  printProducts(db,productFilter);
  handleShowCart();

  addToCartFromProducts(db);

  printProductsInCart(db);

  addDeleteorDiminish(db);

  theTotalizer(db);
  theCartCheckOut(db);
  Statistics(db);

  let btnfltA = document.querySelector('.filterA');
  btnfltA.addEventListener("click", function () { productFilter = "all"; printProducts(db,productFilter) });
  let btnfltB = document.querySelector('.filterB');
  btnfltB.addEventListener("click", function () { productFilter = "shirt"; printProducts(db,productFilter) });
  let btnfltC = document.querySelector('.filterC');
  btnfltC.addEventListener("click", function () { productFilter = "hoddie"; printProducts(db,productFilter) });
  let btnfltD = document.querySelector('.filterD');
  btnfltD.addEventListener("click", function () { productFilter = "sweater"; printProducts(db,productFilter) });

  btnmodo = document.getElementById('modo');
  btnmodo.addEventListener("click", function () { HTML1 = document.querySelector('body'); HTML1.classList.toggle('dark_mode'); });

  const donde = document.querySelector(".products");

  donde.addEventListener("click", function (e) {
    if (e.target.classList.contains("producto")) { infoProducto(e.target.id, db.products); }});

  
  
})();

