import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";

function Products() {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [showLogoutPopup, setShowLogoutPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [showAddDrawer, setShowAddDrawer] = useState(false);

  const [editProduct, setEditProduct] = useState({
    id: "",
    title: "",
    price: "",
    description: "",
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

    fetch("https://fakestoreapi.com/products")
      .then(res => res.json())
      .then(data => {
       setProducts(data); 
      setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [navigate]);

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewPopup(true);
    setShowEditPopup(false);
  };

  const handleEditClick = () => {
    setEditProduct({
      id: selectedProduct.id,
      title: selectedProduct.title,
      price: selectedProduct.price,
      description: selectedProduct.description,
    });
    setShowEditPopup(true);
  };

  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleUpdateProduct = () => {
    const updated = products.map(p =>
      p.id === editProduct.id ? { ...p, ...editProduct } : p
    );
    setProducts(updated);
    setSelectedProduct({ ...selectedProduct, ...editProduct });
    setShowEditPopup(false);
  };

  const handleDeleteProduct = () => {
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeletePopup(false);
    setShowViewPopup(false);
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
  const newItem = {
    ...newProduct,
    id: Date.now(),
  };

  setProducts([newItem, ...products]);
  setShowAddDrawer(false);

  setNewProduct({
    title: "",
    price: "",
    description: "",
    category: "",
    image: "",
    rating: { rate: "", count: "" }
  });
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-sky-200 to-blue-100 no-scrollbar overflow-y-scroll">

      <Navbar 
       onLogout={() => setShowLogoutPopup(true)} 
      isPopupOpen={showViewPopup || showEditPopup || showDeletePopup || showLogoutPopup}
      />


     <header className="pt-32 pb-12 px-6">
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

      <main className="max-w-9xl mx-auto px-6 pb-20">
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
                <div className="h-64 bg-gradient-to-br from-indigo-50 to-sky-100 flex items-center justify-center p-8">
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
                      ₹{Math.round(product.price * 80)}
                    </span>

                    <button
                      onClick={() => handleViewProduct(product)}
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

      {/* View / Edit Modal */}
      {showViewPopup && selectedProduct && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-6">

          <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full  max-h-[70vh] overflow-hidden flex flex-col md:flex-row">

            {/* Left */}
            <div className="md:w-5/12 bg-gradient-to-br from-indigo-50 to-sky-100 p-10 flex items-center justify-center">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.title}
                className="max-h-80 object-contain"
              />
            </div>

            {/* Right */}
            <div className="md:w-7/12 p-10 overflow-y-auto">

              <div className="flex justify-between items-center mb-6">
                <span className="px-4 py-1 bg-indigo-100 text-indigo-700 text-xs font-semibold rounded-full">
                  {selectedProduct.category}
                </span>
                <button
                  onClick={() => { setShowViewPopup(false); setShowEditPopup(false); }}
                  className="text-4xl text-slate-400 hover:text-red-500 font-bold cursor-pointer"
                >
                  &times;
                </button>
              </div>

              {!showEditPopup ? (
                <>
                  <h2 className="text-2xl font-bold text-slate-800 mb-4">
                    {selectedProduct.title}
                  </h2>

                  <p className="text-slate-600 text-sm leading-relaxed mb-6">
                    {selectedProduct.description}
                  </p>

                  <div className="space-y-2 text-sm mb-6">
                    <p><b>Rating:</b> {selectedProduct.rating?.rate} ⭐</p>
                    <p><b>Count:</b> {selectedProduct.rating?.count}</p>
                  </div>

                  <p className="text-2xl font-bold text-indigo-700 mb-8">
                    ₹ {Math.round(selectedProduct.price * 80)}
                  </p>

                  <div className="flex gap-4">
                    <button
                      onClick={handleEditClick}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-medium cursor-pointer"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => setShowDeletePopup(true)}
                      className="flex-1 py-3 bg-red-500 text-white rounded-xl hover:bg-red-600 font-medium cursor-pointer"
                    >
                      Delete
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-bold mb-6">Edit Product</h3>

                  <input
                    type="text"
                    name="title"
                    value={editProduct.title}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2 mb-4"
                  />

                  <input
                    type="number"
                    name="price"
                    value={editProduct.price}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2 mb-4"
                  />

                  <textarea
                    name="description"
                    rows="4"
                    value={editProduct.description}
                    onChange={handleEditChange}
                    className="w-full border rounded-lg px-4 py-2 mb-6"
                  />

                  <div className="flex gap-4">
                    <button
                      onClick={handleUpdateProduct}
                      className="flex-1 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 cursor-pointer"
                    >
                      Save
                    </button>

                    <button
                      onClick={() => setShowEditPopup(false)}
                      className="flex-1 py-3 bg-gray-200 rounded-xl hover:bg-gray-300 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              )}

            </div>
          </div>
        </div>
      )}

      {/* Delete Popup */}
      {showDeletePopup && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-96 text-center animate-in zoom-in duration-300">
            <h3 className="text-xl font-semibold mb-3 text-slate-800">
              Delete Product?
            </h3>
            <p className="text-slate-500 mb-6">
              This product will be permanently removed.
            </p>
            <div className="flex gap-4">
              <button
                onClick={handleDeleteProduct}
                className="flex-1 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium transition cursor-pointer"
              >
                Delete
              </button>
              <button
                onClick={() => setShowDeletePopup(false)}
                className="flex-1 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 font-medium transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
                className="px-6 py-2 rounded-lg bg-white/20 text-white font-semibold border border-white/40 hover:bg-white/30 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmLogout}
                className="px-6 py-2 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition shadow-lg"
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
        <h2 className="text-2xl font-bold text-indigo-700 tracking-tight">
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
