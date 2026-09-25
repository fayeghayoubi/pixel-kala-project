import { getMe, } from "./auth.js";
import { isLogin, getUrlParam, starsFromRating } from "./utils.js";

let currentQty = 1



const showUserInNavbar = () => {
    const navBarProfileBox = document.querySelector("#main-header__profile");
    const isUserLogin = isLogin();

    if (isUserLogin) {
        const userInfos = getMe().then((data) => {
            const identity = data.data;
            navBarProfileBox.innerHTML = `<span>${identity.name} </span>`
            navBarProfileBox.addEventListener('click',(event)=>{
                navBarProfileBox.setAttribute('href', 'dashboard.html')
                
            })
        })
    } else {
        navBarProfileBox.setAttribute('href', 'login.html')
        navBarProfileBox.innerHTML = `<span> ثبت نام / ورود </span>`

    }
}

const getAndShowAllProducts = async () => {
    const productsContainer = document.querySelector("#featuredProducts")

    const res = await fetch(`http://localhost:4000/api/products`)
    const result = await res.json()
    const products = result.data
    console.log(products);

    products.slice(0, 4).map((product) => {

        const flag =
            product.discountPercent > 0
                ? `<span class="tag-flag">${product.discountPercent}٪ تخفیف</span>`
                : product.isNew
                    ? '<span class="tag-flag">جدید</span>'
                    : '';
        productsContainer.insertAdjacentHTML('beforeend',
            `
            <div class="col-6 col-lg-3">
              <div class="product-card">
                <div class="thumb">
                  ${flag}
                  <img src="${product.images[0]} " alt="${product.name} ">
                </div>
                <div class="body">
                  <div class="stars mb-1">
                  ★★★★★ 
                  <span class="text-muted small">${product.rating} </span></div>
                  <a href="product.html?slug=${product.slug} " class="fw-bold d-block mb-2">${product.name} </a>
                  <div class="d-flex align-items-center gap-2">
                    <span class="price">${product.price.toLocaleString('fa-IR')} </span>
                  </div>
                </div>
              </div>
            </div>
            `
        )
    })
}

const getandShowAllCategory = async () => {
    const categoriesContainer = document.querySelector("#categoriesGrid")

    const res = await fetch(`http://localhost:4000/api/categories`)
    const result = await res.json()
    const categories = result.data
    console.log(categories);


    categories.forEach((category) => {

        categoriesContainer.insertAdjacentHTML('beforeend',
            `
                <div class="col-6 col-md-3">
                   <a href="index.html#products" class="category-card d-block">
                     <div class="icon-wrap">${category.icon} </div>
                     <div class="fw-bold">${category.name} </div>
                   </a>
                </div>
            `
        )
    })



}

