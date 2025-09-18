const AppoinmentModel = require("../Models/Appoinment");

// Get appointments for a specific date
const getAppointmentsByDate = async (req, res) => {
  const { date } = req.query;
  try {
    const bookings = await AppoinmentModel.find({ date });
    res.status(200).json(bookings);
  } catch (error) {
    res.status(500).json({ message: "Error fetching appointments", error });
  }
};

// Create a new appointment
const createAppointment = async (req, res) => {
  const { date, slot, name, gmail, password, vtype } = req.body;
  try {
    const existing = await AppoinmentModel.findOne({ date, slot });
    if (existing) {
      return res.status(409).json({ message: "This slot is already booked" });
    }

    const newBooking = new AppoinmentModel({ date, slot, name, gmail, password, vtype });
    await newBooking.save();
    res.status(201).json({ message: "Appointment booked successfully", newBooking });
  } catch (error) {
    res.status(500).json({ message: "Booking failed", error });
  }
};

// Get all appointments (admin)
const getAllAppointments = async (req, res) => {
  try {
    const all = await AppoinmentModel.find();
    res.status(200).json(all);
  } catch (error) {
    res.status(500).json({ message: "Error fetching all appointments", error });
  }
};

// Get appointment by ID
const getAppointmentById = async (req, res) => {
  try {
    const id = req.params.id;
    const data = await AppoinmentModel.findById(id);
    if (!data) return res.status(404).json({ error: "Appointment not found" });
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Error fetching appointment" });
  }
};

// Update appointment by ID
const updateAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    const updated = await AppoinmentModel.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Error updating appointment" });
  }
};

// Delete appointment by ID
const deleteAppointment = async (req, res) => {
  try {
    const id = req.params.id;
    await AppoinmentModel.findByIdAndDelete(id);
    res.json({ message: "Appointment deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting appointment" });
  }
};


module.exports = {
  getAppointmentsByDate,
  createAppointment,
  getAllAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
