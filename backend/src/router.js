const express = require("express");

const router = express.Router();

const paintingsRoutes = require("./routes/paintings.routes");
const authRoutes = require("./routes/auth.routes");
const usersRoutes = require("./routes/users.routes");
const techniquesRoutes = require("./routes/techniques.routes");
const supportsRoutes = require("./routes/supports.routes");
const paintingSizesRoutes = require("./routes/paintingSizes.routes");
const contactsRoutes = require("./routes/contacts.routes");
const familiesRoutes = require("./routes/families.routes");
const paintingGiftsRoutes = require("./routes/paintingGifts.routes");

router.use("/paintings", paintingsRoutes);
router.use("/auth", authRoutes);
router.use("/users", usersRoutes);
router.use("/techniques", techniquesRoutes);
router.use("/supports", supportsRoutes);
router.use("/paintingSizes", paintingSizesRoutes);
router.use("/contacts", contactsRoutes);
router.use("/families", familiesRoutes);
router.use("/paintingGifts", paintingGiftsRoutes);

module.exports = router;
