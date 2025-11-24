// src/components/admin/AddProduct.jsx
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductReset } from "../redux/actions/addProduct.Action";
import toast from "react-hot-toast";
import axios from "axios"; // ← ADDED
import { Upload, X } from "lucide-react";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.addProduct);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false); // ← ADDED LOCAL LOADING

  const imageInputRef = useRef(null);

  // Handle success/error from Redux (optional if you use Redux later)
  useEffect(() => {
    if (success) {
      toast.success("Product Added Successfully!");
      resetForm();
      setTimeout(() => dispatch(addProductReset()), 2000);
    }
    if (error) {
      toast.error(error || "Something went wrong!");
    }
  }, [success, error, dispatch]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length === 0) return;

    if (images.length + files.length > 5) {
      toast.error("Maximum 5 images allowed");
      return;
    }

    const validFiles = [];
    const invalidFiles = [];

    files.forEach((file) => {
      if (file.size > 5 * 1024 * 1024) {
        invalidFiles.push(`${file.name} exceeds 5MB`);
        return;
      }
      if (!file.type.startsWith("image/")) {
        invalidFiles.push(`${file.name} is not an image`);
        return;
      }
      validFiles.push(file);
    });

    invalidFiles.forEach((msg) => toast.error(msg));
    if (validFiles.length === 0) return;

    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, file]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setImagesPreview(imagesPreview.filter((_, i) => i !== index));
  };

  const resetForm = () => {
    setFormData({ name: "", price: "", description: "", category: "", stock: "" });
    setImages([]);
    setImagesPreview([]);
    if (imageInputRef.current) imageInputRef.current.value = "";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("price", formData.price);
    productData.append("description", formData.description);
    productData.append("category", formData.category);
    productData.append("stock", formData.stock || "1");

    // Append all images with field name "images" (matches upload.array("images", 5))
    images.forEach((image) => {
      productData.append("images", image);
    });

    console.log("Submitting product with data:", formData, images);

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:4000/api/v1/products/create", // Change if your backend port is different
        productData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.data.success) {
        toast.success("Product Created Successfully!");
        resetForm();
      }
    } catch (err) {
      console.error("Product creation error:", err);
      toast.error(
        err.response?.data?.message || "Failed to create product. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-pink-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent">
          Add New Product
        </h1>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <form onSubmit={submitHandler} encType="multipart/form-data" className="space-y-8">
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name *"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 text-lg"
                required
              />
              <input
                name="price"
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={handleChange}
                placeholder="Price *"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:ring-4 focus:ring-green-100 text-lg"
                required
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 text-lg"
                required
              >
                <option value="">Select Category *</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Books">Books</option>
                <option value="Sports">Sports</option>
                <option value="Beauty">Beauty</option>
              </select>

              <input
                name="stock"
                type="number"
                min="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock (default: 1)"
                className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-lg"
              />
            </div>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product Description *"
              rows="5"
              className="w-full px-6 py-4 rounded-xl border-2 border-gray-200 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 text-lg resize-none"
              required
            />

            <div>
              <label className="text-xl font-bold mb-4 flex items-center gap-3">
                <Upload className="w-8 h-8 text-orange-600" />
                Product Images (Max 5) *
              </label>
              <input
                ref={imageInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-3 file:px-8 file:rounded-full file:border-0 file:bg-gradient-to-r file:from-orange-500 file:to-pink-600 file:text-white hover:file:from-orange-600 hover:file:to-pink-700 cursor-pointer"
                required={images.length === 0}
              />
              <p className="text-sm text-gray-500 mt-2">
                Max 5MB per image • JPG, PNG, WebP, GIF
              </p>
            </div>

            {imagesPreview.length > 0 && (
              <div>
                <p className="text-lg font-semibold mb-4">
                  Image Previews ({imagesPreview.length}/5)
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {imagesPreview.map((img, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={img}
                        alt={`Preview ${i + 1}`}
                        className="w-full h-32 object-cover rounded-xl shadow-lg"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute -top-2 -right-2 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-6 bg-gradient-to-r from-orange-600 to-pink-600 text-white text-2xl font-bold rounded-2xl hover:shadow-2xl transform hover:scale-105 transition disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  Adding Product...
                </div>
              ) : (
                "Add Product"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;