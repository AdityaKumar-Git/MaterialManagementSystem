import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { selectAdminAuth } from "../store/adminSlice";
import { useSelector } from "react-redux";
import axios from "../axios";

const UpdateProduct = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: 0,
    stock: 0,
    image: []
  });
  const [newImages, setNewImages] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const adminAuth = useSelector(selectAdminAuth);
  
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/products/${productId}`);
        
        if (!response.data.data) {
          throw new Error("Product not found");
        }
        setProduct(response.data.data);
        setExistingImages(response.data.data.image || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct({
      ...product,
      [name]: name === "price" || name === "stock" ? Number(value) : value
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setNewImages(prev => [...prev, ...files]);
  };

  const handleRemoveNewImage = (index) => {
    if (existingImages.length <= 1 && newImages.length === 0) {
      toast.error("At least one product image is required");
      return;
    }

    setNewImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleRemoveExistingImage = (index) => {
    // Prevent removing if it's the last image and no new images
    if (existingImages.length <= 1 && newImages.length === 0) {
      toast.error("At least one product image is required");
      return;
    }
    
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (existingImages.length === 0 && newImages.length === 0) {
      toast.error("At least one product image is mandatory");
      return;
    }
    
    try {
      setSubmitting(true);
      
      const productForm = new FormData();
      productForm.append("name", product.name);
      productForm.append("description", product.description);
      productForm.append("price", product.price);
      productForm.append("stock", product.stock);
      
      // Append existing images as URLs
      existingImages.forEach((imgUrl, index) => {
        productForm.append("existingImages", imgUrl);
      });
      
      // Append new image files
      newImages.forEach((file) => {
        productForm.append("images", file);
      });

      // console.log("Existing Images:", existingImages);
      // console.log("New Images:", newImages);
      // console.log("Product Form entries:");

      for (let [key, value] of productForm.entries()) {
        console.log(key, value);
      }

      const response = await axios.post(`/products/update/${productId}`, productForm, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      
      toast.success("Product updated successfully");
      if (!adminAuth) {
        navigate(`/products/${productId}`);
      } else {
        navigate(`/products`);
      }
    } catch (err) {
      console.log("Update product error:", err);
      toast.error(err.response?.data?.message || "Failed to update product");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-6 bg-red-100 rounded-lg">
          <h2 className="text-2xl font-bold text-red-700 mb-2">Error</h2>
          <p className="text-red-600">{error}</p>
          <Link to="/products" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-md">
            Back to Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-12">
      <div className="container mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Breadcrumbs */}
          <div className="p-4 border-b border-gray-200">
            <div className="flex items-center text-sm">
              <Link to="/" className="text-blue-600 hover:text-blue-800">
                Home
              </Link>
              <span className="mx-2">/</span>
              <Link to="/products" className="text-blue-600 hover:text-blue-800">
                Products
              </Link>
              <span className="mx-2">/</span>
              <Link to={`/products/${productId}`} className="text-blue-600 hover:text-blue-800">
                {product.name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-600">Update</span>
            </div>
          </div>

          {/* Update Form */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Update Product</h1>
            
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Name */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Product Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={product.name}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  {/* Description */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      rows="6"
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    ></textarea>
                  </div>
                  
                  {/* Price & Stock */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                        Price (₹) *
                      </label>
                      <input
                        type="number"
                        id="price"
                        name="price"
                        value={product.price}
                        onChange={handleInputChange}
                        step="0.01"
                        min="0"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                        Stock *
                      </label>
                      <input
                        type="number"
                        id="stock"
                        name="stock"
                        value={product.stock}
                        onChange={handleInputChange}
                        min="0"
                        required
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Right Column - Images */}
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Images *
                    </label>
                    <div className={`border ${existingImages.length === 0 && newImages.length === 0 ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-md p-4`}>
                      
                      {/* Existing Images */}
                      {existingImages.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">Existing Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {existingImages.map((img, index) => (
                              <div key={`existing-${index}`} className="relative group">
                                <img
                                  src={img}
                                  alt={`Existing product image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveExistingImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  disabled={existingImages.length === 1 && newImages.length === 0}
                                  title={existingImages.length === 1 && newImages.length === 0 ? "At least one image is required" : "Remove image"}
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* New Images */}
                      {newImages.length > 0 && (
                        <div className="mb-4">
                          <h4 className="text-sm font-medium text-gray-700 mb-2">New Images</h4>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {newImages.map((file, index) => (
                              <div key={`new-${index}`} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`New product image ${index + 1}`}
                                  className="w-full h-24 object-cover rounded-md border border-gray-200"
                                />
                                <button
                                  type="button"
                                  onClick={() => handleRemoveNewImage(index)}
                                  className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                  title="Remove image"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* No images warning */}
                      {existingImages.length === 0 && newImages.length === 0 && (
                        <p className="text-red-500 text-center py-4">No images added yet. At least one image is required.</p>
                      )}
                      
                      {/* Add new images */}
                      <div className="mt-3">
                        <input
                          type="file"
                          multiple
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Upload new images for your product. You can keep existing images and add new ones. At least one image is mandatory.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Action Buttons */}
              <div className="mt-8 flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`px-6 py-3 rounded-md font-semibold ${
                    submitting
                      ? "bg-gray-400 text-gray-100 cursor-not-allowed"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {submitting ? "Updating..." : "Update Product"}
                </button>
                <Link
                  to={`/products/${productId}`}
                  className="px-6 py-3 border border-blue-600 text-blue-600 rounded-md font-semibold text-center hover:bg-blue-50"
                >
                  Cancel
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateProduct;