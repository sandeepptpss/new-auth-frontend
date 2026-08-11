import '../assets/products.css';
import React, {useState, useEffect} from 'react';
const Products =()=>{
const [products, setProducts] = useState([]);
const showProduct = async()=>{
const productApi = await fetch("https://dummyjson.com/products");
const fetchData = await productApi.json();
setProducts(fetchData.products);
}
useEffect(()=>{
  showProduct();
}, [])
return(
<div className='container'>
<div className="item-main-outer">
{products.map((item, i)=>(
<div key={i} className="item-main-inner">
<div className="item-image-wrapper">
<p className="item-availabilityStatus">
  {item.availabilityStatus || "In Stock"}
</p>
<img className="item-thumbnail-images" src={item.images} alt={item.title}/>
</div>
<h2 className="item-title">{item.title}</h2>
<p className="item-price">{item.price}</p>
</div>
 ))}
</div>
</div>
);
}
export default Products;

// import '../assets/products.css';
// import React, { useState, useEffect } from "react";

// const Products = () => {
//   const [products, setProducts] = useState([]);
//   const showProduct = async () => {
//     const productApi = await fetch("https://dummyjson.com/products");
//     const fetchData = await productApi.json();
//     setProducts(fetchData.products);
//   };
//   useEffect(() => {
//     showProduct();
//   }, []);
//   return (
//     <div className="container">
//       <div className="item-main-outer">
//         {products.map((item, i) => (
//           <div key={i} className="item-main-inner">
//             <div className="item-image-wrapper">
//               <p className="item-availabilityStatus">
//                 {item.availabilityStatus || "In Stock"}
//               </p>
//               <img className="item-thumbnail-images" src={item.thumbnail} alt={item.title}/>
//             </div>
//             <h2 className="item-title">{item.title}</h2>
//             <p className="item-rating">{item.rating}</p>
//             <div className="item-tags">
//               {item.tags?.map((tag, index) => (
//                 <span key={index} className="item-tag-badge">
//                   {tag}
//                 </span>))}</div>
//             {/*<p className="item-weight">sku: {item.sku }</p> */}
//             <p className="item-warrantyInformation">
//               {item.warrantyInformation || "No warranty info"}
//             </p>
//            <p className="item-price">${item.price}</p>
//           <div key={i} className="item-main-inner">
//           <button
//             className="add-to-cart-button"
//             onClick={() => alert(`Added "${item.title}" to cart!`)}>Add Item</button>
//           </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };
// export default Products;
