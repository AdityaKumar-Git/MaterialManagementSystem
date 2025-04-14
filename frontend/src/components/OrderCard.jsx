const OrderCard = ({ productName, quantity, price, orderTime, productImage }) => {
    const formattedDate = new Date(orderTime).toLocaleString("en-IN", {
        dateStyle: "medium",
        timeStyle: "short",
    });

    return (
        <div className="bg-white shadow-md rounded-lg p-4 flex justify-between items-center hover:shadow-lg transition">
            {/* Text Content */}
            <div className="flex-1 mr-4">
                <h3 className="text-lg font-bold text-gray-800">{productName}</h3>
                <p className="text-gray-600 text-sm mt-1">Quantity: {quantity}</p>
                <p className="text-gray-600 text-sm">Total Price: ₹{price.toLocaleString()}</p>
                <p className="text-gray-500 text-sm mt-1">Ordered on: {formattedDate}</p>
            </div>

            {/* Image */}
            <div className="w-32 h-24 flex-shrink-0">
                <img
                    src={productImage || "https://via.placeholder.com/300x200?text=No+Image"}
                    alt={productName}
                    className="w-full h-full object-cover rounded-md"
                />
            </div>
        </div>
    );
};

export default OrderCard;
