const bcrypt = require("bcryptjs");
const Member = require("../Models/Member");

// --- Auth: Login (auto-migrate plaintext -> hashed on first successful login)
const loginMember = async (req, res) => {
  const { gmail, password } = req.body;

  if (!gmail || !password) {
    return res.status(400).json({ message: "Email and password are required." });
  }

  try {
    const existingMember = await Member.findOne({
      gmail: gmail.toLowerCase().trim(),
    });

    if (!existingMember) {
      return res.status(404).json({ message: "User not found" });
    }

    let isValid = false;

    // If already hashed (starts with $2...), compare with bcrypt
    if (typeof existingMember.password === "string" && existingMember.password.startsWith("$2")) {
      isValid = await bcrypt.compare(password, existingMember.password);
    } else {
      // Legacy plaintext: compare, then migrate to hashed
      if (existingMember.password === password) {
        isValid = true;
        existingMember.password = password; // triggers pre('save') to hash
        await existingMember.save();
      }
    }

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const { _id, name, role, contact, gmail: gm } = existingMember;
    return res.status(200).json({
      message: "Login successful",
      staff: { _id, name, gmail: gm, role, contact },
    });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ message: "Server error during login" });
  }
};

// --- List all (no passwords)
const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().select("-password");
    if (!members || members.length === 0) {
      return res.status(404).json({ message: "No members found" });
    }
    return res.status(200).json({ members });
  } catch (err) {
    console.error("Fetch error:", err);
    return res.status(500).json({ message: "Error retrieving members" });
  }
};

// --- Add
const addMembers = async (req, res) => {
  const { name, gmail, password, role, age, address, contact } = req.body;

  try {
    const exists = await Member.findOne({ gmail: gmail?.toLowerCase().trim() });
    if (exists) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newMember = await Member.create({
      name,
      gmail,
      password, // hashed by pre('save')
      role,
      age,
      address,
      contact,
    });

    const { _id } = newMember;
    return res.status(201).json({
      member: { _id, name, gmail: newMember.gmail, role, age, address, contact },
    });
  } catch (err) {
    console.error("Add member error:", err);
    return res.status(500).json({ message: "Unable to add member" });
  }
};

// --- Get by id (no password)
const getById = async (req, res) => {
  const { id } = req.params;
  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing ID" });
  }

  try {
    const member = await Member.findById(id).select("-password");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    return res.status(200).json({ member });
  } catch (err) {
    console.error("Get by ID error:", err);
    return res.status(500).json({ message: "Error fetching member" });
  }
};

// --- Update (no password returned)
const updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, gmail, password, role, age, address, contact } = req.body;

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing ID" });
  }

  try {
    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { name, gmail, password, role, age, address, contact }, // password hashed by pre('findOneAndUpdate') if present
      { new: true, runValidators: true }
    ).select("-password");

    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({ member: updatedMember });
  } catch (err) {
    console.error("Update error:", err);
    return res.status(500).json({ message: "Unable to update member" });
  }
};

// --- Delete
const deleteMember = async (req, res) => {
  const { id } = req.params;

  if (!id || id === "undefined") {
    return res.status(400).json({ message: "Invalid or missing ID" });
  }

  try {
    const member = await Member.findByIdAndDelete(id).select("-password");
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }

    return res.status(200).json({ message: "Member deleted", member });
  } catch (err) {
    console.error("Delete error:", err);
    return res.status(500).json({ message: "Unable to delete member" });
  }
};

// --- Reset password
const resetMemberPassword = async (req, res) => {
  const { gmail, password } = req.body;

  if (!password || password.trim().length < 4) {
    return res.status(400).json({ status: "error", message: "Invalid new password" });
  }

  try {
    const member = await Member.findOne({ gmail: gmail?.toLowerCase().trim() });
    if (!member) {
      return res.status(404).json({ status: "error", message: "member not found" });
    }

    member.password = password; // pre('save') will hash
    await member.save();

    res.json({ status: "ok", message: "Password reset successful" });
  } catch (err) {
    console.error("Error resetting password:", err);
    res.status(500).json({ status: "error", message: "Reset failed" });
  }
};

// --- NEW: List members by role (case-insensitive) for dropdowns
const getMembersByRole = async (req, res) => {
  try {
    const role = (req.params.role || "").toLowerCase().trim();
    if (!role) return res.status(400).json({ message: "Role is required" });

    const members = await Member.find({
      role: { $regex: new RegExp(`^${role}$`, "i") },
    }).select("_id name gmail role contact");

    return res.status(200).json({ members });
  } catch (err) {
    console.error("Error fetching members by role:", err);
    return res.status(500).json({ message: "Error retrieving members by role" });
  }
};

exports.loginMember = loginMember;
exports.getAllMembers = getAllMembers;
exports.addMembers = addMembers;
exports.getById = getById;
exports.updateMember = updateMember;
exports.deleteMember = deleteMember;
exports.resetMemberPassword = resetMemberPassword;
exports.getMembersByRole = getMembersByRole;
