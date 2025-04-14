import OrderCard from "../components/OrderCard";

const dummyOrders = [
    {
        productName: "Transformers",
        productImage: "https://placehold.co/300x200",
        quantity: 2,
        price: 300000,
        orderTime: "2025-04-08T10:30:00Z",
    },
    {
        productName: "Switches",
        productImage: "https://placehold.co/300x200",
        quantity: 10,
        price: 15000,
        orderTime: "2025-04-07T14:45:00Z",
    },
    {
        productName: "VCB/MCB",
        productImage: "https://placehold.co/300x200",
        quantity: 1,
        price: 8500,
        orderTime: "2025-04-05T09:15:00Z",
    },
    {
        productName: "H-Beams",
        productImage: "https://placehold.co/300x200",
        quantity: 5,
        price: 15000,
        orderTime: "2025-04-03T12:00:00Z",
    },
    {
        productName: "RS. Joints",
        productImage: "https://placehold.co/300x200",
        quantity: 20,
        price: 22000,
        orderTime: "2025-04-02T16:20:00Z",
    },
];

const AllOrders = () => {
    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-blue-700">All Orders</h1>
            <div className="grid grid-cols-1 md:grid-cols-1 lg:mx-44 gap-6">
                {dummyOrders.map((order, idx) => (
                    <OrderCard key={idx} {...order} />
                ))}
            </div>
        </div>
    );
};

export default AllOrders;


// import React from 'react'
// import OrderCard from '../components/OrderCard';

// const Orders = [
//     {
//         productName: "Transformers",
//         productImage: "https://placehold.co/300x200",
//         quantity: 2,
//         price: 300000,
//         orderTime: "2025-04-08T10:30:00Z",
//     },
//     {
//         productName: "Switches",
//         productImage: "https://placehold.co/300x200",
//         quantity: 10,
//         price: 15000,
//         orderTime: "2025-04-07T14:45:00Z",
//     },
//     {
//         productName: "VCB/MCB",
//         productImage: "https://placehold.co/300x200",
//         quantity: 1,
//         price: 8500,
//         orderTime: "2025-04-05T09:15:00Z",
//     },
//     {
//         productName: "H-Beams",
//         productImage: "https://placehold.co/300x200",
//         quantity: 5,
//         price: 15000,
//         orderTime: "2025-04-03T12:00:00Z",
//     },
//     {
//         productName: "RS. Joints",
//         productImage: "https://placehold.co/300x200",
//         quantity: 20,
//         price: 22000,
//         orderTime: "2025-04-02T16:20:00Z",
//     },
// ];

// function AllOrders() {
//     return (
//         <div className="min-h-screen bg-gray-100 p-8">
//             <h1 className="text-4xl font-bold text-blue-700 mb-8 text-center">All Orders</h1>
//             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//                 {Orders.map((order, idx) => (
//                     <OrderCard key={idx} {...order} />
//                 ))}
//             </div>
//         </div>
//     );
// }

// export default AllOrders