const getProductsDetails = async () => {
    const productShortSlug = getUrlParam('slug');
    const mainImage = document.querySelector("#mainImage")

    const breadcrumbCategory = document.querySelector("#breadcrumbCategory")
    const breadcrumbName = document.querySelector("#breadcrumbName")
    const productBrand = document.querySelector("#productBrand")
    const productName = document.querySelector("#productName")
    const productStars = document.querySelector("#productStars")
    const productRatingText = document.querySelector("#productRatingText")
    const productDescription = document.querySelector("#productDescription")
    const productDescriptionFull = document.querySelector("#productDescriptionFull")
    const productPrice = document.querySelector("#productPrice")
    const oldPriceEl = document.querySelector('#productOldPrice');
    const flagEl = document.querySelector('#discountFlag');
    const galleryThumbs = document.querySelector('#galleryThumbs')
    const galleryImages = document.querySelectorAll('.gallery-thumb ')

    const res = await fetch(`http://localhost:4000/api/products/${productShortSlug} `)
    const result = await res.json();
    const product = result.data
    console.log(product);

    const reviewsTabCount = document.querySelector('#reviewsTabCount')
    reviewsTabCount.innerHTML = product.reviewsCount

    mainImage.setAttribute('src', product.images[0])


    const images = product.images && product.images.length ? product.images : [''];
    console.log(images);

    galleryThumbs.innerHTML = images.map((img, i) => `
    <div class="col-3">
      <div class="gallery-thumb ${i === 0 ? 'active' : ''}" data-image="${img}">
        <img src="${img}" alt="تصویر ${i + 1}">
      </div>
    </div>
  `).join('');

    document.querySelectorAll('.gallery-thumb').forEach((thumb) => {
        thumb.addEventListener('click', () => {
            mainImage.setAttribute('src', thumb.dataset.image);

            // کلاس active رو جابه‌جا کن تا مشخص بشه کدوم انتخاب شده
            document.querySelectorAll('.gallery-thumb').forEach((t) => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    breadcrumbCategory.innerHTML = product.category ? product.category.name : '';
    breadcrumbName.innerHTML = product.name;
    productBrand.innerHTML = product.brand || ''
    productName.innerHTML = product.name
    productStars.innerHTML = starsFromRating(product.rating)
    productRatingText.innerHTML = `${product.rating} از ۵ — بر اساس ${product.reviewsCount} نظر`
    productDescription.innerHTML = product.description;
    productDescriptionFull.innerHTML = product.description;

    productPrice.innerHTML = product.price.toLocaleString('fa-IR')
    if (product.oldPrice) {
        oldPriceEl.innerHTML = formatPrice(product.oldPrice);
        flagEl.innerHTML = `${product.discountPercent}٪ تخفیف`;
        flagEl.hidden = false;
    } else {
        oldPriceEl.textContent = '';
        flagEl.hidden = true;
    }

    const features = product.specs
    console.log(features);
    const featureContainer = document.querySelector('#featureLines')
    features.slice(0, 3).map((spec) => {
        featureContainer.insertAdjacentHTML('beforeend', `
        <div class="ico">✅</div>
        <div>
          <div class="fw-bold">${spec.label}</div>
          <div class="text-muted small">${spec.value}</div>
        </div>
        `
        )
    })

    const specsTable = document.getElementById('specsTable');
    specsTable.innerHTML = (product.specs || [])
        .map((spec) => `<tr><td>${spec.label}</td><td>${spec.value}</td></tr>`)
        .join('') || '<tr><td colspan="2" class="text-muted">مشخصاتی ثبت نشده</td></tr>';

    getRelatedProducts(product._id)

}


const setupQtyStepper = () => {
    document.getElementById('qtyMinus').addEventListener('click', () => {
        if (currentQty > 1) currentQty -= 1;
        document.getElementById('qtyValue').textContent = currentQty;
    });
    document.getElementById('qtyPlus').addEventListener('click', () => {
        currentQty += 1;
        document.getElementById('qtyValue').textContent = currentQty;
    });
}

const getRelatedProducts = async (productID) => {
    const relatedProductsWrapper = document.querySelector('#relatedProducts')
    console.log(productID);

    const res = await fetch(`http://localhost:4000/api/products/${productID}/related`)
    console.log(res);
    
    const result = await res.json()
    console.log(result);
    
    if (result.length) {
        const relatedProduct = result.data
        relatedProduct.map((product) => {

            const flag = product.discountPercent > 0 ?
                `<span class="tag-flag">${product.discountPercent}٪ تخفیف</span>`
                : product.isNew
                    ? '<span class="tag-flag">جدید</span>'
                    : '';
            relatedProductsWrapper.insertAdjacentHTML('beforeend',
                `
            <div class="col-6 col-lg-3">
              <div class="product-card">
                <div class="thumb">
                  ${flag}
                  <img src="${product.images[0]} " alt="${product.name} ">
                </div>
                <div class="body">
                  <div class="stars mb-1">
                  ★★★★★ 
                  <span class="text-muted small">${product.rating} </span></div>
                  <a href="product.html?slug=${product.slug} " class="fw-bold d-block mb-2">${product.name} </a>
                  <div class="d-flex align-items-center gap-2">
                    <span class="price">${product.price.toLocaleString('fa-IR')} </span>
                  </div>
                </div>
              </div>
            </div>
            `
            )
        })
    } else{
        relatedProductsWrapper.insertAdjacentHTML('beforeend',`
            
            <div class="col-12 text-muted small">محصول مشابهی یافت نشد.</div>
            `)
    }
}


    


export {
    showUserInNavbar,
    getAndShowAllProducts,
    getandShowAllCategory,
    getProductsDetails,
    setupQtyStepper,
}