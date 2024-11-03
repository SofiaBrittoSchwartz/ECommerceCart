const cart = {
    contents: new Map(),
    total: 0,
    itemCount: 0,

    makeProductElement(name, price, numItems) {
        /* Item */
        var itemDiv = document.createElement('div');
        itemDiv.className = "item";
        itemDiv.id = `item ${name}`;

        var productSpan = document.createElement('span');
        productSpan.innerHTML = `${name} - $${price * numItems}`;
        itemDiv.appendChild(productSpan);

        /* Buttons */
        var buttonsDiv = document.createElement('div');
        buttonsDiv.className = "buttons";

        var subtractBtn = document.createElement('button');
        subtractBtn.dataset.name = name;
        subtractBtn.id = "subtract btn";
        subtractBtn.innerHTML = '-';

        var productCount = document.createElement('span');
        productCount.id = `num${name}`;
        productCount.innerHTML = numItems;

        var addBtn = document.createElement('button');
        addBtn.dataset.name = name;
        addBtn.dataset.price = price;
        addBtn.id = "add btn"
        addBtn.innerHTML = '+';
        
        /* Append buttons to buttons div */
        buttonsDiv.appendChild(subtractBtn);
        buttonsDiv.appendChild(productCount);
        buttonsDiv.appendChild(addBtn);

        itemDiv.appendChild(buttonsDiv);
        
        /* Remove Button */
        var removeBtn = document.createElement('button');
        removeBtn.id = "remove btn";
        removeBtn.dataset.name = name;
        removeBtn.innerHTML = "Remove";

        itemDiv.appendChild(removeBtn);

        return itemDiv;
    },

    addToCart(item) {
        var elem = this.contents.get(item.name);
       
        if(elem != null) {
            elem.numItems += 1;
            var numCount = document.getElementById("num"+item.name);
            numCount.innerHTML = elem.numItems;
        } else {
            this.contents.set(item.name, {price: item.price, numItems: 1});
            var itemsDiv = document.querySelector('.items');
            var newProductElement = this.makeProductElement(item.name, item.price, 1);
            itemsDiv.appendChild(newProductElement);
        }
        
        this.total += Number(item.price);
        this.updateTotalElem();
        this.itemCount += 1;
        this.updateItemCountElem();
    },

    removeFromCart(itemName) {
        var itemInfo = this.contents.get(itemName);

        if(itemInfo != null) {
            if(itemInfo.numItems > 0) {
                itemInfo.numItems -= 1;

                if(itemInfo.numItems === 0) {
                    this.deleteItem(itemName, false);
                } else {
                    var numCount = document.getElementById("num"+itemName);
                    numCount.innerHTML = itemInfo.numItems;
                }
            }
        }

        this.total -= Number(itemInfo.price);
        this.updateTotalElem();
        this.itemCount -= 1;
        this.updateItemCountElem();
    },

    deleteItem(itemName, fromBtn) {
        var itemInfo = this.contents.get(itemName);

        if(itemInfo != null) {
            this.contents.delete(itemName);
            var elem = document.getElementById(`item ${itemName}`);
            elem.remove();

            // so total isn't double decremented when deleteItem is called from removeFromCart
            if(fromBtn) {
                this.total -= Number(itemInfo.price) * itemInfo.numItems;
                this.updateTotalElem();
                this.itemCount -= itemInfo.numItems;
                this.updateItemCountElem();
            }
        }
    },

    updateTotalElem() {
        var totalSpan = document.getElementById('total');
        totalSpan.innerHTML = this.total.toFixed(2);

    },

    updateItemCountElem() {
        var itemCountElem = document.getElementById('itemCount');
        itemCountElem.innerHTML = this.itemCount;
    },

    loadCart() {
        var cartDiv = document.querySelector('.items');
        
        cartDiv.addEventListener('click', (event) => {
            var target = event.target;

            if(target.tagName === "BUTTON") {
                if(target.id === "add btn") {
                    this.addToCart({name: target.dataset.name, price: target.dataset.price})
                } else if (target.id === "subtract btn") {
                    this.removeFromCart(target.dataset.name);
                } else if (target.id === "remove btn") {
                    this.deleteItem(target.dataset.name, true);
                }
            }
        });
        
        this.contents.forEach((productInfo, productName) => {
            var newProductElement = this.makeProductElement(productName, productInfo.price, productInfo.numItems);
            cartDiv.appendChild(newProductElement);
            this.total += (Number(productInfo.price) * productInfo.numItems)
        });

        this.updateTotalElem();
    }
}

function loadProducts() {
    let products = [
        {name: "Product 1", price: 10.99},
        {name: "Product 2", price: 19.99},
        {name: "Product 3", price: 5.99},
        {name: "Product 4", price: 15.99}
    ]

    var productsDiv = document.querySelector(".products");
    productsDiv.addEventListener('click', (event) => {
        
        if(event.target.tagName === 'BUTTON') {
            var item = event.target.dataset;
            cart.addToCart(item)
        }
        
    });
    
    products.forEach(item => {
        const span = document.createElement('span');
        span.innerHTML = `${item.name} - $${item.price}`;

        const button = document.createElement('button');
        button.innerHTML = "Add to Cart";
        button.dataset.name = item.name;
        button.dataset.price = item.price;

        const product = document.createElement('div');
        product.id = item.name;
        product.className = "item";

        product.appendChild(span);
        product.appendChild(button);

        productsDiv.appendChild(product);
    });
}

function load() {
    loadProducts();
    cart.loadCart();
    cart.addToCart({name: "Product 5", price: 12.99})
}

window.onload = load;