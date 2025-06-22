import { Bid } from "../models/bid.model.js";
import { Tender } from "../models/tender.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import PDFDocument from "pdfkit";

const submitBid = asyncHandler(async (req, res) => {
  const { tenderId } = req.params;
  const { bids, note, contactInfo } = req.body;

  // Check if tender exists and is active
  const tender = await Tender.findById(tenderId);
  if (!tender) {
    throw new ApiError(404, "Tender not found");
  }

  if (tender.status !== "active") {
    throw new ApiError(400, "Cannot bid on inactive tender");
  }

  // Validate bids
  if (!bids || !Array.isArray(bids) || bids.length === 0) {
    throw new ApiError(400, "Bids are required");
  }

  // Validate contact information
  if (!contactInfo?.name || !contactInfo?.email || !contactInfo?.phone) {
    throw new ApiError(400, "Contact information is required");
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(contactInfo.email)) {
    throw new ApiError(400, "Invalid email format");
  }

  // Validate phone number
  const phoneRegex = /^\d{10}$/;
  if (!phoneRegex.test(contactInfo.phone)) {
    throw new ApiError(400, "Invalid phone number format");
  }

  // Create bid
  const bid = await Bid.create({
    tender: tenderId,
    contactInfo,
    bids,
    note,
  });

  return res
    .status(201)
    .json(new ApiResponse(201, bid, "Bid submitted successfully"));
});

const getTenderBids = asyncHandler(async (req, res) => {
  const { tenderId } = req.params;

  const bids = await Bid.find({ tender: tenderId })
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, bids, "Bids retrieved successfully"));
});

const updateBidStatus = asyncHandler(async (req, res) => {
  const { bidId } = req.params;
  const { status } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    throw new ApiError(400, "Invalid status");
  }

  const bid = await Bid.findById(bidId);
  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  bid.status = status;
  await bid.save();

  return res
    .status(200)
    .json(new ApiResponse(200, bid, "Bid status updated successfully"));
});

const deleteAllBids = asyncHandler(async (req, res) => {
  const { tenderId, bidId } = req.body;

  if (!tenderId) {
    throw new ApiError(400, "tenderId are required");
  }

  const bids = await Bid.find({ tender: tenderId });

  if (!bids || bids.length === 0) {
    throw new ApiError(404, "No bids found for the given tender");
  }


  const updatePromises = bids.map(async (bid) => {
    if (bid._id.toString() !== bidId) {
      bid.status = "rejected";
      return bid.save();
    }
  });

  await Promise.all(updatePromises);

  return res
    .status(200)
    .json(new ApiResponse(200, null, "All other bids rejected successfully"));
});

const generateBill = asyncHandler(async (req, res) => {
  const { bidId } = req.params;

  const bid = await Bid.findById(bidId).populate({
    path: 'tender',
    populate: {
      path: 'items',
      select: 'name description'
    }
  });

  if (!bid) {
    throw new ApiError(404, "Bid not found");
  }

  // Create PDF document
  const doc = new PDFDocument({
    size: 'A4',
    margin: 50
  });
  
  // Set response headers
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=bid-${bidId}.pdf`);

  // Pipe the PDF to the response
  doc.pipe(res);

  // Add company header
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text('MATERIAL MANAGEMENT SYSTEM', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('BID INVOICE', { align: 'center' });
  doc.moveDown(2);

  // Add bid details in a table-like format
  const details = [
    ['Bid ID:', bid._id],
    ['Date:', bid.createdAt.toLocaleDateString()],
    ['Status:', bid.status || 'Pending']
  ];

  details.forEach(([label, value]) => {
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text(label, 50, doc.y, { width: 100 })
       .font('Helvetica')
       .text(value, 150, doc.y, { width: 300 });
    doc.moveDown();
  });
  doc.moveDown();

  // Add contact information
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('CONTACT INFORMATION', { underline: true });
  doc.moveDown();
  
  const contactInfo = [
    ['Name:', bid.contactInfo.name],
    ['Email:', bid.contactInfo.email],
    ['Phone:', bid.contactInfo.phone]
  ];

  contactInfo.forEach(([label, value]) => {
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text(label, 50, doc.y, { width: 100 })
       .font('Helvetica')
       .text(value, 150, doc.y, { width: 300 });
    doc.moveDown();
  });
  doc.moveDown();

  // Add tender details
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('TENDER DETAILS', { underline: true });
  doc.moveDown();
  
  const tenderInfo = [
    ['Tender ID:', bid.tender._id],
    ['Title:', bid.tender.title]
  ];

  tenderInfo.forEach(([label, value]) => {
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text(label, 50, doc.y, { width: 100 })
       .font('Helvetica')
       .text(value, 150, doc.y, { width: 300 });
    doc.moveDown();
  });
  doc.moveDown();

  // Add bid items table
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('BID ITEMS', { underline: true });
  doc.moveDown();

  // Table header
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .text('Item', 50, doc.y, { width: 300 })
     .text('Price (₹)', 350, doc.y, { width: 100, align: 'right' });
  doc.moveDown();

  // Table separator
  doc.moveTo(50, doc.y)
     .lineTo(450, doc.y)
     .stroke();
  doc.moveDown();

  // Add bid items
  let total = 0;
  bid.bids.forEach((itemBid) => {
    const item = bid.tender.items.find(i => i._id.toString() === itemBid.item.toString());
    if (item) {
      doc.fontSize(10)
         .font('Helvetica')
         .text(item.name, 50, doc.y, { width: 300 })
         .text(itemBid.price.toLocaleString(), 350, doc.y, { width: 100, align: 'right' });
      total += itemBid.price;
      doc.moveDown();
    }
  });

  // Table footer
  doc.moveTo(50, doc.y)
     .lineTo(450, doc.y)
     .stroke();
  doc.moveDown();

  // Add total
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Total Amount:', 250, doc.y, { width: 100, align: 'right' })
     .text(`₹${total.toLocaleString()}`, 350, doc.y, { width: 100, align: 'right' });
  doc.moveDown(2);

  // Add note if exists
  if (bid.note) {
    doc.fontSize(12)
       .font('Helvetica-Bold')
       .text('ADDITIONAL NOTES', { underline: true });
    doc.moveDown();
    doc.fontSize(10)
       .font('Helvetica')
       .text(bid.note, { width: 400 });
  }

  // Add footer
  doc.fontSize(8)
     .font('Helvetica')
     .text('This is a computer-generated document. No signature is required.', 50, 700, { align: 'center', width: 400 });

  // Finalize the PDF
  doc.end();
});

export { submitBid, getTenderBids, updateBidStatus, generateBill, deleteAllBids }; 