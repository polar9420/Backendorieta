const socket = io();

socket.on("products", (products) => {
  if(products) {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = "";
    
    products.forEach((product) => {
      const productElement = document.createElement("div");
      productElement.classList = 'card m-2';
      productElement.style = 'width: 18rem';
      productElement.innerHTML = `
      <div class="card-body p-3">
        <h2 class="card-title">${product.title}</h2>
        <p class="card-text">${product.description}</p>
        <p>Precio: <span class="text-success">$${product.price}</span></p>
        <p>Stock: ${product.stock}</p>
        <button class="btn btn-danger" id="deleteButton-${product.id}">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
          <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/>
          <path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/>
        </svg>
        </button>
      </div>
      `;

      const deleteButton = productElement.querySelector(`#deleteButton-${product.id}`);
      deleteButton.addEventListener('click', () => {
        socket.emit('deleteProduct', { id: product.id });
      });

      product.thumbnails.forEach((image) => {
        const imgElement = document.createElement("img");
        imgElement.src = image;
        imgElement.alt = product.title;
        imgElement.classList = 'card-img-top p-3';
        imgElement.style = 'width:150px';
        productElement.appendChild(imgElement);
      });
      productsContainer.appendChild(productElement);
    });
  }
});


const form = document.getElementById("productForm");
const submitButton = document.getElementById("submitForm");

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(event.target);

  fetch("/api/products", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "Success") {
        document.getElementById("result").innerHTML = `
          <div class="alert alert-success" role="alert">
            ${data.response}
          </div>
        `;
        form.reset();
      } else {
        document.getElementById("result").innerHTML = `
          <div class="alert alert-danger" role="alert">
            Error al crear el producto
          </div>
        `;
      }
    })
    .catch((error) => {
      document.getElementById("result").innerHTML = `
        <div class="alert alert-danger" role="alert">
          Error al crear el producto. Error: ${error}
        </div>
      `;
    });
});

socket.on("productCreated", (result) => {
  const resultDiv = document.getElementById("result");
  if (result.success) {
      resultDiv.innerHTML = "Producto creado exitosamente";
  } else {
      resultDiv.innerHTML = "Error al crear el producto: " + result.error;
  }
});