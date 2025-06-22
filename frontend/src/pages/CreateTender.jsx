import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createTender } from "../store/tenderSlice";
import { toast } from "react-toastify";

const CreateTender = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.tender);
  const itemsList = ["MCB", "VCB", "Transformers", "Conductors", "Switches", "Insulators", "H-Beams", "Poles", "RS-Joists"];

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    items: [{ name: itemsList[0], quantity: "", unit: "piece" }],
    store: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index] = {
      ...newItems[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      items: newItems,
    }));
  };

  const addItem = () => {
    setFormData((prev) => ({
      ...prev,
      items: [...prev.items, { name: itemsList[0], quantity: "", unit: "piece" }],
    }));
  };

  const removeItem = (index) => {
    setFormData((prev) => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Creating..")

    // Validate form
    if (!formData.title || !formData.description || !formData.store) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.items.some((item) => !item.name || !item.quantity)) {
      console.log(formData.items)
      toast.error("Please fill in all item details");
      return;
    }

    // Convert quantity to number
    const processedItems = formData.items.map((item) => ({
      ...item,
      quantity: Number(item.quantity),
    }));

    const result = await dispatch(
      createTender({
        ...formData,
        items: processedItems,
      })
    );

    // console.log(result)
    // if(!result) console.log("Not result")

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Tender created successfully");
      navigate("/tenders");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Create New Tender</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Store *
          </label>
          <textarea
            name="store"
            value={formData.store}
            onChange={handleInputChange}
            rows="1"
            className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            style={{borderWidth: 1}}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Title *
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            style={{borderWidth: 1}}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
            style={{borderWidth: 1}}
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium text-gray-900">Items</h2>
            <button
              type="button"
              onClick={addItem}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Add Item
            </button>
          </div>

          <div className="space-y-4">
            {formData.items.map((item, index) => (
              <div key={index} className="flex gap-4 items-start">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Item Name *
                  </label>
                  {
                  /* <input
                    type="text"
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    style={{borderWidth: 1}}
                  /> */
                  }
                  <select
                    value={item.name}
                    onChange={(e) =>
                      handleItemChange(index, "name", e.target.value)
                    }
                    className={`mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500`}
                    style={{borderWidth: 1}}
                  >
                  {
                    itemsList.map((product, i) => {
                      return <option key={i} value={product} className="overflow-auto"> {product} </option>
                    })
                  }
                  </select>
                </div>

                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      handleItemChange(index, "quantity", e.target.value)
                    }
                    min="1"
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    required
                    style={{borderWidth: 1}}
                  />
                </div>

                <div className="w-32">
                  <label className="block text-sm font-medium text-gray-700">
                    Unit *
                  </label>
                  <select
                    value={item.unit}
                    onChange={(e) =>
                      handleItemChange(index, "unit", e.target.value)
                    }
                    className="mt-1 block w-full rounded-md border-gray-400 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    style={{borderWidth: 1}}
                  >
                    <option value="piece">Piece</option>
                    <option value="kg">Kilogram</option>
                    <option value="meter">Meter</option>
                    <option value="liter">Liter</option>
                    <option value="box">Box</option>
                  </select>
                </div>

                {formData.items.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeItem(index)}
                    className="mt-6 text-red-600 hover:text-red-800"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {error && (
          <div className="text-red-600 text-sm mt-2">{error}</div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Tender"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateTender; 