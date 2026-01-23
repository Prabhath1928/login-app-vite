import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);    
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);
  const { id } = useParams();   // dynamic product id from URL


  const [editProduct, setEditProduct] = useState({
  id: "",
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  rating: { rate: "", count: "" }
});

const [newProduct, setNewProduct] = useState({
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
  rating: { rate: "", count: "" }
});

  useEffect(() => {
  const token = localStorage.getItem("token");
  if (!token) navigate("/", { replace: true });

  axios.get("https://fakestoreapi.com/products")
    .then(response => {
      setProducts(response.data);
      setLoading(false);
    })
    .catch(error => {
      console.error("Error fetching products:", error);
      setLoading(false);
    });

}, [navigate]);

  const handleEditChange = (e) => {
  const { name, value } = e.target;

  if (name === "rate" || name === "count") {
    setEditProduct({
      ...editProduct,
      rating: { ...editProduct.rating, [name]: value }
    });
  } else {
    setEditProduct({ ...editProduct, [name]: value });
  }
};

const handleUpdateProduct = () => {
 
  const updatedProduct = {
    ...selectedProduct,
    ...editProduct,
    price: Number(editProduct.price)
  };

  axios.put(`https://fakestoreapi.com/products/${editProduct.id}`, {
    title: updatedProduct.title,
    price: updatedProduct.price,
    description: updatedProduct.description,
    image: updatedProduct.image,
    category: updatedProduct.category
  })
  .then(() => {

    const updatedList = products.map(p =>
      p.id === updatedProduct.id ? updatedProduct : p
    );

    setProducts(updatedList);
    setSelectedProduct(updatedProduct);
    setShowEditPopup(false);   
  })
  .catch(error => {
    console.error("Error updating product:", error);
  });
};

  const handleConfirmLogout = () => {
    localStorage.removeItem("token");
    navigate("/", { replace: true });
  };
const handleAddChange = (e) => {
  const { name, value } = e.target;

  if (name === "rate" || name === "count") {
    setNewProduct({
      ...newProduct,
      rating: { ...newProduct.rating, [name]: value }
    });
  } else {
    setNewProduct({ ...newProduct, [name]: value });
  }
};

const handleAddProduct = () => {
  axios.post("https://fakestoreapi.com/products", {
    title: newProduct.title,
    price: Number(newProduct.price),
    description: newProduct.description,
    image: newProduct.image,
    category: newProduct.category
  })
  .then(response => {
    const addedProduct = response.data;

    // Add API response product to UI list
    setProducts([addedProduct, ...products]);

    setShowAddDrawer(false);

    // Reset form
    setNewProduct({
      title: "",
      price: "",
      description: "",
      category: "",
      image: "",
      rating: { rate: "", count: "" }
    });
  })
  .catch(error => {
    console.error("Error adding product:", error);
  });
};

const handleDeleteProduct = () => {
  if (!id) return;

  axios.delete(`https://fakestoreapi.com/products/${id}`)
    .then(() => {
      setProducts(products.filter(p => p.id !== Number(id)));
      setShowDeletePopup(false);
      navigate("/products");
    })
    .catch(err => {
      console.error("Delete error:", err);
    });
};


useEffect(() => {
  if (id) {
    axios.get(`https://fakestoreapi.com/products/${id}`)
      .then(response => {
        setSelectedProduct(response.data);

        setEditProduct({
          id: response.data.id,
          title: response.data.title,
          price: response.data.price,
          description: response.data.description,
          category: response.data.category,
          image: response.data.image,
          rating: response.data.rating || { rate: "", count: "" }
        });
      })
      .catch(error => {
        console.error("Error fetching single product:", error);
      });
  }
}, [id]);

