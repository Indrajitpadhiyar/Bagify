import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addProductReset } from "../redux/actions/addProduct.Action";
import toast from "react-hot-toast";
import { Upload, X } from "lucide-react";
import AdminLayout from "../components/admin/AdminLayout";

const AddProduct = () => {
  const dispatch = useDispatch();
  const { success, error } = useSelector((state) => state.addProduct);

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    description: "",
    category: [], // ← Now an array for multiple categories
    stock: "",
  });

  const [images, setImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [loading, setLoading] = useState(false);

  const imageInputRef = useRef(null);

  // Category Options
  const categoryOptions = [
    { value: "Electronics", label: "Electronics" },
    { value: "Clothing", label: "Clothing" },
    { value: "Fashion", label: "Fashion" },
    { value: "Home & Garden", label: "Home & Garden" },
    { value: "Books", label: "Books" },
    { value: "Sports", label: "Sports" },
    { value: "Beauty", label: "Beauty" },
    { value: "Toys", label: "Toys & Games" },
    { value: "Food", label: "Food & Beverages" },
    { value: "Health", label: "Health & Fitness" },
    { value: "Automotive", label: "Automotive" },
    { value: "Jewelry", label: "Jewelry" },
  ];

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

  // Handle Multiple Category Selection
  const handleCategoryChange = (selectedOptions) => {
    const selectedValues = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
    setFormData({ ...formData, category: selectedValues });
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
    setFormData({ name: "", price: "", description: "", category: [], stock: "" });
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

    if (formData.category.length === 0) {
      toast.error("Please select at least one category");
      return;
    }

    const productData = new FormData();
    productData.append("name", formData.name);
    productData.append("price", formData.price);
    productData.append("description", formData.description);
    productData.append("stock", formData.stock || "1");

    // Append multiple categories
    formData.category.forEach((cat) => {
      productData.append("category", cat);
    });

    // Append all images
    images.forEach((image) => {
      productData.append("images", image);
    });

    try {
      setLoading(true);

      // Let the browser/axios set Content-Type (with boundary) automatically
      const response = await API.post("/products/create", productData);

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
    <AdminLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Add New Product
        </h1>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <form onSubmit={submitHandler} encType="multipart/form-data" className="space-y-6">

            {/* Name & Price */}
            <div className="grid md:grid-cols-2 gap-6">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Product Name *"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
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
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
                required
              />
            </div>

            {/* Multiple Category Select */}
            <div>
              <label className="text-sm font-semibold mb-2 block text-gray-700">
                Categories *
              </label>
              <Select
                isMulti
                name="category"
                options={categoryOptions}
                value={categoryOptions.filter((option) =>
                  formData.category.includes(option.value)
                )}
                onChange={handleCategoryChange}
                placeholder="Select categories..."
                className="basic-multi-select"
                classNamePrefix="select"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    padding: "0.2rem",
                    borderRadius: "0.75rem",
                    borderColor: state.isFocused ? "#f97316" : "#e5e7eb",
                    boxShadow: state.isFocused ? "0 0 0 4px rgba(249, 115, 22, 0.1)" : "none",
                    "&:hover": { borderColor: "#f97316" },
                  }),
                  multiValue: (base) => ({
                    ...base,
                    backgroundColor: "#fff7ed",
                    border: "1px solid #ffedd5",
                    borderRadius: "0.5rem",
                  }),
                  multiValueLabel: (base) => ({
                    ...base,
                    color: "#c2410c",
                    fontWeight: "600",
                  }),
                }}
              />
            </div>

            {/* Stock */}
            <div>
              <input
                name="stock"
                type="number"
                min="1"
                value={formData.stock}
                onChange={handleChange}
                placeholder="Stock Quantity"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none"
              />
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Product Description *"
              rows="5"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-500/10 transition-all outline-none resize-none"
              required
            />

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-orange-400 transition-colors bg-gray-50/50">
              <input
                ref={imageInputRef}
                type="file"
                id="file-upload"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-2">
                <Upload className="w-10 h-10 text-orange-500" />
                <span className="text-gray-600 font-medium">Click to upload product images</span>
                <span className="text-xs text-gray-400">Max 5 images • JPG, PNG, WebP</span>
              </label>
            </div>

            {/* Image Previews */}
            {imagesPreview.length > 0 && (
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-4">
                {imagesPreview.map((img, i) => (
                  <div key={i} className="relative group aspect-square">
                    <img
                      src={img}
                      alt={`Preview ${i + 1}`}
                      className="w-full h-full object-cover rounded-xl border border-gray-200"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute -top-2 -right-2 bg-white text-red-500 shadow-md rounded-full p-1 opacity-100 hover:scale-110 transition-all border border-gray-100"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold rounded-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:translate-y-[-2px] transition-all disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? "Creating..." : "Create Product"}
            </button>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AddProduct;