if (id && selectedProduct) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col lg:flex-row relative">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-20">
        <button
          onClick={() => navigate("/products")}
          className="px-5 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shadow-md cursor-pointer"
        >
          ← Back to Products
        </button>
      </div>

      {/* Left Side: Image Centered Vertically and Horizontally */}
      <div className="w-full lg:w-1/2 h-[280px] lg:h-full bg-gradient-to-br from-indigo-50 to-sky-100 flex items-center justify-center p-6 lg:p-12">
        <img 
          src={selectedProduct.image} 
          alt={selectedProduct.title}
          className="max-h-[80%] max-w-full object-contain" 
        />
      </div>

      {/* Right Side: Full Height Details */}
      <div className="w-full lg:w-1/2 px-6 py-6 lg:px-12 lg:py-10 flex flex-col justify-between bg-white lg:border-l border-slate-100">
        {!showEditPopup ? (
          <>
            {/* Top Section */}
            <div className="overflow-y-auto pr-2">
              <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-wider rounded-full select-none">
                {selectedProduct.category}
              </span>

              <h2 className="text-3xl font-bold mt-4 mb-3 text-slate-900 leading-tight select-none">
                {selectedProduct.title}
              </h2>

              <p className="text-slate-600 mb-6 text-base leading-relaxed select-none">
                {selectedProduct.description}
              </p>

              <div className="flex flex-col gap-4 select-none">
                <p className="text-3xl font-bold text-indigo-700">
                  ₹ {selectedProduct.price}
                </p>
                
                <div className="flex items-center gap-3 text-slate-600 text-sm font-medium">
                  <div className="flex items-center gap-1.5 bg-amber-50 text-amber-700 px-3 py-1 rounded-lg">
                    <span className="text-base">★</span>
                    <span>{selectedProduct.rating?.rate || "0.0"}</span>
                  </div>
                  <span className="text-slate-300">|</span>
                  <div className="bg-slate-50 px-3 py-1 rounded-lg">
                    <span>{selectedProduct.rating?.count || "0"} in stock</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-50">
              <button
                onClick={() => setShowEditPopup(true)}
                className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg cursor-pointer"
              >
                Edit Product
              </button>

              <button
                onClick={() => setShowDeletePopup(true)}
                className="flex-1 py-3.5 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition shadow-lg cursor-pointer"
              >
                Delete Product
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col h-full justify-between overflow-hidden">
            {/* Top Section: Edit Form */}
            <div className="overflow-y-auto pr-2 custom-scrollbar">
              <h3 className="text-2xl font-bold mb-6 text-slate-900">Edit Product</h3>

              <div className="space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Title</label>
                  <input
                    name="title"
                    value={editProduct.title}
                    onChange={handleEditChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Price</label>
                    <input
                      name="price"
                      type="number"
                      value={editProduct.price}
                      onChange={handleEditChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Category</label>
                    <input
                      name="category"
                      value={editProduct.category}
                      onChange={handleEditChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Image URL</label>
                  <input
                    name="image"
                    value={editProduct.image}
                    onChange={handleEditChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-500 ml-1">Description</label>
                  <textarea
                    name="description"
                    rows="3"
                    value={editProduct.description}
                    onChange={handleEditChange}
                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Rating</label>
                    <input
                      name="rate"
                      value={editProduct.rating?.rate}
                      onChange={handleEditChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-slate-500 ml-1">Stock</label>
                    <input
                      name="count"
                      value={editProduct.rating?.count}
                      onChange={handleEditChange}
                      className="w-full border border-slate-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Section: Edit Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mt-6 pt-6 border-t border-slate-50">
              <button
                onClick={handleUpdateProduct}
                className="flex-1 py-3.5 bg-indigo-600 text-white rounded-xl font-semibold hover:bg-indigo-700 transition shadow-lg cursor-pointer"
              >
                Save Changes
              </button>

              <button
                onClick={() => setShowEditPopup(false)}
                className="flex-1 py-3.5 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">Delete Product?</h3>
            <p className="text-slate-600 mb-8">Are you sure you want to delete "{selectedProduct.title}"? This action cannot be undone.</p>
            <div className="flex gap-4">
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-3 bg-red-500 text-white rounded-xl font-semibold hover:bg-red-600 transition cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-200 to-blue-100 no-scrollbar overflow-y-scroll">

      <Navbar 
       onLogout={() => setShowLogoutPopup(true)} 
      />


     <header className="pt-24 sm:pt-32 pb-10 px-4 sm:px-6">
  <div className="max-w-9xl mx-auto flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">

    <div>
      <h1 className="text-4xl font-bold text-indigo-700 tracking-tight">
        Product Dashboard
      </h1>
      <p className="mt-2 text-slate-600">
        Manage and monitor your inventory
      </p>
    </div>

    <button
      onClick={() => setShowAddDrawer(true)}
      className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow-lg
                 hover:bg-indigo-700 transition font-medium
                 cursor-pointer"
    >
      + Add Product
    </button>

  </div>
</header>

      <main className="max-w-9xl mx-auto px-4 sm:px-6 pb-20">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
            <p className="text-slate-500">Loading products...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {products.map(product => (
              <div
                key={product.id}
                className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden flex flex-col"
              >
                <div className="h-52 sm:h-64 bg-gradient-to-br from-indigo-50 to-sky-100 flex items-center justify-center p-6 sm:p-8">
                  <img
                    src={product.image}
                    alt={product.title}
                    className="max-h-full object-contain hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <span className="text-[11px] uppercase tracking-widest text-indigo-500 font-semibold mb-2">
                    {product.category}
                  </span>

                  <h3 className="text-sm font-semibold text-slate-800 line-clamp-2 mb-4">
                    {product.title}
                  </h3>

                  <div className="mt-auto pt-4 border-t flex items-center justify-between">
                    <span className="text-lg font-bold text-indigo-700">
                      ₹{product.price}
                    </span>

                    <button
                      onClick={() => navigate(`/products/${product.id}`)}
                      className="px-5 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium
                                 hover:bg-indigo-700 transition shadow-md cursor-pointer"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {showLogoutPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-sm">
          <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-8 rounded-2xl shadow-2xl w-96 text-center border border-white/30">
            <h3 className="text-2xl font-bold mb-3 text-white drop-shadow">
              Confirm Logout
            </h3>
            <p className="text-white/90 mb-8">
              Are you sure you want to logout?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLogoutPopup(false)}
                className="px-6 py-2 rounded-lg bg-white/20 text-white font-semibold border border-white/40 hover:bg-white/30 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-lg cursor-pointer"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
      
{showAddDrawer && (
  <div
    className="fixed inset-0 z-999 bg-black/40 backdrop-blur-md flex justify-end"
    onClick={() => setShowAddDrawer(false)}   
  >
    <div
  className="w-full sm:w-[460px] h-full bg-white shadow-2xl 
             overflow-y-auto no-scrollbar animate-slideIn"
  onClick={(e) => e.stopPropagation()}   
>

      <div className="sticky top-0 bg-white z-10 border-b px-8 py-5 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-indigo-700 tracking-tight cursor-pointer">
          Add New Product
        </h2>

        <button
          onClick={() => setShowAddDrawer(false)}
          className="w-10 h-10 rounded-full flex items-center justify-center
                     bg-slate-100 hover:bg-red-100 text-slate-500 hover:text-red-600
                     text-2xl font-bold transition cursor-pointer"
        >
          &times;
        </button>
      </div>

      {/* Form */}
      <div className="p-8 space-y-6">

        {/* Product Title */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">
            Product Title
          </label>
          <input
            name="title"
            value={newProduct.title}
            onChange={handleAddChange}
            placeholder="Enter product title"
            className="w-full px-4 py-3 rounded-xl border border-slate-300
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition"
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">
            Price
          </label>
          <input
            name="price"
            type="number"
            value={newProduct.price}
            onChange={handleAddChange}
            placeholder="Enter price"
            className="w-full px-4 py-3 rounded-xl border border-slate-300
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">
            Category
          </label>
          <input
            name="category"
            value={newProduct.category}
            onChange={handleAddChange}
            placeholder="e.g. men's clothing"
            className="w-full px-4 py-3 rounded-xl border border-slate-300
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition"
          />
        </div>

        {/* Image URL */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">
            Image URL
          </label>
          <input
            name="image"
            value={newProduct.image}
            onChange={handleAddChange}
            placeholder="Paste image URL"
            className="w-full px-4 py-3 rounded-xl border border-slate-300
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-slate-600 mb-1">
            Description
          </label>
          <textarea
            name="description"
            rows="4"
            value={newProduct.description}
            onChange={handleAddChange}
            placeholder="Product description"
            className="w-full px-4 py-3 rounded-xl border border-slate-300
                       focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                       outline-none transition resize-none"
          />
        </div>

        {/* Rating + Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Rating
            </label>
            <input
              name="rate"
              value={newProduct.rating.rate}
              onChange={handleAddChange}
              placeholder="e.g. 4.5"
              className="w-full px-4 py-3 rounded-xl border border-slate-300
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         outline-none transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-600 mb-1">
              Stock Count
            </label>
            <input
              name="count"
              value={newProduct.rating.count}
              onChange={handleAddChange}
              placeholder="e.g. 120"
              className="w-full px-4 py-3 rounded-xl border border-slate-300
                         focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                         outline-none transition"
            />
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleAddProduct}
          className="w-full py-4 bg-gradient-to-r from-indigo-600 to-sky-500
                     text-white rounded-2xl font-semibold text-lg
                     hover:from-indigo-700 hover:to-sky-600
                     transition shadow-lg shadow-indigo-200 cursor-pointer"
        >
          Add Product
        </button>
         </div>
        </div>
       </div>
      )}
    </div>
  );
}

export default Products;